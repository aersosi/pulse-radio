import StationListLoading from "@/components/station/station-list-loading";
import PaginationControls from "@/components/pagination-controls";

export default function StationLoading() {
    return (
        <>
            <p className="flex items-center h-9 text-xl animate-pulse">Loading Radio Stations ...</p>
            <StationListLoading/>
            <PaginationControls page={1} totalCount={50} isLoading={true}/>
        </>
    );
}