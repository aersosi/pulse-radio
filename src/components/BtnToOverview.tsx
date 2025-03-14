import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BtnToOverview() {
    return (
        <Link href="/">
            <Button  variant="ghost">← Back to overview</Button>
        </Link>
    );
}