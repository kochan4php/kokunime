import { RecoilRoot } from "recoil";
import { Footer, Navbar } from "../components";
import Layout from "../layout";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }) => (
  <RecoilRoot>
    <Layout>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </Layout>
  </RecoilRoot>
);

export default MyApp;
