import { useCallback, useEffect, useMemo, useState } from 'react'
import { db } from '../db/indexedDB'

export function useMoodEntries() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const data = await db.moodEntries.toArray()
      data.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
      setEntries(data)
      setError(null)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addEntry = useCallback(async (emotions, notes = '') => {
    const newEntry = {
      date: new Date(),
      emotions,
      notes,
      timestamp: Date.now(),
    }
    const id = await db.moodEntries.add(newEntry)
    setEntries((prev) => [{ ...newEntry, id }, ...prev])
    return id
  }, [])

  const getEntriesFromDays = useCallback(
    (days = 14) => {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
      return entries.filter((e) => (e.timestamp ?? 0) >= cutoff)
    },
    [entries],
  )

  return { entries, loading, error, refresh, addEntry, getEntriesFromDays }
}

export function useSafetyPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const planId = 'safety_plan_1'

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const existing = await db.safetyPlan.get(planId)
      setPlan(
        existing || {
          planId,
          warningSignals: '',
          copingStrategies: '',
          supportPeople: [],
          safePlaces: '',
          limitAccessToMeans: '',
          lastEdited: null,
        },
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const savePlan = useCallback(async (partial) => {
    const updated = {
      planId,
      ...partial,
      lastEdited: new Date(),
    }
    await db.safetyPlan.put(updated)
    setPlan(updated)
    return updated
  }, [])

  const hasAnyData = useMemo(() => {
    if (!plan) return false
    return Boolean(
      plan.warningSignals ||
        plan.copingStrategies ||
        plan.safePlaces ||
        plan.limitAccessToMeans ||
        (Array.isArray(plan.supportPeople) && plan.supportPeople.length > 0),
    )
  }, [plan])

  return { plan, loading, savePlan, reload: load, hasAnyData }
}

export function useSettings(key, defaultValue) {
  const [value, setValue] = useState(defaultValue)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const row = await db.settings.get(key)
        if (!alive) return
        setValue(row?.value ?? defaultValue)
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [key, defaultValue])

  const set = useCallback(
    async (next) => {
      const resolved = typeof next === 'function' ? next(value) : next
      await db.settings.put({ key, value: resolved })
      setValue(resolved)
      return resolved
    },
    [key, value],
  )

  return { value, set, loading }
}

export async function clearAllLocalData() {
  await Promise.all([
    db.moodEntries.clear(),
    db.safetyPlan.clear(),
    db.settings.clear(),
  ])
}
