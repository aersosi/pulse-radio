import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Skeleton,
} from "@/components/ui";
import BtnToTop100 from "@/components/btn-to-home";

export default function StationLoading() {
    return (
        <>
            <BtnToTop100/>

            <Card>
                <div className="rounded-xl py-6 border shadow-sm">

                <CardHeader className="text-center">
                    <CardTitle className="text-4xl">
                        {/*Station Name*/}
                        <Skeleton className="h-[40px] w-1/2 mx-auto rounded-full"/>
                    </CardTitle>
                    <CardDescription className="h-[28px] py-1 text-xl">
                        {/*Station Topic*/}
                        <Skeleton className="h-full w-1/3 mx-auto rounded-full"/>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-[var(--step-8-24)]">
                    {/*Station Logo Image*/}
                    <div className="fludidStationLogo mx-auto my-4 relative">
                        <Skeleton className="w-full h-full rounded-md"/>
                    </div>
                    {/*Station Description*/}
                    <div className="h-[52px] flex items-center w-full">
                        <Skeleton className="h-6 w-1/2 mx-auto rounded-full"/>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col items-center w-full">

                        {/*Audio Player*/}
                        <Skeleton className="h-[54px] w-[400px] rounded-full"/>
                        <p className="text-muted-foreground animate-pulse py-4">Loading Radio Station ...</p>
                    </div>
                </CardFooter>
                </div>
            </Card>
            <div className="h-8 w-1/2 py-2 mx-auto">
                <Skeleton className="h-full rounded-full"/>
            </div>
        </>
    );
}