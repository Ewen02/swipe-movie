"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
  GlassButton,
  GlassBadge,
  GlassPanel,
  GlassModal,
  GlassInput,
  GlassTextarea,
  LiquidGlassFilters,
} from "@swipe-movie/ui"
import {
  Sparkles,
  Heart,
  Star,
  Zap,
  Film,
  Users,
  Play,
  Moon,
  Sun,
  Check,
  ArrowRight,
  Search,
  Mail,
  Lock,
  Eye,
  Layers,
  Droplets,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"

export default function LiquidGlassShowcase() {
  const [isDark, setIsDark] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className={isDark ? "dark" : ""}>
      {/* SVG Filters for advanced effects */}
      <LiquidGlassFilters />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, transparent 70%)",
              top: "5%",
              left: "5%",
            }}
            animate={{
              x: [0, 80, -40, 0],
              y: [0, -40, 80, 0],
              scale: [1, 1.15, 0.95, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-35"
            style={{
              background: "radial-gradient(circle, rgba(236, 72, 153, 0.5) 0%, transparent 70%)",
              top: "40%",
              right: "5%",
            }}
            animate={{
              x: [0, -60, 50, 0],
              y: [0, 60, -50, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-30"
            style={{
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)",
              bottom: "10%",
              left: "25%",
            }}
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -30, 50, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Liquid Glass
              </h1>
              <p className="text-white/60">iOS 26 Style Design System</p>
            </motion.div>
            <div className="flex items-center gap-3">
              <Link href="/design">
                <GlassButton variant="ghost" size="sm">
                  <ArrowRight className="w-4 h-4 rotate-180 text-white" />
                  Standard UI
                </GlassButton>
              </Link>
              <GlassButton
                variant="ghost"
                size="icon"
                onClick={() => setIsDark(!isDark)}
              >
                {isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
              </GlassButton>
            </div>
          </div>

          {/* iOS 26 Feature Banner */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassPanel variant="floating" padding="lg" showBlobs>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Droplets className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-2">Apple Liquid Glass Design</h2>
                  <p className="text-white/70">
                    Inspired by iOS 26 - featuring translucent materials, light refraction,
                    specular highlights, and dynamic blur effects that respond to content.
                  </p>
                </div>
                <div className="flex gap-2">
                  <GlassBadge variant="primary" icon={<Sparkles className="w-3 h-3" />}>
                    iOS 26
                  </GlassBadge>
                  <GlassBadge variant="accent" icon={<Zap className="w-3 h-3" />}>
                    New
                  </GlassBadge>
                </div>
              </div>
            </GlassPanel>
          </motion.section>

          {/* Section: Card Variants */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Layers className="w-6 h-6 text-purple-400" />
              Glass Card Variants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Default Card */}
              <GlassCard variant="default" hover>
                <GlassCardHeader>
                  <GlassCardTitle className="text-white">Default Glass</GlassCardTitle>
                  <GlassCardDescription>Standard glass with shine effect</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent>
                  <p className="text-white/80 text-sm">
                    Translucent background with blur and saturation boost for vibrant colors.
                  </p>
                </GlassCardContent>
              </GlassCard>

              {/* Subtle Card */}
              <GlassCard variant="subtle" hover>
                <GlassCardHeader>
                  <GlassCardTitle className="text-white">Subtle Glass</GlassCardTitle>
                  <GlassCardDescription>Lighter, minimal blur</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent>
                  <p className="text-white/80 text-sm">
                    More see-through for background-focused designs.
                  </p>
                </GlassCardContent>
              </GlassCard>

              {/* Intense Card */}
              <GlassCard variant="intense" hover>
                <GlassCardHeader>
                  <GlassCardTitle className="text-white">Intense Glass</GlassCardTitle>
                  <GlassCardDescription>Maximum blur & opacity</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent>
                  <p className="text-white/80 text-sm">
                    Strong frosted effect for important content.
                  </p>
                </GlassCardContent>
              </GlassCard>

              {/* Refract Card */}
              <GlassCard variant="refract" hover edgeGlow>
                <GlassCardHeader>
                  <GlassCardTitle className="text-white">Refraction Effect</GlassCardTitle>
                  <GlassCardDescription>Light bending simulation</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="flex items-center gap-2 text-purple-300">
                    <Lightbulb className="w-5 h-5" />
                    <span className="text-sm">Simulates glass refraction</span>
                  </div>
                </GlassCardContent>
              </GlassCard>

              {/* Specular Card */}
              <GlassCard variant="specular" hover>
                <GlassCardHeader>
                  <GlassCardTitle className="text-white">Specular Highlights</GlassCardTitle>
                  <GlassCardDescription>Animated light reflections</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="flex items-center gap-2 text-pink-300">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-sm">Dynamic light movement</span>
                  </div>
                </GlassCardContent>
              </GlassCard>

              {/* Colored Glow Card */}
              <GlassCard variant="colored" glowColor="rgba(168, 85, 247, 0.4)" hover>
                <GlassCardHeader>
                  <GlassCardTitle className="text-white">Colored Glow</GlassCardTitle>
                  <GlassCardDescription>Custom glow color</GlassCardDescription>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="flex items-center gap-2 text-purple-300">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm">Purple ambient glow</span>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>
          </section>

          {/* Section: Animated Effects */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              Animated Effects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Shimmer */}
              <GlassCard variant="default" shimmer>
                <GlassCardHeader>
                  <GlassCardTitle className="text-white">Shimmer Effect</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <p className="text-white/70 text-sm">
                    Light passing through glass animation
                  </p>
                </GlassCardContent>
              </GlassCard>

              {/* Breathe */}
              <GlassCard variant="colored" glowColor="rgba(236, 72, 153, 0.3)" breathe>
                <GlassCardHeader>
                  <GlassCardTitle className="text-white">Breathing</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="flex items-center gap-2 text-pink-300">
                    <Heart className="w-5 h-5 fill-current" />
                    <span className="text-sm">Subtle pulse animation</span>
                  </div>
                </GlassCardContent>
              </GlassCard>

              {/* Edge Glow */}
              <GlassCard variant="intense" edgeGlow>
                <GlassCardHeader>
                  <GlassCardTitle className="text-white">Edge Glow</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <p className="text-white/70 text-sm">
                    Highlight borders for emphasis
                  </p>
                </GlassCardContent>
              </GlassCard>
            </div>
          </section>

          {/* Section: Buttons */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              Glass Buttons
            </h2>
            <GlassPanel variant="floating" padding="lg">
              <div className="space-y-8">
                {/* Variants */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Variants</h3>
                  <div className="flex flex-wrap gap-4">
                    <GlassButton variant="default">Default</GlassButton>
                    <GlassButton variant="primary">Primary</GlassButton>
                    <GlassButton variant="accent">Accent</GlassButton>
                    <GlassButton variant="ghost">Ghost</GlassButton>
                    <GlassButton variant="outline">Outline</GlassButton>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <GlassButton variant="primary" size="sm">Small</GlassButton>
                    <GlassButton variant="primary" size="md">Medium</GlassButton>
                    <GlassButton variant="primary" size="lg">Large</GlassButton>
                    <GlassButton variant="primary" size="icon">
                      <Play className="w-5 h-5" />
                    </GlassButton>
                  </div>
                </div>

                {/* With Icons */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">With Icons</h3>
                  <div className="flex flex-wrap gap-4">
                    <GlassButton variant="primary">
                      <Film className="w-5 h-5" />
                      Watch Now
                    </GlassButton>
                    <GlassButton variant="accent">
                      <Heart className="w-5 h-5" />
                      Favorite
                    </GlassButton>
                    <GlassButton variant="default">
                      <Users className="w-5 h-5" />
                      Invite Friends
                    </GlassButton>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </section>

          {/* Section: Form Inputs */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-400" />
              Glass Form Elements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard variant="default" size="lg">
                <GlassCardHeader>
                  <GlassCardTitle className="text-white">Glass Inputs</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Email</label>
                    <GlassInput
                      variant="default"
                      placeholder="Enter your email..."
                      icon={<Mail className="w-4 h-4" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Password</label>
                    <GlassInput
                      variant="default"
                      type="password"
                      placeholder="Enter password..."
                      icon={<Lock className="w-4 h-4" />}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Search (Intense)</label>
                    <GlassInput
                      variant="intense"
                      placeholder="Search movies..."
                      icon={<Search className="w-4 h-4" />}
                    />
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard variant="default" size="lg">
                <GlassCardHeader>
                  <GlassCardTitle className="text-white">Glass Textarea</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Message (Default)</label>
                    <GlassTextarea
                      variant="default"
                      placeholder="Write your message..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Bio (Intense)</label>
                    <GlassTextarea
                      variant="intense"
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>
          </section>

          {/* Section: Badges */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400" />
              Glass Badges
            </h2>
            <GlassCard variant="default" size="lg">
              <div className="space-y-6">
                {/* Variants */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <GlassBadge variant="default">Default</GlassBadge>
                    <GlassBadge variant="primary">Primary</GlassBadge>
                    <GlassBadge variant="accent">Accent</GlassBadge>
                    <GlassBadge variant="success">Success</GlassBadge>
                    <GlassBadge variant="warning">Warning</GlassBadge>
                    <GlassBadge variant="destructive">Destructive</GlassBadge>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <GlassBadge variant="primary" size="sm">Small</GlassBadge>
                    <GlassBadge variant="primary" size="md">Medium</GlassBadge>
                    <GlassBadge variant="primary" size="lg">Large</GlassBadge>
                  </div>
                </div>

                {/* With Icons */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">With Icons</h3>
                  <div className="flex flex-wrap gap-3">
                    <GlassBadge variant="success" icon={<Check className="w-3 h-3" />}>
                      Verified
                    </GlassBadge>
                    <GlassBadge variant="primary" icon={<Star className="w-3 h-3" />}>
                      Premium
                    </GlassBadge>
                    <GlassBadge variant="accent" icon={<Sparkles className="w-3 h-3" />}>
                      New
                    </GlassBadge>
                    <GlassBadge variant="warning" icon={<Zap className="w-3 h-3" />}>
                      Trending
                    </GlassBadge>
                    <GlassBadge variant="default" icon={<Eye className="w-3 h-3" />}>
                      Watching
                    </GlassBadge>
                  </div>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Section: Panels */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Film className="w-6 h-6 text-blue-400" />
              Glass Panels
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Panel with blobs */}
              <GlassPanel variant="floating" padding="lg" showBlobs>
                <h3 className="text-xl font-semibold text-white mb-3">Floating Panel with Blobs</h3>
                <p className="text-white/70 mb-4">
                  Animated background blobs create organic, living movement inside the panel.
                </p>
                <div className="flex gap-3">
                  <GlassButton variant="primary" size="sm">Get Started</GlassButton>
                  <GlassButton variant="ghost" size="sm">Learn More</GlassButton>
                </div>
              </GlassPanel>

              {/* Simple panel */}
              <GlassPanel variant="default" padding="lg">
                <h3 className="text-xl font-semibold text-white mb-3">Default Panel</h3>
                <p className="text-white/70 mb-4">
                  Clean glass surface without animated elements for content-focused layouts.
                </p>
                <div className="flex flex-wrap gap-2">
                  <GlassBadge variant="primary" icon={<Users className="w-3 h-3" />}>
                    5 Members
                  </GlassBadge>
                  <GlassBadge variant="success" icon={<Heart className="w-3 h-3" />}>
                    12 Matches
                  </GlassBadge>
                </div>
              </GlassPanel>
            </div>
          </section>

          {/* Section: Modal */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Glass Modal
            </h2>
            <GlassCard variant="subtle">
              <GlassCardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white">Interactive Modal</h3>
                    <p className="text-white/60">Click the button to see the glass modal in action</p>
                  </div>
                  <GlassButton variant="primary" onClick={() => setIsModalOpen(true)}>
                    Open Modal
                  </GlassButton>
                </div>
              </GlassCardContent>
            </GlassCard>

            <GlassModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              showBlobs
              padding="lg"
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Droplets className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Liquid Glass Modal</h3>
                <p className="text-white/70 mb-6">
                  iOS 26 style modal with frosted glass effect, animated blobs, and smooth transitions.
                </p>
                <div className="space-y-3">
                  <GlassInput
                    variant="intense"
                    placeholder="Enter room name..."
                    className="w-full"
                  />
                  <div className="flex justify-center gap-3 pt-2">
                    <GlassButton variant="ghost" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </GlassButton>
                    <GlassButton variant="primary" onClick={() => setIsModalOpen(false)}>
                      Create Room
                    </GlassButton>
                  </div>
                </div>
              </div>
            </GlassModal>
          </section>

          {/* Section: Real-world Example */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <Film className="w-6 h-6 text-green-400" />
              Real-World Example: Movie Card
            </h2>
            <div className="max-w-sm mx-auto">
              <GlassCard variant="intense" size="sm" hover edgeGlow className="overflow-hidden">
                {/* Movie Poster */}
                <div className="relative h-[400px] -m-4 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  {/* Movie Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex gap-2 mb-2">
                      <GlassBadge variant="success" size="sm" icon={<Star className="w-3 h-3" />}>
                        8.5
                      </GlassBadge>
                      <GlassBadge variant="default" size="sm">
                        2024
                      </GlassBadge>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">Dune: Part Two</h3>
                    <p className="text-white/70 text-sm line-clamp-2">
                      Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.
                    </p>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-2 p-4 pt-0">
                  <GlassButton variant="primary" className="flex-1">
                    <Heart className="w-4 h-4" />
                    Like
                  </GlassButton>
                  <GlassButton variant="ghost" className="flex-1">
                    <Play className="w-4 h-4" />
                    Trailer
                  </GlassButton>
                </div>
              </GlassCard>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
