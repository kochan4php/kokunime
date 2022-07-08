import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAnimeSearch } from "../../action";
import {
  AlertWarning,
  Loading,
  MainCard,
  TitleSection,
} from "../../components";
import Layout from "../../layout";
import { For, RenderIfFalse, RenderIfTrue } from "../../utils";

const SearchAnime = () => {
  const router = useRouter();
  const { inputValue } = router.query;
  const value = inputValue?.split(" ")?.join("%20");

  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async (keyword) => {
    const res = await getAnimeSearch(keyword);
    if (res.status === 200) {
      if (res.data.success !== false) {
        setAnime(res.data);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getData(value);
  }, [inputValue, value]);

  return (
    <Layout>
      <section className="min-w-full bg-gradient-to-tl from-slate-900 via-slate-800 to-slate-900 pt-4 pb-8 min-h-screen">
        <div className="container flex items-center pt-4 pb-6">
          <TitleSection>Result of {inputValue}</TitleSection>
        </div>
        <RenderIfTrue isTrue={isLoading}>
          <Loading />
        </RenderIfTrue>
        <RenderIfFalse isFalse={isLoading}>
          <RenderIfTrue isTrue={anime.length > 0}>
            <div className="container px-0 lg:px-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6 my-3">
                <For
                  each={anime}
                  render={(data, index) => (
                    <MainCard
                      key={index}
                      path={`/details/${data?.link?.endpoint}`}
                      id={index}
                      image={data?.link?.thumbnail}
                      title={data?.title}
                      py="py-5"
                      fontsize="text-base"
                    />
                  )}
                />
              </div>
            </div>
          </RenderIfTrue>
          <RenderIfFalse isFalse={anime.length > 0}>
            <AlertWarning
              message={`Anime dengan judul ${inputValue} tidak ada.`}
            />
          </RenderIfFalse>
        </RenderIfFalse>
      </section>
    </Layout>
  );
};

export default SearchAnime;
