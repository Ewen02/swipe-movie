import { getTranslations } from 'next-intl/server';
import { PricingCard } from '@/components/pricing/PricingCard';
import { Check } from 'lucide-react';

export default async function PricingPage() {
  const t = await getTranslations('pricing');

  const plans = [
    {
      name: 'FREE',
      price: 0,
      period: 'forever',
      description: t('free.description'),
      features: [
        { text: t('free.features.rooms'), included: true },
        { text: t('free.features.participants'), included: true },
        { text: t('free.features.swipes'), included: true },
        { text: t('free.features.expiry'), included: true },
        { text: t('free.features.filters'), included: false },
        { text: t('free.features.email'), included: false },
      ],
      cta: t('free.cta'),
      highlighted: false,
      comingSoon: false,
    },
    {
      name: 'STARTER',
      price: 4.99,
      period: 'month',
      description: t('starter.description'),
      features: [
        { text: t('starter.features.rooms'), included: true },
        { text: t('starter.features.participants'), included: true },
        { text: t('starter.features.swipes'), included: true },
        { text: t('starter.features.expiry'), included: true },
        { text: t('starter.features.email'), included: true },
        { text: t('starter.features.filters'), included: false },
      ],
      cta: t('starter.cta'),
      highlighted: false,
      comingSoon: true,
    },
    {
      name: 'PRO',
      price: 9.99,
      period: 'month',
      description: t('pro.description'),
      features: [
        { text: t('pro.features.unlimited'), included: true },
        { text: t('pro.features.participants'), included: true },
        { text: t('pro.features.swipes'), included: true },
        { text: t('pro.features.noExpiry'), included: true },
        { text: t('pro.features.filters'), included: true },
        { text: t('pro.features.email'), included: true },
      ],
      cta: t('pro.cta'),
      highlighted: true,
      badge: t('pro.badge'),
      comingSoon: true,
    },
    {
      name: 'TEAM',
      price: 19.99,
      period: 'month',
      description: t('team.description'),
      features: [
        { text: t('team.features.accounts'), included: true },
        { text: t('team.features.everything'), included: true },
        { text: t('team.features.api'), included: true },
        { text: t('team.features.whitelabel'), included: true },
        { text: t('team.features.support'), included: true },
        { text: t('team.features.analytics'), included: true },
      ],
      cta: t('team.cta'),
      highlighted: false,
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('faq.title')}</h2>
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">{t('faq.q1.question')}</h3>
              <p className="text-muted-foreground">{t('faq.q1.answer')}</p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">{t('faq.q2.question')}</h3>
              <p className="text-muted-foreground">{t('faq.q2.answer')}</p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">{t('faq.q3.question')}</h3>
              <p className="text-muted-foreground">{t('faq.q3.answer')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
