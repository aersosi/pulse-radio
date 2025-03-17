import StationListLoading from "@/components/StationListLoading";
import PaginationControls from "@/components/PaginationControls";

export default function StationLoading() {
    return (
        <>
            <p className="flex items-center h-9 text-xl font-bold animate-pulse">Loading Radio Stations ...</p>

            <StationListLoading/>
            <PaginationControls page={1} totalCount={5} isLoading={true}/>
        </>
    );
}