"use client";

const Error = (): JSX.Element => (
    <section className="flex flex-col items-start md:items-center justify-center min-h-screen mx-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Something went wrong! Try again later.</h1>
        <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 md:mx-7 rounded text-slate-5 active:ring active:ring-sky-500 hover:border-sky-500 border-2 border-transparent transition-all duration-300 selection:bg-orange-500 selection:text-orange-900 text-base md:text-lg font-semibold bg-slate-900"
        >
            Or try again now
        </button>
    </section>
);

export default Error;
