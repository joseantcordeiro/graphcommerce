import { useEffect, useState } from 'react';
import axios from 'axios';
import { getApiDomain, getApiVersion } from '../../App';
import Session from "supertokens-auth-react/recipe/session";

Session.addAxiosInterceptors(axios);

interface IProps {
	organization: { name: string,	id: string };
}

function Group (props: IProps) {
	const [searchedWord, setSearch] = useState("");
  const [resultSearch, setResults] = useState([]);
  const [resultCards, setCards] = useState([]);

	useEffect(() => {
    // Create an scoped async function in the hook
    async function searchWithMeili() {
			const search = await axios.get(getApiDomain() + getApiVersion() + "/search/indexes/group-" + props.organization.id + "/search?q=" + searchedWord);
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
					<tr>
						<td>{group.name}</td>
						<td>{group.description}</td>
						<td>{group.type}</td>
						<td><button className="button is-info is-small">Members</button></td>
						<td><button className="button is-success is-small">Edit</button></td>
						<td><button className="button is-danger is-small">Delete</button></td>
					</tr>
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
					<div className="card">
						<header className="card-header">
							<p className="card-header-title">
								Group Search
							</p>
							<a href="#" className="card-header-icon" aria-label="more options">
								<span className="icon">
									<i className="fa fa-angle-down" aria-hidden="true"></i>
								</span>
							</a>
						</header>
						<div className="card-content">
							<div className="content">
								<div className="control has-icons-left has-icons-right">
									<input
										type="text"
										value={searchedWord}
										onChange={(event) => setSearch(event.target.value)}
										className="input is-medium"
										placeholder="Type the Group Name, description, …"
									/>
									<span className="icon is-medium is-left">
										<i className="fa fa-search"></i>
									</span>
									<span className="icon is-medium is-right">
										<i className="fa fa-check"></i>
									</span>
								</div>
							</div>
						</div>
					</div>

        </div>
      </div>

      <div className="box">
				<table className="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Description</th>
							<th>Type</th>
							<th><button className="button is-link">Create</button></th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{resultCards}
					</tbody>
				</table>
      </div>
    </div>
  );
}

export default Group;
