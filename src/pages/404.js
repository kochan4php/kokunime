import Link from "next/link";
import { Button } from "../components";

const NotFound = () => (
  <section className="min-h-screen bg-gradient-to-tl from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center">
    <h1 className="text-3xl md:text-4xl font-medium mb-4">
      Not Found this URL :(
    </h1>
    <Link href="/" passHref>
      <Button>
        <a className="mx-7">Back to Home</a>
      </Button>
    </Link>
  </section>
);

export default NotFound;
