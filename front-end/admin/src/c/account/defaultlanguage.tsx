import axios from "axios";
import { Component } from "react";
import Session from "supertokens-auth-react/recipe/session";
import { getApiDomain } from "../../App";
Session.addAxiosInterceptors(axios);

interface IProps {
  alpha_2: string
}

interface IState {
	data: { alpha_2: string,	name: string }[]
}

export default class DefaultLanguage extends Component<IProps, IState> {
	constructor(props: IProps) {
    super(props)
    this.state = { data: [] };
  }
	async componentDidMount() {
    try {
      const response = await axios.get(getApiDomain() + "/api/v1/languages");
			if (response.statusText !== "OK") {
        throw Error(response.statusText);
      }
      this.setState({ data: response.data.languages });
    } catch (error) {
      console.log(error);
    }
	}

	render() {
		return (
		<div className="field">
			<label className="label">Default Language</label>
			<div className="control">
				<div className="select">
					<select>
					{this.state.data.map(item => (
						<option>{item.name}</option>
					))}
					</select>
				</div>
			</div>
		</div>
		)
	}
}