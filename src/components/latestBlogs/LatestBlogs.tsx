import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";

import UserBlogList from "../userBlogList/UserBlogList";

const LatestBlogs = () => {
	const { t } = useTranslation(NAMESPACES.LATEST_BLOGS);
	return (
		<div className="latest-blogs">
			<UserBlogList latest={true} title={t("latestBlogs:title")} />
		</div>
	);
};

export default LatestBlogs;
