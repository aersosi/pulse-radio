import { getStations } from "@/lib/api";
import StationList from "@/components/StationList";
import PaginationControls from "@/components/PaginationControls";
import { ErrorPage } from "@/components/errorPage";
import { STATIONS_PER_PAGE } from "@/lib/constants";

export default async function Home({searchParams}: { searchParams: Promise<{ page?: string }> }) {
    const pageParams = await searchParams;
    const page = pageParams.page ? parseInt(pageParams.page) : 1;

    const offset = (page - 1) * STATIONS_PER_PAGE;
    const { stations, totalCount } = await getStations(STATIONS_PER_PAGE, offset);

    if (!stations || stations.length === 0) {
        return (
        <ErrorPage
            title="Stations Not Found"
            description="The stations you are looking for do not exist or are not available."
            backLinkText="Back to overview"
            backLinkHref="/"
        />
        );
    }

    return (
        <>
            <div className="flex justify-between items-center gap-4 h-9 text-xl font-bold">
                <p>{`Station: ${offset + 1} - ${Math.min(offset + STATIONS_PER_PAGE, totalCount)}`}</p>
                <p className="font-light text-muted-foreground">Total: {totalCount}</p>
            </div>

            <StationList stations={stations}/>
            <PaginationControls page={page} totalCount={totalCount}/>
        </>
    );
}
