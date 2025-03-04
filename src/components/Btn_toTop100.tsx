import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Btn_toTop100() {
    return (
        <Link href="/">
            <Button>← Back to Top 100</Button>
        </Link>
    );
}