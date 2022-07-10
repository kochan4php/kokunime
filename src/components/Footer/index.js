import Link from "next/link";
import { memo } from "react";
import { For } from "../../utils";
import SocialMedia from "./SocialMedia";

const Footer = () => (
  <footer>
    <div className="p-4 md:py-6 text-center text-white min-w-full bg-gradient-to-r from-gray-900 to-gray-800 border-t border-slate-600 border-opacity-60">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-5">
          <section>
            <h1 className="text-center bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent font-semibold text-2xl md:text-3xl">
              <Link href="/">
                <a className="selection:bg-yellow-700 selection:text-yellow-400">
                  Kokunime
                </a>
              </Link>
            </h1>
          </section>
          <section>
            <div className="flex gap-5">
              <For
                each={SocialMedia}
                render={({ sosmedName, sosmedPath, sosmedIcon }) => (
                  <Link href={sosmedPath} key={sosmedName}>
                    <a
                      target="_blank"
                      className="text-xl md:text-2xl hover:text-sky-500 transition-colors duration-200"
                    >
                      {sosmedIcon}
                    </a>
                  </Link>
                )}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  </footer>
);

export default memo(Footer);
