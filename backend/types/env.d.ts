export interface Env {
    (key: string, defaultValue?: string): string;
    bool: (key: string, defaultValue?: boolean) => boolean;
    int: (key: string, defaultValue?: number) => number;
    array: (key: string, separator?: string) => string[];
}