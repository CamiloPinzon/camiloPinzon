import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent as firebaseLogEvent, isSupported, Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID,
	measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Initialize Analytics with proper error handling
// Note: Ad blockers may still block requests, but this won't break the app
let analytics: Analytics | null = null;

// Initialize analytics asynchronously and silently
(async () => {
	try {
		// Only initialize in browser environments
		if (typeof window === 'undefined') return;
		
		// Check if analytics is supported
		const supported = await isSupported();
		if (supported) {
			analytics = getAnalytics(app);
		}
	} catch {
		// Silently fail - analytics is optional
		// Ad blockers may prevent initialization
	}
})();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Safe logEvent wrapper that checks if analytics is available
export const logEvent = (
	_analyticsInstance: Analytics | null, 
	eventName: string, 
	eventParams?: Record<string, unknown>
) => {
	// Only log if analytics was successfully initialized
	if (analytics) {
		try {
			firebaseLogEvent(analytics, eventName, eventParams);
		} catch {
			// Silently fail - analytics is not critical
			// This prevents errors from ad blockers breaking the app
		}
	}
};

export { app, analytics };
