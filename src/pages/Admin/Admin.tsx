import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import { signOutUser } from "../../utils/firebase/auth";

const Admin = () => {
	const { currentUser, isAdmin } = useContext(UserContext);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	// ✅ Wait for `currentUser` before setting `loading` to false
	useEffect(() => {
		console.log("👀 Admin - Checking user state:", { currentUser, isAdmin });

		if (currentUser !== null) {
			setLoading(false);
		}
	}, [currentUser]);

	// ✅ Only navigate once `loading` is done
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
		<div>
			<h1>Admin Dashboard</h1>
			<div>
				<span>{currentUser?.email}</span>
				<button onClick={handleSignOut}>Sign Out</button>
			</div>
		</div>
	);
};

export default Admin;
