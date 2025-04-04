import { z } from "zod";
import { STATIONS_PER_PAGE } from "@/lib/constants";

export const searchSchema = z.object({
    query: z.string()
        .min(1, "Search query cannot be empty")
        .max(128, "Search query can only be max 128 characters")
        .trim()
        .refine(s => !(/<[^>]*>?/gm.test(s)), "Query cannot contain HTML tags.")
        .default(""),
    count: z.coerce.number()
        .int("Station Count must be an integer")
        .nonnegative("Station Count can not be negative")
        .min(1, "Search query cannot be empty")
        .max(10, "Max 10 Stations allowed")
        .default(STATIONS_PER_PAGE),
    offset: z.coerce.number()
        .int("Station Offsets must be an integer")
        .nonnegative("Station Offsets can not be negative")
        .optional()
        .default(0),
});

export const stationsSchema = z.object({
    count: z.number().int().positive().optional().default(STATIONS_PER_PAGE),
    offset: z.number().int().nonnegative().optional().default(0),
});

export const stationDetailsSchema = z.object({
    stationId: z.string().min(1, "Station ID cannot be empty"),
});

