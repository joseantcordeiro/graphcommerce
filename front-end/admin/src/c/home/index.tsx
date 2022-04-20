import { Component } from "react";
import SuccessView from "./SuccessView";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import { CurrentUser} from "../../i/state-pool/CurrentUserType";

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

					
				</div>
				<SuccessView userId={this.props.currentUser.userId} />
			</div>
    );
	}
}