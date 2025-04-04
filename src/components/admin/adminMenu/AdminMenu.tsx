import { NavLink } from "react-router-dom";

import "../../mainMenu/mainMenu.scss";

const AdminMenu = () => {
	const handleSendNewsletter = () => {
		//ask for confirmation before sending the newsletter
		if (!window.confirm("Are you sure you want to send the newsletter?")) {
			return;
		}
		//send the newsletter to the server
		const url =
			"http://camilopinzon.netlify.app/.netlify/functions/send-newsletter";
		window
			.fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				if (response.ok) {
					alert("Newsletter sent successfully!");
				} else {
					alert("Error sending newsletter. Please try again later.");
				}
			})
			.catch((error) => {
				alert("Error sending newsletter. Please try again later.");
				console.error("Error sending newsletter: ", error);
			});
	};
	return (
		<nav className="main-menu">
			<NavLink
				className={({ isActive }) =>
					isActive
						? "main-menu__link main-menu__link--active"
						: "main-menu__link"
				}
				to="/admin"
				end
			>
				Dashboard Home
			</NavLink>
			<NavLink
				className={({ isActive }) =>
					isActive
						? "main-menu__link main-menu__link--active"
						: "main-menu__link"
				}
				to="/admin/blogs"
				end
			>
				Manage Blogs
			</NavLink>
			<NavLink
				className={({ isActive }) =>
					isActive
						? "main-menu__link main-menu__link--active"
						: "main-menu__link"
				}
				to="/admin/blogs/new"
			>
				Create New Blog
			</NavLink>
			<a href="#" className="main-menu__link" onClick={handleSendNewsletter}>
				Send newsletter email
			</a>
		</nav>
	);
};

export default AdminMenu;
