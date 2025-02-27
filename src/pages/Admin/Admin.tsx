import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../contexts/auth.context";
import { signOutUser } from "../../utils/firebase/auth";

const Admin = () => {
	const { currentUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSignOut = async () => {
		try {
			await signOutUser();
			navigate("/login");
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return (
		<div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-2xl font-bold">Admin Dashboard</h1>
				<div className="flex items-center">
					<span className="mr-4">{currentUser?.email}</span>
					<button
						onClick={handleSignOut}
						className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
					>
						Sign Out
					</button>
				</div>
			</div>

			{/* Here you would add your admin features */}
			<div className="bg-gray-100 p-4 rounded">
				<h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
				<p>
					You can add your admin functionality here - manage users, view/edit
					contacts, etc.
				</p>
			</div>
		</div>
	);
};

export default Admin;
