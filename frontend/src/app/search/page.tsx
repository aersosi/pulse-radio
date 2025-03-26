import { redirect } from 'next/navigation';
import { getSearchResults } from "@/lib/api";
import StationList from "@/components/station/station-list";
import PaginationControls from "@/components/pagination-controls";
import { ErrorPage } from "@/components/error-page";
import { STATIONS_PER_PAGE } from "@/lib/constants";
import BtnToHome from "@/components/btn-to-home";

export default async function SearchPage({searchParams,}: {
    searchParams: Promise<{ q?: string; page?: string }>;
}) {
    const params = await searchParams;
    const query = params.q || "";
    const page = params.page ? parseInt(params.page) : 1;
    const offset = (page - 1) * STATIONS_PER_PAGE;

    const {stations, totalCount} = await getSearchResults(
        query,
        STATIONS_PER_PAGE,
        offset
    );

    const totalPages = Math.ceil(totalCount / STATIONS_PER_PAGE);

    if (page > totalPages && totalPages > 0) {
        redirect(`/search?q=${encodeURIComponent(query)}&page=${totalPages}`);
    }
    if (page < 1) {
        redirect(`/search?q=${encodeURIComponent(query)}&page=1`);
    }

    if (!stations || stations.length === 0) {
        return (
            <>
                <ErrorPage
                    title="No stations found"
                    description={`No stations found for search term "${query}"`}
                    backLinkText="Back to overview"
                    backLinkHref="/"
                />
            </>
        );
    }

    return (
        <>
            <div className="flex justify-between items-center gap-4 h-9">
                <BtnToHome></BtnToHome>
                <p>
                    Search results for: &nbsp;
                    <span className="font-bold text-green-500">{query}</span>
                </p>
                <div className="flex gap-4">
                    <p>{`Station: ${totalCount > 0 ? offset + 1 : 0} - ${Math.min(
                        offset + STATIONS_PER_PAGE,
                        totalCount
                    )}`}
                    </p>
                    <p>|</p>
                    <p>Found Stations: {totalCount}</p>
                </div>
            </div>

            <StationList stations={stations}/>
            <PaginationControls
                page={page}
                totalCount={totalCount}
                searchParams={{q: query}}
            />
        </>
    );
}