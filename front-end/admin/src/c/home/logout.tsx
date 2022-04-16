export default function Logout(props: { logoutClicked: any; }) {
	let logoutClicked = props.logoutClicked;

	return (
		<div className="buttons">
          <a className="button is-primary" onClick={logoutClicked}>
            <strong>SIGN OUT</strong>
          </a>
    </div>
	);
}