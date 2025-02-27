// src/contexts/auth.context.tsx
import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import {
	onAuthStateChangedListener,
	getCurrentUser,
} from "../utils/firebase/auth";
import { createUserProfileDocument } from "../utils/firebase/creation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase/config";

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

export const AuthContext = createContext<AuthContextType>({
	currentUser: null,
	userData: null,
	setCurrentUser: () => null,
	isAdmin: false,
	isLoading: false,
	authError: null,
});

type AuthProviderProps = {
	children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;
		console.log("AuthProvider - Initializing authentication");

		const fetchUserData = async (user: User) => {
			if (!isMounted) return;

			try {
				console.log("AuthProvider - Fetching user data for:", user.email);

				// Create or update user document
				await createUserProfileDocument(user);

				// Get user data from Firestore
				const userRef = doc(db, "users", user.uid);
				const userSnapshot = await getDoc(userRef);

				if (userSnapshot.exists()) {
					const userData = userSnapshot.data() as UserData;
					if (isMounted) {
						setUserData(userData);
						setIsAdmin(userData.role === "admin");
						console.log("AuthProvider - User role:", userData.role);
					}
				} else {
					console.log("AuthProvider - User document does not exist");
				}
			} catch (error) {
				console.error("AuthProvider - Error fetching user data:", error);
				if (isMounted) {
					setAuthError("Failed to fetch user data");
				}
			}
		};

		const initAuth = async () => {
			try {
				console.log("AuthProvider - Getting current user");
				const user = await getCurrentUser();

				if (isMounted) {
					console.log(
						"AuthProvider - Current user:",
						user ? "Logged in" : "Not logged in"
					);
					setCurrentUser(user);

					if (user) {
						await fetchUserData(user);
					}
				}
			} catch (error) {
				console.error("AuthProvider - Error checking authentication:", error);
				if (isMounted) {
					setAuthError("Authentication check failed");
				}
			} finally {
				if (isMounted) {
					console.log("AuthProvider - Finishing initialization");
					setIsLoading(false);
				}
			}
		};

		initAuth();

		const unsubscribe = onAuthStateChangedListener(async (user) => {
			console.log(
				"AuthProvider - Auth state changed:",
				user ? "Logged in" : "Not logged in"
			);

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
