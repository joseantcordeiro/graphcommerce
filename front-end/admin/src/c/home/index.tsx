import { useSessionContext } from "supertokens-auth-react/recipe/session";
import SuccessView from "./SuccessView";
import DashboardSidebar from "../dashboard/DashboardSidebar";

export default function Home() {
	const { userId } = useSessionContext();

    return (
			<div className="container">

				<div className="columns">
					<SuccessView userId={userId} />
				</div>
			</div>
    );
}