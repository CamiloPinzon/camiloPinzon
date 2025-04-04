import {
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {auth, db} from "./config";

// Create a Google provider instance
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
	prompt: "select_account",
});

// Sign in with Google popup
export const signInWithGooglePopup = async () => {
	return await signInWithPopup(auth, googleProvider);
};

// Sign out
export const signOutUser = async () => await signOut(auth);

// Observer for auth state changes
export const onAuthStateChangedListener = (
	callback: (user: User | null) => void
) => {
	return onAuthStateChanged(auth, callback);
};

// Get current user
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

// Check if user is admin
export const isUserAdmin = async (user: User): Promise<boolean> => {
	const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
	if (!user || !user.email) return false;

	// Quick check against admin emails list
	if (adminEmail.includes(user.email)) {
		return true;
	}

	// Check in database (in case admin list was updated)
	try {
		const userRef = doc(db, "users", user.uid);
		const userSnapshot = await getDoc(userRef);

		if (userSnapshot.exists()) {
			const userData = userSnapshot.data();
			return userData.role === "admin";
		}
	} catch (error) {
		console.error("Error checking admin status:", error);
	}

	return false;
};
