import { getStations, totalCount } from "@/lib/api";
import { Station } from "@/lib/definitions";
import StationList from "@/components/StationList";
import PaginationControls from "@/components/PaginationControls";

export default async function Home({searchParams}: { searchParams: Promise<{ page?: string }> }) {
    const pageParams = await searchParams;
    const page = pageParams.page ? parseInt(pageParams.page) : 1;
    const offset = (page - 1) * 5;

    const stations: Station[] = await getStations(5, offset);
    const totalCountValue: number = await totalCount();

    return (
        <div className="flex flex-col gap-8 py-4">
            <header className="container mx-auto px-4">
                <div className="flex justify-between items-center gap-4 flex-col md:flex-row">
                    <div className="flex gap-4 items-center">
                        <img className="w-8 h-8" src={"/pulse_logo_32.png"} alt={"Pulse radio logo"}/>
                        <h1 className="text-2xl font-bold">Pulse Radio</h1>
                    </div>
                    <div className="flex gap-4 text-xl font-bold">
                        <p>{`Station: ${offset + 1} - ${Math.min(offset + 5, totalCountValue)}`}</p>
                        <p className="font-light text-muted-foreground">Total: {totalCountValue}</p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4">
                <StationList stations={stations}/>
            </main>

            <footer className="container mx-auto px-4">
                <PaginationControls page={page} totalCount={totalCountValue}/>
            </footer>
        </div>
    );
}
