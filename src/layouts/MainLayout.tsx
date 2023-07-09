import Navbar from "@/components/Navbar";
import { ChildrenProps } from "../interfaces/index";
import Footer from "@/components/Footer";

const MainLayout = ({ children }: ChildrenProps) => (
  <>
    <Navbar />
    <main className="flex-auto">{children}</main>
    <Footer />
  </>
);

export default MainLayout;
