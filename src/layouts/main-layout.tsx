import Navbar from "@/components/navbar";
import { ChildrenProps } from "@/interfaces";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import FloatingTopButton from "@/components/floating-top-button";
import KeyboardNavigation from "@/components/keyboard-navigation";
import OfflineIndicator from "@/components/offline-indicator";
import StaleDataBanner from "@/components/stale-data-banner";
import { DeferredPwaInstallBanner } from "@/components/deferred-pwa-banner";

import { HoneypotTrap } from "@/components/honeypot-trap";

const MainLayout = ({ children }: ChildrenProps) => (
  <>
    <HoneypotTrap />
    <a
      href="#konten"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:font-bold focus:text-(--accent-ink) focus:shadow-[4px_4px_0_0_var(--border)] focus:outline-none"
    >
      Lompat ke konten utama
    </a>
    <ScrollToTop />
    <KeyboardNavigation />
    <OfflineIndicator />
    <StaleDataBanner />
    <DeferredPwaInstallBanner />
    <Navbar />
    <main id="konten" tabIndex={-1} className="flex-auto">
      {children}
    </main>
    <Footer />
    <FloatingTopButton />
  </>
);

export default MainLayout;
