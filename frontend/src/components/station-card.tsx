import Link from "next/link";
import Image from "next/image";
import { Station } from "@/lib/definitions";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import placeholderImage from "public/images/no-image-available.webp";

export default function StationCard({station}: {station: Station}) {
    return (
        <Link href={`/station/${station.id}`} className="block">
            <Card className="spring-bounce-60 spring-duration-300 hover:scale-105 transition-transform text-center">
                <CardHeader className="h-[32px]">
                    <CardTitle>{station.name}</CardTitle>
                </CardHeader>
                <CardContent>
                        <Image
                            src={station.logo || placeholderImage.src}
                            alt={station.name ? station.name : "No image available"}
                            placeholder={station.blurDataURL ? "blur" : undefined}
                            blurDataURL={station.blurDataURL || undefined}
                            width={300}
                            height={300}
                            sizes="80px"
                            className="w-20 h-20 mx-auto rounded-md"
                        />
                </CardContent>
                <CardFooter className="h-[40px]">
                    <p>{station.topics || "No topics available"}</p>
                </CardFooter>
            </Card>
        </Link>
    );
}