import type { Metadata } from "next";
import Image from "next/image";
import { getStationDetails } from "@/lib/api";
import { ErrorResponse, Station } from "@/lib/definitions";
import BtnToHome from "@/components/btn-to-home";
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
import StationNotFound from "@/app/station/[id]/not-found";
import placeholderImage from "public/images/no-image-available.webp"

// Dynamic metadata based on station
export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const params = await props.params;
    const {id} = params;
    const station: Station | ErrorResponse | null = await getStationDetails(id);

    if (!station || 'error' in station) {
        return {
            title: 'Station not found',
        };
    }

    return {
        title: `${station.name}`,
        description: station.description || `Listen to ${station.name} live`,
    };
}

export default async function StationDetailPage(
    props: { params: Promise<{ id: string; }>; }
) {
    const params = await props.params;
    const station: Station | ErrorResponse | null = await getStationDetails(params.id, 1000);

    if (!station || 'error' in station) {
        return (
            <StationNotFound></StationNotFound>
        );
    }

    return (
        <>
            <BtnToHome/>
            <Card>
                <div className="rounded-xl py-6 border shadow-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl">{station.name}</CardTitle>
                        {station.topics ? (
                            <CardDescription className="text-xl">{station.topics}</CardDescription>
                        ) : (
                            <p className="text-xl text-muted-foreground">Topics not avalible</p>
                        )}
                    </CardHeader>
                    <CardContent className="flex flex-col items-center py-[var(--step-8-24)]">
                        {station.logo300x300 && (
                            <Image
                                priority={true}
                                src={station.logo300x300 || placeholderImage.src}
                                alt={station.name ? station.name : "No image available"}
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
                            <p className="text-gray-600 text-sm py-4">Description not available</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <div className="flex flex-col items-center w-full">
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
            <p className="flex items-center h-8 text-center break-all max-w-3/4 text-muted-foreground text-sm mx-auto">{station.streamUrl}</p>
        </>
    );
}