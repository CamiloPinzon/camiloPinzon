import { useContext, useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import { signOutUser } from "../../utils/firebase/auth";

import AdminMenu from "../../components/admin/adminMenu/AdminMenu";
import Button from "../../components/button/Button";

import "./admin.scss";

const Admin = () => {
	const { currentUser, isAdmin } = useContext(UserContext);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (currentUser !== null) {
			setLoading(false);
		}
	}, [currentUser]);

	useEffect(() => {
		if (!loading) {
			if (!currentUser) {
				console.warn("⛔ No user found, redirecting...");
				navigate("/login");
			} else if (!isAdmin) {
				console.warn("⛔ Not an admin, redirecting...");
				navigate("/");
			}
		}
	}, [currentUser, isAdmin, navigate, loading]);

	const handleSignOut = async () => {
		try {
			await signOutUser();
			navigate("/login");
		} catch (error) {
			console.error("❌ Error signing out:", error);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="admin-dashboard">
			<div className="admin-header container">
				<AdminMenu />
				<div className="user-controls">
					<Button onClick={handleSignOut} type="button" style="secondary">
						Sign Out
					</Button>
				</div>
			</div>

			<div className="admin-content">
				<Outlet />
			</div>
		</div>
	);
};

export default Admin;
