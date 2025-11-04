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

// Initialize Analytics only if supported (avoids errors with ad blockers, etc.)
let analytics: Analytics | null = null;

// Check if analytics is supported before initializing
isSupported().then((supported) => {
	if (supported) {
		analytics = getAnalytics(app);
	} else {
		console.warn("Firebase Analytics is not supported in this environment");
	}
}).catch((error) => {
	console.warn("Error checking Analytics support:", error);
});

export const auth = getAuth(app);
export const db = getFirestore(app);

// Safe logEvent wrapper that checks if analytics is available
export const logEvent = (analyticsInstance: Analytics | null, eventName: string, eventParams?: Record<string, unknown>) => {
	if (analyticsInstance) {
		try {
			firebaseLogEvent(analyticsInstance, eventName, eventParams);
		} catch (error) {
			console.warn("Error logging event:", error);
		}
	}
};

export { app, analytics };
