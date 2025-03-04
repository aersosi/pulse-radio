import Link from "next/link";
import Image from "next/image";
import {StationCardProps} from "@/lib/definitions";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


export default function StationCard({station}: StationCardProps) {
    return (
        <Link href={`/station/${station.id}`} className="block">

            <Card className="hover:scale-105 transition-transform text-center">
                <CardHeader>
                    <CardTitle>{station.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-32 h-32 mx-auto relative">
                        <Image
                            src={station.logo || "/no-image-available.webp"}
                            alt={station.name ? station.name : "No image available"}
                            placeholder="blur"
                            blurDataURL={station.logoSmall || "/no-image-available.webp"}
                            fill
                            className="object-contain rounded-lg"
                            sizes="(max-width: 768px) 100vw, 250px"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <p>{station.genre || "No genre available"}</p>
                </CardFooter>
            </Card>
        </Link>
    );
}