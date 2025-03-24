"use client";

import React, { useEffect, useState } from "react";
import { get5Stations, totalCount } from "@/lib/api";
import { Station } from "@/lib/definitions";
import StationList from "@/components/StationList";
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
                <div className="flex justify-between items-center gap-4 flex-col md:flex-row">
                    <div className="flex gap-4 items-center">
                        <img
                            className="w-8 h-8"
                            src={"/pulse_logo_32.png"}
                            alt={"Pulse radio logo"}
                        />
                        <h1 className="text-2xl font-bold">{isLoading ? "Loading Radio Stations" : "Top Radio Stations"}</h1>
                    </div>
                    <div className="flex gap-4 text-xl font-bold">
                        {isLoading ? "" : <p>{`Station: ${offset + 1} - ${offset + 5}`}</p>}
                        {totalCountValue > 0 ?
                            <p className="font-light text-muted-foreground">Total: {totalCountValue}</p> : ""}
                    </div>
                </div>
            </header>

            {error && <div className="text-red-500">{error}</div>}

            <main className="container mx-auto px-4">
                <StationList stations={stations} isLoading={isLoading}/>
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