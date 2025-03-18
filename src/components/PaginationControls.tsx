"use client";

import { useRouter } from "next/navigation";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { STATIONS_PER_PAGE } from "@/lib/constants";

export default function PaginationControls({page, totalCount, isLoading = false}: {
    page: number;
    totalCount: number;
    isLoading?: boolean
}) {
    const router = useRouter();
    const totalPages = Math.ceil(totalCount / 5);

    const goToPage = (newPage: number) => {
        router.push(`?page=${newPage}`, {scroll: false});
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem className={`cursor-pointer ${page <= 1 ? "opacity-30 pointer-events-none" : ""}`}>
                    <PaginationPrevious onClick={() => goToPage(page - 1)}/>
                </PaginationItem>
                {[...Array(STATIONS_PER_PAGE)].map((_, index) => {
                    const pageNumber = page + index;
                    // boundries for navigation
                    if (pageNumber <= 0 || pageNumber > totalPages || isLoading) return null;
                    return (
                        <PaginationItem key={pageNumber} className="cursor-pointer">
                            <PaginationLink
                                onClick={() => goToPage(pageNumber)}
                                isActive={pageNumber === page}
                            >
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                <PaginationItem className="opacity-30">
                    <PaginationEllipsis/>
                </PaginationItem>
                <PaginationItem
                    className={`cursor-pointer ${page >= totalPages ? "opacity-30 pointer-events-none" : ""}`}>
                    <PaginationNext onClick={() => goToPage(page + 1)}/>
                </PaginationItem>

            </PaginationContent>
        </Pagination>)
}
