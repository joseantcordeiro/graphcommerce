import axios from 'axios';
import { createGlobalstate, useGlobalStateReducer } from 'state-pool';
import { getApiDomain } from '../../App';
import Session from "supertokens-auth-react/recipe/session";
import { CurrentUser } from './CurrentUserType';
/**
const initialGlobalState = { userId: "", name: "", email: "", picture: "", defaultOrganizationId: ""};
Session.addAxiosInterceptors(axios);

const loadUserData = async ()  => {

  try {
    const response = await axios.get(getApiDomain() + "/person");
		if (response.statusText !== "OK") {
			throw Error(response.statusText);
		}
		return( {
			id: response.data.persons[0].id,
			name: response.data.persons[0].name,
			email: response.data.persons[0].email,
			picture: response.data.persons[0].picture,
			defaultOrganizationId: response.data.persons[0].defaultOrganizationId
		});
  } catch (err) {
    console.log(err);
  }
	return(initialGlobalState);
};

const currentUser = createGlobalstate<CurrentUser>(initialGlobalState);

export default function GetCurrentUser(): Promise<CurrentUser> {
	let [user, dispatch] = useGlobalStateReducer<CurrentUser>(loadUserData, currentUser);
	return user;
}
 */