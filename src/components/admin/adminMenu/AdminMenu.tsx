import { NavLink } from "react-router-dom";

import "../../mainMenu/mainMenu.scss";

const AdminMenu = () => {
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
		</nav>
	);
};

export default AdminMenu;
