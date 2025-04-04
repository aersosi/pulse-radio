import { z } from "zod";
import { STATIONS_PER_PAGE } from "@/lib/constants";

export const searchSchema = z.object({
    query: z.string()
        .min(1)
        .max(128)
        .trim()
        .refine(s => !(/<[^>]*>?/gm.test(s)), {
            message: "Query cannot contain HTML tags."
        })
        .default(""),
    count: z.coerce.number()
        .int()
        .min(1)
        .max(10)
        .default(STATIONS_PER_PAGE),
    offset: z.coerce.number()
        .int()
        .min(0)
        .default(0),
});