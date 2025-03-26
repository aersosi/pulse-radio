import type { Metadata } from "next";
import Image from "next/image";
import { getStationDetails } from "@/lib/api";
import { Station } from "@/lib/definitions";
import BtnToTop100 from "@/components/btn-to-home";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { truncateEnd, truncateStart } from "@/lib/utils";
import PlayerHLS from "@/components/mediaPlayer/player-HLS";
import PlayerAudio from "@/components/mediaPlayer/player-audio";
import { InlineError } from "@/components/error-alert";
import { ErrorPage } from "@/components/error-page";
import placeholderImage from "public/images/no-image-available.webp"

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

export default async function StationDetailPage({params}: {
    params: Promise<{ id: string }>;
}) {
    const {id} = await params;
    const station: Station | null = await getStationDetails(id, 1000);

    if (!station) {
        return (
            <ErrorPage
                title="Station Not Found"
                description="The station you are looking for does not exist or is not available."
                backLinkText="Back to overview"
                backLinkHref="/"
            />
        );
    }

    return (
        <>
            <BtnToTop100/>
            <Card>
                <div className="rounded-xl py-6 border shadow-sm">

                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl">{station.name}</CardTitle>
                        {station.topics ? (
                            <CardDescription className="text-xl">{station.topics}</CardDescription>
                        ) : (
                            <p className="text-xl text-muted-foreground">No topics avalible</p>
                        )}
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        {station.logo && (
                            <Image
                                src={station.logo || placeholderImage.src}
                                alt={station.name ? station.name : "No image available"}
                                placeholder={station.blurDataURL ? "blur" : undefined}
                                blurDataURL={station.blurDataURL || undefined}
                                width={300}
                                height={300}
                                sizes="128px"
                                className="fludidStationLogo my-4 mx-auto rounded-md"
                            />
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
                                    <PlayerHLS url={station.streamUrl} title={station.name}/>
                                ) : (
                                    <PlayerAudio url={station.streamUrl} title={station.name}/>
                                )
                            ) : (
                                <InlineError
                                    title="Streaming Url not found"
                                    description="Stream currently not available"
                                />
                            )}
                        </div>
                    </CardFooter>
                </div>
            </Card>
            <p className="flex items-center h-9 text-center break-all max-w-3/4 text-muted-foreground text-sm mx-auto">{station.streamUrl}</p>
        </>
    );
}