import Link from "next/link";

const Footer = () => (
  <footer className="px-4 py-3 md:py-4 text-center text-white min-w-full bg-gradient-to-r from-gray-900 to-gray-800 border-t border-slate-600 border-opacity-60">
    <p className="text-md md:text-lg selection:bg-purple-500 selection:text-purple-900">
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
  </footer>
);

export default Footer;
