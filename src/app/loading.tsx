import StationListLoading from "@/components/StationListLoading";
import PaginationControls from "@/components/PaginationControls";

export default function StationLoading() {
    return (
        <div className="flex flex-col gap-8 py-4">
            <header className="container mx-auto px-4">
                <div className="flex justify-between items-center gap-4 flex-col md:flex-row">
                    <div className="flex gap-4 items-center animate-pulse">
                        <img className="w-8 h-8" src={"/pulse_logo_32.png"} alt={"Pulse radio logo"}/>
                        <h1 className="text-2xl font-bold">Loading Radio Stations ...</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4">
                <StationListLoading/>
            </main>

            <footer className="container mx-auto px-4 animate-pulse">
                <PaginationControls page={1} totalCount={5} isLoading={true}/>
            </footer>
        </div>
    );
}