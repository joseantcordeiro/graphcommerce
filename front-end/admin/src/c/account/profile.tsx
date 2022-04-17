import axios from "axios";
import { Component } from "react";
import Session from "supertokens-auth-react/recipe/session";
import { getApiDomain } from "../../App";

import DefaultLanguage from './defaultlanguage'
import ProfilePicture from './profilepicture'

Session.addAxiosInterceptors(axios);

interface IProps {
  name: string,
	picture: string
}

interface IState {
	picture: string,
	name: string
}

export default class Profile extends Component<IProps, IState> {
	constructor(props: IProps) {
    super(props)
    this.state = { picture: this.props.picture, name: this.props.name };
  }

	render() {
		const image = this.state.picture;
		return (
			<div className="container">
				<div className="columns is-centered">
					<div className="column is-one-quarter">
						<div className="box">
							<ProfilePicture image={image} />
						</div>
					</div>
					<div className="column">
					<form className="box">
						<div className="field">
							<label className="label">Name</label>
							<div className="control">
								<input className="input" type="text" defaultValue={this.state.name} placeholder={this.state.name} />
							</div>
						</div>

						<DefaultLanguage alpha_2={''} />

						<button className="button is-primary">Update</button>
					</form>
					</div>
				</div>
			</div>
		)
	}
}