import { Button } from "@/components";
import Layout from "@/layout";
import Link from "next/link";

const NotFound = () => (
  <Layout>
    <section className="flex flex-col items-center justify-center">
      <h1 className="text-3xl md:text-4xl font-medium mb-4">
        Not Found this URL :(
      </h1>
      <Link href="/" passHref>
        <Button>
          <a className="mx-7">Back to Home</a>
        </Button>
      </Link>
    </section>
  </Layout>
);

export default NotFound;
