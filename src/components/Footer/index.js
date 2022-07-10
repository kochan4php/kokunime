import { memo } from "react";
import Link from "next/link";
import { BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";
import { SiMyanimelist } from "react-icons/si";

const Footer = () => (
  <footer>
    <div className="p-4 md:py-4 text-center text-white min-w-full bg-gradient-to-r from-gray-900 to-gray-800 border-t border-slate-600 border-opacity-60">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-5">
          <h1 className="text-center bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent font-semibold text-2xl md:text-3xl">
            <Link href="/">
              <a className="selection:bg-yellow-700 selection:text-yellow-400">
                Kokunime
              </a>
            </Link>
          </h1>
          <div className="flex gap-5">
            <Link href="https://github.com/kochan4php">
              <a
                target="_blank"
                className="text-xl md:text-2xl hover:text-sky-500 transition-colors duration-200"
              >
                <BsGithub />
              </a>
            </Link>
            <Link href="https://instagram.com/kochan.php">
              <a
                target="_blank"
                className="text-xl md:text-2xl hover:text-sky-500 transition-colors duration-200"
              >
                <BsInstagram />
              </a>
            </Link>
            <Link href="https://twitter.com/deo_sbrn">
              <a
                target="_blank"
                className="text-xl md:text-2xl hover:text-sky-500 transition-colors duration-200"
              >
                <BsTwitter />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default memo(Footer);
