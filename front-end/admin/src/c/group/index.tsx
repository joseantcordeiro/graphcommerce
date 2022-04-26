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
	const [organization, setOrganization] = useState({ name: "", id: "" });
	const [searchedWord, setSearch] = useState("");
  const [resultSearch, setResults] = useState([]);
  const [resultCards, setCards] = useState([]);

	useEffect(() => {
		async function getOrganization() {
			try {
				const response = await axios.get(getApiDomain() + getApiVersion() + "/person/organization");
				if (response.statusText !== "OK") {
					throw Error(response.statusText);
				}
				setOrganization({ name: response.data.results[0].name, id: response.data.results[0].id});
			} catch (error) {
				console.log(error);
			}
		}
		getOrganization();
	}, []);

	useEffect(() => {
    // Create an scoped async function in the hook
    async function searchWithMeili() {
			// const index = searchClient.getIndex('group-' + organization.id);
			const search = await axios.get(getApiDomain() + getApiVersion() + "/search/indexes/group-" + organization.id + "/search?q=" + searchedWord);
      /** const search = index.search(searchedWord, {
				limit: 10,
				attributesToHighlight: ["name"],
				filter: 'deleted = false'
			}); */
      setResults(search.data.hits);
    }
    // Execute the created function directly
    searchWithMeili();
  }, [searchedWord]);

	useEffect(() => {
		async function getCards () {
			let arrayItems: any = [];
			for (const element of resultSearch) {
				const group: any = element;
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
				<div className="box">
					<div className="tile" >
            Stop looking for an item — find it and work hard!
          </div>

            <input
              type="text"
              value={searchedWord}
              onChange={(event) => setSearch(event.target.value)}
              className="input is-medium"
              placeholder="Type the Group Name, description, …"
            />

        </div>
      </div>

      <div>
        <div className="columns">{resultCards}</div>
      </div>
    </div>
  );
}

export default Group;
