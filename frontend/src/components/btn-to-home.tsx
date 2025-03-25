import Link from "next/link";
import { Button } from "./ui";

export default function BtnToHome({linkText = "Back to overview", linkHref = "/"}: {
    linkText?: string,
    linkHref?: string
}) {
    return (
        <Link href={linkHref} className="w-fit">
            <Button variant="ghost">← {linkText}</Button>
        </Link>
    );
}