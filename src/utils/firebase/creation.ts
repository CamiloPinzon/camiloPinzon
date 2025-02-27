import { doc, setDoc } from "firebase/firestore";

import { db } from "./config";

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
