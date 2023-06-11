import Link from "next/link";

const Footer = (): JSX.Element => {
    return (
        <footer>
            <div className="p-4 text-center text-white min-w-full bg-gradient-to-r from-gray-900 to-gray-800 border-t border-slate-600 border-opacity-60">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-center items-center w-full gap-5">
                        <section>
                            <h1 className="text-center bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent font-bold text-2xl md:text-3xl">
                                <Link
                                    href="/"
                                    className="selection:bg-yellow-700 selection:text-yellow-400"
                                >
                                    Kokunime
                                </Link>
                            </h1>
                        </section>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
