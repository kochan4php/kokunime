import { ChildrenProps } from "@/interfaces";
import Link from "next/link";

export default function Card({ src, alt, title, path }: any): JSX.Element {
    return (
        <div className="bg-cover bg-center h-full bg-no-repeat selection:bg-violet-500 rounded overflow-hidden bg-slate-700">
            <div className="min-w-full h-full py-4">
                <Link href={path}>
                    <div className="cursor-pointer group px-2 relative min-h-full">
                        <div className="group px-3 relative min-h-full">
                            <img
                                src={src}
                                alt={alt}
                                width="100%"
                                height="100%"
                            />
                            <p
                                className={`text-white group-hover:text-teal-300 tracking-wide transition-colors duration-300 selection:bg-teal-500 selection:text-teal-800 block font-semibold pt-4`}
                            >
                                {title}
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
