import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import languageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { NAMESPACES } from "./namespaces";

// Static resources //

/* English*/

import enCommon from "./resources/en/common.json";
import enProfileInfo from "./resources/en/profileInfo.json";
import enTabedNavigation from "./resources/en/tabedNavigation.json";
import enLatestBlogs from "./resources/en/latestBlogs.json";
import enFeaturedRepos from "./resources/en/featuredRepos.json";
import enClientes from "./resources/en/clients.json";
import enExperience from "./resources/en/experience.json";

/* Spanish*/

import esCommon from "./resources/es/common.json";
import esProfileInfo from "./resources/es/profileInfo.json";
import esTabedNavigation from "./resources/es/tabedNavigation.json";
import esLatestBlogs from "./resources/es/latestBlogs.json";
import esFeaturedRepos from "./resources/es/featuredRepos.json";
import esClientes from "./resources/es/clients.json";
import esExperience from "./resources/es/experience.json";

/*Resources Config*/

const resources = {
	en: {
		[NAMESPACES.COMMON]: enCommon,
		[NAMESPACES.PROFILE_INFO]: enProfileInfo,
		[NAMESPACES.TABED_NAVIGATION]: enTabedNavigation,
		[NAMESPACES.LATEST_BLOGS]: enLatestBlogs,
		[NAMESPACES.FEATURED_REPOS]: enFeaturedRepos,
		[NAMESPACES.CLIENTES]: enClientes,
		[NAMESPACES.EXPERIENCE]: enExperience,
	},
	es: {
		[NAMESPACES.COMMON]: esCommon,
		[NAMESPACES.PROFILE_INFO]: esProfileInfo,
		[NAMESPACES.TABED_NAVIGATION]: esTabedNavigation,
		[NAMESPACES.LATEST_BLOGS]: esLatestBlogs,
		[NAMESPACES.FEATURED_REPOS]: esFeaturedRepos,
		[NAMESPACES.CLIENTES]: esClientes,
		[NAMESPACES.EXPERIENCE]: esExperience,
	},
};

i18n
	.use(Backend)
	.use(languageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en",
		supportedLngs: ["en", "es"],
		ns: Object.values(NAMESPACES),
		defaultNS: NAMESPACES.COMMON,
		debug: import.meta.env.DEV,
		interpolation: { escapeValue: false },
		detection: {
			order: ["localStorage", "navigator"],
			caches: ["localStorage"],
		},
	});

export default i18n;
