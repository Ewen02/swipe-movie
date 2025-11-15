"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import * as Sentry from "@sentry/nextjs"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  children: ReactNode
  roomId?: string
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Specialized Error Boundary for Room-related components
 * Provides room-specific error recovery options
 */
export class RoomErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (process.env.NODE_ENV === "development") {
      console.error("Room Error Boundary caught an error:", error)
      console.error("Error Info:", errorInfo)
    }

    // Send error to Sentry with room context
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
        room: {
          roomId: this.props.roomId,
        },
      },
      tags: {
        errorBoundary: "RoomErrorBoundary",
      },
    })
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    })
    this.props.onReset?.()
  }

  handleBackToRooms = (): void => {
    window.location.href = "/rooms"
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                </div>
                <CardTitle>Erreur dans la room</CardTitle>
              </div>
              <CardDescription>
                Une erreur s'est produite lors du chargement de cette room. Vous pouvez réessayer ou retourner à la liste des rooms.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error details in development */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs font-mono text-red-600 dark:text-red-400">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {/* Room ID if available */}
              {this.props.roomId && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Room ID: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{this.props.roomId}</code>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button onClick={this.handleReset} className="flex-1 gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Réessayer
                </Button>
                <Button onClick={this.handleBackToRooms} variant="outline" className="flex-1 gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Mes rooms
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
