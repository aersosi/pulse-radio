import Link from "next/link";

export default function Btn_toTop100() {
    return (
        <Link href="/" className="inline-block mb-4 hover:underline">
            ← Back to Top 100
        </Link>
    );
}