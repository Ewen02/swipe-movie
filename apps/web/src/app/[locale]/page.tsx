'use client';

import {
  Users,
  Film,
  Heart,
  Zap,
  Globe,
  Shield,
  Clock,
  Smartphone,
  X,
  Sparkles,
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Footer } from '@/components/layout/Footer';
import {
  HeroSection,
  StatsSection,
  HowItWorksSection,
  DemoSection,
  FeaturesSection,
  TestimonialsSection,
  TrustBadges,
  FinalCTA,
} from '@/components/landing';

export default function LandingPage() {
  const { data: session } = useSession();
  const t = useTranslations('landing');
  // Render landing eagerly during SSR for SEO; session state simply
  // toggles a few CTAs once the client hydrates.
  const isAuthenticated = !!session;

  const stats = [
    { value: 10000, suffix: '+', label: t('stats.movies'), color: 'text-green-500' },
    { value: 50, suffix: '+', label: t('stats.platforms'), color: 'text-blue-500' },
    { value: 30, suffix: 's', label: t('stats.decide'), color: 'text-purple-500' },
    { value: 100, suffix: '%', label: t('stats.free'), color: 'text-orange-500' },
  ];

  const steps = [
    {
      step: '1',
      icon: Film,
      title: t('howItWorks.step1.title'),
      desc: t('howItWorks.step1.description'),
      color: 'from-primary to-accent',
      delay: 0,
    },
    {
      step: '2',
      icon: Users,
      title: t('howItWorks.step2.title'),
      desc: t('howItWorks.step2.description'),
      color: 'from-blue-500 to-cyan-500',
      delay: 0.15,
    },
    {
      step: '3',
      icon: Heart,
      title: t('howItWorks.step3.title'),
      desc: t('howItWorks.step3.description'),
      color: 'from-green-500 to-emerald-500',
      delay: 0.3,
    },
  ];

  const demoInstructions = [
    { icon: Heart, text: t('demo.right'), color: 'text-green-500 bg-green-500/10' },
    { icon: X, text: t('demo.left'), color: 'text-red-500 bg-red-500/10' },
    { icon: Sparkles, text: t('demo.match'), color: 'text-primary bg-primary/10' },
  ];

  const features = [
    {
      icon: Users,
      title: t('features.noFights.title'),
      desc: t('features.noFights.description'),
      color: 'from-blue-500 to-cyan-500',
      delay: 0,
    },
    {
      icon: Zap,
      title: t('features.fast.title'),
      desc: t('features.fast.description'),
      color: 'from-yellow-500 to-orange-500',
      delay: 0.1,
    },
    {
      icon: Globe,
      title: t('features.platforms.title'),
      desc: t('features.platforms.description'),
      color: 'from-purple-500 to-pink-500',
      delay: 0.2,
    },
    {
      icon: Heart,
      title: t('features.addictive.title'),
      desc: t('features.addictive.description'),
      color: 'from-red-500 to-pink-500',
      delay: 0.3,
    },
  ];

  const testimonials = [
    {
      name: t('testimonials.items.marie.name'),
      role: t('testimonials.items.marie.role'),
      content: t('testimonials.items.marie.content'),
      avatar: '\u{1F469}\u{200D}\u{1F9B0}',
      delay: 0,
    },
    {
      name: t('testimonials.items.thomas.name'),
      role: t('testimonials.items.thomas.role'),
      content: t('testimonials.items.thomas.content'),
      avatar: '\u{1F468}',
      delay: 0.1,
    },
    {
      name: t('testimonials.items.sophie.name'),
      role: t('testimonials.items.sophie.role'),
      content: t('testimonials.items.sophie.content'),
      avatar: '\u{1F469}',
      delay: 0.2,
    },
  ];

  const badges = [
    {
      icon: Shield,
      text: t('badges.free.title'),
      subtext: t('badges.free.subtitle'),
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      text: t('badges.ready.title'),
      subtext: t('badges.ready.subtitle'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Smartphone,
      text: t('badges.mobile.title'),
      subtext: t('badges.mobile.subtitle'),
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      text: t('badges.google.title'),
      subtext: t('badges.google.subtitle'),
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <PublicHeader variant="landing" isAuthenticated={isAuthenticated} />
      <HeroSection
        isAuthenticated={isAuthenticated}
        badge={t('hero.badge')}
        title={t('hero.title')}
        titleHighlight={t('hero.titleHighlight')}
        subtitle={t('hero.subtitle')}
        cta={t('hero.cta')}
        ctaAuth={t('hero.ctaAuth')}
        trustFree={t('hero.trust.free')}
        trustReady={t('hero.trust.ready')}
        trustNoCard={t('hero.trust.noCard')}
      />
      <StatsSection stats={stats} />
      <HowItWorksSection
        badge={t('howItWorks.badge')}
        title={t('howItWorks.title')}
        titleHighlight={t('howItWorks.titleHighlight')}
        subtitle={t('howItWorks.subtitle')}
        stepLabel={t('howItWorks.step')}
        steps={steps}
      />
      <DemoSection
        badge={t('demo.badge')}
        title={t('demo.title')}
        titleHighlight={t('demo.titleHighlight')}
        subtitle={t('demo.subtitle')}
        instructions={demoInstructions}
      />
      <FeaturesSection
        badge={t('features.badge')}
        title={t('features.title')}
        titleHighlight={t('features.titleHighlight')}
        subtitle={t('features.subtitle')}
        features={features}
      />
      <TestimonialsSection
        badge={t('testimonials.badge')}
        title={t('testimonials.title')}
        titleHighlight={t('testimonials.titleHighlight')}
        subtitle={t('testimonials.subtitle')}
        testimonials={testimonials}
      />
      <TrustBadges badges={badges} />
      <FinalCTA
        isAuthenticated={isAuthenticated}
        badge={t('cta.badge')}
        title={t('cta.title')}
        titleHighlight={t('cta.titleHighlight')}
        titleEnd={t('cta.titleEnd')}
        subtitle={t('cta.subtitle')}
        subtitleAuth={t('cta.subtitleAuth')}
        button={t('cta.button')}
        buttonAuth={t('cta.buttonAuth')}
        trustFree={t('cta.trust.free')}
        trustNoCard={t('cta.trust.noCard')}
        matchFound={t('cta.matchFound')}
        matchSubtitle={t('cta.matchSubtitle')}
        itsAMatch={t('cta.itsAMatch')}
      />
      <Footer />
    </div>
  );
}
