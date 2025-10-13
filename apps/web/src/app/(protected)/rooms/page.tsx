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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { RoomsList } from "@/components/room/RoomsList"
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
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RoomsPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState<UserRoomsResponseDto | null>(null)

  useEffect(() => {
    setLoading(true)
    getMyRoom()
      .then((data) => {
        setRooms(data)
        console.log("API returned", data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const createForm = useForm<CreateRoomValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: { name: "" },
  })

  const joinForm = useForm<JoinRoomValues>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: { code: "" },
  })

  const onCreate = async (values: CreateRoomValues) => {
    try {
      setError(null)
      setLoading(true)
      const room = await createRoom(values)
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
    <div className="flex h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Bienvenue dans les Rooms 🎬</h1>
        <p className="text-muted-foreground">
          Créez une room pour inviter vos amis, ou rejoignez une room existante avec un code.
        </p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-4 justify-center">
          {/* CREATE ROOM */}
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={loading}>Créer une room</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une room</DialogTitle>
                <DialogDescription>Entrez un nom pour votre room</DialogDescription>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreate)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Nom de la room" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Création..." : "Créer"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* JOIN ROOM */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={loading}>Rejoindre une room</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rejoindre une room</DialogTitle>
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
                          <Input placeholder="Code de la room" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Connexion..." : "Rejoindre"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        {rooms && (
          <div className="mt-8 text-left">
            <h2 className="text-lg font-semibold mb-2">Mes Rooms</h2>
            <RoomsList rooms={rooms} />
          </div>
        )}
      </div>
    </div>
  )
}