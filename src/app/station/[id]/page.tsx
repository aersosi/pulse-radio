import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getStationDetails } from "@/lib/api";
import { StationDetailPageProps, StationDetail } from "@/lib/definitions";
import BtnToTop100 from "@/components/BtnToTop100";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { truncateEnd, truncateStart } from "@/lib/utils";
import HLSPlayer from "@/components/HLSPlayer";
import NativeAudioPlayer from "@/components/NativeAudioPlayer";

// Dynamic metadata based on station
export async function generateMetadata({params}: { params: Promise<{ id: string }> }): Promise<Metadata> {
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
            <BtnToTop100/>

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
                        <Accordion type="single" collapsible className="max-w-3/4">
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
                    <div className="flex flex-col gap-8 items-center w-full">
                        {station.streamUrl ? (
                            station.streamUrl.includes('.m3u8') ? (
                                <HLSPlayer url={station.streamUrl} />
                            ) : (
                                <NativeAudioPlayer streamUrl={station.streamUrl} />
                            )
                        ) : (
                            <div className="text-red-500 mt-4">Stream currently not available</div>
                        )}

                        <p className="text-green-500 font-bold">Enjoy your Radio and increase volume if you like!</p>
                    </div>
                </CardFooter>
            </Card>
            <p className="text-center break-all max-w-3/4 text-muted-foreground text-sm mx-auto">{station.streamUrl}</p>

        </main>);
}