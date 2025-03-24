import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { SupportedLanguage, LANGUAGES } from "../i18n/languageOptions";

type LanguageContextType = {
	currentLanguage: SupportedLanguage;
	changeLanguage: (lang: SupportedLanguage) => void;
	isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextType>({
	currentLanguage: LANGUAGES.EN,
	changeLanguage: () => {},
	isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);

type LanguageProviderProps = {
	children: ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
	children,
}) => {
	const { i18n } = useTranslation();
	const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
		(i18n.language as SupportedLanguage) || LANGUAGES.EN
	);

	const isRTL = false;

	useEffect(() => {
		const handleLanguageChanged = (lng: string) => {
			setCurrentLanguage(lng as SupportedLanguage);
			// Update document direction if needed
			document.documentElement.dir = isRTL ? "rtl" : "ltr";
		};

		i18n.on("languageChanged", handleLanguageChanged);

		return () => {
			i18n.off("languageChanged", handleLanguageChanged);
		};
	}, [i18n, isRTL]);

	const changeLanguage = (lang: SupportedLanguage) => {
		i18n.changeLanguage(lang);
	};

	return (
		<LanguageContext.Provider
			value={{ currentLanguage, changeLanguage, isRTL }}
		>
			{children}
		</LanguageContext.Provider>
	);
};
