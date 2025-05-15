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

    function lightenHexColor(
        hex: string,
        lightnessAmount: number = 0.2,
        saturationAmount: number = 0
    ): [string, string, string] {
        hex = hex.replace(/^#/, '');

        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }

        const num = parseInt(hex, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;

        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;

        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case rNorm:
                    h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
                    break;
                case gNorm:
                    h = (bNorm - rNorm) / d + 2;
                    break;
                case bNorm:
                    h = (rNorm - gNorm) / d + 4;
                    break;
            }
            h /= 6;
        }

        // Adjust H and S
        s = Math.min(1, Math.max(0, s + saturationAmount));
        l = Math.min(1, Math.max(0, l + lightnessAmount));

        // Return as CSS hsl()
        const hDeg = Math.round(h * 360);
        const sPerc = Math.round(s * 100);
        const lPerc = Math.round(l * 100);

        const isBright = 62; // todo: magic number must be some real contrast-check
        const textColor = lPerc <= isBright ? "text-white" : "text-black";
        const borderColor = lPerc <= isBright ? "border-white/30" : "border-black/30";

        return [textColor, borderColor, `hsl(${hDeg}, ${sPerc}%, ${lPerc}%)`];
    }

    const hasColor = station.strikingColor1 ? station.strikingColor1 : "#cdcdcd";
    const [textColor, borderColor, gradientColorLight] = lightenHexColor(`${hasColor}`, 0.2, -0.1);

    const gradient = {
        backgroundImage: `radial-gradient(
        at top right,
        ${hasColor} 45%,
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
                                <p className="text-lg 2xl:text-2xl font-semibold">{station.city}</p>
                            </div>
                            <div className={`border ${borderColor} relative fludidStationLogo rounded-md`}>
                                <Image
                                    src={station.logo300x300 || placeholderImage.src}
                                    alt={station.name ? station.name : "No station name available"}
                                    placeholder={station.blurDataURL ? "blur" : undefined}
                                    blurDataURL={station.blurDataURL || undefined}
                                    data-url={station.blurDataURL || undefined}
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
                                      className={`border ${borderColor} px-2 2xl:px-2.5 py-0.5 2xl:py-1 rounded-full font-semibold text-xs 2xl:text-base`}>
                                    {topic}
                                </span>
                            ))}
                        </div>
                        <h2 className="text-xl 2xl:text-3xl font-semibold">{station.name}</h2>
                    </CardContent>
                </div>
            </Card>
        </Link>
    );
}