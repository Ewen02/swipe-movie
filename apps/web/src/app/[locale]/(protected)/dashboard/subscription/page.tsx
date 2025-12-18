'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Crown, CreditCard, BarChart3, Settings, Loader2 } from 'lucide-react';
import { Button, Progress } from '@swipe-movie/ui';
import { useSubscription } from '@/hooks/useSubscription';
import { ManageSubscriptionButton } from '@/components/subscription';
import { Footer } from '@/components/layout/Footer';
import { BackgroundOrbs } from '@/components/layout/BackgroundOrbs';
import { useRouter } from 'next/navigation';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const PLAN_DISPLAY: Record<string, { name: string; color: string; icon: React.ReactNode }> = {
  free: { name: 'FREE', color: 'text-muted-foreground', icon: null },
  starter: { name: 'STARTER', color: 'text-blue-500', icon: <Crown className="w-5 h-5 text-blue-500" /> },
  pro: { name: 'PRO', color: 'text-primary', icon: <Crown className="w-5 h-5 text-primary" /> },
  team: { name: 'TEAM', color: 'text-purple-500', icon: <Crown className="w-5 h-5 text-purple-500" /> },
};

export default function SubscriptionDashboardPage() {
  const t = useTranslations('dashboard.subscription');
  const { subscription, plan, limits, usage, loading, isPaid } = useSubscription();
  const router = useRouter();

  const planDisplay = PLAN_DISPLAY[plan] || PLAN_DISPLAY.free;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background orbs */}
      <BackgroundOrbs />

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t('title')}</h1>
              <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/rooms')} className="gap-2">
              <Settings className="w-4 h-4" />
              {t('backToRooms')}
            </Button>
          </motion.div>

          {/* Current Plan Card */}
          <motion.div variants={fadeInUp}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <div className="p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-6">
                    <CreditCard className="w-5 h-5" />
                    {t('currentPlan')}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {planDisplay.icon}
                        <span className={`text-2xl font-bold ${planDisplay.color}`}>
                          {planDisplay.name}
                        </span>
                      </div>
                      {isPaid && subscription?.periodEnd && (
                        <div className="text-sm text-muted-foreground">
                          {t('renewsOn', {
                            date: new Date(subscription.periodEnd).toLocaleDateString(),
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      {isPaid ? (
                        <ManageSubscriptionButton variant="outline" />
                      ) : (
                        <Button onClick={() => router.push('/pricing')} className="gap-2">
                          <Crown className="w-4 h-4" />
                          {t('upgrade')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Usage Stats */}
          <motion.div variants={fadeInUp}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                <div className="p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-6">
                    <BarChart3 className="w-5 h-5" />
                    {t('usage.title')}
                  </h3>
                  <div className="space-y-6">
                    {/* Rooms Usage */}
                    <UsageStat
                      label={t('usage.rooms')}
                      current={usage.activeRooms}
                      limit={limits.maxRooms}
                      unlimited={limits.maxRooms === -1}
                    />

                    {/* Swipes Usage */}
                    <UsageStat
                      label={t('usage.swipesPerRoom')}
                      current={usage.maxSwipesInRoom}
                      limit={limits.maxSwipes}
                      unlimited={limits.maxSwipes === -1}
                    />

                    {/* Participants */}
                    <UsageStat
                      label={t('usage.participantsPerRoom')}
                      current={usage.maxParticipantsInRoom}
                      limit={limits.maxParticipants}
                      unlimited={limits.maxParticipants === -1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Access */}
          <motion.div variants={fadeInUp}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6">{t('features.title')}</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FeatureItem
                      label={t('features.advancedFilters')}
                      enabled={limits.hasAdvancedFilters}
                    />
                    <FeatureItem
                      label={t('features.emailNotifications')}
                      enabled={limits.hasEmailNotifications}
                    />
                    <FeatureItem
                      label={t('features.apiAccess')}
                      enabled={limits.hasApiAccess}
                    />
                    <FeatureItem
                      label={t('features.roomExpiry', {
                        days: limits.roomExpiryDays === -1 ? t('features.unlimited') : limits.roomExpiryDays,
                      })}
                      enabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upgrade CTA for free users */}
          {!isPaid && (
            <motion.div variants={fadeInUp}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-xl border border-primary/20 rounded-3xl overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                  <div className="py-8 px-6 text-center space-y-4">
                    <Crown className="w-12 h-12 mx-auto text-primary" />
                    <h3 className="text-xl font-semibold">{t('upgradeCta.title')}</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {t('upgradeCta.description')}
                    </p>
                    <Button onClick={() => router.push('/pricing')} size="lg" className="gap-2">
                      <Crown className="w-4 h-4" />
                      {t('upgradeCta.button')}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

function UsageStat({
  label,
  current,
  limit,
  unlimited,
}: {
  label: string;
  current: number;
  limit: number;
  unlimited: boolean;
}) {
  const t = useTranslations('dashboard.subscription');
  const percentage = unlimited ? 0 : Math.min((current / limit) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {unlimited ? t('usage.unlimited') : `${current} / ${limit}`}
        </span>
      </div>
      {!unlimited && <Progress value={percentage} className="h-2" />}
    </div>
  );
}

function FeatureItem({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-muted-foreground/30'}`}
      />
      <span className={enabled ? '' : 'text-muted-foreground'}>{label}</span>
    </div>
  );
}
