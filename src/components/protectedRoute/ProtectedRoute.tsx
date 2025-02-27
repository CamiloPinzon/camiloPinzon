import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../../contexts/auth.context";

type ProtectedRouteProps = {
	redirectPath?: string;
};

const ProtectedRoute = ({ redirectPath = "/login" }: ProtectedRouteProps) => {
	const { currentUser, isLoading } = useContext(AuthContext);

	// Add some console logs for debugging
	useEffect(() => {
		console.log("ProtectedRoute - Auth state:", {
			currentUser: currentUser ? "Logged in" : "Not logged in",
			isLoading,
		});
	}, [currentUser, isLoading]);

	if (isLoading) {
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
