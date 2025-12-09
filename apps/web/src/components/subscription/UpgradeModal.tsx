'use client';

import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
} from '@swipe-movie/ui';
import { Crown, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  feature: 'rooms' | 'participants' | 'swipes' | 'filters';
  currentLimit?: number;
  requiredPlan?: 'STARTER' | 'PRO' | 'TEAM';
}

export function UpgradeModal({
  open,
  onClose,
  feature,
  currentLimit,
  requiredPlan = 'PRO',
}: UpgradeModalProps) {
  const t = useTranslations('subscription.upgrade');
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/pricing');
    onClose();
  };

  const featureMessages: Record<string, { title: string; description: string }> = {
    rooms: {
      title: t('rooms.title'),
      description: t('rooms.description', { limit: currentLimit || 3 }),
    },
    participants: {
      title: t('participants.title'),
      description: t('participants.description', { limit: currentLimit || 4 }),
    },
    swipes: {
      title: t('swipes.title'),
      description: t('swipes.description', { limit: currentLimit || 20 }),
    },
    filters: {
      title: t('filters.title'),
      description: t('filters.description'),
    },
  };

  const message = featureMessages[feature] || featureMessages.rooms;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              <DialogTitle>{message.title}</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription className="pt-4">
            {message.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Current Plan */}
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-medium mb-2">{t('currentPlan')}</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="font-semibold">FREE</span>
            </div>
          </div>

          {/* Recommended Plan */}
          <div className="bg-primary/10 border-2 border-primary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">{t('recommended')}</p>
              <Crown className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{requiredPlan}</span>
              <span className="text-sm text-muted-foreground">
                {requiredPlan === 'STARTER' && '€4.99/month'}
                {requiredPlan === 'PRO' && '€9.99/month'}
                {requiredPlan === 'TEAM' && '€19.99/month'}
              </span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('benefits.title')}</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              {feature === 'rooms' && (
                <>
                  <li>{t('benefits.unlimitedRooms')}</li>
                  <li>{t('benefits.moreParticipants')}</li>
                </>
              )}
              {feature === 'participants' && (
                <>
                  <li>{t('benefits.unlimitedParticipants')}</li>
                  <li>{t('benefits.unlimitedSwipes')}</li>
                </>
              )}
              {feature === 'swipes' && (
                <>
                  <li>{t('benefits.unlimitedSwipes')}</li>
                  <li>{t('benefits.noExpiry')}</li>
                </>
              )}
              {feature === 'filters' && (
                <>
                  <li>{t('benefits.advancedFilters')}</li>
                  <li>{t('benefits.betterMatches')}</li>
                </>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t('notNow')}
            </Button>
            <Button onClick={handleUpgrade} className="flex-1">
              {t('viewPlans')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
