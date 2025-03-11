import { useContext, useEffect, useState } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import { signOutUser } from "../../utils/firebase/auth";

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
			<div className="admin-header">
				<h1>Admin Dashboard</h1>
				<div className="user-controls">
					<span>{currentUser?.email}</span>
					<button onClick={handleSignOut}>Sign Out</button>
				</div>
			</div>

			<div className="admin-navigation">
				<nav>
					<ul>
						<li>
							<Link to="/admin">Dashboard Home</Link>
						</li>
						<li>
							<Link to="/admin/blogs">Manage Blogs</Link>
						</li>
						<li>
							<Link to="/admin/blogs/new">Create New Blog</Link>
						</li>
					</ul>
				</nav>
			</div>

			<div className="admin-content">
				{/* This is where nested routes will render */}
				<Outlet />
			</div>
		</div>
	);
};

export default Admin;
