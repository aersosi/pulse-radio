"use client";

import { Button } from "@/components/ui";
import { X } from "lucide-react";

interface RecentSearchItemProps {
    search: string;
    onSelect: (query: string) => void;
    onRemove: (e: React.MouseEvent, query: string) => void;
}

export function RecentSearchItem({ search, onSelect, onRemove }: RecentSearchItemProps) {
    return (
        <li
            className="flex items-center justify-between pl-3 py-1 hover:bg-accent cursor-pointer rounded-md"
            onClick={() => onSelect(search)}
        >
            <span className="truncate">{search}</span>
            <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(e, search);
                }}
                className="hover:text-destructive-foreground"
            >
                <X/>
                <span className="sr-only">Remove</span>
            </Button>
        </li>
    );
}