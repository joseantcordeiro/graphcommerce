import Nav from '../nav'
export default function Profile() {
	return (
		<div className="container">
			<Nav />
			<div className="columns is-centered">
				<div className="column is-one-quarter">
					<div className="box">
						<div className="content has-text-centered">
							<figure className="image is-128x128">
								<img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" alt=""/>
							</figure>
							<p className="title is-4"></p>
							<div className="file">
								<label className="file-label">
									<input className="file-input" type="file" name="resume" />
									<span className="file-cta">
										<span className="file-icon">
											<i className="fas fa-upload"></i>
										</span>
										<span className="file-label">
											Choose a file…
										</span>
									</span>
								</label>
							</div>
						</div>
					</div>
				</div>
				<div className="column">
				<form className="box">
					<div className="field">
						<label className="label">Name</label>
						<div className="control">
							<input className="input" type="text" placeholder="your name" />
						</div>
					</div>

					<div className="field">
						<label className="label">Default Languague</label>
						<div className="control">
							<div className="select">
								<select>
									<option>English</option>
									<option>Português</option>
								</select>
							</div>
						</div>
					</div>

					<button className="button is-primary">Update</button>
				</form>
				</div>
			</div>
		</div>
	)
}