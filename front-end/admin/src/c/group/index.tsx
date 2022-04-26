import { SetStateAction, useEffect, useState } from 'react';
import { InstantSearch, SearchBox, Hits, Highlight } from 'react-instantsearch-dom';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { CurrentUser } from '../../i/state-pool/CurrentUserType';
import axios from 'axios';
import { getApiDomain, getApiVersion } from '../../App';
import Session from "supertokens-auth-react/recipe/session";

Session.addAxiosInterceptors(axios);

const searchClient = instantMeiliSearch(
  "http://192.168.1.81:7700",
  "RtGNmRBXjHnM1mWkshssPhIqayGDqfxZ"
);

function Group () {
	const [searchedWord, setSearch] = useState("");
  const [resultSearch, setResults] = useState([]);
  const [resultCards, setCards] = useState([]);
	const [organization, setOrganization] = useState({ name: "", id: "" });

	useEffect(() => {
		async function getOrganization() {
			try {
				const response = await axios.get(getApiDomain() + + getApiVersion() + "/person/organization");
				if (response.statusText !== "OK") {
					throw Error(response.statusText);
				}
				setOrganization({ name: response.data.results[0].name, id: response.data.results[0].id});
			} catch (error) {
				console.log(error);
			}
		}
		getOrganization();
	}, [organization]);

	useEffect(() => {
    // Create an scoped async function in the hook
    async function searchWithMeili() {
			const index = searchClient.getIndex('group-' + organization.id);
      const search = index.search(searchedWord, {
				limit: 10,
				attributesToHighlight: ["name"],
				filter: 'deleted = false'
			});
      setResults(search.hits);
    }
    // Execute the created function directly
    searchWithMeili();
  }, [searchedWord]);

	useEffect(() => {
		async function getCards () {
			let arrayItems: any = [];
			for (let i = 0; i < resultSearch.length; i++) {
				const group: any = resultSearch[i];
				arrayItems.push(
					<div className="box">
						<h1 className="title">{group.name}</h1>
						<h2 className="subtitle">{group.description}</h2>
					</div>
				);
			}
			setCards(arrayItems);
		}
    getCards();
  }, [resultSearch]);

	return (
    <div className="container">
      <div className="columns is-centered">
        <header className="">
          
					<div className="tile" >
            Stop looking for an item — find it and work hard!
          </div>
          <div className="box">
						<button className="button">
              <svg
                className="icon"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
              </svg>
            </button>
            <input
              type="text"
              value={searchedWord}
              onChange={(event) => setSearch(event.target.value)}
              className="input is-medium"
              placeholder="Group Name, description, …"
            />
          </div>
        </header>
      </div>

      <div>
        <div className="columns">{resultCards}</div>
      </div>
    </div>
  );
}

export default Group;
