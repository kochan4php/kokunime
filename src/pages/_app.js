import { Footer, Navbar } from "../components";
import Layout from "../layout";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }) => (
  <Layout>
    <Navbar />
    <Component {...pageProps} />
    <Footer />
  </Layout>
);

export default MyApp;
