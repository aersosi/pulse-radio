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
import placeholderImage from "../../../public/images/no-image-available.webp";
import styles from "./station-card.module.css";
import { Play } from "lucide-react";

export default function StationCard({station}: { station: Station }) {
    return (
        <Link href={`/station/${station.id}`} className="block">
            <Card
                className={`${styles.stationCard} spring-bounce-50 spring-duration-300 hover:scale-102 transition text-center `}

            >
              <div className="transition rounded-xl py-6 border hover:border-green-500/50 hover:bg-green-500/5  shadow-sm hover:shadow-green-500/50">
                  <CardHeader className="h-[32px]">
                      <CardTitle>{station.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className={`fludidStationLogo relative mx-auto w-20 h-20`}>
                          <Image
                              src={station.logo || placeholderImage.src}
                              alt={station.name ? station.name : "No image available"}
                              placeholder={station.blurDataURL ? "blur" : undefined}
                              blurDataURL={station.blurDataURL || undefined}
                              width={300}
                              height={300}
                              sizes="80px"
                              className={`${styles.stationLogo} rounded-md`}
                          />

                          <div
                              className={`${styles.playIcon} absolute fludidPlayIcon rounded-full flex items-center justify-center`}
                          >
                              <Play size={32} className="pl-[3px]"/>
                          </div>
                      </div>
                  </CardContent>
                  <CardFooter className="h-[40px]">
                      <p>{station.topics || "No topics available"}</p>
                  </CardFooter>
              </div>
            </Card>
        </Link>
    );
}