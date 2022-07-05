import { useRouter } from "next/router";
import { Button } from "../components";

const NotFound = () => {
  const router = useRouter();

  return (
    <section className="min-h-screen bg-slate-800">
      <div className="container">
        <div className="min-h-screen flex-col flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-medium mb-4">
            404 Not Found this URL :(
          </h1>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
