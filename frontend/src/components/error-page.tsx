import { AlertCircle } from "lucide-react"
import BtnToHome from "./btn-to-home";

interface ErrorPageProps {
    title: string;
    description?: string;
    backLinkText?: string;
    backLinkHref?: string;
}

export function ErrorPage({title, description, backLinkText = "Back to overview", backLinkHref = "/"}: ErrorPageProps) {
    return (
        <div className="px-4 py-8 flex flex-col gap-8 items-center text-center">
            <div className="flex gap-4 align-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive/90"/>
                <h2 className="text-2xl font-bold text-destructive/90">
                    {title}
                </h2>
            </div>

            {description && (
                <p>{description}</p>
            )}
            <BtnToHome linkText={backLinkText} linkHref={backLinkHref}/>
        </div>
    );
}