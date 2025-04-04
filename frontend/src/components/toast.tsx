"use client";

import { useEffect } from 'react';
import { toast } from "sonner";
import { ErrorType } from "@/lib/definitions";

export function Toast({ error }: { error: ErrorType }) {
    useEffect(() => {
        let toastIds: (string | number)[] = [];

        if (error.details && Array.isArray(error.details)) {
            // Show each validation error as separate toast with main message included
            error.details.forEach((err, index) => {
                setTimeout(() => {
                    const errorMessage = (
                        <div>
                            <p className="font-semibold">{error.message}</p>
                            <p>{`${err.path.join('.')}: ${err.message}`}</p>
                        </div>
                    );

                    const id = toast.error(errorMessage, {
                        action: {
                            label: 'Close',
                            onClick: () => toast.dismiss(id)
                        },
                    });
                    toastIds.push(id);
                }, index * 100);
            });
        }
        return () => {
            toastIds.forEach(id => toast.dismiss(id));
        };
    }, [error]);

    return null;
}