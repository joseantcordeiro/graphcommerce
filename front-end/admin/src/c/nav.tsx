import OrgDropDown from "./orgs/dropdown";
import AccountDropDown from "./account/AccountDropDown";
import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/emailpassword";

interface IProps {
	picture: string;
}

export default function Nav(props: IProps) {
	let picture = props.picture;

	console.log(picture);
	const navigate = useNavigate();
	async function logoutClicked() {
    await signOut();
    navigate("/auth");
  }
	
return (

<nav className="navbar is-black" role="navigation" aria-label="main navigation">
	<div className="navbar-brand">
	<img src="https://joseantcordeiro.hopto.org/assets/img/logo.png" alt="Graph Commerce" width="48" height="48" />
			<a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</a>
	</div>

	<div id="navbarBasicExample" className="navbar-menu">
		<div className="navbar-start">
			<a className="navbar-item" href="/">
			<span className="icon">
					<i className="fa fa-home"></i>
				</span>
			</a>
			<OrgDropDown id={""} />

			<a className="navbar-item" href="/dashboard">
				Dashboard
			</a>

			<a className="navbar-item" href="/teams">
				Teams
			</a>

			<a className="navbar-item" href="/settings">
				Settings
			</a>
		</div>

		<div className="navbar-end">
			<div className="navbar-item">
				<span className="icon">
					<i className="fa-brands fa-github"></i>
				</span>
				<span className="icon">
					<i className="fa-brands fa-twitter"></i>
				</span>
				<span className="icon">
					<i className="fas fa-life-ring"></i>
				</span>
				<AccountDropDown logoutClicked={logoutClicked} picture={picture} />
			</div>
		</div>
	</div>
</nav>
)
}