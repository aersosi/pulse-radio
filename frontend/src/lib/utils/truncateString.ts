export const truncateEnd = (input: string, length: number = 100) =>
    input?.length > length ? `${input.substring(0, length)}...` : input;

export const truncateStart = (input: string, length: number = 100) =>
    input.length > length ? `... ${input.substring(length)}` : input;