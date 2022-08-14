import Head from "next/head";
import PropTypes from "prop-types";
import { Navbar, Footer } from "../components";

const Layout = ({ children }) => (
  <>
    <Head>
      <title>Kokunime</title>
    </Head>
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <main>{children}</main>
      <Footer className="self-end" />
    </div>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
