import type {Metadata} from "next";
import {Geist} from "next/font/google";
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
        <html lang="en" className="light">
        <body
            className={`${geistSans.variable} antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
