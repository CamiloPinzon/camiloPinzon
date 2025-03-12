import { useSEO } from "../../hooks/useSEO";
import UserBlogList from "../../components/userBlogList/UserBlogList";

const Blogs = () => {
	useSEO({
		title: "Expert Front-End Developer | React, WordPress, TypeScript, ...",
		description:
			"Stay updated with the latest in front-end development, React, WordPress, and WooCommerce. Read expert insights, tips, and tutorials.",
	});
	return (
		<div>
			<h1>Blogs Page</h1>
			<UserBlogList />
		</div>
	);
};

export default Blogs;
