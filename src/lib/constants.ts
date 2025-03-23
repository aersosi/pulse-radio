export const STATIONS_PER_PAGE = 6;

export const CACHE_TIMES = {
    STATION_DETAILS: 60 * 60 * 24 * 7, // 7 Tage
    STATION_LIST: 60 * 60 * 24,       // 24 Stunden
    SEARCH_RESULTS: 60 * 60,          // 1 Stunde
};

export const MAX_RECENT_SEARCHES = 10;
export const SEARCHES_STORAGE_KEY = "recentSearches";

// AudioPlay
export const START_VOLUME = 0;
export const TARGET_VOLUME = 0.2;
export const VOLUME_CLIMB_DURATION = 2000;
