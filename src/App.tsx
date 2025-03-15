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
import BlogList from "./components/admin/blogList/BlogList";
import BlogForm from "./components/admin/blogForm/BlogForm";

import "./App.scss";

function App() {
	return (
		<>
			<BrowserRouter>
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
						{/* Use relative paths for nested routes */}
						<Route path="blogs" element={<BlogList />} />
						<Route path="blogs/new" element={<BlogForm />} />
						<Route path="blogs/edit/:id" element={<BlogForm />} />
					</Route>
					{/* This would conflict with the "/" route above */}
					<Route path="*" element={<Navigate to="/login" replace />} />
				</Routes>
				<Footer />
			</BrowserRouter>
		</>
	);
}

export default App;
