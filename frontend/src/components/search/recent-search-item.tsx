"use client";

import React from "react";
import { Button } from "@/components/ui";
import { X } from "lucide-react";
import { RecentSearchItemProps } from "@/lib/definitions";


export function RecentSearchItem({search, onSelect, onRemove}: RecentSearchItemProps) {

    const handleReturnSearchItem = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(e, search);
    }

    return (
        <li
            className="flex items-center justify-between pl-2 py-1 transition-colors hover:bg-accent [&:has(button:hover)]:bg-red-500/10 cursor-pointer rounded-md"
            onClick={() => onSelect(search)}
        >
            <span className="truncate">{search}</span>
            <Button
                variant="transparentDestructive"
                size="xs"
                onClick={handleReturnSearchItem}
            >

                <X/>
                <span className="sr-only">Remove</span>
            </Button>
        </li>
    );
}