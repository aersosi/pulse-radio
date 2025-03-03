import Image from "next/image";
import {getStationDetails} from "@/lib/api";
import {notFound} from "next/navigation";
import AudioPlayer from "@/components/AudioPlayer";
import {StationDetailPageProps} from "@/lib/definitions";
import Btn_toTop100 from "@/components/Btn_toTop100";

export async function generateMetadata({params}: { params: { id: string } }) {
    const {id} = await params;
    const station = await getStationDetails(id);

    if (!station) {
        return {
            title: "Station not found",
        };
    }

    return {
        title: `${station.name}`,
        description: station.description || `Höre ${station.name} live`,
    };
}

export default async function StationDetailPage({params}: StationDetailPageProps) {
    const {id} = await params;
    const station = await getStationDetails(id);

    if (!station) notFound();

    return (
        <main className="container mx-auto p-4">
            <Btn_toTop100/>

            <h1 className="text-3xl font-bold mt-4">{station.name}</h1>

            {station.logo && (
                <div className="w-48 h-48 mx-auto my-4 relative">
                    <Image
                        src={station.logo || "/no-image-available.webp"}
                        alt={station.name ? station.name : "No image available"}
                        fill
                        className="object-contain rounded-md"
                        sizes="(max-width: 768px) 100vw, 250px"
                    />
                </div>
            )}

            {station.genre && (
                <p className="text-lg text-red-500">
                    {station.genre.join(', ')}
                </p>
            )}

            {station.description && <p className="mt-4">{station.description}</p>}

            {station.streamUrl ? (
                <AudioPlayer streamUrl={station.streamUrl}/>
            ) : (
                <div className="text-red-500 mt-4">Stream currently not available</div>
            )}
        </main>
    );
}
