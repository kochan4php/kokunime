import { Metadata } from "next";
import { JSX, ReactNode } from "react";

// The offline fallback is never a search result.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Offline · Kokunime",
};

const OfflineLayout = ({ children }: { children: ReactNode }): JSX.Element => <>{children}</>;

export default OfflineLayout;
