"use client";

import { useState, useEffect } from "react";
import { MAX_RECENT_SEARCHES, SEARCHES_STORAGE_KEY } from "../constants";

export function useRecentSearches() {
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(SEARCHES_STORAGE_KEY);
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (error) {
                console.error('Error in useRecentSearches:', error);
                localStorage.removeItem(SEARCHES_STORAGE_KEY);
            }
        }
    }, []);

    const addNewSearch = (query: string) => {
        if (!query.trim()) return;

        const updated = [
            query,
            ...recentSearches.filter(s => s !== query)
        ].slice(0, MAX_RECENT_SEARCHES);

        setRecentSearches(updated);
        localStorage.setItem(SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    };

    const removeSingleSearch = (query: string) => {
        const updated = recentSearches.filter(s => s !== query);
        setRecentSearches(updated);
        localStorage.setItem(SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    };

    const clearAllSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem(SEARCHES_STORAGE_KEY);
    };

    return {
        recentSearches,
        addNewSearch,
        removeSingleSearch,
        clearAllSearches,
        hasSearches: recentSearches.length > 0
    };
}