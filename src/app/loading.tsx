import StationListLoading from "@/components/StationListLoading";
import PaginationControls from "@/components/PaginationControls";

export default function StationLoading() {
    return (
        <main className="container mx-auto px-4 flex flex-col gap-6">
            <p className="text-xl font-bold animate-pulse">Loading Radio Stations ...</p>
            <StationListLoading/>
            <PaginationControls page={1} totalCount={5} isLoading={true}/>
        </main>
    );
}