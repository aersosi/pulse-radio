"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";
import { Search } from "lucide-react";
import { useRecentSearches } from "@/lib/hooks";
import { RecentSearchesPopover } from "@/components/search/recent-searches-popover";
import { Popover, PopoverAnchor, PopoverTrigger } from "@/components/ui/popover";

export default function SearchBar({initialValue = ""}: { initialValue?: string }) {
    const [searchQuery, setSearchQuery] = useState(initialValue);
    const [showPopover, setShowPopover] = useState(false);
    const searchBarRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputWidth, setInputWidth] = useState<number | null>(null);
    const router = useRouter();

    const {
        recentSearches,
        addNewSearch,
        removeSingleSearch,
        clearAllSearches,
        hasSearches,
    } = useRecentSearches();

    const updateInputWidth = () => {
        if (inputRef.current) setInputWidth(inputRef.current.offsetWidth);
    };

    useEffect(() => {
        updateInputWidth();

        const resizeObserver = new ResizeObserver(() => updateInputWidth());
        if (inputRef.current) {
            resizeObserver.observe(inputRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchBarRef.current &&
                !searchBarRef.current.contains(event.target as Node) &&
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node)
            ) {
                setShowPopover(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            addNewSearch(searchQuery.trim());
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowPopover(false);
        }
    };

    const selectSearch = (query: string) => {
        setSearchQuery(query);
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setShowPopover(false);
    };

    const handleremoveSingleSearch = (e: React.MouseEvent, query: string) => {
        e.stopPropagation();
        removeSingleSearch(query);
    };

    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        clearAllSearches();
        setShowPopover(false);
        inputRef.current?.focus();
    };

    return (
        <div ref={searchBarRef} className="relative flex grow items-center">
            <Popover open={showPopover}>
                <PopoverTrigger asChild>
                <form onSubmit={handleSubmit} className="w-full relative">
                    <PopoverAnchor ref={inputRef} className="absolute bottom-0"/>

                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Search stations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => hasSearches && setShowPopover(true)}
                        onClick={() => hasSearches && setShowPopover(true)}
                        className="pl-4"
                    />
                    <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-[2px] px-3 hover:bg-transparent"
                    >
                        <Search/>
                        <span className="sr-only">Search</span>
                    </Button>
                </form>
            </PopoverTrigger>

                {hasSearches && showPopover && (
                    <RecentSearchesPopover
                        ref={popoverRef}
                        width={inputWidth}
                        recentSearches={recentSearches}
                        onClearAll={handleClearAll}
                        onSelect={selectSearch}
                        onRemove={handleremoveSingleSearch}
                    />
                )}
            </Popover>
        </div>
    );
}