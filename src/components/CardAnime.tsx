import { CardAnimeProps } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";

export default function CardAnime({
    src,
    alt,
    title,
    path,
}: CardAnimeProps): JSX.Element {
    return (
        <div className="bg-cover bg-center h-full bg-no-repeat selection:bg-violet-500 rounded overflow-hidden bg-slate-700">
            <div className="min-w-full h-full py-4">
                <Link href={path}>
                    <div className="cursor-pointer group px-2 relative min-h-full">
                        <div className="group px-2 relative min-h-full">
                            <Image
                                src={src}
                                alt={alt || "thumbnail"}
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: "100%", height: "auto" }}
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
