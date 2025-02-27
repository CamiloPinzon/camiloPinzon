import {
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	User,
} from "firebase/auth";

import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
	prompt: "select_account",
});

export const signInWithGooglePopup = async () => {
	return await signInWithPopup(auth, googleProvider);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (
	callback: (user: User | null) => void
) => {
	return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = (): Promise<User | null> => {
	return new Promise((resolve, reject) => {
		const unsubscribe = onAuthStateChanged(
			auth,
			(userAuth) => {
				unsubscribe();
				resolve(userAuth);
			},
			reject
		);
	});
};
