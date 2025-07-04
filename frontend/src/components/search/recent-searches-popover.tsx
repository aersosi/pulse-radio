"use client";

import { forwardRef } from "react";
import { Button } from "@/components/ui";
import { Clock, Trash2 } from "lucide-react";
import { RecentSearchItem } from "./recent-search-item";
import { PopoverContent } from "@/components/ui/popover";
import { RecentSearchesPopoverProps } from "@/lib/definitions";

export const RecentSearchesPopover = forwardRef<HTMLDivElement, RecentSearchesPopoverProps>(
    ({ width, recentSearches, onRemoveAll, onRemove, onSelect }, ref) => {
        return (
            <PopoverContent
                ref={ref}
                align="start"
                sideOffset={4}
                style={{width: width ? `${width}px` : "auto"}}
                className="p-0"
            >
                <div className="flex items-center justify-between py-2 pr-1 pl-3 border-b">
                    <span className="text-xs font-medium flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4"/>
                        Recent Searches
                    </span>
                    <Button
                        variant="ghostDestructive"
                        size="xs"
                        onClick={onRemoveAll}
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
            </PopoverContent>
        );
    }
);

RecentSearchesPopover.displayName = "RecentSearchesPopover";