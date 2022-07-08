import Head from "next/head";
import PropTypes from "prop-types";
import { Navbar, Footer } from "../components";

const Layout = ({ children }) => (
  <>
    <Head>
      <title>Kokunime</title>
      <meta name="description" content="Kokunime" />
      <link rel="icon" href="favicon.ico" />
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />
      <meta
        name="keywords"
        content="Kokunime, kokunime, website download anime, download batch anime, download anime, download anime terlengkap, website download anime terlengkap"
      />
    </Head>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
