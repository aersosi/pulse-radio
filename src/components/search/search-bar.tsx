"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";
import { Search, Clock, X, Trash2 } from "lucide-react";
import { useRecentSearches } from "@/lib/hooks";
import { RecentSearchesPopover } from "@/components/search/recent-searches-popover";

export default function SearchBar({initialValue = ""}: { initialValue?: string }) {
    const [searchQuery, setSearchQuery] = useState(initialValue);
    const [showPopover, setShowPopover] = useState(false);
    const searchBarRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const {
        recentSearches,
        addNewSearch,
        removeSingleSearch,
        clearAllSearches,
        hasSearches
    } = useRecentSearches();

    // Schließen des Popovers bei Klick außerhalb
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setShowPopover(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Suchformular absenden
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            addNewSearch(searchQuery.trim());
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowPopover(false);
        }
    };

    // Gespeicherte Suche auswählen
    const selectSearch = (query: string) => {
        setSearchQuery(query);
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setShowPopover(false);
    };

    // Eine Suchanfrage aus der Historie entfernen
    const handleremoveSingleSearch = (e: React.MouseEvent, query: string) => {
        e.stopPropagation();
        removeSingleSearch(query);
    };

    // Alle Suchanfragen löschen
    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        clearAllSearches();
        setShowPopover(false);
        inputRef.current?.focus();
    };

    return (
        <div ref={searchBarRef} className="relative flex grow items-center">
            <form onSubmit={handleSubmit} className="w-full">
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

            {hasSearches && showPopover && (
                <RecentSearchesPopover
                    recentSearches={recentSearches}
                    onClearAll={handleClearAll}
                    onSelect={selectSearch}
                    onRemove={handleremoveSingleSearch}/>
            )}
        </div>
    );
}