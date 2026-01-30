import Dexie from 'dexie'

export const db = new Dexie('CrisisApp')

db.version(1).stores({
  moodEntries: '++id, date, timestamp',
  safetyPlan: '&planId',
  settings: '&key',
})
