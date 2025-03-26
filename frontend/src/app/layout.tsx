import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeDropdown } from "@/components/theme-dropdown";
import SearchBar from "@/components/search/search-bar";
import placeholderImage from "public/images/no-image-available.webp"
import pulseLogo from "public/images/pulse_logo_128.png"
import "./globals.css";

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
        <body className={`${geistSans.variable} antialiased flex flex-col`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="fludidContainer grow mx-auto flex flex-col">
                <header className="flex flex-col sm:flex-row gap-4 p-4 justify-between ">
                    <div className="flex gap-4 items-center">
                        <Link href={"/"} className="flex gap-3">
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
                        </Link>
                    </div>
                    <div className="flex gap-2 grow md:grow-0 md:w-1/2">
                        <SearchBar/>
                        <ThemeDropdown></ThemeDropdown>
                    </div>
                </header>
                <main className="grow px-4 flex flex-col gap-6">
                    {children}
                </main>
                <footer className="text-center text-sm p-4 text-muted-foreground transition hover:text-green-500">
                    Pulse Radio © Copyright {new Date().getFullYear()} by Arthur Ersosi. All rights reserved.
                </footer>
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}
