import pl from '../i18n/pl.json'
import de from '../i18n/de.json'

const DICTS = { pl, de }

function pickDict(lang = 'pl') {
	return DICTS[lang] ?? DICTS.pl
}

export function getEmotions(lang = 'pl') {
	return pickDict(lang).data.emotions
}

export const EMOTIONS = getEmotions(
	typeof window !== 'undefined' ? window.localStorage.getItem('app_lang') ?? 'pl' : 'pl',
)
