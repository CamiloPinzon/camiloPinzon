import { useSEO } from "../../hooks/useSEO";
import UserBlogList from "../../components/userBlogList/UserBlogList";

import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";

const Blogs = () => {
	useSEO({
		title: "Expert Front-End Developer | React, WordPress, TypeScript, ...",
		description:
			"Stay updated with the latest in front-end development, React, WordPress, and WooCommerce. Read expert insights, tips, and tutorials.",
	});
	const { t } = useTranslation(NAMESPACES.BLOGS);
	return (
		<div>
			<UserBlogList title={t("blogs:title")} subtitle={t("blogs:subtitle")} />
		</div>
	);
};

export default Blogs;
