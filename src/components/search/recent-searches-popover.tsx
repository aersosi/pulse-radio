"use client";

import { useRef } from "react";
import { Button } from "@/components/ui";
import { Clock, Trash2 } from "lucide-react";
import { RecentSearchItem } from "./recent-search-item";

interface RecentSearchesPopoverProps {
    recentSearches: string[];
    onClearAll: (e: React.MouseEvent) => void;
    onSelect: (query: string) => void;
    onRemove: (e: React.MouseEvent, query: string) => void;
}

export function RecentSearchesPopover({
                                          recentSearches,
                                          onClearAll,
                                          onSelect,
                                          onRemove
                                      }: RecentSearchesPopoverProps) {
    const popoverRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={popoverRef}
            className="absolute top-full left-0 mt-1 w-full rounded-md border bg-popover p-0 text-popover-foreground shadow-md z-50 animate-in fade-in-0 zoom-in-95"
        >
            <div className="max-h-[300px] overflow-auto">
                <div className="flex items-center justify-between py-2 pr-2 pl-4 border-b">
                    <span className="text-xs font-medium flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4"/>
                        Recent Searches
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearAll}
                        className="text-xs hover:text-destructive-foreground"
                    >
                        <Trash2/>
                        Clear All
                    </Button>
                </div>
                <ul className="p-1">
                    {recentSearches.map((search, index) => (
                        <RecentSearchItem
                            key={`${search}-${index}`}
                            search={search}
                            onSelect={onSelect}
                            onRemove={onRemove}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}