import { useContext, useEffect, useState } from "react";
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
import Onboarding from "./c/onboarding/Onboarding";
import CreateOrganization from "./c/orgs/create";
import { createGlobalstate, useGlobalStateReducer } from "state-pool";
import { CurrentUser } from "./i/state-pool/CurrentUserType";

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
					/**
					onHandleEvent: async (context) => {
						if (context.action === "SESSION_ALREADY_EXISTS") {
								// TODO:
						} else {
								if (context.action === "SUCCESS") {
										if (context.isNewUser) {
												// TODO: Sign up
										} else {
												// TODO: Sign in
										}
								}
						}
					}
					
					getRedirectionURL: async (context) => {
						if (context.action === "RESET_PASSWORD") {
								// called when the user clicked on the forgot password button
						} else if (context.action === "SIGN_IN_AND_UP") {
								// called when the user is navigating to sign in / up page
						} else if (context.action === "SUCCESS") {
								// called on a successful sign in / up. Where should the user go next?
								let redirectToPath = context.redirectToPath;
								if (redirectToPath !== undefined) {
										// we are navigating back to where the user was before they authenticated
										return redirectToPath;
								}
								if (context.isNewUser) {
										// user signed up
										return "/organization/create"
								} else {
										// user signed in
										return "/dashboard"
								}
						} else if (context.action === "VERIFY_EMAIL") {
								// called when the user is to be shown the verify email screen
						}
						// return undefined to let the default behaviour play out
						return undefined;
					} */
				}),
        Session.init(),
    ],
});

Session.addAxiosInterceptors(axios);

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

function App() {
  let [showSessionExpiredPopup, updateShowSessionExpiredPopup] = useState(false);
	let { userId, doesSessionExist } = useSessionContext();
	let [user, dispatch] = useGlobalStateReducer<CurrentUser>(loadUserData, currentUser);

  return (
    <div className="App">
        <Router>
          <div className="fill">
						{!doesSessionExist ? <Nav currentUser={user} /> : null}
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
                    <Home currentUser={user} />
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
                    <Profile currentUser={user}  />
                    {showSessionExpiredPopup && <SessionExpiredPopup />}
                  </EmailPassword.EmailPasswordAuth>
                }
              />

							<Route
                path="/onboarding"
                element={
                                /* This protects the "/" route so that it shows 
                                <Home /> only if the user is logged in.
                                Else it redirects the user to "/auth" */
                  <EmailPassword.EmailPasswordAuth
                    onSessionExpired={() => {
                      updateShowSessionExpiredPopup(true);
                    }}>
                    <Onboarding userId={userId} />
                    {showSessionExpiredPopup && <SessionExpiredPopup />}
                  </EmailPassword.EmailPasswordAuth>
                }
              />

							<Route
                path="/organization/create"
                element={
                                /* This protects the "/" route so that it shows 
                                <Home /> only if the user is logged in.
                                Else it redirects the user to "/auth" */
                  <EmailPassword.EmailPasswordAuth
                    onSessionExpired={() => {
                      updateShowSessionExpiredPopup(true);
                    }}>
                    <CreateOrganization userId={userId} />
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
