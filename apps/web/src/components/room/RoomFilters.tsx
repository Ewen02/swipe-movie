"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { WATCH_PROVIDERS } from "@/lib/constants/providers"

export interface RoomFilterValues {
  minRating?: number
  releaseYearMin?: number
  releaseYearMax?: number
  runtimeMin?: number
  runtimeMax?: number
  watchProviders?: number[]
  watchRegion?: string
  originalLanguage?: string
}

interface RoomFiltersProps {
  filters: RoomFilterValues
  onChange: (filters: RoomFilterValues) => void
}

const LANGUAGES = [
  { code: "fr", name: "Français" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
]

const CURRENT_YEAR = new Date().getFullYear()
const DECADES = [
  { label: "2020s", min: 2020, max: CURRENT_YEAR },
  { label: "2010s", min: 2010, max: 2019 },
  { label: "2000s", min: 2000, max: 2009 },
  { label: "1990s", min: 1990, max: 1999 },
  { label: "1980s", min: 1980, max: 1989 },
]

export function RoomFilters({ filters, onChange }: RoomFiltersProps) {
  const toggleProvider = (providerId: number) => {
    const current = filters.watchProviders || []
    const newProviders = current.includes(providerId)
      ? current.filter((id) => id !== providerId)
      : [...current, providerId]
    onChange({ ...filters, watchProviders: newProviders })
  }

  const removeProvider = (providerId: number) => {
    const newProviders = (filters.watchProviders || []).filter(
      (id) => id !== providerId
    )
    onChange({ ...filters, watchProviders: newProviders })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filtres avancés</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Affinez votre sélection de films avec ces critères
        </p>
      </div>

      {/* Note minimum */}
      <div className="space-y-2">
        <Label>Note minimum</Label>
        <Select
          value={filters.minRating !== undefined ? filters.minRating.toFixed(1) : "none"}
          onValueChange={(value) =>
            onChange({
              ...filters,
              minRating: value === "none" ? undefined : parseFloat(value),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les notes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Toutes les notes</SelectItem>
            <SelectItem value="8.0">8.0+ (Excellents)</SelectItem>
            <SelectItem value="7.0">7.0+ (Très bons)</SelectItem>
            <SelectItem value="6.0">6.0+ (Bons)</SelectItem>
            <SelectItem value="5.0">5.0+ (Moyens)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Décennie */}
      <div className="space-y-2">
        <Label>Période de sortie</Label>
        <Select
          value={
            filters.releaseYearMin
              ? `${filters.releaseYearMin}-${filters.releaseYearMax}`
              : "none"
          }
          onValueChange={(value) => {
            if (value === "none") {
              onChange({
                ...filters,
                releaseYearMin: undefined,
                releaseYearMax: undefined,
              })
            } else {
              const [min, max] = value.split("-").map(Number)
              onChange({ ...filters, releaseYearMin: min, releaseYearMax: max })
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les périodes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Toutes les périodes</SelectItem>
            {DECADES.map((decade) => (
              <SelectItem key={decade.label} value={`${decade.min}-${decade.max}`}>
                {decade.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Durée */}
      <div className="space-y-2">
        <Label>Durée</Label>
        <Select
          value={
            filters.runtimeMin !== undefined && filters.runtimeMax !== undefined
              ? `${filters.runtimeMin}-${filters.runtimeMax}`
              : "none"
          }
          onValueChange={(value) => {
            if (value === "none") {
              onChange({
                ...filters,
                runtimeMin: undefined,
                runtimeMax: undefined,
              })
            } else {
              const [min, max] = value.split("-").map(Number)
              onChange({ ...filters, runtimeMin: min, runtimeMax: max })
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les durées" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Toutes les durées</SelectItem>
            <SelectItem value="0-90">Court (&lt; 90 min)</SelectItem>
            <SelectItem value="90-130">Standard (90-130 min)</SelectItem>
            <SelectItem value="130-999">Long (&gt; 130 min)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Langue originale */}
      <div className="space-y-2">
        <Label htmlFor="language">Langue originale</Label>
        <Select
          value={filters.originalLanguage || "none"}
          onValueChange={(value) =>
            onChange({
              ...filters,
              originalLanguage: value === "none" ? undefined : value,
            })
          }
        >
          <SelectTrigger id="language">
            <SelectValue placeholder="Toutes les langues" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Toutes les langues</SelectItem>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Plateformes de streaming */}
      <div className="space-y-2">
        <Label>Disponible sur</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {WATCH_PROVIDERS.map((provider) => {
            const isSelected = (filters.watchProviders || []).includes(
              provider.id
            )
            return (
              <Badge
                key={provider.id}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleProvider(provider.id)}
              >
                <span className="mr-1">{provider.logo}</span>
                {provider.name}
                {isSelected && (
                  <X
                    className="ml-1 h-3 w-3"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeProvider(provider.id)
                    }}
                  />
                )}
              </Badge>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Région : France (FR) par défaut
        </p>
      </div>

      {/* Custom year range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="yearMin">Année min</Label>
          <Input
            id="yearMin"
            type="number"
            placeholder="1990"
            min={1900}
            max={CURRENT_YEAR}
            value={filters.releaseYearMin || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                releaseYearMin: e.target.value
                  ? parseInt(e.target.value, 10)
                  : undefined,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearMax">Année max</Label>
          <Input
            id="yearMax"
            type="number"
            placeholder={CURRENT_YEAR.toString()}
            min={1900}
            max={CURRENT_YEAR}
            value={filters.releaseYearMax || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                releaseYearMax: e.target.value
                  ? parseInt(e.target.value, 10)
                  : undefined,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
