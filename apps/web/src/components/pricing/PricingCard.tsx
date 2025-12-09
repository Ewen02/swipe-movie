'use client';

import { useState } from 'react';
import {
  PricingCard as PricingCardUI,
  type PricingFeature,
} from '@swipe-movie/ui';
import { subscription, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/providers/toast-provider';

interface PricingCardProps {
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
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    // For free plan, just redirect to signup/dashboard
    if (name === 'FREE') {
      if (session?.user) {
        router.push('/rooms');
      } else {
        router.push('/sign-up');
      }
      return;
    }

    // For paid plans, check if user is logged in
    if (!session?.user) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour souscrire à un abonnement',
        type: 'error',
      });
      router.push('/sign-in');
      return;
    }

    setIsLoading(true);
    try {
      const result = await subscription.upgrade({
        plan: name.toLowerCase(),
        annual: billingPeriod === 'annual',
        successUrl: `${window.location.origin}/pricing/success`,
        cancelUrl: `${window.location.origin}/pricing`,
      });

      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error.message || 'Une erreur est survenue',
          type: 'error',
        });
      }
      // If successful, the user will be redirected to Stripe checkout
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la souscription',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PricingCardUI
      name={name}
      price={price}
      period={period}
      description={description}
      features={features}
      cta={cta}
      highlighted={highlighted}
      badge={badge}
      billingPeriod={billingPeriod}
      monthlyPrice={monthlyPrice}
      annualPrice={annualPrice}
      index={index}
      isLoading={isLoading}
      onSubscribe={handleSubscribe}
    />
  );
}
