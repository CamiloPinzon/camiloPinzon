import { useState, useEffect } from "react";

export type Breakpoints = {
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl: number;
	xxl: number;
};

export type ResponsiveState = {
	isXs: boolean;
	isSm: boolean;
	isMd: boolean;
	isLg: boolean;
	isXl: boolean;
	isXxl: boolean;
	// Current active breakpoint name
	current: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
};

const useResponsive = (
	customBreakpoints?: Partial<Breakpoints>
): ResponsiveState => {
	const defaultBreakpoints: Breakpoints = {
		xs: 0,
		sm: 576,
		md: 768,
		lg: 992,
		xl: 1200,
		xxl: 1400,
	};

	const breakpoints: Breakpoints = {
		...defaultBreakpoints,
		...customBreakpoints,
	};

	const [responsive, setResponsive] = useState<ResponsiveState>(() => {
		const defaultState: ResponsiveState = {
			isXs: false,
			isSm: false,
			isMd: false,
			isLg: false,
			isXl: false,
			isXxl: false,
			current: "lg",
		};

		if (typeof window === "undefined") return defaultState;

		const width = window.innerWidth;

		let current: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" = "xxl";
		if (width < breakpoints.sm) current = "xs";
		else if (width < breakpoints.md) current = "sm";
		else if (width < breakpoints.lg) current = "md";
		else if (width < breakpoints.xl) current = "lg";
		else if (width < breakpoints.xxl) current = "xl";

		return {
			isXs: width >= breakpoints.xs && width < breakpoints.sm,
			isSm: width >= breakpoints.sm && width < breakpoints.md,
			isMd: width >= breakpoints.md && width < breakpoints.lg,
			isLg: width >= breakpoints.lg && width < breakpoints.xl,
			isXl: width >= breakpoints.xl && width < breakpoints.xxl,
			isXxl: width >= breakpoints.xxl,
			current,
		};
	});

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleResize = () => {
			const width = window.innerWidth;

			let current: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" = "xxl";
			if (width < breakpoints.sm) current = "xs";
			else if (width < breakpoints.md) current = "sm";
			else if (width < breakpoints.lg) current = "md";
			else if (width < breakpoints.xl) current = "lg";
			else if (width < breakpoints.xxl) current = "xl";

			setResponsive({
				isXs: width >= breakpoints.xs && width < breakpoints.sm,
				isSm: width >= breakpoints.sm && width < breakpoints.md,
				isMd: width >= breakpoints.md && width < breakpoints.lg,
				isLg: width >= breakpoints.lg && width < breakpoints.xl,
				isXl: width >= breakpoints.xl && width < breakpoints.xxl,
				isXxl: width >= breakpoints.xxl,
				current,
			});
		};

		window.addEventListener("resize", handleResize);

		console.log(`Current: ${responsive.current}`);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [
		breakpoints.xs,
		breakpoints.sm,
		breakpoints.md,
		breakpoints.lg,
		breakpoints.xl,
	]);
	return responsive;
};

export default useResponsive;
