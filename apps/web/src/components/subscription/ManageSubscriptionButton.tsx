'use client';

import { useState } from 'react';
import { Button } from '@swipe-movie/ui';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/components/providers/toast-provider';

interface ManageSubscriptionButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  children?: React.ReactNode;
}

export function ManageSubscriptionButton({
  className,
  variant = 'outline',
  size = 'default',
  children,
}: ManageSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/portal`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Portal session error:', error);
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Impossible d\'accéder au portail de gestion',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleManageSubscription}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Chargement...
        </>
      ) : (
        <>
          {children || 'Gérer mon abonnement'}
          <ExternalLink className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  );
}
