import Link from "next/link";

const NotFoundPage = (): JSX.Element => (
    <section className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {"Not Found this Page. Maybe you lost :("}
        </h1>
        <Link
            href="/"
            className="px-3 py-1.5 mx-7 rounded text-slate-5 active:ring active:ring-sky-500 hover:border-sky-500 border-2 border-transparent transition-all duration-300 selection:bg-orange-500 selection:text-orange-900 text-base md:text-lg font-semibold bg-slate-900"
        >
            Back to Home
        </Link>
    </section>
);

export default NotFoundPage;
