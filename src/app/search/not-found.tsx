import { ErrorPage } from "@/components/error-page";

export default function SearchNotFound() {
    return (
        <ErrorPage
            title="Search Results Not Found"
            description="No stations found matching your search criteria."
            backLinkText="Back to overview"
            backLinkHref="/"
        />
    );
}