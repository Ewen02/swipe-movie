'use client';

import { Button } from '../atoms/button';
import { Badge } from '../atoms/badge';
import { Check, X, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
  billingPeriod?: 'monthly' | 'annual';
  monthlyPrice?: number;
  annualPrice?: number;
  index?: number;
  isLoading?: boolean;
  onSubscribe?: () => void;
  savingsLabel?: string;
  className?: string;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  highlighted = false,
  badge,
  billingPeriod = 'monthly',
  monthlyPrice = 0,
  annualPrice = 0,
  index = 0,
  isLoading = false,
  onSubscribe,
  savingsLabel = 'Économisez',
  className,
}: PricingCardProps) {
  // Calculate savings for annual billing
  const savings =
    billingPeriod === 'annual' && monthlyPrice > 0
      ? (monthlyPrice * 12 - annualPrice).toFixed(2)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn('relative group h-full', badge && 'pt-6', className)}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-20">
          <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1.5 text-sm font-semibold shadow-lg whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {badge}
          </Badge>
        </div>
      )}

      {/* Hover glow effect */}
      <div
        className={cn(
          'absolute -inset-1 rounded-3xl blur-lg transition-opacity duration-500',
          highlighted
            ? 'bg-gradient-to-r from-primary to-accent opacity-20 group-hover:opacity-30'
            : 'bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-10',
        )}
      />

      <div
        className={cn(
          'relative h-full bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-300 flex flex-col',
          highlighted
            ? 'border-2 border-primary/50 shadow-xl shadow-primary/20 scale-105'
            : 'border border-white/10 hover:border-primary/30',
        )}
      >
        {/* Top gradient bar (only for highlighted) */}
        {highlighted && (
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        )}

        <div className="p-6 md:p-8 flex flex-col flex-1">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
              <span className="text-2xl font-bold">
                {name === 'FREE' ? '🎬' : name === 'PRO' ? '⭐' : '🚀'}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{name}</h3>

            {/* Price */}
            <div className="mb-2">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {price === 0 ? 'Gratuit' : `€${price}`}
                </span>
                {price > 0 && (
                  <span className="text-muted-foreground text-lg">
                    /{period}
                  </span>
                )}
              </div>

              {/* Savings badge */}
              {savings && parseFloat(savings) > 0 && (
                <div className="mt-2">
                  <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                    {savingsLabel} €{savings}/an
                  </Badge>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8 flex-grow">
            {features.map((feature, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + idx * 0.05 }}
                className="flex items-start gap-3"
              >
                <div
                  className={cn(
                    'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5',
                    feature.included ? 'bg-primary/20' : 'bg-muted/20',
                  )}
                >
                  {feature.included ? (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm',
                    feature.included
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground line-through',
                  )}
                >
                  {feature.text}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* CTA Button */}
          <Button
            className={cn(
              'w-full transition-all duration-300',
              highlighted
                ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg text-white'
                : 'border-white/20 hover:bg-white/5',
            )}
            variant={highlighted ? 'default' : 'outline'}
            disabled={isLoading}
            size="lg"
            onClick={onSubscribe}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              cta
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
