import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const truncateEnd = (input: string, length: number = 100) =>
    input?.length > length ? `${input.substring(0, length)}...` : input;

export const truncateStart = (input: string, length: number = 100) =>
    input.length > length ? `... ${input.substring(length)}` : input;