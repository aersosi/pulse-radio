import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BtnToOverview() {
    return (
        <Link href="/">
            <Button>← Back to overview</Button>
        </Link>
    );
}