import { ErrorPage } from "@/components/error-page";

export default function StationNotFound() {
    return (
        <ErrorPage
            title="Station Not Found"
            description="The station you are looking for does not exist or is not available."
            backLinkText="Back to overview"
            backLinkHref="/"
        />
    );
}