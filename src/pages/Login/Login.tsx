// src/pages/Login.tsx
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {signInWithGooglePopup} from "../../utils/firebase/auth";
import { AuthContext } from "../../contexts/auth.context";
import { FirebaseError } from "firebase/app";

const Login = () => {
	const [error, setError] = useState("");
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const navigate = useNavigate();
	const { currentUser, isLoading, authError } = useContext(AuthContext);

	useEffect(() => {
		// Display any auth context errors
		if (authError) {
			setError(authError);
		}
	}, [authError]);

	// Use effect to handle redirection
	useEffect(() => {
		if (!isLoading && currentUser) {
			console.log("Login - User is authenticated, redirecting to admin");
			navigate("/admin");
		}
	}, [currentUser, isLoading, navigate]);

	// Show loading if still checking auth
	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mb-4"></div>
				<p className="ml-3">Checking authentication...</p>
			</div>
		);
	}

	// If we're not loading and user is logged in, we should be redirected by the effect
	// If we're still here, we should show the login form

	const handleGoogleSignIn = async () => {
		setError("");
		setIsLoggingIn(true);

		try {
			console.log("Login - Attempting Google sign-in");
			await signInWithGooglePopup();
			// Navigation handled by the useEffect
		} catch (error) {
            console.error("Login - Google sign-in error:", error);
            if (error instanceof FirebaseError) {
                setError(error.message);
            } else {
				setError(`Failed to sign in: "Unknown error"`);
			}
		} finally {
			setIsLoggingIn(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
			<h1 className="text-2xl font-bold mb-6">Admin Login</h1>

			{error && (
				<div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
			)}

			<button
				onClick={handleGoogleSignIn}
				disabled={isLoggingIn}
				className={`w-full flex justify-center items-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 mb-4 ${
					isLoggingIn ? "opacity-50 cursor-not-allowed" : ""
				}`}
			>
				{isLoggingIn ? (
					<>
						<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 mr-3"></div>
						Signing in...
					</>
				) : (
					<>
						<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
							<path fill="none" d="M1 1h22v22H1z" />
						</svg>
						Sign in with Google
					</>
				)}
			</button>

			<div className="mt-4 text-sm text-gray-600">
				<p>
					Note: Only authorized administrators can access the admin dashboard.
				</p>
			</div>
		</div>
	);
};

export default Login;
