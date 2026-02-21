import Dexie from 'dexie';

export const db = new Dexie('CrisisApp');
db.version(2).stores({
  moodEntries: '++id, date, timestamp',
  safetyPlan: '&planId',
  settings: '&key',
  sobriety: '&id, startDate',
  addictionConfig: '&id',
});
