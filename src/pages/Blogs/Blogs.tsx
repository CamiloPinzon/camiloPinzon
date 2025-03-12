import { useSEO } from "../../hooks/useSEO";

const Blogs = () => {
	useSEO({
		title: "Expert Front-End Developer | React, WordPress, TypeScript, ...",
		description:
			"Stay updated with the latest in front-end development, React, WordPress, and WooCommerce. Read expert insights, tips, and tutorials.",
	});
	return (
		<div>
			<h1>Blogs Page</h1>
		</div>
	);
};

export default Blogs;
