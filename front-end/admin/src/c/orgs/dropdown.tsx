import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Component } from "react";
import Session from "supertokens-auth-react/recipe/session";
import { getApiDomain } from "../../App";
import cx from "classnames";

Session.addAxiosInterceptors(axios);

interface IProps {
	organization: { name: string; id: string };
}

interface IState {
	data: { name: string,	id: string }[];
}

export default class OrgDropDown extends Component<IProps, IState> {
	constructor(props: IProps) {
    super(props)
    this.state = { data: [] };
  }

	async componentDidMount() {
    try {
      let response = await axios.get(getApiDomain() + "/api/v1/organization");
			if (response.statusText !== "OK") {
        throw Error(response.statusText);
      }
      this.setState({ data: response.data.results });
    } catch (error) {
      console.log(error);
    }
	}
/** 
	navigate = useNavigate();

	organizationClicked = async (id: string) => {
		let values = { organizationId: id };
		try {
			const response = await axios.post(getApiDomain() + "/person/organization", values);
			if (response.statusText !== "OK") {
				throw Error(response.statusText);
			}
			this.navigate("/dashboard");
		} catch (error) {
			console.log(error);
		}
	}
*/
	render() {
		return (
		<div className="navbar-item has-dropdown is-hoverable">
			<a className="navbar-link">
				Organizations
			</a>

			<div className="navbar-dropdown">
			{this.state.data.map(item => (
				<a className={cx("navbar-item", item.id === this.props.organization.id && "is-active")} id={item.id} >
					{item.name}
				</a>
			))}
				<hr className="navbar-divider" />
				<a className="navbar-item" href="/organization/create">
					Create
				</a>
			</div>
		</div>
		)
	}
}

