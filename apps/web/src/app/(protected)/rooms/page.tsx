"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { RoomsList } from "@/components/room/RoomsList"
import { RoomFilters, RoomFilterValues } from "@/components/room/RoomFilters"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createRoomSchema,
  joinRoomSchema,
  CreateRoomValues,
  JoinRoomValues,
  UserRoomsResponseDto
} from "@/schemas/rooms"

import { joinRoom, createRoom, getMyRoom } from "@/lib/api/rooms"
import { getGenres } from "@/lib/api/movies"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { MovieGenre } from "@/schemas/movies"
import { Plus, Users, Film, Sparkles } from "lucide-react"

export default function RoomsPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState<UserRoomsResponseDto | null>(null)
  const [genres, setGenres] = useState<MovieGenre[]>([])
  const [filters, setFilters] = useState<RoomFilterValues>({
    watchRegion: "FR",
  })

  useEffect(() => {
    setLoading(true)
    Promise.all([getMyRoom(), getGenres()])
      .then(([roomsData, genresData]) => {
        setRooms(roomsData)
        setGenres(genresData)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const createForm = useForm<CreateRoomValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      type: "movie",
    },
  })

  const joinForm = useForm<JoinRoomValues>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: { code: "" },
  })

  const onCreate = async (values: CreateRoomValues) => {
    try {
      setError(null)
      setLoading(true)
      // Merge form values with filters
      const roomData = {
        ...values,
        ...filters,
      }
      const room = await createRoom(roomData)
      router.push(`/rooms/${room.code}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const onJoin = async (values: JoinRoomValues) => {
    try {
      setError(null)
      setLoading(true)
      const room = await joinRoom(values)
      router.push(`/rooms/${room.code}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
            Mes Rooms 🎬
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Créez une nouvelle room ou rejoignez vos amis pour décider ensemble
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
              <CardContent className="py-4">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {/* Create Room Card */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Créer une room</h3>
                  <p className="text-muted-foreground text-sm">
                    Configurez vos préférences et invitez vos amis
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Créer une room
                </DialogTitle>
                <DialogDescription>
                  Personnalisez votre expérience de sélection de films
                </DialogDescription>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreate)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la room (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="Soirée cinéma entre amis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de contenu *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="movie">🎬 Films</SelectItem>
                            <SelectItem value="tv">📺 Séries TV</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="genreId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre (optionnel)</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tous les genres" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Tous les genres</SelectItem>
                            {genres.map((genre) => (
                              <SelectItem key={genre.id} value={genre.id.toString()}>
                                {genre.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="filters" className="border-none">
                      <AccordionTrigger className="hover:no-underline py-3 px-4 rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Filtres avancés (optionnels)
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <RoomFilters filters={filters} onChange={setFilters} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    {loading ? "Création..." : "Créer la room"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Join Room Card */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-accent/50">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                    <Users className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Rejoindre une room</h3>
                  <p className="text-muted-foreground text-sm">
                    Entrez le code pour rejoindre vos amis
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Rejoindre une room
                </DialogTitle>
                <DialogDescription>Entrez le code de la room</DialogDescription>
              </DialogHeader>
              <Form {...joinForm}>
                <form onSubmit={joinForm.handleSubmit(onJoin)} className="space-y-4">
                  <FormField
                    control={joinForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Entrez le code (ex: ABC123)"
                            {...field}
                            className="text-center text-lg tracking-wider uppercase"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90"
                  >
                    {loading ? "Connexion..." : "Rejoindre"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* My Rooms Section */}
        {rooms && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Film className="w-6 h-6 text-primary" />
              Mes rooms actives
            </h2>
            <RoomsList rooms={rooms} />
          </div>
        )}
      </div>
    </div>
  )
}
