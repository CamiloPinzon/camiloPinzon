export const LANGUAGES = {
	EN: "en",
	ES: "es",
} as const;

export type SupportedLanguage = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const LanguageOptions = [
	{ code: LANGUAGES.EN, name: "English", flag: "EN" },
	{ code: LANGUAGES.ES, name: "Español", flag: "ES" },
];
