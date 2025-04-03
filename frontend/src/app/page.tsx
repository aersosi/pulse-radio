import { getStations } from "@/lib/api";
import StationList from "@/components/station/station-list";
import PaginationControls from "@/components/pagination-controls";
import { ErrorPage } from "@/components/error-page";
import { STATIONS_PER_PAGE } from "@/lib/constants";

export default async function Home({searchParams}: { searchParams: { page?: string } }) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;

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
            <div className="flex justify-between items-center gap-4 h-9">
                <p>{`Station: ${offset + 1} - ${Math.min(offset + STATIONS_PER_PAGE, totalCount)}`}</p>
                <p>Found Stations: {totalCount}</p>
            </div>

            <StationList stations={stations}/>
            <PaginationControls page={page} totalCount={totalCount}/>
        </>
    );
}
