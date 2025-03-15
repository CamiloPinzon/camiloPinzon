import UserBlogList from "../userBlogList/UserBlogList";

const LatestBlogs = () => {
	return (
		<div className="latest-blogs">
			<UserBlogList latest={true} />
		</div>
	);
};

export default LatestBlogs;
