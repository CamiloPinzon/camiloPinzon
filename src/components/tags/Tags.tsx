import "./tags.scss";

interface TagsListProps {
	tags: string[];
}

const Tags = (props: TagsListProps) => {
	return (
		<div className="tags">
			<p className="tags-title">Tags:</p>
			<ul className="tags-list">
				{props.tags.map((tag, index) => (
					<li key={index} className="tags-item">
						{tag}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Tags;
