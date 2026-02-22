// Hook do śledzenia czasu czystości
export function useSobrietyTimer() {
  const [startDate, setStartDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pobierz datę rozpoczęcia czystości
  const refresh = useCallback(async () => {
    setLoading(true);
    const entry = await db.sobriety.get('sobriety_timer');
    setStartDate(entry?.startDate || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Ustaw nową datę rozpoczęcia czystości
  const setSobrietyStart = useCallback(async (date) => {
    await db.sobriety.put({ id: 'sobriety_timer', startDate: date });
    setStartDate(date);
  }, []);

  // Zresetuj licznik czystości
  const resetSobriety = useCallback(async () => {
    await db.sobriety.delete('sobriety_timer');
    setStartDate(null);
  }, []);

  // Oblicz czas od rozpoczęcia czystości (dodano sekundy)
  const getElapsed = useCallback(() => {
    if (!startDate) return null;
    const now = Date.now();
    const start = new Date(startDate).getTime();
    const diff = now - start;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }, [startDate]);

  return { startDate, loading, setSobrietyStart, resetSobriety, getElapsed };
}
import { useCallback, useEffect, useMemo, useState } from 'react'
import { db } from '../db/indexedDB'

// Hook do obsługi konfiguracji uzależnienia
export function useAddictionConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const entry = await db.addictionConfig.get('user_config');
    setConfig(entry || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveConfig = useCallback(async (data) => {
    await db.addictionConfig.put({ id: 'user_config', ...data });
    setConfig({ id: 'user_config', ...data });
  }, []);

  const clearConfig = useCallback(async () => {
    await db.addictionConfig.delete('user_config');
    setConfig(null);
  }, []);

  return { config, loading, saveConfig, clearConfig };
}
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

const csvEscape = (value) => {
  const s = String(value ?? '')
  if (/[",\n\r;]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export async function exportAllLocalDataJSON() {
  const [moodEntries, safetyPlans, settings] = await Promise.all([
    db.moodEntries.toArray(),
    db.safetyPlan.toArray(),
    db.settings.toArray(),
  ])

  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      data: {
        moodEntries,
        safetyPlans,
        settings,
      },
    },
    null,
    2,
  )
}

export async function exportMoodEntriesCSV() {
  const moodEntries = await db.moodEntries.toArray()
  moodEntries.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))

  const header = ['id', 'timestamp', 'dateISO', 'emotions', 'notes']
  const rows = moodEntries.map((e) => {
    const emotions = Array.isArray(e.emotions) ? e.emotions.join('|') : ''
    const dateISO = e.date ? new Date(e.date).toISOString() : ''
    return [
      csvEscape(e.id ?? ''),
      csvEscape(e.timestamp ?? ''),
      csvEscape(dateISO),
      csvEscape(emotions),
      csvEscape(e.notes ?? ''),
    ].join(',')
  })

  return [header.join(','), ...rows].join('\n')
}

export async function exportSafetyPlanText() {
  const planId = 'safety_plan_1'
  const plan = await db.safetyPlan.get(planId)

  if (!plan) {
    return [
      'Mój plan bezpieczeństwa',
      '',
      '(Brak zapisanych danych.)',
      '',
      `Wygenerowano: ${new Date().toLocaleString()}`,
    ].join('\n')
  }

  const supportPeople = Array.isArray(plan.supportPeople) ? plan.supportPeople : []
  const supportLines = supportPeople.length
    ? supportPeople.map((p, idx) => `${idx + 1}. ${String(p?.name ?? '').trim()}${p?.contact ? ` — ${String(p.contact).trim()}` : ''}`)
    : ['(brak)']

  const lines = [
    'Mój plan bezpieczeństwa',
    '',
    `Ostatnia edycja: ${plan.lastEdited ? new Date(plan.lastEdited).toLocaleString() : '—'}`,
    '',
    '1) Moje sygnały ostrzegawcze',
    String(plan.warningSignals ?? '').trim() || '—',
    '',
    '2) Co pomaga mi, gdy jest bardzo trudno',
    String(plan.copingStrategies ?? '').trim() || '—',
    '',
    '3) Osoby, z którymi mogę porozmawiać',
    ...supportLines,
    '',
    '4) Miejsca, w których czuję się bezpiecznie',
    String(plan.safePlaces ?? '').trim() || '—',
    '',
    '5) Jak ograniczyć dostęp do rzeczy, którymi mógłbym/mogłabym zrobić sobie krzywdę',
    String(plan.limitAccessToMeans ?? '').trim() || '—',
    '',
    '---',
    'To nie jest usługa ratunkowa. Jeśli jesteś w bezpośrednim zagrożeniu — zadzwoń pod 112.',
    `Wygenerowano: ${new Date().toLocaleString()}`,
  ]

  return lines.join('\n')
}
