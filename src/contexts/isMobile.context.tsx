import { createContext, useState, useEffect, ReactNode } from "react";

export type isMobileContextType = {
	isMobile: boolean;
	checkIfMobile: () => void;
};

type isMobileProviderProps = {
	children: ReactNode;
};

export const IsMobileContext = createContext<isMobileContextType>({
	isMobile: false,
	checkIfMobile: () => {},
});

export const IsMobileProvider = ({ children }: isMobileProviderProps) => {
	const [isMobile, setIsMobile] = useState(false);

	const checkIfMobile = () => {
		setIsMobile(window.innerWidth < 768);
		console.log(window.innerWidth);
	};

	useEffect(() => {
		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);
		return () => {
			window.removeEventListener("resize", checkIfMobile);
		};
	}, []);

	useEffect(() => {
		console.log(window.innerWidth, isMobile);
	}, [isMobile]);

	const value: isMobileContextType = { isMobile, checkIfMobile };
	return (
		<IsMobileContext.Provider value={value}>
			{children}
		</IsMobileContext.Provider>
	);
};
