import pl from '../i18n/pl.json'
import de from '../i18n/de.json'

const DICTS = { pl, de }

function pickDict(lang = 'pl') {
	return DICTS[lang] ?? DICTS.pl
}

export function getHotlinesMeta(lang = 'pl') {
	return pickDict(lang).data.hotlinesMeta
}

export function getHotlines(lang = 'pl') {
	return pickDict(lang).data.hotlines
}

export const HOTLINES_META = getHotlinesMeta(
	typeof window !== 'undefined' ? window.localStorage.getItem('app_lang') ?? 'pl' : 'pl',
)
export const HOTLINES = getHotlines(
	typeof window !== 'undefined' ? window.localStorage.getItem('app_lang') ?? 'pl' : 'pl',
)
