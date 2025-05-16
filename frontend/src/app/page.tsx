import StationLoading from "@/app/loading";
import { getStations } from "@/lib/api";
import StationList from "@/components/station/station-list";
import PaginationControls from "@/components/pagination-controls";
import PageNotFound from "@/app/not-found";
import { STATIONS_PER_PAGE } from "@/lib/constants";
import { Suspense } from "react";

async function HomeContent(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const page = searchParams.page ? parseInt(searchParams.page) : 1;

    const offset = (page - 1) * STATIONS_PER_PAGE;
    const result = await getStations(STATIONS_PER_PAGE, offset);

    if (!result || 'error' in result || !result.stations || result.stations.length === 0) {
        return (
            <PageNotFound></PageNotFound>
        );
    }

    const { stations, totalCount } = result;

    return (
        <>
            <div className="flex justify-between items-center gap-4 h-8">
                <p>{`Station: ${offset + 1} - ${Math.min(offset + STATIONS_PER_PAGE, totalCount)}`}</p>
                <p>Found Stations: {totalCount}</p>
            </div>

            <StationList stations={stations} />
            <PaginationControls page={page} totalCount={totalCount} />
        </>
    );
}

export default function Home(props: { searchParams: Promise<{ page?: string }> }) {
    return (
        <Suspense fallback={<StationLoading />}>
            <HomeContent searchParams={props.searchParams} />
        </Suspense>
    );
}