import { memo } from "react";
import Link from "next/link";

const Footer = () => (
  <footer className="px-4 py-3 md:py-4 text-center text-white min-w-full bg-gradient-to-r from-gray-900 to-gray-800 border-t border-slate-600 border-opacity-60">
    <div className="container">
      <div className="flex justify-between items-center w-full gap-4">
        <h1 className="text-center bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent font-semibold text-2xl md:text-3xl">
          <Link href="/">
            <a className="selection:bg-yellow-700 selection:text-yellow-400">
              Kokunime
            </a>
          </Link>
        </h1>
        <p className="text-lg md:text-xl selection:bg-purple-500 selection:text-purple-900">
          &copy; 2022&nbsp;
          <Link href="https://github.com/kochan4php">
            <a
              target="_blank"
              className="hover:text-sky-500 transition-colors duration-200"
            >
              Kochan.php
            </a>
          </Link>
        </p>
      </div>
    </div>
  </footer>
);

export default memo(Footer);
