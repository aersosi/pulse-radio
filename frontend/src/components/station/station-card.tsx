import { lightenHexColor } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Station } from "@/lib/definitions";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui";
import placeholderImage from "../../../public/images/no-image-available.webp";
import styles from "./station-card.module.css";
import { Play } from "lucide-react";

export default function StationCard({station}: { station: Station }) {

    const fallbackColors = [
        '#e61717', '#ffbf00', '#22cc00',
        '#00d9b5', '#00d4ff', '#0073e6',
        '#531aff', '#c317e6', '#e60b9d'];
    const randomFallbackColor = fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
    const hasColor = station.strikingColor1 ? station.strikingColor1 : randomFallbackColor;

    const [textColor, bgColor, borderColor, outlineColor, gradientColorLight] = lightenHexColor(`${hasColor}`, 0.3, -0.1);
    const gradient = {
        backgroundImage: `radial-gradient(
        at top right,
        ${hasColor} 40%,
        ${gradientColorLight}
      )`
    };
    const topicsSplit = station.topics?.split(",").sort((a, b) => a.length - b.length);

    return (
        <Link href={`/station/${station.id}`} className="block">
            <Card
                className={`${styles.stationCard} h-full spring-bounce-50 spring-duration-300 hover:scale-102 transition`}
            >
                <div style={gradient}
                     className="flex flex-col grow gap-4 transition rounded-xl p-[var(--step-20-60)] border shadow-sm">
                    <CardHeader className={`p-0 ${textColor}`}>
                        <div className="flex gap-4 justify-between">
                            <div>
                                <p className="2xl:text-lg">{station.country}</p>
                                <p className="text-lg 2xl:text-xl font-semibold">{station.city}</p>
                            </div>
                            <div className="relative fludidStationLogo">
                                <div
                                    className={`placeholderBG ${styles.placeholderBG} ${bgColor} outline-3 ${outlineColor} `}/>
                                <Image
                                    priority={true}
                                    src={station.logo300x300 || placeholderImage.src}
                                    alt={station.name ? station.name : "No station name available"}
                                    width={300}
                                    height={300}
                                    sizes="80px"
                                    className={`${styles.stationLogo} rounded-md`}
                                />
                                <div
                                    className={`${styles.playIcon} absolute fludidPlayIcon rounded-full flex items-center justify-center`}
                                >
                                    <Play size={40} className="pl-[3px]"/>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className={`${textColor} grow min-h-28 p-0 flex flex-col justify-end gap-2`}>
                        <div className="flex gap-2 flex-wrap">
                            {topicsSplit?.map((topic, index) => (
                                <span key={index}
                                      className={`border ${borderColor} px-2 2xl:px-2.5 py-0.5 2xl:py-1 rounded-full font-semibold text-xs 2xl:text-sm`}>
                                    {topic}
                                </span>
                            ))}
                        </div>
                        <h2 className="text-xl 2xl:text-2xl font-semibold">{station.name}</h2>
                    </CardContent>
                </div>
            </Card>
        </Link>
    );
}