import StationCard from "@/components/StationCard";
import {StationListProps} from "@/lib/definitions";
import StationCardLoading from "@/components/StationCardLoading";

export default function StationList({stations, isLoading}: StationListProps & { isLoading: boolean }) {
    if (isLoading || stations.length === 0) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {Array.from({ length: 5 }).map((_, index) => (
                    <StationCardLoading key={index} />
                ))}
            </div>
        );
    }

    if (!stations) {
        return (
            <div className="text-center py-8 text-gray-600">
                No stations found
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {stations.map((station) => (
                <StationCard key={station.id} station={station}/>
            ))}
        </div>
    );
}