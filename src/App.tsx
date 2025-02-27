import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import Blogs from "./pages/Blogs/Blogs";
import Blog from "./pages/Blog/Blog";
import Contact from "./pages/Contact/Contact";
import Experience from "./pages/Experience/Experience";
import Login from "./pages/Login/Login";
import Admin from "./pages/Admin/Admin";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

import "./App.scss";

function App() {
	return (
		<>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path="/" index element={<Home />} />
					<Route path="/services" element={<Services />} />
					<Route path="/blogs" element={<Blogs />}>
						<Route path=":id" element={<Blog />} />
					</Route>
					<Route path="/contact" element={<Contact />} />
					<Route path="/experience" element={<Experience />} />
					<Route path="/login" element={<Login />} />
					<Route element={<ProtectedRoute />}>
						<Route path="/admin" element={<Admin />} />
					</Route>
					<Route path="/" element={<Navigate to="/login" replace />} />
				</Routes>
				<Footer />
			</BrowserRouter>
		</>
	);
}

export default App;
