import { ApiProperty } from '@nestjs/swagger';

export class GroupMemberDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ nullable: true })
  name!: string | null;
}

export class GroupResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  createdBy!: string;

  @ApiProperty({ enum: ['MOVIE', 'TV'] })
  type!: string;

  @ApiProperty()
  genreId!: number;

  @ApiProperty({ type: [GroupMemberDto] })
  members!: GroupMemberDto[];

  @ApiProperty({ description: 'Number of members' })
  memberCount!: number;

  @ApiProperty()
  createdAt!: Date;
}

export class GroupsResponseDto {
  @ApiProperty({ type: [GroupResponseDto] })
  groups!: GroupResponseDto[];
}

/** Returned when spawning a fresh room from a group. */
export class GroupSessionResponseDto {
  @ApiProperty({ description: 'The new room code to navigate to' })
  code!: string;

  @ApiProperty()
  roomId!: string;

  @ApiProperty({ description: 'How many group members were notified' })
  notified!: number;
}
