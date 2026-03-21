import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import pl from './pl.json'

const DICTS = { pl }
const FALLBACK_LANG = 'pl'
const STORAGE_KEY = 'app_lang'

function getByPath(obj, path) {
  if (!obj || !path) return undefined
  return path.split('.').reduce((acc, key) => (acc && key in acc ? acc[key] : undefined), obj)
}

function interpolate(text, vars) {
  if (typeof text !== 'string') return text
  return text.replace(/\{\{(.*?)\}\}/g, (_, key) => String(vars?.[key.trim()] ?? ''))
}

const I18nContext = createContext({
  lang: FALLBACK_LANG,
  setLang: () => {},
  t: (key, fallback, vars) => (fallback ?? key),
  get: (key, fallback) => fallback,
  availableLanguages: Object.keys(DICTS),
})

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return FALLBACK_LANG
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved && DICTS[saved] ? saved : FALLBACK_LANG
  })

  const dict = useMemo(() => DICTS[lang] ?? DICTS[FALLBACK_LANG], [lang])

  const changeLang = useCallback((nextLang) => {
    if (!DICTS[nextLang]) return
    setLang(nextLang)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextLang)
      document.documentElement.lang = nextLang
    }
  }, [])

  const t = useCallback(
    (key, fallback = key, vars = undefined) => {
      const value = getByPath(dict, key)
      const text = typeof value === 'string' ? value : fallback
      return interpolate(text, vars)
    },
    [dict],
  )

  const get = useCallback(
    (key, fallback = undefined) => {
      const value = getByPath(dict, key)
      return value ?? fallback
    },
    [dict],
  )

  const contextValue = useMemo(
    () => ({
      lang,
      setLang: changeLang,
      t,
      get,
      availableLanguages: Object.keys(DICTS),
    }),
    [lang, changeLang, t, get],
  )

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
