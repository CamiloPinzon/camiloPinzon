import { useState, useEffect, useCallback } from "react";

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

// Replace with your actual site key
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export const useRecaptcha = () => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [score, setScore] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Only load the script once
		if (!document.querySelector('script[src*="recaptcha"]')) {
			const script = document.createElement("script");
			script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
			script.async = true;
			script.defer = true;

			script.onload = () => {
				window.grecaptcha.ready(() => {
					setIsLoaded(true);
				});
			};

			document.head.appendChild(script);

			return () => {
				if (document.querySelector('script[src*="recaptcha"]')) {
					document.head.removeChild(script);
				}
			};
		} else if (window.grecaptcha) {
			window.grecaptcha.ready(() => {
				setIsLoaded(true);
			});
		}
	}, []);

	const executeRecaptcha = useCallback(
		async (action: string = "submit_contact") => {
			if (!isLoaded) {
				console.error("reCAPTCHA not loaded yet");
				return false;
			}

			setLoading(true);
			try {
				// Get token
				const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
					action,
				});

				// Without a backend, we can't verify the token properly,
				// so we'll assume it succeeded if we got a token
				if (token) {
					// In a real implementation with a backend, you would send this token
					// to your server and verify it with Google's API
					// For now, we'll just simulate a successful verification
					setScore(0.9); // Simulated high score
					return true;
				}
				return false;
			} catch (error) {
				console.error("Error executing recaptcha:", error);
				return false;
			} finally {
				setLoading(false);
			}
		},
		[isLoaded]
	);

	return { score, loading, executeRecaptcha, isLoaded };
};
