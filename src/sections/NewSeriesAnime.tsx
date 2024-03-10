import MainController from "@/controllers/main.controller";
import blurDataUrl from "@/data/blur-data-url";
import { AnimeType } from "@/interfaces";
import strLimit from "@/utils/strLimit";
import Image from "next/image";
import Link from "next/link";

const NewSeriesAnime = async (props: any): Promise<JSX.Element> => {
  const slug: string = props.slug;
  const getNewSeriesAnime = await MainController.getAnimePerPage(1);
  const newSeriesAnime = getNewSeriesAnime.anime?.filter((data: AnimeType) => !data?.link?.endpoint?.includes(slug));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4">
      {newSeriesAnime?.map((item: AnimeType, index: number) => (
        <div className="w-full grid grid-cols-3 gap-3 pt-4 group" key={index}>
          <div className="selection:bg-violet-500 rounded overflow-hidden bg-slate-700 min-w-full h-full py-3">
            <Link href={`/anime/${item.link.endpoint?.split("/").join(" ").trim()}`}>
              <div className="cursor-pointer px-2.5 relative min-h-full flex">
                <Image
                  src={item.link.image as string}
                  alt="thumbnail"
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="rounded-sm"
                  style={{ width: "100%", height: "auto" }}
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                  loading="lazy"
                />
              </div>
            </Link>
          </div>
          <div className="col-span-2 py-2">
            <Link
              href={`/anime/${item.link.endpoint}`}
              className="text-base md:text-lg font-semibold group-hover:text-pink-500 transition-colors duration-300"
            >
              {strLimit(item.title, 45)}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewSeriesAnime;
