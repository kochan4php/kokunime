import CardAnime from "@/components/CardAnime";
import MainController from "@/controllers/main.controller";
import { AnimeType } from "@/interfaces";
import MainLayout from "@/layouts/MainLayout";
import { JSX } from "react";

const SearchAnime = async (props: any): Promise<JSX.Element> => {
  const { input } = await props.params;
  const anime: AnimeType[] = await MainController.searchAnime(`${input.split("%2B").join("+")}`);

  return (
    <MainLayout>
      <section className="min-w-full pt-4 pb-8">
        <div className="container flex items-center pt-4 md:pt-2 px-4 md:px-8 mb-5">
          <h1 className="text-3xl text-sky-300 selection:bg-emerald-500 selection:text-emerald-900 font-bold tracking-wide">
            Hasil pencarian kamu :
          </h1>
        </div>
        <div className="container px-4 md:px-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 my-3">
          {anime.map((item: AnimeType, index: number) => (
            <CardAnime
              key={index}
              path={`/anime/${item?.link?.endpoint?.split("/").join(" ").trim()}`}
              src={item?.link?.image as string}
              title={item?.title}
              alt={item?.title}
            />
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default SearchAnime;
