import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";
import placeholderImage from "public/images/no-image-available.webp"
import pulseLogo from "public/images/pulse_logo_128.png"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        absolute: "",
        default: "Pulse Radio",
        template: "Pulse Radio | %s"

    },
    description: "Your pulse, in tune with the music",
};

export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} antialiased flex flex-col`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <header className="container mx-auto flex p-4 justify-between">
                <div className="flex gap-4 items-center">
                    <Image
                        className="w-8 h-8"
                        src={pulseLogo.src || placeholderImage.src}
                        alt={pulseLogo.src ? "Pulse radio logo" : "No image available"}
                        width={128}
                        height={128}
                        sizes="32px"
                        placeholder="blur"
                        blurDataURL={pulseLogo.blurDataURL}
                    />
                    <h1 className="text-2xl font-bold">Pulse Radio</h1>
                </div>
                <ModeToggle></ModeToggle>
            </header>
            <main className="grow container mx-auto px-4 flex flex-col gap-6">
                {children}
            </main>
            <footer className="text-center p-4 text-muted-foreground">
                Pulse Radio © Copyright {new Date().getFullYear()} by Arthur Ersosi. All rights reserved.
            </footer>
        </ThemeProvider>
        </body>
        </html>
    );
}
