import Link from "next/link";
import Image from "next/image";
import { Station } from "@/lib/definitions";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";


export default function StationCard({station}: {station: Station}) {
    return (
        <Link href={`/station/${station.id}`} className="block">

            <Card className="hover:scale-105 transition-transform text-center">
                <CardHeader className="h-[32px]">
                    <CardTitle>{station.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-20 h-20 mx-auto relative">
                        <Image
                            src={station.logo || "/no-image-available.webp"}
                            alt={station.name ? station.name : "No image available"}
                            placeholder="blur"
                            blurDataURL={station.logo || "/no-image-available.webp"}
                            fill
                            className="object-contain rounded-lg"
                            sizes="(max-width: 768px) 100vw, 250px"
                        />
                    </div>
                </CardContent>
                <CardFooter className="h-[40px]">
                    <p>{station.topics || "No topics available"}</p>
                </CardFooter>
            </Card>
        </Link>
    );
}