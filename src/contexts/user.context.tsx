import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import {
	onAuthStateChangedListener,
	getCurrentUser,
} from "../utils/firebase/auth";

type AuthContextType = {
	currentUser: User | null;
	setCurrentUser: (user: User | null) => void;
	isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
	currentUser: null,
	setCurrentUser: () => null,
	isLoading: true,
});

type AuthProviderProps = {
	children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			try {
				const user = await getCurrentUser();
				setCurrentUser(user);
			} catch (error) {
				console.error("Error checking authentication:", error);
			} finally {
				setIsLoading(false);
			}
		};

		initAuth();

		const unsubscribe = onAuthStateChangedListener((user) => {
			setCurrentUser(user);
			setIsLoading(false);
		});

		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		setCurrentUser,
		isLoading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
