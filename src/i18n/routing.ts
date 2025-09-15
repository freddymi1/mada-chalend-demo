export type Locale = (typeof locales)[number]

export const locales = ['en', 'fr', 'mg'] as const
export const defaultLocale: Locale = 'fr'