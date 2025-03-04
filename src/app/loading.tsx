import {Skeleton} from "@/components/ui/skeleton"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

export default function StationLoading() {
    return (
        <main className="container mx-auto p-4 flex flex-col gap-8">
            <div className="h-4"></div>

            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl">
                        {/*Station Name*/}
                        <Skeleton className="h-[40px] w-full"/>
                    </CardTitle>
                    <CardDescription className="text-xl">
                        {/*Station Genre*/}
                        <Skeleton className="h-[28px] w-full"/>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    {/*Station Logo Image*/}
                    <div className="w-32 h-32 mx-auto my-4 relative">
                        <Skeleton className="h-[128px] w-[128px] rounded-md"/>
                    </div>
                    {/*Station Description*/}
                    <div className="text-gray-600">
                        <Skeleton className="h-[] w-full"/>
                    </div>
                </CardContent>
                <CardFooter>
                    {/*Audio Player*/}
                    <Skeleton className="h-[54px] w-[300px] rounded-full"/>
                </CardFooter>
            </Card>
        </main>
    );
}