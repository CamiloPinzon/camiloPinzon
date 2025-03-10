import { createRoot } from "react-dom/client";

import { UserProvider } from "./contexts/user.context.tsx";
import { RecaptchaProvider } from "./contexts/recaptcha.context.tsx";
import { IsMobileProvider } from "./contexts/isMobile.context.tsx";

import "./index.scss";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<UserProvider>
		<RecaptchaProvider siteKey={import.meta.env.VITE_RECAPTCHA_KEY}>
			<IsMobileProvider>
				<App />
			</IsMobileProvider>
		</RecaptchaProvider>
	</UserProvider>
);
