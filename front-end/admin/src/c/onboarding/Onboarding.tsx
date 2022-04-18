import { Component } from "react";
import axios from "axios";
import Session from "supertokens-auth-react/recipe/session";
import { getApiDomain } from "../../App";

Session.addAxiosInterceptors(axios);

interface IProps {
  userId: string
}

interface IState {
	picture: string
	name: string
	languages: { alpha_2: string,	name: string }[]
	countries: { iso_2: string,	name: string }[]
	currencies: { code: string,	name: string }[]
}

export default class Onboarding extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = { picture: "", name: "", languages: [], countries: [], currencies: [] };
	}

	async componentDidMount() {
    try {
      const response = await axios.get(getApiDomain() + "/languages");
			if (response.statusText !== "OK") {
        throw Error(response.statusText);
      }
      this.setState({ languages: response.data.languages });
    } catch (error) {
      console.log(error);
    }
		try {
      const response = await axios.get(getApiDomain() + "/countries");
			if (response.statusText !== "OK") {
        throw Error(response.statusText);
      }
      this.setState({ countries: response.data.countries });
    } catch (error) {
      console.log(error);
    }
		try {
      const response = await axios.get(getApiDomain() + "/currencies");
			if (response.statusText !== "OK") {
        throw Error(response.statusText);
      }
      this.setState({ currencies: response.data.currencies });
    } catch (error) {
      console.log(error);
    }
	}

	async createPerson() {	
		try {
			const response = await axios.post(getApiDomain() + "/person",
				{
					organizationId: "string",
					userId: this.props.userId,
					name: "José Cordeiro",
					email: "joseantcordeiro@hotmail.com",
					defaultLanguage: "pt"
				}
			);
			if (response.statusText !== "OK") {
				throw Error(response.statusText);
			}
			this.setState({ picture: response.data.picture, name: response.data.name });
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		return (
			<div className="container">
				<div className="steps" id="stepsDemo">
					<div className="step-item is-active is-success">
						<div className="step-marker">1</div>
						<div className="step-details">
							<p className="step-title">Account</p>
						</div>
					</div>
					<div className="step-item">
						<div className="step-marker">2</div>
						<div className="step-details">
							<p className="step-title">Organization</p>
						</div>
					</div>
					<div className="step-item">
						<div className="step-marker">3</div>
						<div className="step-details">
							<p className="step-title">Finish</p>
						</div>
					</div>
					<div className="steps-content">
						<div className="step-content has-text-centered">
							<div className="field is-horizontal">
								<div className="field-label is-normal">
									<label className="label">Last name</label>
								</div>
								<div className="field-body">
									<div className="field">
										<div className="control has-icon has-icon-right">
											<input className="input" type="text" name="name" id="name" placeholder="Full name" data-validate="require" />
										</div>
									</div>
								</div>
							</div>
							<div className="field is-horizontal">
								<div className="field-label is-normal">
									<label className="label">Default Language</label>
								</div>
								<div className="field-body">
									<div className="field">
										<div className="control has-icon has-icon-right">
											<div className="select">
											<select>
												{this.state.languages.map(item => (
													<option>{item.name}</option>
												))}
												</select>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="step-content has-text-centered">
							<div className="field is-horizontal">
								<div className="field-label is-normal">
									<label className="label">Organization Name</label>
								</div>
								<div className="field-body">
									<div className="field">
										<div className="control has-icon has-icon-right">
											<input className="input" type="text" name="organizationName" id="organizationName" placeholder="Your organization name" data-validate="require" />
										</div>
									</div>
								</div>
							</div>
							<div className="field is-horizontal">
								<div className="field-label is-normal">
									<label className="label">Default Language</label>
								</div>
								<div className="field-body">
									<div className="field">
										<div className="control has-icon has-icon-right">
											<div className="select">
											<select>
												{this.state.languages.map(item => (
													<option>{item.name}</option>
												))}
												</select>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="field is-horizontal">
								<div className="field-label is-normal">
									<label className="label">Default Country</label>
								</div>
								<div className="field-body">
									<div className="field">
										<div className="control has-icon has-icon-right">
											<div className="select">
											<select>
												{this.state.countries.map(item => (
													<option>{item.name}</option>
												))}
												</select>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="field is-horizontal">
								<div className="field-label is-normal">
									<label className="label">Default Currency</label>
								</div>
								<div className="field-body">
									<div className="field">
										<div className="control has-icon has-icon-right">
											<div className="select">
											<select>
												{this.state.currencies.map(item => (
													<option>{item.name}</option>
												))}
												</select>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="step-content has-text-centered">
							<h1 className="title is-4">Your account is now created!</h1>
						</div>
					</div>
					<div className="steps-actions">
						<div className="steps-action">
							<a href="#" data-nav="previous" className="button is-light">Previous</a>
						</div>
						<div className="steps-action">
							<a href="#" data-nav="next" className="button is-light">Next</a>
						</div>
					</div>
				</div>
			</div>

		)
	}
}