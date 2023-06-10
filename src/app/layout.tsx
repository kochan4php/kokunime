import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ChildrenProps } from "@/interfaces";
import "./globals.css";

export const metadata = {
    title: "Kokunime",
    description: "Generated by create next app",
};

export default function RootLayout({ children }: ChildrenProps): JSX.Element {
    return (
        <html lang="en">
            <body suppressHydrationWarning>
                <Navbar />
                <div>{children}</div>
                <Footer />
            </body>
        </html>
    );
}
