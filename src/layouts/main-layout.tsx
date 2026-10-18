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
