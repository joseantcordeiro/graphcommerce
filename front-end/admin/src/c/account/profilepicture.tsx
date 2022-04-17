import { Component } from "react";

interface IProps {
  image: string
}

interface IState {
	picture: string
}

export default class ProfilePicture extends Component<IProps, IState> {
	constructor(props: IProps) {
    super(props)
		const image = 'http://' + this.props.image
    this.state = { picture: image };
  }

	render() {
		return (
			<div className="content has-text-centered">
				<figure className="image is-128x128">
					<img className="is-rounded" src={this.state.picture} alt=""/>
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
		)
	}
}