import pl from '../i18n/pl.json'
import de from '../i18n/de.json'

const DICTS = { pl, de }

function pickDict(lang = 'pl') {
	return DICTS[lang] ?? DICTS.pl
}

export function getFriendGuide(lang = 'pl') {
	const data = pickDict(lang).data.friendGuide
	if (Array.isArray(data?.sections) && data.sections.length > 0) return data
	return DICTS.pl.data.friendGuide
}

export const FRIEND_GUIDE = getFriendGuide(
	typeof window !== 'undefined' ? window.localStorage.getItem('app_lang') ?? 'pl' : 'pl',
)
