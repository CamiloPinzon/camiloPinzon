import { useState } from "react";

import "./tabedNavigation.scss";

const TabedNavigation = () => {
	const [activeTab, setActiveTab] = useState(0);

	const handleTab = (tab: number) => {
		setActiveTab(tab);
	};

	return (
		<div className="tabed-navigation">
			<div className="tabed-navigation__tabs">
				<div
					className="tabed-navigation__tabs-tab"
					onClick={() => handleTab(0)}
				>
					Tech Stak
				</div>
				<div
					className="tabed-navigation__tabs-tab"
					onClick={() => handleTab(1)}
				>
					Skills
				</div>
			</div>
			<div className="tabed-navigation__content">{activeTab}</div>
		</div>
	);
};

export default TabedNavigation;
