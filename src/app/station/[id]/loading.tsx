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
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl">
                        {/*Station Name*/}
                        <Skeleton className="h-[40px] w-1/2 mx-auto rounded-full"/>
                    </CardTitle>
                    <CardDescription className="text-xl">
                        {/*Station Topic*/}
                        <Skeleton className="h-[28px] w-1/3 mx-auto rounded-full"/>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    {/*Station Logo Image*/}
                    <div className="w-32 h-32 mx-auto my-4 relative">
                        <Skeleton className="h-[128px] w-[128px] rounded-md"/>
                    </div>
                    {/*Station Description*/}
                    <div className="h-[72px] flex items-center w-full">
                        <Skeleton className="h-9 w-1/2 mx-auto rounded-full"/>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col gap-8 items-center w-full">

                        {/*Audio Player*/}
                        <Skeleton className="h-[54px] w-[300px] rounded-full"/>
                        <p className="text-muted-foreground font-bold animate-pulse">Loading Radio Station ...</p>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}