import {getTop100Stations} from "@/lib/api";
import StationList from "@/components/StationList";
import {Station} from "@/lib/definitions";

export default async function Home() {
    const stations: Station[] = await getTop100Stations();

    return (
        <div className="font-[family-name:var(--font-geist-sans)]">
            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Top 100 Radio Stations</h1>
                <StationList stations={stations}/>
            </main>
            <footer className="">
            </footer>
        </div>
    );
}
