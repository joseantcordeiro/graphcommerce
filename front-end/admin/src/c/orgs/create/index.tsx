import axios from "axios";
import Session from "supertokens-auth-react/recipe/session";
import { getApiDomain } from "../../../App";
import {
	Formik,
	Form,
	Field,
} from 'formik';
import { Component } from "react";
import * as Yup from 'yup';

Session.addAxiosInterceptors(axios);

interface FormValues {
	name: string;
	defaultLanguage: string;
	defaultCurrency: string;
	defaultCountry: string;

}

interface IProps {
	userId: string;
}

interface IState {
	picture: string
	name: string
	languages: { alpha_2: string,	name: string }[]
	countries: { iso_2: string,	name: string }[]
	currencies: { code: string,	name: string }[]
}

const ValidatorSchema = Yup.object().shape({
	name: Yup.string()
		.min(8, 'Too Short!')
		.max(100, 'Too Long!')
		.required('Required'),
});

export default class CreateOrganization extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			picture: "",
			name: "",
			languages: [],
			countries: [],
			currencies: [],
		};
		const userId = props.userId
	}

	async componentDidMount() {
    try {
      let res = await axios.get(getApiDomain() + "/api/v1/languages");
			if (res.statusText !== "OK") {
        throw Error(res.statusText);
      }
      this.setState({ languages: res.data.languages });
    } catch (error) {
      console.log(error);
    }
		try {
      let res = await axios.get(getApiDomain() + "/api/v1/countries");
			if (res.statusText !== "OK") {
        throw Error(res.statusText);
      }
      this.setState({ countries: res.data.countries });
    } catch (error) {
      console.log(error);
    }
		try {
      let res = await axios.get(getApiDomain() + "/api/v1/currencies");
			if (res.statusText !== "OK") {
        throw Error(res.statusText);
      }
      this.setState({ currencies: res.data.currencies });
    } catch (error) {
      console.log(error);
    }
	}

	render() {
	let initialValues: FormValues = { name: '', defaultCountry: 'us', defaultLanguage: 'en', defaultCurrency: 'usd' };
	return (

		<div className="columns is-centered">
			<div className="columns is-full">
			<div className="box">
				<p className="title is-3">Create a new organization</p>
				<Formik
					initialValues={initialValues}
					validationSchema={ValidatorSchema}
					onSubmit={async (values, actions) => {
						console.log({ values, actions });
						let res = await axios.post(getApiDomain() + "/api/v1/organization", values);
						/** if (res.statusText !== "OK") {
							throw Error(res.statusText);
						} */
						alert('Organization created!');
						actions.setSubmitting(false);
					}}
				>	
				{({ errors, touched }) => (
					<Form>
					<div className="field">
						<label htmlFor="name">Organization Name</label>
						<div className="control">
							<Field className="input" id="name" name="name" placeholder="Organization Name" />
							{errors.name && touched.name ? <div className="notification is-danger is-light"><button className="delete"></button>{errors.name}</div> : null}
						</div>
					</div>
					<div className="field">
						<label className="label">Default Language</label>
						<div className="control">
							<div className="select">
								<Field as="select" name="defaultLanguage">
									{this.state.languages.map(item => (
										<option value={item.alpha_2}>{item.name}</option>
									))}
								</Field>

							</div>
						</div>
					</div>
					<div className="field">
						<label className="label">Default Country</label>
						<div className="control">
							<div className="select">
								<Field as="select" name="defaultCountry">
									{this.state.countries.map(item => (
										<option value={item.iso_2}>{item.name}</option>
									))}
								</Field>

							</div>
						</div>
					</div>
					<div className="field">
						<label className="label">Default Currency</label>
						<div className="control">
							<div className="select">
								<Field as="select" name="defaultCurrency">
									{this.state.currencies.map(item => (
										<option value={item.code}>{item.name}</option>
									))}
								</Field>

							</div>
						</div>
					</div>
						<button className="button is-primary" type="submit">Create Organization</button>
					</Form>
				)}
				</Formik>
				</div>
    	</div>
		</div>
  );
	}
}