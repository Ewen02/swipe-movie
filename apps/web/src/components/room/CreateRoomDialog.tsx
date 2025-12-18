"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@swipe-movie/ui"
import { RoomFilters, RoomFilterValues } from "./RoomFilters"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createRoomSchema, CreateRoomValues } from "@/schemas/rooms"
import type { MovieGenre } from "@/schemas/movies"
import { Sparkles, Loader2, Film, Tv, ChevronDown, ChevronUp } from "lucide-react"

interface CreateRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateRoomValues) => Promise<void>
  genres: MovieGenre[]
  loading: boolean
}

export function CreateRoomDialog({
  open,
  onOpenChange,
  onSubmit,
  genres,
  loading,
}: CreateRoomDialogProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filters, setFilters] = useState<RoomFilterValues>({
    watchRegion: "FR",
    minRating: 6.0,
  })

  const form = useForm<CreateRoomValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      type: "movie",
    },
  })

  const handleSubmit = async (values: CreateRoomValues) => {
    const roomData = {
      ...values,
      ...filters,
    }
    await onSubmit(roomData as CreateRoomValues)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background/98 to-background/95 backdrop-blur-xl border border-border">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Créer une room</DialogTitle>
              <DialogDescription className="text-base">
                Configurez votre sélection de films en quelques clics
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4" aria-label="Formulaire de création de room">
            {/* Type de contenu - Boutons Toggle */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Type de contenu *</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => field.onChange("movie")}
                        className={`group p-6 rounded-xl border-2 transition-all ${
                          field.value === "movie"
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                            : "border-border hover:border-primary/50 hover:bg-accent/5"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className={`w-14 h-14 rounded-lg flex items-center justify-center transition-colors ${
                            field.value === "movie"
                              ? "bg-primary text-white"
                              : "bg-muted group-hover:bg-primary/10"
                          }`}>
                            <Film className="w-7 h-7" />
                          </div>
                          <div className="font-semibold text-lg">Films</div>
                          <p className="text-xs text-muted-foreground text-center">
                            Longs métrages et cinéma
                          </p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("tv")}
                        className={`group p-6 rounded-xl border-2 transition-all ${
                          field.value === "tv"
                            ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                            : "border-border hover:border-accent/50 hover:bg-accent/5"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className={`w-14 h-14 rounded-lg flex items-center justify-center transition-colors ${
                            field.value === "tv"
                              ? "bg-accent text-white"
                              : "bg-muted group-hover:bg-accent/10"
                          }`}>
                            <Tv className="w-7 h-7" />
                          </div>
                          <div className="font-semibold text-lg">Séries</div>
                          <p className="text-xs text-muted-foreground text-center">
                            Séries TV et mini-séries
                          </p>
                        </div>
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nom de la room */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Nom de la room</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Soirée cinéma entre amis"
                      {...field}
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Donnez un nom reconnaissable pour vos amis
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Genre */}
            <FormField
              control={form.control}
              name="genreId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Genre (optionnel)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Tous les genres" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="0">Tous les genres</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre.id} value={genre.id.toString()}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Filtrez par genre pour affiner les suggestions
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Filtres avancés - Section repliable */}
            <div className={`relative rounded-2xl border transition-all ${
              showAdvancedFilters ? "border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5" : "border-border bg-gradient-to-br from-background/50 to-background/30"
            }`}>
              <div className="p-5">
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="w-full flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold">Filtres avancés</h4>
                      <p className="text-sm text-muted-foreground">
                        {showAdvancedFilters ? "Masquer les options" : "Personnaliser les critères"}
                      </p>
                    </div>
                  </div>
                  {showAdvancedFilters ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </button>

                {showAdvancedFilters && (
                  <div className="mt-6 pt-6 border-t">
                    <RoomFilters filters={filters} onChange={setFilters} />
                  </div>
                )}

                {!showAdvancedFilters && (
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>⭐ Note minimum :</span>
                      <span className="font-medium text-foreground">{filters.minRating || 6.0}/10</span>
                    </div>
                    {filters.releaseYearMin && filters.releaseYearMax && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>📅 Période :</span>
                        <span className="font-medium text-foreground">
                          {filters.releaseYearMin} - {filters.releaseYearMax}
                        </span>
                      </div>
                    )}
                    {filters.watchProviders && filters.watchProviders.length > 0 && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>📺 Plateformes :</span>
                        <span className="font-medium text-foreground">
                          {filters.watchProviders.length} sélectionnée(s)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg py-6 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Créer la room
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
