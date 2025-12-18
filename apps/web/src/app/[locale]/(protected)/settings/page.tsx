"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { ArrowLeft, Settings, User, Shield, Trash2, Download, LogOut, Loader2, AlertTriangle } from "lucide-react"
import {
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@swipe-movie/ui"
import { useSession, signOut } from "@/lib/auth-client"
import { useToast } from "@/components/providers/toast-provider"
import { Footer } from "@/components/layout/Footer"
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { exportUserData, deleteUserAccount } from "@/lib/api/users"
import { SettingsPageSkeleton } from "./SettingsPageSkeleton"

export default function SettingsPage() {
  const t = useTranslations("settings")
  const { data: session, isPending } = useSession()
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleExportData = async () => {
    try {
      setIsExporting(true)
      const data = await exportUserData()

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `swipe-movie-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: t("data.exportSuccess"),
        description: t("data.exportSuccessDescription"),
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: t("data.exportError"),
        description: t("data.exportErrorDescription"),
        type: "error",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      await deleteUserAccount()

      toast({
        title: t("danger.deleteSuccess"),
        description: t("danger.deleteSuccessDescription"),
      })

      // Sign out and redirect
      await signOut()
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: t("danger.deleteError"),
        description: t("danger.deleteErrorDescription"),
        type: "error",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isPending) {
    return <SettingsPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Background orbs */}
      <BackgroundOrbs />

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div className="mb-8" variants={fadeInUp}>
            <Link href="/rooms">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2 hover:bg-foreground/5">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToRooms")}
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">{t("title")}</h1>
            </div>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            className="rounded-2xl border border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl p-6 mb-6"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-lg font-semibold">{t("profile.title")}</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div>
                  <p className="text-sm font-medium">{t("profile.email")}</p>
                  <p className="text-sm text-muted-foreground">{session?.user?.email || "-"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div>
                  <p className="text-sm font-medium">{t("profile.name")}</p>
                  <p className="text-sm text-muted-foreground">{session?.user?.name || t("profile.notSet")}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{t("profile.createdAt")}</p>
                  <p className="text-sm text-muted-foreground">
                    {session?.user?.createdAt
                      ? new Date(session.user.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Data & Privacy Section (RGPD) */}
          <motion.div
            className="rounded-2xl border border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl p-6 mb-6"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-green-500/10">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-lg font-semibold">{t("data.title")}</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{t("data.description")}</p>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleExportData}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isExporting ? t("data.exporting") : t("data.exportButton")}
              </Button>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
              <p>{t("data.exportInfo")}</p>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/5 to-background/80 backdrop-blur-xl p-6"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-red-500/10">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-red-500">{t("danger.title")}</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{t("danger.description")}</p>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4" />
                {t("danger.logout")}
              </Button>

              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t("danger.deleteButton")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("danger.deleteDialogTitle")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("danger.deleteDialogDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                      {t("danger.cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t("danger.deleting")}
                        </>
                      ) : (
                        t("danger.confirmDelete")
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
