import {
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore";

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
		console.error("Error creating the contact", error);
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
		console.error("Error creating the user profile", error);
	}
};

export const createUserNewsletterDocument = async (userAuth: {
	email: string;
}): Promise<{ success: boolean; message: string }> => {
	try {
		const newsletterRef = collection(db, "newsletter");
		const q = query(newsletterRef, where("email", "==", userAuth.email));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			return {
				success: false,
				message: "User already subscribed to newsletter",
			};
		}

		const uid = Math.random().toString(36).substring(2, 9);
		const createdAt = new Date();
		const userDocRef = doc(db, "newsletter", uid);

		await setDoc(userDocRef, {
			uid,
			email: userAuth.email,
			createdAt,
		});

		return {
			success: true,
			message: "User subscribed to newsletter successfully",
		};
	} catch (error) {
		console.error("Error in newsletter subscription:", error);
		return {
			success: false,
			message: "An error occurred while processing your subscription.",
		};
	}
};
