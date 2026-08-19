import Navbar from "@/components/navbar";
import { ChildrenProps } from "@/interfaces";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import FloatingTopButton from "@/components/floating-top-button";
import KeyboardNavigation from "@/components/keyboard-navigation";
import OfflineIndicator from "@/components/offline-indicator";
import { PwaInstallBanner } from "@/components/pwa-install-banner";

const MainLayout = ({ children }: ChildrenProps) => (
  <>
    <a
      href="#konten"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:font-bold focus:text-(--accent-ink) focus:shadow-2xl focus:outline-none"
    >
      Lompat ke konten utama
    </a>
    <ScrollToTop />
    <KeyboardNavigation />
    <OfflineIndicator />
    <PwaInstallBanner />
    <Navbar />
    <main id="konten" tabIndex={-1} className="flex-auto">
      {children}
    </main>
    <Footer />
    <FloatingTopButton />
  </>
);

export default MainLayout;
