import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { STATIONS_PER_PAGE } from "@/lib/constants";

export default function StationListLoading() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[...Array(STATIONS_PER_PAGE)].map((_, index) => (
                <Card key={`station-list-loading-${index}`}>
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl">
                            {/*Station Name*/}
                            <Skeleton className="h-4 w-full"/>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        {/*Station Logo Image*/}
                        <div className="w-20 h-20 mx-auto my-4 relative">
                            <Skeleton className="h-full w-full rounded-md"/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        {/*Station topic*/}
                        <Skeleton className="h-6 w-[300px] rounded-full"/>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}