import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { UserProvider } from "./contexts/user.context.tsx";
import { RecaptchaProvider } from "./contexts/recaptcha.context.tsx";

import App from "./App.tsx";
import { LanguageProvider } from "./contexts/language.context.tsx";
import Modal from "./components/modal/Modal.tsx";

import "./i18n";

import "./index.scss";

createRoot(document.getElementById("root")!).render(
	<LanguageProvider>
		<Suspense
			fallback={<Modal isOpen={true} type="loader" onClose={() => {}} />}
		></Suspense>
		<UserProvider>
			<RecaptchaProvider siteKey={import.meta.env.VITE_RECAPTCHA_KEY}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</RecaptchaProvider>
		</UserProvider>
	</LanguageProvider>
);
