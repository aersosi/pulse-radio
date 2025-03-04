import StationCard from "@/components/StationCard";
import {StationListProps} from "@/lib/definitions";

export default function StationList({stations}: StationListProps) {
    if (!stations || stations.length === 0) {
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