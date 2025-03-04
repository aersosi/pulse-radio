import Image from "next/image";
import {getStationDetails} from "@/lib/api";
import {notFound} from "next/navigation";
import AudioPlayer from "@/components/AudioPlayer";
import {StationDetailPageProps, StationDetail} from "@/lib/definitions";
import Btn_toTop100 from "@/components/Btn_toTop100";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {truncateEnd, truncateStart} from "@/lib/utils";
import {Metadata} from "next";

// Dynamic metadata based on station
export async function generateMetadata({params}: { params: { id: string } }): Promise<Metadata> {
    const {id} = await params;
    const station = await getStationDetails(id);

    if (!station) {
        return {
            title: 'Station not found',
        };
    }

    return {
        title: `${station.name}`,
        description: station.description || `Listen to ${station.name} live`,
    };
}

export default async function StationDetailPage({params}: StationDetailPageProps) {
    const {id} = await params;
    const station: StationDetail | null = await getStationDetails(id);

    if (!station) {
        notFound();
    }

    return (
        <main className="container mx-auto p-4 flex flex-col gap-8">
            <Btn_toTop100/>

            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl">{station.name}</CardTitle>
                    {station.genre && (
                        <CardDescription className="text-xl">{station.genre}</CardDescription>
                    )}
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    {station.logo && (
                        <div className="w-32 h-32 mx-auto my-4 relative">
                            <Image
                                src={station.logo || "/no-image-available.webp"}
                                alt={station.name ? station.name : "No image available"}
                                placeholder="blur"
                                blurDataURL={station.logo || "/no-image-available.webp"}
                                fill
                                className="object-contain rounded-md"
                                sizes="(max-width: 768px) 100vw, 250px"
                            />
                        </div>
                    )}

                    {station.description ? (
                        <Accordion type="single" collapsible className="max-w-1/2">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>{truncateEnd(station.description, 80)}</AccordionTrigger>
                                <AccordionContent>
                                    {truncateStart(station.description, 80)}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ) : (
                        <div className="text-gray-600">Description not available</div>
                    )}
                </CardContent>
                <CardFooter>
                    {station.streamUrl ? (
                        <AudioPlayer streamUrl={station.streamUrl}/>
                    ) : (
                        <div className="text-red-500 mt-4">Stream currently not available</div>
                    )}
                </CardFooter>
            </Card>
        </main>);
}