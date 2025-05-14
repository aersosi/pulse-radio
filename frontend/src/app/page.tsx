import { getStations } from "@/lib/api";
import StationList from "@/components/station/station-list";
import PaginationControls from "@/components/pagination-controls";
import { ErrorPage } from "@/components/error-page";
import { STATIONS_PER_PAGE } from "@/lib/constants";

export default async function Home(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const page = searchParams.page ? parseInt(searchParams.page) : 1;

    const offset = (page - 1) * STATIONS_PER_PAGE;
    const result = await getStations(STATIONS_PER_PAGE, offset);

    // Check if the result is a StationCollection
    if (!result || 'error' in result || !result.stations || result.stations.length === 0) {
        return (
            <ErrorPage
                title="Stations Not Found"
                description="The stations you are looking for do not exist or are not available."
                backLinkText="Back to overview"
                backLinkHref="/"
            />
        );
    }

    const { stations, totalCount } = result;

    return (
        <>
            <div className="flex justify-between items-center gap-4 h-9">
                <p>{`Station: ${offset + 1} - ${Math.min(offset + STATIONS_PER_PAGE, totalCount)}`}</p>
                <p>Found Stations: {totalCount}</p>
            </div>

            <StationList stations={stations} />
            <PaginationControls page={page} totalCount={totalCount} />
        </>
    );
}
