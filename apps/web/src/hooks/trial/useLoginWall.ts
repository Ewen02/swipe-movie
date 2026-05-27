'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

type LoginWallTrigger = 'match' | 'swipe_limit' | null

interface UseLoginWallReturn {
  shouldShow: boolean
  trigger: LoginWallTrigger
  dismiss: () => void
  isHardBlock: boolean
}

const MAX_DISMISSALS = 2
const SOFT_LIMIT = 15
const HARD_LIMIT = 25
const COOLDOWN_AFTER_DISMISS = 5

export function useLoginWall(swipeCount: number, hasMatch: boolean): UseLoginWallReturn {
  const [shouldShow, setShouldShow] = useState(false)
  const [trigger, setTrigger] = useState<LoginWallTrigger>(null)
  const [dismissCount, setDismissCount] = useState(0)
  const [dismissedAtSwipe, setDismissedAtSwipe] = useState(0)

  const matchShownRef = useRef(false)

  const isHardBlock = swipeCount >= HARD_LIMIT || dismissCount >= MAX_DISMISSALS

  useEffect(() => {
    if (hasMatch && !matchShownRef.current) {
      matchShownRef.current = true
      setTrigger('match')
      setShouldShow(true)
    }
  }, [hasMatch])

  useEffect(() => {
    if (
      swipeCount >= SOFT_LIMIT &&
      !hasMatch &&
      !shouldShow &&
      trigger !== 'match' &&
      swipeCount >= dismissedAtSwipe + COOLDOWN_AFTER_DISMISS
    ) {
      setTrigger('swipe_limit')
      setShouldShow(true)
    }
  }, [swipeCount, hasMatch, shouldShow, trigger, dismissedAtSwipe])

  useEffect(() => {
    if (swipeCount >= HARD_LIMIT) {
      setTrigger('swipe_limit')
      setShouldShow(true)
    }
  }, [swipeCount])

  const dismiss = useCallback(() => {
    if (isHardBlock) return
    setDismissCount((prev) => prev + 1)
    setDismissedAtSwipe(swipeCount)
    setShouldShow(false)
  }, [isHardBlock, swipeCount])

  return {
    shouldShow,
    trigger,
    dismiss,
    isHardBlock,
  }
}
