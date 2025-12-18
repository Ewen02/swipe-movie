import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { UpdateUserPreferencesDto, UserPreferencesDto, OnboardingSwipeDto } from './dtos/user-preferences.dto';
import { LibraryItemDto, LibraryResponseDto, LibraryQueryDto } from './dtos/library.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserPreferences(userId: string): Promise<UserPreferencesDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        watchProviders: true,
        watchRegion: true,
        favoriteGenreIds: true,
        onboardingStep: true,
        onboardingCompleted: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      watchProviders: user.watchProviders,
      watchRegion: user.watchRegion,
      favoriteGenreIds: user.favoriteGenreIds,
      onboardingStep: user.onboardingStep,
      onboardingCompleted: user.onboardingCompleted,
    };
  }

  async updateUserPreferences(
    userId: string,
    dto: UpdateUserPreferencesDto,
  ): Promise<UserPreferencesDto> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.watchProviders !== undefined && { watchProviders: dto.watchProviders }),
        ...(dto.watchRegion !== undefined && { watchRegion: dto.watchRegion }),
        ...(dto.favoriteGenreIds !== undefined && { favoriteGenreIds: dto.favoriteGenreIds }),
        ...(dto.onboardingStep !== undefined && { onboardingStep: dto.onboardingStep }),
        ...(dto.onboardingCompleted !== undefined && { onboardingCompleted: dto.onboardingCompleted }),
      },
      select: {
        watchProviders: true,
        watchRegion: true,
        favoriteGenreIds: true,
        onboardingStep: true,
        onboardingCompleted: true,
      },
    });

    return {
      watchProviders: user.watchProviders,
      watchRegion: user.watchRegion,
      favoriteGenreIds: user.favoriteGenreIds,
      onboardingStep: user.onboardingStep,
      onboardingCompleted: user.onboardingCompleted,
    };
  }

  async saveOnboardingSwipe(
    userId: string,
    swipe: OnboardingSwipeDto,
  ): Promise<void> {
    const source = swipe.source || 'onboarding';
    await this.prisma.userMediaLibrary.upsert({
      where: {
        userId_tmdbId_mediaType: {
          userId,
          tmdbId: swipe.tmdbId,
          mediaType: swipe.mediaType,
        },
      },
      create: {
        userId,
        tmdbId: swipe.tmdbId,
        mediaType: swipe.mediaType,
        status: swipe.liked ? 'liked' : 'disliked',
        source,
      },
      update: {
        status: swipe.liked ? 'liked' : 'disliked',
        source,
      },
    });
  }

  async saveBatchOnboardingSwipes(
    userId: string,
    swipes: OnboardingSwipeDto[],
  ): Promise<{ saved: number }> {
    const operations = swipes.map((swipe) => {
      const source = swipe.source || 'onboarding';
      // For manual imports, use 'watchlist' status. For swipes, use liked/disliked
      const status = source === 'manual'
        ? 'watchlist'
        : (swipe.liked ? 'liked' : 'disliked');

      return this.prisma.userMediaLibrary.upsert({
        where: {
          userId_tmdbId_mediaType: {
            userId,
            tmdbId: swipe.tmdbId,
            mediaType: swipe.mediaType,
          },
        },
        create: {
          userId,
          tmdbId: swipe.tmdbId,
          mediaType: swipe.mediaType,
          status,
          source,
        },
        update: {
          status,
          source,
        },
      });
    });

    await this.prisma.$transaction(operations);
    return { saved: swipes.length };
  }

  async completeOnboarding(userId: string): Promise<UserPreferencesDto> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStep: 4,
        onboardingCompleted: true,
      },
      select: {
        watchProviders: true,
        watchRegion: true,
        favoriteGenreIds: true,
        onboardingStep: true,
        onboardingCompleted: true,
      },
    });

    return {
      watchProviders: user.watchProviders,
      watchRegion: user.watchRegion,
      favoriteGenreIds: user.favoriteGenreIds,
      onboardingStep: user.onboardingStep,
      onboardingCompleted: user.onboardingCompleted,
    };
  }

  async getUserLibrary(
    userId: string,
    query: LibraryQueryDto,
  ): Promise<LibraryResponseDto> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.source) {
      where.source = query.source;
    }

    const [items, total] = await Promise.all([
      this.prisma.userMediaLibrary.findMany({
        where,
        orderBy: { importedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          tmdbId: true,
          mediaType: true,
          status: true,
          source: true,
          rating: true,
          importedAt: true,
        },
      }),
      this.prisma.userMediaLibrary.count({ where }),
    ]);

    return {
      items: items.map((item) => ({
        id: item.id,
        tmdbId: item.tmdbId,
        mediaType: item.mediaType as 'movie' | 'tv',
        status: item.status,
        source: item.source,
        rating: item.rating ?? undefined,
        importedAt: item.importedAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateLibraryItemStatus(
    userId: string,
    itemId: string,
    status: string,
  ): Promise<LibraryItemDto> {
    // First check if the item exists and belongs to the user
    const item = await this.prisma.userMediaLibrary.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Library item not found');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('You do not have access to this item');
    }

    const updated = await this.prisma.userMediaLibrary.update({
      where: { id: itemId },
      data: { status },
      select: {
        id: true,
        tmdbId: true,
        mediaType: true,
        status: true,
        source: true,
        rating: true,
        importedAt: true,
      },
    });

    return {
      id: updated.id,
      tmdbId: updated.tmdbId,
      mediaType: updated.mediaType as 'movie' | 'tv',
      status: updated.status,
      source: updated.source,
      rating: updated.rating ?? undefined,
      importedAt: updated.importedAt,
    };
  }

  async deleteLibraryItem(userId: string, itemId: string): Promise<void> {
    // First check if the item exists and belongs to the user
    const item = await this.prisma.userMediaLibrary.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Library item not found');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('You do not have access to this item');
    }

    await this.prisma.userMediaLibrary.delete({
      where: { id: itemId },
    });
  }

  async deleteLibraryItemByTmdbId(
    userId: string,
    tmdbId: string,
    mediaType: string = 'movie',
  ): Promise<void> {
    const item = await this.prisma.userMediaLibrary.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId,
          tmdbId,
          mediaType,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Library item not found');
    }

    await this.prisma.userMediaLibrary.delete({
      where: { id: item.id },
    });
  }

  async getLibraryStats(userId: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
  }> {
    const items = await this.prisma.userMediaLibrary.findMany({
      where: { userId },
      select: { status: true, source: true },
    });

    const byStatus: Record<string, number> = {};
    const bySource: Record<string, number> = {};

    for (const item of items) {
      byStatus[item.status] = (byStatus[item.status] || 0) + 1;
      bySource[item.source] = (bySource[item.source] || 0) + 1;
    }

    return {
      total: items.length,
      byStatus,
      bySource,
    };
  }

  /**
   * Export all user data (GDPR compliant)
   */
  async exportUserData(userId: string) {
    const [user, library, swipes, memberships, matches] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          watchProviders: true,
          watchRegion: true,
          favoriteGenreIds: true,
          onboardingStep: true,
          onboardingCompleted: true,
        },
      }),
      this.prisma.userMediaLibrary.findMany({
        where: { userId },
        select: {
          id: true,
          tmdbId: true,
          mediaType: true,
          status: true,
          source: true,
          rating: true,
          importedAt: true,
        },
      }),
      this.prisma.swipe.findMany({
        where: { userId },
        select: {
          movieId: true,
          roomId: true,
          value: true,
          createdAt: true,
        },
      }),
      this.prisma.roomMember.findMany({
        where: { userId },
        include: {
          room: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      }),
      this.prisma.match.findMany({
        where: {
          room: {
            members: {
              some: { userId },
            },
          },
        },
        select: {
          movieId: true,
          roomId: true,
          createdAt: true,
        },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      profile: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
      preferences: {
        watchProviders: user.watchProviders,
        watchRegion: user.watchRegion,
        favoriteGenreIds: user.favoriteGenreIds,
        onboardingStep: user.onboardingStep,
        onboardingCompleted: user.onboardingCompleted,
      },
      library: library.map((item) => ({
        id: item.id,
        tmdbId: item.tmdbId,
        mediaType: item.mediaType,
        status: item.status,
        source: item.source,
        rating: item.rating,
        importedAt: item.importedAt.toISOString(),
      })),
      swipes: swipes.map((s) => ({
        movieId: s.movieId,
        roomId: s.roomId,
        value: s.value,
        createdAt: s.createdAt.toISOString(),
      })),
      rooms: memberships.map((m) => ({
        id: m.room.id,
        name: m.room.name,
        code: m.room.code,
      })),
      matches: matches.map((m) => ({
        movieId: m.movieId,
        roomId: m.roomId,
        createdAt: m.createdAt.toISOString(),
      })),
      exportedAt: new Date().toISOString(),
    };
  }

  /**
   * Delete user account and all associated data (GDPR compliant)
   */
  async deleteUserAccount(userId: string): Promise<void> {
    // Use transaction to delete all user data atomically
    await this.prisma.$transaction(async (tx) => {
      // Delete user's swipes
      await tx.swipe.deleteMany({ where: { userId } });

      // Delete user's room memberships
      await tx.roomMember.deleteMany({ where: { userId } });

      // Delete user's library
      await tx.userMediaLibrary.deleteMany({ where: { userId } });

      // Delete user's accounts (OAuth)
      await tx.account.deleteMany({ where: { userId } });

      // Delete user's sessions
      await tx.session.deleteMany({ where: { userId } });

      // Delete rooms where user is the creator
      const ownedRooms = await tx.room.findMany({
        where: { createdBy: userId },
        select: { id: true },
      });

      for (const room of ownedRooms) {
        // Delete all matches in the room
        await tx.match.deleteMany({ where: { roomId: room.id } });
        // Delete all swipes in the room
        await tx.swipe.deleteMany({ where: { roomId: room.id } });
        // Delete all room members
        await tx.roomMember.deleteMany({ where: { roomId: room.id } });
        // Delete the room
        await tx.room.delete({ where: { id: room.id } });
      }

      // Finally, delete the user
      await tx.user.delete({ where: { id: userId } });
    });
  }
}
