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
} from "@/components/ui";
import { STATIONS_PER_PAGE } from "@/lib/constants";

export default function PaginationControls({page, totalCount, isLoading = false, searchParams = {}}: {
    page: number;
    totalCount: number;
    isLoading?: boolean;
    searchParams?: Record<string, string>;
}) {
    const router = useRouter();
    const totalPages = Math.ceil(totalCount / STATIONS_PER_PAGE);

    const getPageRange = () => {
        const range = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            range.push(i);
        }

        return range;
    };

    const goToPage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;

        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
            params.append(key, value);
        });
        params.set('page', newPage.toString());

        router.push(`?${params.toString()}`, {scroll: false});
    };

    if (totalPages <= 1 || totalCount === 0) {
        return null;
    }

    return (
        <Pagination>
            <PaginationContent className={isLoading ? "animate-pulse pointer-events-none" : ""}>
                <PaginationItem className={`cursor-pointer ${page <= 1 ? "opacity-30 pointer-events-none" : ""}`}>
                    <PaginationPrevious onClick={() => goToPage(page - 1)}/>
                </PaginationItem>

                {getPageRange().map(pageNum => (
                    <PaginationItem key={pageNum} className="cursor-pointer">
                        <PaginationLink
                            onClick={() => goToPage(pageNum)}
                            isActive={pageNum === page}
                        >
                            {pageNum}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {Math.max(...getPageRange()) < totalPages && (
                    <PaginationItem className="opacity-30">
                        <PaginationEllipsis/>
                    </PaginationItem>
                )}

                <PaginationItem
                    className={`cursor-pointer ${page >= totalPages ? "opacity-30 pointer-events-none" : ""}`}>
                    <PaginationNext onClick={() => goToPage(page + 1)}/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}