import StationCard from "@/components/station-card";
import { Station } from "@/lib/definitions";

export default function StationList({stations}: { stations: Station[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {stations.map((station) => (
                <StationCard key={station.id} station={station}/>
            ))}
        </div>
    );
}