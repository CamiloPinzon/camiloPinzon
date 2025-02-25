import Divisor from "../divisor/Divisor";

import repos from "../../data/repos.json";

import "./featuredRepos.scss";

const GitHubRepos = () => {
	return (
		<div className="github-repos">
			<h2>GitHub Repositories</h2>
			<Divisor theme="light" />
			<ul>
				{repos.length > 0 ? (
					repos.map((repo) => (
						<li key={repo.id} className="github-repos__item">
							<a href={repo.html_url} target="_blank" rel="noopener noreferrer">
								<h3>{repo.name}</h3>
							</a>
							<p>{repo.description || "No description available."}</p>
							{repo.deployed_url && (
								<a
									className="github-repos__item--deployed"
									href={repo.deployed_url}
									target="_blank"
									rel="noopener noreferrer"
								>
									Deployed
								</a>
							)}
						</li>
					))
				) : (
					<p>No featured repositories found.</p>
				)}
			</ul>
		</div>
	);
};

export default GitHubRepos;
