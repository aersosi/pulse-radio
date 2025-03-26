import StationListLoading from "@/components/station/station-list-loading";
import PaginationControls from "@/components/pagination-controls";

export default function SearchLoading() {
    return (
        <>
            <p className="flex items-center h-9 animate-pulse">Searching...</p>
            <StationListLoading />
            <PaginationControls page={1} totalCount={5} isLoading={true} />
        </>
    );
}