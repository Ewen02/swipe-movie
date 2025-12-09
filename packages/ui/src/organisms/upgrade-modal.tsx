'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Button } from '../atoms/button';
import { Crown, X } from 'lucide-react';
import { cn } from '../utils/cn';

export type UpgradeFeature = 'rooms' | 'participants' | 'swipes' | 'filters';
export type PlanTier = 'STARTER' | 'PRO' | 'TEAM';

export interface UpgradeModalTranslations {
  currentPlan: string;
  recommended: string;
  notNow: string;
  viewPlans: string;
  benefits: {
    title: string;
  };
  features: {
    [key in UpgradeFeature]: {
      title: string;
      description: string;
      benefits: string[];
    };
  };
}

export interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  feature: UpgradeFeature;
  currentLimit?: number;
  requiredPlan?: PlanTier;
  onUpgrade?: () => void;
  translations: UpgradeModalTranslations;
  planPrices?: {
    STARTER: string;
    PRO: string;
    TEAM: string;
  };
  className?: string;
}

export function UpgradeModal({
  open,
  onClose,
  feature,
  currentLimit,
  requiredPlan = 'PRO',
  onUpgrade,
  translations,
  planPrices = {
    STARTER: '€4.99/month',
    PRO: '€9.99/month',
    TEAM: '€19.99/month',
  },
  className,
}: UpgradeModalProps) {
  const featureConfig = translations.features[feature];
  const description = featureConfig.description.replace(
    '{limit}',
    String(currentLimit || 0),
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn('sm:max-w-md', className)}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              <DialogTitle>{featureConfig.title}</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription className="pt-4">{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Current Plan */}
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-medium mb-2">{translations.currentPlan}</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="font-semibold">FREE</span>
            </div>
          </div>

          {/* Recommended Plan */}
          <div className="bg-primary/10 border-2 border-primary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">{translations.recommended}</p>
              <Crown className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{requiredPlan}</span>
              <span className="text-sm text-muted-foreground">
                {planPrices[requiredPlan]}
              </span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <p className="text-sm font-medium">{translations.benefits.title}</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              {featureConfig.benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {translations.notNow}
            </Button>
            <Button onClick={onUpgrade} className="flex-1">
              {translations.viewPlans}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
