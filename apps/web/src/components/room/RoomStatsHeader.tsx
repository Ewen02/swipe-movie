"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Film, Users, Heart, TrendingUp, Plus, ArrowRight } from "lucide-react"

interface RoomStatsHeaderProps {
  totalRooms: number
  totalMatches?: number
  totalSwipesToday?: number
  onCreateRoom: () => void
  onJoinRoom: () => void
}

export function RoomStatsHeader({
  totalRooms,
  totalMatches = 0,
  totalSwipesToday = 0,
  onCreateRoom,
  onJoinRoom,
}: RoomStatsHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border-2 border-primary/20 mb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />

      <div className="relative p-8 md:p-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3">
            Mes Rooms 🎬
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Créez une nouvelle room ou rejoignez vos amis pour décider ensemble du prochain film ou série à regarder
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-primary/20 bg-background/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rooms actives</p>
                  <p className="text-3xl font-bold text-primary">{totalRooms}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Film className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-background/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Matches trouvés</p>
                  <p className="text-3xl font-bold text-accent">{totalMatches}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-background/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Swipes aujourd'hui</p>
                  <p className="text-3xl font-bold text-green-500">{totalSwipesToday}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg py-6 flex-1 sm:flex-initial"
            onClick={onCreateRoom}
          >
            <Plus className="w-5 h-5 mr-2" />
            Créer une room
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 text-lg py-6 flex-1 sm:flex-initial hover:bg-accent/10 hover:border-accent"
            onClick={onJoinRoom}
          >
            <Users className="w-5 h-5 mr-2" />
            Rejoindre une room
          </Button>
        </div>
      </div>
    </div>
  )
}
