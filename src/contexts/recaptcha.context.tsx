import { createContext, useEffect, useState, ReactNode } from "react";

declare global {
	interface Window {
		grecaptcha: {
			ready: (callback: () => void) => void;
			execute: (siteKey: string, action: string) => Promise<string | null>;
		};
	}
}

interface RecaptchaContextType {
	executeRecaptcha: (action: string) => Promise<string | null>;
	loading: boolean;
}

export const RecaptchaContext = createContext<RecaptchaContextType | null>(null);

interface RecaptchaProviderProps {
	siteKey: string;
	children: ReactNode;
}

export function RecaptchaProvider({
	siteKey,
	children,
}: RecaptchaProviderProps) {
	const [recaptcha, setRecaptcha] = useState<typeof window.grecaptcha | null>(
		null
	);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const script = document.createElement("script");
		script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
		script.async = true;
		script.defer = true;

		script.onload = () => {
			setRecaptcha(window.grecaptcha);
			setLoading(false);
		};

		document.head.appendChild(script);

		return () => {
			if (document.head.contains(script)) {
				document.head.removeChild(script);
			}
		};
	}, [siteKey]);

	const executeRecaptcha = async (action: string): Promise<string | null> => {
		if (!recaptcha) return null;

		try {
			await new Promise<void>((resolve) => recaptcha.ready(resolve));
			const token = await recaptcha.execute(siteKey, action);
			return token;
		} catch (error) {
			console.error("Error executing reCAPTCHA:", error);
			return null;
		}
	};

	return (
		<RecaptchaContext.Provider value={{ executeRecaptcha, loading }}>
			{children}
		</RecaptchaContext.Provider>
	);
}
