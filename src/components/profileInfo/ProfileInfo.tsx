import Image from "../image/Image";

import ProfilePic from "../../assets/profile_pic__sm.jpg";

import "./profileInfo.scss";

const ProfileInfo = () => {
	return (
		<div className="profile-info">
			<div className="profile-info__image">
				<Image src={ProfilePic} alt="profile picture" kind="profile_rounded" />
			</div>
			<div className="profile-info__name">
				<h1>Camilo Pinzón</h1>
				<p>
					<i>Web Develper</i>
					<br />
					<span>React | Node | Express</span>
				</p>
				<br />
				<p>
					<h2>introduction</h2>
					<p>
						Self-taught and dedicated. A web developer with ability to
						assimilate work under pressure and great facility for teamwork, no
						matter if it’s locally or remote. He brings his experience to find
						solutions for all the possible problems that can happen in all the
						project stages and brings calm to the customer.
					</p>
				</p>
			</div>
		</div>
	);
};

export default ProfileInfo;
