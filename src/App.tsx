import { useEffect } from "react";
import {
	Routes,
	Route,
	Navigate,
	useLocation,
} from "react-router-dom";

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
import BlogList from "./components/admin/blogList/BlogList";
import BlogForm from "./components/admin/blogForm/BlogForm";

import { analytics, logEvent } from "./utils/firebase/config";

import "./App.scss";

function App() {
	const location = useLocation();

	useEffect(() => {
		logEvent(analytics, "page_view", {
			page_path: location.pathname,
			page_location: window.location.href,
			page_title: document.title,
		});
	}, [location]);

	return (
		<>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/services" element={<Services />} />
				<Route path="/blogs" element={<Blogs />} />
				<Route path="/blogs/:slug" element={<Blog />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/experience" element={<Experience />} />
				<Route path="/login" element={<Login />} />
				<Route path="/admin" element={<Admin />}>
					<Route path="blogs" element={<BlogList />} />
					<Route path="blogs/new" element={<BlogForm />} />
					<Route path="blogs/edit/:id" element={<BlogForm />} />
				</Route>
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
			<Footer />
		</>
	);
}

export default App;
