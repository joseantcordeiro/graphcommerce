import axios from "axios";
import Session from "supertokens-auth-react/recipe/session";
import { getApiDomain } from "../../App";
Session.addAxiosInterceptors(axios);

export default function CallAPIView() {
    async function callAPIClicked() {
        // this will also automatically refresh the session if needed
        let response = await axios.get(getApiDomain() + "/person");
        window.alert("Session Information:\n" + JSON.stringify(response, null, 2));
    }

    return (
			<div className="buttons">
				<button onClick={callAPIClicked} className="button is-primary">Call API</button>
			</div>
    );
}