/* jshint esversion: 11, asi: true, module: true */
import { useEffect, useRef } from 'react'
import { useSettings } from './useIndexedDB'

const DEFAULT_TIME = '20:00'
const ONE_DAY_MS = 24 * 60 * 60 * 1000
const CHECKIN_TAG = 'daily-checkin'

const parseTime = (value) => {
  if (!value || typeof value !== 'string') return { hours: 20, minutes: 0 }
  const [rawHours, rawMinutes] = value.split(':')
  const hours = Number.parseInt(rawHours, 10)
  const minutes = Number.parseInt(rawMinutes, 10)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return { hours: 20, minutes: 0 }
  return {
    hours: Math.min(Math.max(hours, 0), 23),
    minutes: Math.min(Math.max(minutes, 0), 59),
  }
}

const getTodayAt = (timeStr, now = new Date()) => {
  const { hours, minutes } = parseTime(timeStr)
  const target = new Date(now)
  target.setHours(hours, minutes, 0, 0)
  return target
}

const getNextAt = (timeStr, now = new Date()) => {
  const todayAt = getTodayAt(timeStr, now)
  if (todayAt.getTime() <= now.getTime()) {
    const next = new Date(todayAt)
    next.setDate(next.getDate() + 1)
    return next
  }
  return todayAt
}

const showCheckInNotification = async () => {
  if (typeof window === 'undefined') return false
  if (!('Notification' in window)) return false
  if (Notification.permission !== 'granted') return false

  const title = 'Codzienny check-in'
  const options = {
    body: 'Jak się dziś czujesz? Otwórz aplikację i dodaj wpis nastroju.',
    tag: CHECKIN_TAG,
    renotify: false,
    data: { url: '/' },
    icon: '/logo.svg',
    badge: '/logo.svg',
  }

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration?.showNotification) {
      await registration.showNotification(title, options)
      return true
    }
  }

  // Fallback do powiadomienia z poziomu okna (gdy SW nie jest aktywny).
  new Notification(title, options)
  return true
}

export function useCheckInNotifications() {
  const { value: enabled, loading: enabledLoading } = useSettings('checkin_enabled_v1', false)
  const { value: time, loading: timeLoading } = useSettings('checkin_time_v1', DEFAULT_TIME)
  const { value: lastNotified, set: setLastNotified, loading: lastLoading } = useSettings(
    'checkin_last_v1',
    0,
  )
  const timerRef = useRef(null)

  useEffect(() => {
    if (enabledLoading || timeLoading || lastLoading) return undefined
    if (!enabled) return undefined
    if (typeof window === 'undefined') return undefined
    if (!('Notification' in window)) return undefined
    if (Notification.permission !== 'granted') return undefined

    let alive = true

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    const fireIfDue = async (nowMs) => {
      const todayAt = getTodayAt(time, new Date(nowMs)).getTime()
      const last = typeof lastNotified === 'number' ? lastNotified : 0
      if (nowMs >= todayAt && last < todayAt) {
        const sent = await showCheckInNotification()
        if (sent && alive) {
          await setLastNotified(Date.now())
        }
      }
    }

    const scheduleNext = (nowMs) => {
      const nextAt = getNextAt(time, new Date(nowMs)).getTime()
      const delay = Math.max(nextAt - nowMs, 1000)
      clearTimer()
      timerRef.current = window.setTimeout(async () => {
        const nowInside = Date.now()
        await fireIfDue(nowInside)
        if (alive) scheduleNext(Date.now())
      }, delay)
    }

    const nowMs = Date.now()
    fireIfDue(nowMs)
    scheduleNext(nowMs)

    return () => {
      alive = false
      clearTimer()
    }
  }, [enabled, enabledLoading, time, timeLoading, lastNotified, lastLoading, setLastNotified])

  return { enabled, time, lastNotified }
}
