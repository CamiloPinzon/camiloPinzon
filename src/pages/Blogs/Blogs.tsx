import UserBlogList from "../../components/userBlogList/UserBlogList";

import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";

const Blogs = () => {
	const { t } = useTranslation(NAMESPACES.BLOGS);
	return (
		<div>
			<title>{t("blogs:title")}</title>
			<meta name="description" content={t("blogs:subtitle")} />
			<UserBlogList title={t("blogs:title")} subtitle={t("blogs:subtitle")} />
		</div>
	);
};

export default Blogs;
