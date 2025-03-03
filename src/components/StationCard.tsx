import Link from "next/link";
import Image from "next/image";
import { StationCardProps } from "@/lib/definitions";

export default function StationCard({ station }: StationCardProps) {
    return (
        <Link href={`/station/${station.id}`} className="block">
            <div className="bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition-transform">
                {station.logo && (
                    <div className="w-full h-32 relative">
                        <Image
                            src={station.logo}
                            alt={station.name}
                            fill
                            className="object-contain rounded-md"
                            sizes="(max-width: 768px) 100vw, 250px"
                        />
                    </div>
                )}
                <h2 className="text-lg font-semibold mt-2">{station.name}</h2>
                {station.genre && (
                    <p className="text-sm text-red-500">{station.genre}</p>
                )}
            </div>
        </Link>
    );
}