"use client"

import {get5Stations, totalCount} from "@/lib/api";
import StationList from "@/components/StationList";
import {Station} from "@/lib/definitions";
import {useEffect, useState} from "react";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";


export default function Home() {
    const [stations, setStations] = useState<Station[]>([]);
    const [offset, setOffset] = useState(0);
    const [page, setPage] = useState(1);
    const [totalCountValue, setTotalCountValue] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStations = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const newStations = await get5Stations(5, offset);
                setStations(newStations);

                const count = await totalCount();
                setTotalCountValue(count);
            } catch (error) {
                setError('Failed to load stations');
                console.error('Failed to fetch stations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStations();
    }, [offset]);

// In your render method
    {error && <div className="text-red-500">{error}</div>}

    const handlePrev = () => {
        if (page > 1) {
            setPage(page - 1);
            setOffset((prevOffset) => prevOffset - 5);
        }
    };

    const handleNext = () => {
        setPage(page + 1);
        setOffset((prevOffset) => prevOffset + 5);
    };

    const handleGoToPage = (newPage: number) => {
        setPage(newPage);
        setOffset((newPage - 1) * 5);
    };

    return (
        <div className="flex flex-col gap-8 py-4 font-[family-name:var(--font-geist-sans)]">
            <header className="container mx-auto px-4">
                <div className="flex justify-between items-baseline gap-4">
                    <h1 className="text-2xl font-bold">{isLoading ? "Loading Radio Stations" : "Top Radio Stations"}</h1>
                    <div className="flex gap-4 text-xl font-bold">
                        {isLoading ? "" : <p>{`Station: ${offset + 1} - ${offset + 5}`}</p>}
                        {totalCountValue > 0 ? <p className="font-light text-muted-foreground">Total: {totalCountValue}</p> : "" }
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4">
                <StationList stations={stations} isLoading={isLoading} />
            </main>
            <footer className="container mx-auto px-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem className="cursor-pointer">
                            <PaginationPrevious onClick={handlePrev}/>
                        </PaginationItem>
                        {[...Array(5)].map((_, index) => {
                            const pageNumber = page + index - 2;
                            if (pageNumber <= 0) return null;
                            return (
                                <PaginationItem key={pageNumber} className="cursor-pointer">
                                    <PaginationLink
                                        onClick={() => handleGoToPage(pageNumber)}
                                        isActive={pageNumber === page}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}
                        <PaginationItem>
                            <PaginationEllipsis/>
                        </PaginationItem>
                        <PaginationItem className="cursor-pointer">
                            <PaginationNext onClick={handleNext}/>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </footer>
        </div>
    );
}