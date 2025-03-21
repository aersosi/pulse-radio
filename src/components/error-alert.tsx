"use client"

import { X, AlertCircle } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface InlineErrorProps {
    title?: string;
    description?: string;
    onClose?: () => void;
}

export function InlineError({title = "Error", description, onClose,}: InlineErrorProps) {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) {
            onClose();
        }
    };

    if (!isVisible) {
        return null;
    }

    return (
        <Alert variant="destructive" className="relative">
            <AlertCircle className="h-4 w-4"/>
            <AlertTitle>{title}</AlertTitle>
            {description && <AlertDescription>{description}</AlertDescription>}
            <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-7 w-7 p-0"
                onClick={handleClose}
            >
                <X className="h-4 w-4"/>
                <span className="sr-only">Close</span>
            </Button>
        </Alert>
    );
}