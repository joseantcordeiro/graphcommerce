export default function OrgDropDown() {
	
    let state = {
    	items: [
      	{ name: "Learn JavaScript", id: "gkgkgk", active: "navbar-item is-active" },
        { name: "Learn React", id: "asfssfaf", active: "navbar-item" },
        { name: "Play around in JSFiddle", id: "asfagbsbd", active: "navbar-item" },
        { name: "Build something awesome", id: "jopjibboibik", active: "navbar-item" }
      ]
    }


	return (
	<div className="navbar-item has-dropdown is-hoverable">
		<a className="navbar-link">
			Organizations
		</a>

		<div className="navbar-dropdown">
		{state.items.map(item => (
			<a className={item.active} id={item.id}>
				{item.name}
			</a>
		))}
			<hr className="navbar-divider" />
			<a className="navbar-item">
				Create
			</a>
		</div>
	</div>
	)

}
