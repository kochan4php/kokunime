import Navbar from "@/components/navbar";
import { ChildrenProps } from "@/interfaces";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

const MainLayout = ({ children }: ChildrenProps) => (
  <>
    <ScrollToTop />
    <Navbar />
    <main className="flex-auto">{children}</main>
    <Footer />
  </>
);

export default MainLayout;
