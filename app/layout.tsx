import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Agro-Sig 237",
    description: "Cartographie des bassins de production du Cameroun",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
        <body>{children}</body>
        </html>
    );
}