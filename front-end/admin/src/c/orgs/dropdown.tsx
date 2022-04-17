import axios from "axios";
import { Component } from "react";
import Session from "supertokens-auth-react/recipe/session";
import { getApiDomain } from "../../App";
Session.addAxiosInterceptors(axios);

interface IProps {
  id: string
}

interface IState {
	data: { name: string,	id: string }[]
}

export default class OrgDropDown extends Component<IProps, IState> {
	constructor(props: IProps) {
    super(props)
    this.state = { data: [] };
  }
	async componentDidMount() {
    try {
      const response = await axios.get(getApiDomain() + "/organization");
			if (response.statusText !== "OK") {
        throw Error(response.statusText);
      }
      this.setState({ data: response.data.organizations });
    } catch (error) {
      console.log(error);
    }
	}

	render() {
		return (
		<div className="navbar-item has-dropdown is-hoverable">
			<a className="navbar-link">
				Organizations
			</a>

			<div className="navbar-dropdown">
			{this.state.data.map(item => (
				<a className="navbar-item" id={item.id}>
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

