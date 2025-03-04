import { createContext, useEffect, useState, ReactNode } from "react";

// Define window with grecaptcha property for TypeScript
declare global {
	interface Window {
		grecaptcha: {
			ready: (callback: () => void) => void;
			execute: (
				siteKey: string,
				options: { action: string }
			) => Promise<string>;
		};
	}
}

interface RecaptchaContextType {
	executeRecaptcha: (action: string) => Promise<string | null>;
	loading: boolean;
}

export const RecaptchaContext = createContext<RecaptchaContextType | null>(
	null
);

interface RecaptchaProviderProps {
	siteKey: string;
	children: ReactNode;
}

export function RecaptchaProvider({
	siteKey,
	children,
}: RecaptchaProviderProps) {
	const [loading, setLoading] = useState<boolean>(true);
	const [initialized, setInitialized] = useState<boolean>(false);

	useEffect(() => {
		// Check if reCAPTCHA script is already loaded
		const existingScript = document.querySelector(
			'script[src*="recaptcha/api.js"]'
		);

		if (!existingScript) {
			// Load the reCAPTCHA script
			const script = document.createElement("script");
			script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
			script.async = true;
			script.defer = true;

			script.onload = () => {
				// When script loads, ensure reCAPTCHA is ready before setting loading to false
				if (window.grecaptcha) {
					window.grecaptcha.ready(() => {
						setLoading(false);
						setInitialized(true);
						console.log("reCAPTCHA initialized successfully");
					});
				} else {
					console.error("grecaptcha not available after script load");
				}
			};

			script.onerror = (error) => {
				console.error("Error loading reCAPTCHA script:", error);
			};

			document.head.appendChild(script);

			return () => {
				// Cleanup
				if (document.head.contains(script)) {
					document.head.removeChild(script);
				}
			};
		} else {
			// Script already exists, just wait for reCAPTCHA to be ready
			if (window.grecaptcha) {
				window.grecaptcha.ready(() => {
					setLoading(false);
					setInitialized(true);
					console.log("reCAPTCHA initialized successfully (existing script)");
				});
			} else {
				// Set a timeout to check again if window.grecaptcha is available
				const checkRecaptcha = setInterval(() => {
					if (window.grecaptcha) {
						window.grecaptcha.ready(() => {
							setLoading(false);
							setInitialized(true);
							console.log("reCAPTCHA initialized successfully (delayed)");
						});
						clearInterval(checkRecaptcha);
					}
				}, 100);

				// Clear interval after 10 seconds to prevent endless checking
				setTimeout(() => {
					clearInterval(checkRecaptcha);
					if (!initialized) {
						console.error(
							"reCAPTCHA failed to initialize within the timeout period"
						);
					}
				}, 10000);

				return () => {
					clearInterval(checkRecaptcha);
				};
			}
		}
	}, [siteKey, initialized]);

	// Function to execute reCAPTCHA
	const executeRecaptcha = async (action: string): Promise<string | null> => {
		// Double check initialization before execution
		if (loading || !initialized) {
			console.warn("Attempted to execute reCAPTCHA before initialization");
			// Wait for initialization
			try {
				await new Promise<void>((resolve, reject) => {
					const checkInit = setInterval(() => {
						if (initialized && !loading && window.grecaptcha) {
							clearInterval(checkInit);
							resolve();
						}
					}, 100);

					// Timeout after 5 seconds
					setTimeout(() => {
						clearInterval(checkInit);
						reject(new Error("reCAPTCHA initialization timeout"));
					}, 5000);
				});
			} catch (error) {
				console.error("Failed waiting for reCAPTCHA initialization:", error);
				return null;
			}
		}

		try {
			if (!window.grecaptcha) {
				throw new Error("grecaptcha is not available");
			}

			// Execute and get token
			const token = await window.grecaptcha.execute(siteKey, { action });
			return token;
		} catch (error) {
			console.error("reCAPTCHA execution failed:", error);
			return null;
		}
	};

	return (
		<RecaptchaContext.Provider value={{ executeRecaptcha, loading }}>
			{children}
		</RecaptchaContext.Provider>
	);
}
