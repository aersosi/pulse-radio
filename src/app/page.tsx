import { getStations } from "@/lib/api";
import StationList from "@/components/StationList";
import PaginationControls from "@/components/PaginationControls";

export default async function Home({searchParams}: { searchParams: { page?: string } }) {
    const pageParams = await searchParams;
    const page = pageParams.page ? parseInt(pageParams.page) : 1;
    const offset = (page - 1) * 5;
    const { stations, totalCount } = await getStations(5, offset);

    return (
        <main className="container mx-auto px-4 flex flex-col gap-6">
            <div className="flex justify-between gap-4 text-xl font-bold">
                <p>{`Station: ${offset + 1} - ${Math.min(offset + 5, totalCount)}`}</p>
                <p className="font-light text-muted-foreground">Total: {totalCount}</p>
            </div>

            <StationList stations={stations}/>
            <PaginationControls page={page} totalCount={totalCount}/>
        </main>
    );
}
