import { useEffect, useState } from "react";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import SuperTokens, { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session, { useSessionContext } from "supertokens-auth-react/recipe/session";
import Home from "./c/home";
import Dashboard from "./c/dashboard";
import Footer from "./c/footer";
import SessionExpiredPopup from "./c/SessionExpiredPopup";
import Profile from "./c/account/profile";
import axios from "axios";
import Nav from "./c/nav";

export function getApiDomain() {
    const apiPort = process.env.REACT_APP_API_PORT || 8000;
    const apiUrl = process.env.REACT_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = process.env.REACT_APP_WEBSITE_PORT || 3000;
    const websiteUrl = process.env.REACT_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

SuperTokens.init({
    appInfo: {
        appName: "Graph Commerce Admin", // TODO: Your app name
        apiDomain: getApiDomain(), // TODO: Change to your app's API domain
        websiteDomain: getWebsiteDomain(), // TODO: Change to your app's website domain
    },
    recipeList: [
        EmailPassword.init({
            emailVerificationFeature: {
                mode: "REQUIRED",
            },
        }),
        Session.init(),
    ],
});

Session.addAxiosInterceptors(axios);

interface CurrentUser {
  name: string,
	picture: string
}

function App() {
  let [showSessionExpiredPopup, updateShowSessionExpiredPopup] = useState(false);
	let [currentUser, updateCurrentUser] = useState<CurrentUser>({ name: "", picture: "" });
	let { userId, doesSessionExist } = useSessionContext();

	async function callAPI() {
		try {
			const response = await axios.get(getApiDomain() + "/person");
			if (response.statusText !== "OK") {
				throw Error(response.statusText);
			}
			updateCurrentUser({ name: response.data.persons[0].name, picture: response.data.persons[0].picture });
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
    callAPI();
  }, [])

  return (
    <div className="App">
        <Router>
          <div className="fill">
						{!doesSessionExist ? <Nav picture={currentUser.picture} /> : null}
            <Routes>
              {/* This shows the login UI on "/auth" route */}
              {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"))}

              <Route
                path="/"
                element={
                                /* This protects the "/" route so that it shows 
                                <Home /> only if the user is logged in.
                                Else it redirects the user to "/auth" */
                  <EmailPassword.EmailPasswordAuth
                    onSessionExpired={() => {
                      updateShowSessionExpiredPopup(true);
                    }}>
                    <Home />
                    {showSessionExpiredPopup && <SessionExpiredPopup />}
                  </EmailPassword.EmailPasswordAuth>
                }
              />
							<Route
                path="/dashboard"
                element={
                                /* This protects the "/" route so that it shows 
                                <Home /> only if the user is logged in.
                                Else it redirects the user to "/auth" */
                  <EmailPassword.EmailPasswordAuth
                    onSessionExpired={() => {
                      updateShowSessionExpiredPopup(true);
                    }}>
                    <Dashboard />
                    {showSessionExpiredPopup && <SessionExpiredPopup />}
                  </EmailPassword.EmailPasswordAuth>
                }
              />

							<Route
                path="/account/profile"
                element={
                                /* This protects the "/" route so that it shows 
                                <Home /> only if the user is logged in.
                                Else it redirects the user to "/auth" */
                  <EmailPassword.EmailPasswordAuth
                    onSessionExpired={() => {
                      updateShowSessionExpiredPopup(true);
                    }}>
                    <Profile name={currentUser.name} picture={currentUser.picture} />
                    {showSessionExpiredPopup && <SessionExpiredPopup />}
                  </EmailPassword.EmailPasswordAuth>
                }
              />

            </Routes>
          </div>
        </Router>
			<Footer />
    </div>
  );
}

export default App;
