import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "camilopinzon-e8ed1.firebaseapp.com",
	projectId: "camilopinzon-e8ed1",
	storageBucket: "camilopinzon-e8ed1.firebasestorage.app",
	messagingSenderId: "773918555783",
	appId: "1:773918555783:web:afb704104991078ffd4222",
	measurementId: "G-YM4S1MH1ED",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
	prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopUp = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const createContactDocument = async (contactData: {
	fullName: string;
	email: string;
	company: string;
	phone: string;
	message: string;
}) => {
	const contactId = `contact_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
	const contactDocRef = doc(db, "contacts", contactId);
	const createdAt = new Date();
	try {
		await setDoc(contactDocRef, {
			fullName: contactData.fullName,
			email: contactData.email,
			company: contactData.company,
			phone: contactData.phone,
			message: contactData.message,
			createdAt,
		});

		return contactDocRef;
	} catch (error) {
		console.log("Error creating the contact", error);
		throw error;
	}
};