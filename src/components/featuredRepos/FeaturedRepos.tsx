import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../i18n/namespaces";
import { SupportedLanguage } from "../../i18n/languageOptions";

import Divisor from "../divisor/Divisor";

import "./featuredRepos.scss";

type Repo = {
	id: number;
	name: string;
	description: string;
	html_url: string;
	deployed_url?: string;
};

const GitHubRepos = () => {
	const [repos, setRepos] = useState([] as Repo[]);
	const { i18n } = useTranslation();
	const currentLanguage = i18n.language as SupportedLanguage;

	useEffect(() => {
		const fetchRepos = async () => {
			const response = await fetch(`./data/repos_${currentLanguage}.json`);
			const data = await response.json();
			setRepos(data);
		};

		fetchRepos();
	}, [currentLanguage]);

	const { t } = useTranslation(NAMESPACES.FEATURED_REPOS);
	return (
		<div className="github-repos">
			<h2>{t("featuredRepos:title")}</h2>
			<Divisor theme="light" />
			<ul>
				{repos.length > 0 ? (
					repos.map((repo) => (
						<li key={repo.id} className="github-repos__item">
							<a href={repo.html_url} target="_blank" rel="noopener noreferrer">
								<h3>{repo.name}</h3>
								<p>{repo.description || "No description available."}</p>
							</a>
							{repo.deployed_url && (
								<a
									className="github-repos__item--deployed"
									href={repo.deployed_url}
									target="_blank"
									rel="noopener noreferrer"
								>
									{t("featuredRepos:deployed")}
								</a>
							)}
						</li>
					))
				) : (
					<p>{t("featuredRepos:no_found")}</p>
				)}
			</ul>
		</div>
	);
};

export default GitHubRepos;
