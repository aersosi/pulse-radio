import { ErrorPage } from "@/components/errorPage";

export default function PageNotFound() {
    return (
        <ErrorPage
            title="Page Not Found"
            description="The page you are looking for does not exist or is not available."
            backLinkText="Back to overview"
            backLinkHref="/"
        />
    );
}