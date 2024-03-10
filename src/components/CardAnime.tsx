import blurDataUrl from "@/data/blur-data-url";
import { CardAnimeProps } from "@/interfaces";
import strLimit from "@/utils/strLimit";
import Image from "next/image";
import Link from "next/link";

const CardAnime = ({ src, alt, title, path }: CardAnimeProps): JSX.Element => (
  <div className="bg-cover bg-center h-full bg-no-repeat selection:bg-violet-500 rounded overflow-hidden bg-slate-700">
    <div className="min-w-full h-full py-3">
      <Link href={path}>
        <div className="cursor-pointer group px-2 relative min-h-full">
          <div className="group px-1 relative min-h-full flex flex-col gap-4">
            <Image
              placeholder="blur"
              blurDataURL={blurDataUrl}
              src={src}
              alt={alt || "thumbnail"}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
              className="rounded-sm"
              loading="lazy"
            />
            <p className="text-white group-hover:text-teal-300 tracking-wide transition-colors duration-300 selection:bg-teal-500 selection:text-teal-800 block font-semibold">
              {strLimit(title, 40)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  </div>
);

export default CardAnime;
