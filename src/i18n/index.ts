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
import enServices from "./resources/en/services.json";
import enContact from "./resources/en/contact.json";
import enContactForm from "./resources/en/contactForm.json";
import enUserBlogList from "./resources/en/userBlogList.json";

/* Spanish*/

import esCommon from "./resources/es/common.json";
import esProfileInfo from "./resources/es/profileInfo.json";
import esTabedNavigation from "./resources/es/tabedNavigation.json";
import esLatestBlogs from "./resources/es/latestBlogs.json";
import esFeaturedRepos from "./resources/es/featuredRepos.json";
import esClientes from "./resources/es/clients.json";
import esExperience from "./resources/es/experience.json";
import esServices from "./resources/es/services.json";
import esContact from "./resources/es/contact.json";
import esContactForm from "./resources/es/contactForm.json";
import esUserBlogList from "./resources/es/userBlogList.json";

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
		[NAMESPACES.SERVICES]: enServices,
		[NAMESPACES.CONTACT]: enContact,
		[NAMESPACES.CONTACT_FORM]: enContactForm,
		[NAMESPACES.USER_BLOG_LIST]: enUserBlogList,
	},
	es: {
		[NAMESPACES.COMMON]: esCommon,
		[NAMESPACES.PROFILE_INFO]: esProfileInfo,
		[NAMESPACES.TABED_NAVIGATION]: esTabedNavigation,
		[NAMESPACES.LATEST_BLOGS]: esLatestBlogs,
		[NAMESPACES.FEATURED_REPOS]: esFeaturedRepos,
		[NAMESPACES.CLIENTES]: esClientes,
		[NAMESPACES.EXPERIENCE]: esExperience,
		[NAMESPACES.SERVICES]: esServices,
		[NAMESPACES.CONTACT]: esContact,
		[NAMESPACES.CONTACT_FORM]: esContactForm,
		[NAMESPACES.USER_BLOG_LIST]: esUserBlogList,
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
