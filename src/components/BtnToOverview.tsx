import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BtnToOverview() {
    return (
        <Link href="/" className="w-fit">
            <Button  variant="ghost">← Back to overview</Button>
        </Link>
    );
}