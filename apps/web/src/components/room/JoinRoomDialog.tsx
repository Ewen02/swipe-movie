"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { joinRoomSchema, JoinRoomValues } from "@/schemas/rooms"
import { Users, Loader2, Hash } from "lucide-react"

interface JoinRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: JoinRoomValues) => Promise<void>
  loading: boolean
}

export function JoinRoomDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: JoinRoomDialogProps) {
  const form = useForm<JoinRoomValues>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: { code: "" },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Rejoindre une room</DialogTitle>
              <DialogDescription className="text-base">
                Entrez le code partagé par vos amis
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Hash className="w-5 h-5" />
                      </div>
                      <Input
                        placeholder="ABCD12"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        className="h-16 text-center text-2xl tracking-[0.3em] uppercase font-mono pl-12 border-2 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-accent"
                        maxLength={6}
                      />
                    </div>
                  </FormControl>
                  <p className="text-sm text-muted-foreground text-center">
                    Le code fait exactement 6 caractères
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-accent to-primary hover:opacity-90 text-lg shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-2" />
                    Rejoindre la room
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Besoin d'aide ?
                  </span>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">Comment obtenir un code ?</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Demandez à un ami de créer une room</li>
                  <li>• Il peut partager le code via le bouton "Partager"</li>
                  <li>• Le code se trouve aussi en haut de chaque room</li>
                </ul>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
