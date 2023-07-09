"use client"; // Error components must be Client Components

const Error = (): JSX.Element => (
  <div className="min-h-screen flex flex-col justify-center items-center gap-6">
    <h2 className="text-3xl font-bold">
      Something went wrong! Try again later.
    </h2>
    <button
      onClick={() => window.location.reload()}
      className="px-3 py-1.5 mx-7 rounded text-slate-5 active:ring active:ring-sky-500 hover:border-sky-500 border-2 border-transparent transition-all duration-300 selection:bg-orange-500 selection:text-orange-900 text-base md:text-lg font-semibold bg-slate-900"
    >
      Or try again now
    </button>
  </div>
);

export default Error;
