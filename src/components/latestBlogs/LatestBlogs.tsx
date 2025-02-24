import { useState, useEffect } from "react";

import Divisor from "../divisor/Divisor";

import blogData from "../../data/blogs.json";
import "./latestBlogs.scss";

interface IBlog {
	id: number;
	title: string;
	author: string;
	date: string;
	tags: string[];
	excerpt: string;
	image: string;
}

const LatestBlogs = () => {
	const [latestBlogs, setLatestBlogs] = useState<IBlog[]>([]);
	const totalBlogs = 3;

	useEffect(() => {
		const sortedBlogs = [...blogData.blogs].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);
		setLatestBlogs(sortedBlogs.slice(0, totalBlogs));
	}, []);

	return (
		<div className="latest-blogs">
			<h2>Latest Blog Posts</h2>
			<Divisor />
			<ul>
				{latestBlogs.map((blog) => (
					<li key={blog.id} className="latest-blogs__item">
						<img
							src={blog.image}
							alt={blog.title}
							className="latest-blogs__item--image"
						/>
						<div className="latest-blogs__item--info">
							<h3>{blog.title}</h3>
							<p>{blog.excerpt}</p>
							<a
								href={`/blogs/${blog.id}`}
								className="latest-blogs__item--info-link"
							>
								Read More
							</a>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default LatestBlogs;
