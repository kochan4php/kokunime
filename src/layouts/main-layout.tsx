import Navbar from "@/components/navbar";
import { ChildrenProps } from "@/interfaces";
import Footer from "@/components/footer";

const MainLayout = ({ children }: ChildrenProps) => (
  <>
    <Navbar />
    <main className="flex-auto">{children}</main>
    <Footer />
  </>
);

export default MainLayout;
