import { doc, setDoc } from "firebase/firestore";

import { db } from "./config";
import { User } from "firebase/auth";

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

export const createUserProfileDocument = async (userAuth: User) => {
	const userDocRef = doc(db, "users", userAuth.uid);
	const createdAt = new Date();
	try {
		await setDoc(userDocRef, {
			uid: userAuth.uid,
			email: userAuth.email,
			displayName: userAuth.displayName,
			photoURL: userAuth.photoURL,
			createdAt,
		});
	} catch (error) {
		console.log("Error creating the user profile", error);
	}
};
