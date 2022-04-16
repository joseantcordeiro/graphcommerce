import CallAPIView from "./CallAPIView";

export default function SuccessView(props: { userId: any; }) {
    let userId = props.userId;

    return (
			<div className="container is-max-widescreen">
				<div className="notification is-primary">
				🥳🎉 Login successful. Your user ID is {userId}.
				</div>
				<CallAPIView />
			</div>
    );
}