import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../../contexts/auth.context";

type ProtectedRouteProps = {
	redirectPath?: string;
};

const ProtectedRoute = ({ redirectPath = "/login" }: ProtectedRouteProps) => {
	const { currentUser, isLoading } = useContext(AuthContext);
	const [loadingTimeout, setLoadingTimeout] = useState(false);

	// Add a timeout to prevent infinite loading state
	useEffect(() => {
		const timer = setTimeout(() => {
			if (isLoading) {
				setLoadingTimeout(true);
			}
		}, 5000); // 5 seconds timeout

		return () => clearTimeout(timer);
	}, [isLoading]);

	// Add some console logs for debugging
	useEffect(() => {
		console.log("ProtectedRoute - Auth state:", {
			currentUser: currentUser ? "Logged in" : "Not logged in",
			isLoading,
		});
	}, [currentUser, isLoading]);

	if (isLoading) {
		if (loadingTimeout) {
			// Show a more helpful message if loading takes too long
			return (
				<div className="flex flex-col items-center justify-center h-screen p-4">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mb-4"></div>
					<p className="text-gray-700">
						Authentication is taking longer than expected...
					</p>
					<p className="text-sm text-gray-500 mt-2">
						If this persists, try refreshing the page or clearing your browser
						cache.
					</p>
				</div>
			);
		}

		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
				<p className="mt-4">Loading...</p>
			</div>
		);
	}

	if (!currentUser) {
		console.log("ProtectedRoute - Redirecting to:", redirectPath);
		return <Navigate to={redirectPath} replace />;
	}

	console.log("ProtectedRoute - Rendering protected content");
	return <Outlet />;
};

export default ProtectedRoute;
