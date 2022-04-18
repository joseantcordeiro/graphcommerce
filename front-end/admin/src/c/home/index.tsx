import { Component } from "react";
import SuccessView from "./SuccessView";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import CurrentUser from "../../i/CurrentUser";

interface IProps {
  currentUser: CurrentUser;
}

interface IState {
	
}

export default class Home extends Component<IProps, IState> {
	constructor(props: IProps) {
    super(props);
		this.state = {};
  }

	render() {
    return (
			<div className="container">

				<div className="columns">
					<section className="hero is-primary">
            <div className="hero-body">

                <p className="title">
                  Hello, {this.props.currentUser.name}.
                </p>
                <p className="subtitle">
                  I hope you are having a great day!
                </p>

            </div>
          </section>
					
				</div>
				<SuccessView userId={this.props.currentUser.id} />
			</div>
    );
	}
}