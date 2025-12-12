"use client"

import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@swipe-movie/ui"
import type { MovieGenre } from "@/schemas/movies"

interface StepPersonalizationProps {
  name: string
  genreId?: number
  minRating: number
  genres: MovieGenre[]
  onNameChange: (name: string) => void
  onGenreChange: (genreId?: number) => void
  onMinRatingChange: (rating: number) => void
}

export function StepPersonalization({
  name,
  genreId,
  minRating,
  genres,
  onNameChange,
  onGenreChange,
  onMinRatingChange,
}: StepPersonalizationProps) {
  return (
    <div className="space-y-6">
      {/* Nom de la room */}
      <div className="space-y-2">
        <Label htmlFor="room-name" className="text-base font-semibold">
          Nom de la room
        </Label>
        <Input
          id="room-name"
          placeholder="Ex: Soiree cinema entre amis"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="h-12 text-base"
        />
        <p className="text-sm text-muted-foreground">
          Donnez un nom reconnaissable pour vos amis (optionnel)
        </p>
      </div>

      {/* Genre */}
      <div className="space-y-2">
        <Label htmlFor="genre" className="text-base font-semibold">
          Genre prefere
        </Label>
        <Select
          value={genreId?.toString() || "0"}
          onValueChange={(value) => {
            const id = parseInt(value)
            onGenreChange(id === 0 ? undefined : id)
          }}
        >
          <SelectTrigger id="genre" className="h-12 text-base">
            <SelectValue placeholder="Tous les genres" />
          </SelectTrigger>
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
      </div>

      {/* Note minimum */}
      <div className="space-y-2">
        <Label htmlFor="min-rating" className="text-base font-semibold">
          Note minimum
        </Label>
        <Select
          value={minRating.toFixed(1)}
          onValueChange={(value) => onMinRatingChange(parseFloat(value))}
        >
          <SelectTrigger id="min-rating" className="h-12 text-base">
            <SelectValue placeholder="Selectionner une note" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.0">Toutes les notes</SelectItem>
            <SelectItem value="8.0">8.0+ (Excellents)</SelectItem>
            <SelectItem value="7.0">7.0+ (Tres bons)</SelectItem>
            <SelectItem value="6.0">6.0+ (Bons) - Recommande</SelectItem>
            <SelectItem value="5.0">5.0+ (Moyens)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Seuls les contenus bien notes seront proposes
        </p>
      </div>
    </div>
  )
}
