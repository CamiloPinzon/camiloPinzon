import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import {
	onAuthStateChangedListener,
	getCurrentUser,
} from "../utils/firebase/auth";
import { createUserProfileDocument } from "../utils/firebase/creation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase/config";

// Type definitions
type UserData = {
	displayName: string;
	email: string;
	photoURL: string;
	role: string;
	createdAt: Date;
};

type AuthContextType = {
	currentUser: User | null;
	userData: UserData | null;
	setCurrentUser: (user: User | null) => void;
	isAdmin: boolean;
	isLoading: boolean;
	authError: string | null;
};

// Default context values
export const AuthContext = createContext<AuthContextType>({
	currentUser: null,
	userData: null,
	setCurrentUser: () => null,
	isAdmin: false,
	isLoading: true, // Changed from false to true to prevent flash of unauthenticated content
	authError: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(true); // Start with loading true
	const [authError, setAuthError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		// Fetch user data from Firestore
		const fetchUserData = async (user: User) => {
			if (!isMounted) return;

			try {
				// Create or update user document
				await createUserProfileDocument(user);

				// Get user data from Firestore
				const userRef = doc(db, "users", user.uid);
				const userSnapshot = await getDoc(userRef);

				if (userSnapshot.exists() && isMounted) {
					const data = userSnapshot.data() as UserData;
					setUserData(data);
					setIsAdmin(data.role === "admin");
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
				if (isMounted) {
					setAuthError("Failed to fetch user data");
				}
			}
		};

		// Initialize authentication
		const initAuth = async () => {
			try {
				const user = await getCurrentUser();

				if (isMounted) {
					setCurrentUser(user);

					if (user) {
						await fetchUserData(user);
					}
				}
			} catch (error) {
				console.error("Error checking authentication:", error);
				if (isMounted) {
					setAuthError("Authentication check failed");
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		// Initialize auth and set up auth state listener
		initAuth();

		const unsubscribe = onAuthStateChangedListener(async (user) => {
			if (isMounted) {
				setCurrentUser(user);

				if (user) {
					await fetchUserData(user);
				} else {
					setUserData(null);
					setIsAdmin(false);
				}

				setIsLoading(false);
			}
		});

		// Cleanup function
		return () => {
			isMounted = false;
			unsubscribe();
		};
	}, []);

	const value = {
		currentUser,
		userData,
		setCurrentUser,
		isAdmin,
		isLoading,
		authError,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
