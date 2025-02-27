import { createRoot } from "react-dom/client";

import { UserProvider } from "./contexts/user.context.tsx";

import "./index.scss";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<UserProvider>
		<App />
	</UserProvider>
);
