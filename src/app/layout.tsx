import { ChildrenProps } from "@/interfaces";
import { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import "./globals.css";
import Loading from "./loading";

export const metadata: Metadata = {
    title: "Kokunime",
    description: "Website download anime dan baca manga",
    openGraph: {
        title: "Kokunime",
        description: "Website buat download anime dan baca manga tanpa iklan 😎",
        url: "https://kokunime.netlify.app",
        siteName: "Kokunime",
        images: [
            {
                url: "https://kokunime.netlify.app/farhan-kebab.jpg",
                alt: "Alt nya kalo preview gambarnya ga ada hehe",
            },
            {
                url: "https://kokunime.netlify.app/ironi-mamah-aku-takut.jpg",
                alt: "Alt nya kalo preview gambarnya ga ada hehe",
            },
            {
                url: "https://kokunime.netlify.app/haah-lah.jpg",
                alt: "Alt nya kalo preview gambarnya ga ada hehe",
            },
            {
                url: "https://kokunime.netlify.app/maxresdefault.jpg",
                alt: "Alt nya kalo preview gambarnya ga ada hehe",
            },
        ],
        locale: "en_US",
        type: "website",
    },
};

const RootLayout = ({ children }: ChildrenProps): JSX.Element => (
    <html lang="en" className="scroll-smooth">
        <body
            suppressHydrationWarning
            className="!overflow-x-hidden bg-gradient-to-tl from-slate-900 via-slate-800 to-slate-900 min-h-screen flex flex-col justify-between"
        >
            <NextTopLoader showSpinner={false} />
            <Suspense fallback={<Loading />}>{children}</Suspense>
        </body>
    </html>
);

export default RootLayout;
