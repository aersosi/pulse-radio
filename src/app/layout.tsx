import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";

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
            className={`${geistSans.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <header className="container mx-auto flex p-4 justify-between">
                <div className="flex gap-4 items-center">
                    <Image className="w-8 h-8" width={128} height={128} quality={100}
                           src={"/images/pulse_logo_128.png"} alt={"Pulse radio logo"}/>
                    <h1 className="text-2xl font-bold">Pulse Radio</h1>
                </div>
                <ModeToggle></ModeToggle>
            </header>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
