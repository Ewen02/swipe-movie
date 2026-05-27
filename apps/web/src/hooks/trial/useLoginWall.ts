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
const SOFT_LIMIT = 10
const HARD_LIMIT = 15

export function useLoginWall(swipeCount: number, hasMatch: boolean): UseLoginWallReturn {
  const [shouldShow, setShouldShow] = useState(false)
  const [trigger, setTrigger] = useState<LoginWallTrigger>(null)
  const [dismissCount, setDismissCount] = useState(0)

  // Track whether match was already shown to avoid re-triggering
  const matchShownRef = useRef(false)

  const isHardBlock = swipeCount >= HARD_LIMIT || dismissCount >= MAX_DISMISSALS

  // If a match is found, show the wall
  useEffect(() => {
    if (hasMatch && !matchShownRef.current) {
      matchShownRef.current = true
      setTrigger('match')
      setShouldShow(true)
    }
  }, [hasMatch])

  // If swipe count reaches the soft limit
  useEffect(() => {
    if (swipeCount >= SOFT_LIMIT && !hasMatch && !shouldShow && trigger !== 'match') {
      setTrigger('swipe_limit')
      setShouldShow(true)
    }
  }, [swipeCount, hasMatch, shouldShow, trigger])

  // Hard block on HARD_LIMIT
  useEffect(() => {
    if (swipeCount >= HARD_LIMIT) {
      setTrigger('swipe_limit')
      setShouldShow(true)
    }
  }, [swipeCount])

  const dismiss = useCallback(() => {
    if (isHardBlock) return
    setDismissCount((prev) => prev + 1)
    setShouldShow(false)
  }, [isHardBlock])

  return {
    shouldShow,
    trigger,
    dismiss,
    isHardBlock,
  }
}
