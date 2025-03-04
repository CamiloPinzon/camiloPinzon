import { createRoot } from "react-dom/client";

import { UserProvider } from "./contexts/user.context.tsx";

import "./index.scss";
import App from "./App.tsx";
import { RecaptchaProvider } from "./contexts/recaptcha.context.tsx";

createRoot(document.getElementById("root")!).render(
	<UserProvider>
		<RecaptchaProvider siteKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
			<App />
		</RecaptchaProvider>
	</UserProvider>
);
