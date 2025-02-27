import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/user.context";

type ProtectedRouteProps = {
	redirectPath?: string;
};

const ProtectedRoute = ({ redirectPath = "/login" }: ProtectedRouteProps) => {
	const { currentUser, isLoading } = useContext(AuthContext);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!currentUser) {
		return <Navigate to={redirectPath} replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
