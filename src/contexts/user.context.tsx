import {
	createContext,
	useState,
	useEffect,
	ReactNode,
	Dispatch,
	SetStateAction,
} from "react";
import { onAuthStateChangedListener } from "../utils/firebase/auth";
import { User as FirebaseUser } from "firebase/auth";

export type User = {
	id: string;
	email: string;
	displayName: string;
	createdAt: Date;
} | null;

export type UserContextType = {
	currentUser: User;
	setCurrentUser: Dispatch<SetStateAction<User>>;
	isAdmin: boolean;
};

export type UserProviderProps = {
	children: ReactNode;
};

export const UserContext = createContext<UserContextType>({
	currentUser: null,
	setCurrentUser: () => null,
	isAdmin: false,
});

export const UserProvider = ({ children }: UserProviderProps) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	useEffect(() => {
		const unsubscribe = onAuthStateChangedListener(
			(user: FirebaseUser | null) => {
				if (user) {
					const formattedUser: User = {
						id: user.uid,
						email: user.email || "",
						displayName: user.displayName || "No Name",
						createdAt: new Date(),
					};

					setCurrentUser(formattedUser);
					setIsAdmin(user.email === "pinzonac@gmail.com");
				} else {
					setCurrentUser(null);
					setIsAdmin(false);
				}
			}
		);

		return unsubscribe;
	}, []);

	const value: UserContextType = { currentUser, setCurrentUser, isAdmin };

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
