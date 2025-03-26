import { Card, CardContent, CardFooter, CardHeader, CardTitle, Skeleton } from "@/components/ui";
import { STATIONS_PER_PAGE } from "@/lib/constants";

export default function StationListLoading() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(STATIONS_PER_PAGE)].map((_, index) => (
                <Card key={`station-list-loading-${index}`}>
                    <div className="rounded-xl py-6 border shadow-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl">
                            {/*Station Name*/}
                            <Skeleton className="h-4 w-1/2 mx-auto"/>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        {/*Station Logo Image*/}
                        <div className="fludidStationLogo mx-auto my-4 relative">
                            <Skeleton className="h-full w-full rounded-md"/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        {/*Station topic*/}
                        <Skeleton className="h-4 w-1/3 rounded-full mb-2"/>
                    </CardFooter>
                    </div>
                </Card>
            ))}
        </div>
    );
}