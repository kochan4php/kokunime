import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAnimeWithPagination } from "../action";
import { Button, Loading, MainCard, TitleSection } from "../components";
import Layout from "../layout";
import { For, RenderIfFalse, RenderIfTrue } from "../utils";

const Home = () => {
  const router = useRouter();

  const [anime, setAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    const res = await getAnimeWithPagination();
    if (res.status === 200) {
      if (res.data.success !== false) {
        console.log(res.data);
        setAnime(res.data);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getData();
  }, []);

  return (
    <Layout>
      <section className="min-w-full bg-gradient-to-tl from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen">
        <RenderIfTrue isTrue={isLoading}>
          <Loading />
        </RenderIfTrue>
        <RenderIfFalse isFalse={isLoading}>
          <section
            className="bg-slate-800 min-w-full bg-cover bg-center bg-no-repeat object-cover"
            style={{
              backgroundImage: `url(${anime[0]?.link?.thumbnail})`,
            }}
          >
            <section className="min-h-[40vh] sm:min-h-[50vh] md:min-h-[40vh] lg:min-h-[70vh] xl:min-h-[80vh] 2xl:min-h-[75vh] bg-slate-800 bg-opacity-40 backdrop-blur-lg backdrop-brightness-90 flex items-center justify-start px-2 md:px-6 pb-6">
              <div className="container max-w-full lg:max-w-3xl">
                <div className="my-6">
                  <h1 className="text-slate-50 text-2xl md:text-4xl font-semibold mb-4 selection:bg-red-700 selection:text-red-200">
                    {anime[0]?.title}
                  </h1>
                </div>
                <div className="my-6">
                  <p className="text-lg md:text-2xl text-slate-200 font-medium truncate selection:bg-teal-400 selection:text-teal-900">
                    {anime[0]?.release}
                  </p>
                </div>
                <div className="my-6">
                  <Button
                    onClick={() =>
                      router.push(`/details/${anime[0]?.link?.endpoint}`)
                    }
                    width="w-full"
                  >
                    Detail
                  </Button>
                </div>
              </div>
            </section>
          </section>
          <section className="min-h-screen min-w-full bg-gradient-to-tl from-slate-900 via-slate-800 to-slate-900 py-10">
            <div className="mb-7 container">
              <TitleSection>Updatetan Terbaru</TitleSection>
            </div>
            <div className="container px-0 md:px-4 min-h-screen">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6">
                <For
                  each={anime}
                  render={(data, index) => (
                    <MainCard
                      key={index}
                      path={`/details/${data?.link?.endpoint}`}
                      image={data?.link?.thumbnail}
                      title={data?.title}
                      py="py-5"
                      fontsize="text-base"
                    />
                  )}
                />
              </div>
            </div>
          </section>
        </RenderIfFalse>
      </section>
    </Layout>
  );
};

export default Home;
