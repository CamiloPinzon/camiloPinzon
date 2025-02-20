import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";
import Blogs from "./pages/Blogs/Blogs";
import Blog from "./pages/Blog/Blog";
import Contact from "./pages/Contact/Contact";
import Experience from "./pages/Experience/Experience";

import "./App.scss";

function App() {
	return (
		<>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path="/" index element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/services" element={<Services />} />
					<Route path="/blogs" element={<Blogs />}>
						<Route path=":id" element={<Blog />} />
					</Route>
					<Route path="/contact" element={<Contact />} />
					<Route path="/experience" element={<Experience />} />
				</Routes>
				<Footer />
			</BrowserRouter>
		</>
	);
}

export default App;
