"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui";
import { Search } from "lucide-react";

export default function SearchBar({ initialValue = "" }: { initialValue?: string }) {
    const [searchQuery, setSearchQuery] = useState(initialValue);
    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex grow items-center">
            <Input
                type="text"
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
            />
            <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-0 px-3 hover:bg-transparent"
            >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
            </Button>
        </form>
    );
}