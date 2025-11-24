'use client';

import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Feature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  description: string;
  features: Feature[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
  comingSoon?: boolean;
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
  comingSoon = false,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative bg-card border rounded-2xl p-6 flex flex-col ${
        highlighted
          ? 'border-primary shadow-xl shadow-primary/20 scale-105'
          : 'border-border'
      }`}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
          {badge}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <div className="mb-2">
          <span className="text-4xl font-bold">€{price}</span>
          {price > 0 && <span className="text-muted-foreground">/{period}</span>}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            {feature.included ? (
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            )}
            <span
              className={
                feature.included ? 'text-foreground' : 'text-muted-foreground'
              }
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        className={`w-full ${highlighted ? '' : 'variant-outline'}`}
        variant={highlighted ? 'default' : 'outline'}
        disabled={comingSoon}
      >
        {comingSoon ? 'Coming Soon' : cta}
      </Button>

      {comingSoon && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          Available after beta launch
        </p>
      )}
    </motion.div>
  );
}
