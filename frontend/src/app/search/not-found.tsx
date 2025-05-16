import { ErrorPage } from "@/components/error-page";

export default function SearchNotFound(
    {title, description, backLinkText, backLinkHref,}:
    { title: string, description: string, backLinkText: string, backLinkHref: string }
) {
    return (
        <ErrorPage
            title={title}
            description={description}
            backLinkText={backLinkText}
            backLinkHref={backLinkHref}
        />
    );
}