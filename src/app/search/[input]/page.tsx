import CardAnime from "@/components/CardAnime";
import { axiosInstance } from "@/config";
import { ResponseGetAllType } from "@/interfaces";

const SearchAnime = async (props: any): Promise<JSX.Element> => {
  const { input } = props.params;
  const { data: getSearchAnime } = await axiosInstance.get(
    `/search/${input.split("%2B").join("+") as string}`
  );
  const anime = getSearchAnime.data;

  return (
    <section className="min-w-full pt-4 pb-8 !h-full">
      <div className="container flex items-center pt-4 md:pt-2 px-4 mb-5 md:px-0">
        <h1 className="text-3xl md:text-4xl text-sky-300 selection:bg-emerald-500 selection:text-emerald-900 font-bold">
          Hasil pencarian {input.split("%2B").join(" ")}
        </h1>
      </div>
      <div className="container px-4 md:px-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 my-3">
        {anime.map((item: ResponseGetAllType, index: number) => (
          <CardAnime
            key={index}
            path={`/anime/${item?.link?.endpoint}`}
            src={item?.link?.image}
            title={item?.title}
            alt={item?.title}
          />
        ))}
      </div>
    </section>
  );
};

export default SearchAnime;
