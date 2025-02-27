import {
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
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

// Define admin emails
const ADMIN_EMAILS = [
	"pinzonac@gmail.com",
];

// Create or update user document in Firestore
export const createUserProfileDocument = async (userAuth: User) => {
	if (!userAuth) return;

	const userRef = doc(db, "users", userAuth.uid);
	const userSnapshot = await getDoc(userRef);

	if (!userSnapshot.exists()) {
		// User doesn't exist yet, create new document
		const { displayName, email, photoURL } = userAuth;

		try {
			await setDoc(userRef, {
				displayName: displayName || "User",
				email,
				photoURL,
				createdAt: serverTimestamp(),
				lastLogin: serverTimestamp(),
				role: email && ADMIN_EMAILS.includes(email) ? "admin" : "user",
			});
		} catch (error) {
			console.error("Error creating user document:", error);
		}
	} else {
		// User exists, update last login
		try {
			await setDoc(
				userRef,
				{
					lastLogin: serverTimestamp(),
				},
				{ merge: true }
			);
		} catch (error) {
			console.error("Error updating user last login:", error);
		}
	}

	return userRef;
};

// Check if user is admin
export const isUserAdmin = async (user: User): Promise<boolean> => {
	if (!user || !user.email) return false;

	// Quick check against admin emails list
	if (ADMIN_EMAILS.includes(user.email)) {
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
