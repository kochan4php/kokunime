import CardAnime from "@/components/CardAnime";
import AnimeController from "@/controllers/AnimeController";
import { AnimeType } from "@/interfaces";

const SearchAnime = async (props: any): Promise<JSX.Element> => {
  const { input } = props.params;
  const anime = await AnimeController.searchAnime(
    input.split("%2B").join("+") as string
  );

  return (
    <section className="min-w-full pt-4 pb-8">
      <div className="container flex items-center pt-4 md:pt-2 px-4 mb-5 md:px-0">
        <h1 className="text-3xl md:text-4xl text-sky-300 selection:bg-emerald-500 selection:text-emerald-900 font-bold">
          Hasil pencarian kamu :
        </h1>
      </div>
      <div className="container px-4 md:px-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 my-3">
        {anime.map((item: AnimeType, index: number) => (
          <CardAnime
            key={index}
            path={`/anime/${item?.link?.endpoint}`}
            src={item?.link?.image as string}
            title={item?.title}
            alt={item?.title}
          />
        ))}
      </div>
    </section>
  );
};

export default SearchAnime;
