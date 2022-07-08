import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAnimeDetail } from "../../action";
import {
  AlertWarning,
  Button,
  Description,
  Loading,
  ParallaxImage,
  Text,
} from "../../components";
import Layout from "../../layout";
import { For, RenderIfFalse, RenderIfTrue } from "../../utils";

const DetailAnime = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [detailAnime, setDetailAnime] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getData = async (slug) => {
    const res = await getAnimeDetail(slug);
    if (res.status === 200) {
      if (res.data.success !== false) {
        setDetailAnime(res.data);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getData(slug);
  }, [slug]);

  return (
    <Layout>
      <section className="min-w-full bg-gradient-to-tl from-slate-900 via-slate-800 to-slate-900 text-white py-3 min-h-screen">
        <RenderIfTrue isTrue={isLoading}>
          <Loading />
        </RenderIfTrue>
        <RenderIfFalse isFalse={isLoading}>
          <RenderIfTrue isTrue={Object.keys(detailAnime).length > 0}>
            <div className="container mt-4 mb-2 p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
                <div className="flex justify-center items-center selection:bg-pink-500 mb-5 lg:mb-0 px-4">
                  <ParallaxImage
                    image={detailAnime?.thumbnail}
                    alt={detailAnime?.title}
                  />
                </div>
                <div className="flex flex-col justify-start lg:col-start-2 lg:col-end-4 p-4 lg:py-0">
                  <RenderIfTrue isTrue={detailAnime?.score}>
                    <span className="gap-3 mt-3 md:mt-0 md:mb-4 text-2xl lg:text-3xl flex items-center selection:bg-emerald-500 selection:text-emerald-900">
                      <span className="text-3xl text-yellow-500">⭐</span>{" "}
                      <span>{detailAnime?.score?.substring(1)}</span>
                    </span>
                  </RenderIfTrue>
                  <h1 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium my-6 md:my-0 md:mb-7 selection:bg-violet-500 selection:text-violet-900">
                    {detailAnime?.title}
                  </h1>
                  <div className="text-lg selection:bg-pink-500 selection:text-pink-900">
                    <div className="lg:flex lg:justify-between lg:gap-3">
                      <div className="lg:px-2">
                        <RenderIfTrue isTrue={detailAnime?.japanese}>
                          <Text category="Japanese">
                            {detailAnime?.japanese}
                          </Text>
                        </RenderIfTrue>
                        <RenderIfTrue isTrue={detailAnime?.release}>
                          <Text category="Release">{detailAnime?.release}</Text>
                        </RenderIfTrue>
                        <RenderIfTrue isTrue={detailAnime?.season?.name}>
                          <Text category="Season">
                            {detailAnime?.season?.name}
                          </Text>
                        </RenderIfTrue>
                        <RenderIfTrue isTrue={detailAnime?.total_eps}>
                          <Text category="Total Eps">
                            {detailAnime?.total_eps}
                          </Text>
                        </RenderIfTrue>
                        <RenderIfTrue isTrue={detailAnime?.durasi}>
                          <Text category="Duration">{detailAnime?.durasi}</Text>
                        </RenderIfTrue>
                      </div>
                      <div className="lg:px-2 lg:w-2/3">
                        <RenderIfTrue isTrue={detailAnime?.genre}>
                          <Text category="Genre">
                            <For
                              each={detailAnime?.genre}
                              render={(genre, index) => {
                                const coma =
                                  detailAnime?.genre.length - 1 === index
                                    ? ""
                                    : ", ";
                                return (
                                  <Link
                                    href={`/${genre.endpoint}`}
                                    key={index}
                                    passHref
                                  >
                                    <a className="hover:text-pink-500 transition-colors duration-300">
                                      {genre.name}
                                      {coma}
                                    </a>
                                  </Link>
                                );
                              }}
                            />
                          </Text>
                        </RenderIfTrue>
                        <RenderIfTrue isTrue={detailAnime?.producers}>
                          <Text category="Producers">
                            <For
                              each={detailAnime?.producers}
                              render={(producer, index) => {
                                const coma =
                                  detailAnime?.producers.length - 1 === index
                                    ? ""
                                    : ", ";
                                return (
                                  <span key={index}>
                                    {producer}
                                    {coma}
                                  </span>
                                );
                              }}
                            />
                          </Text>
                        </RenderIfTrue>
                        <RenderIfTrue isTrue={detailAnime?.type}>
                          <Text category="Type">{detailAnime?.type}</Text>
                        </RenderIfTrue>
                        <RenderIfTrue isTrue={detailAnime?.status}>
                          <Text category="Status"> {detailAnime?.status}</Text>
                        </RenderIfTrue>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <RenderIfTrue isTrue={detailAnime?.sinopsis}>
                <Description hasTitle title="Sinopsis">
                  {detailAnime?.sinopsis}
                </Description>
              </RenderIfTrue>
              <div className="mt-10 lg:mt-0 md:pt-10 lg:pt-16">
                <h1 className="text-3xl md:text-4xl 2xl:text-5xl mb-3 selection:bg-emerald-500 selection:text-emerald-900 text-center">
                  <span className="hover:text-warning transition-all duration-200">
                    Link Download
                  </span>
                </h1>
                <div className="lg:container lg:max-w-4xl">
                  <div className="divide-y-2 divide-slate-600">
                    <For
                      each={detailAnime?.list_download}
                      render={(data, index) => (
                        <div key={index} className="py-8">
                          <p className="bg-slate-700 rounded p-4 selection:bg-pink-700 selection:text-pink-200">
                            {data[0]}
                          </p>
                          <div>
                            <For
                              each={data[1]}
                              render={(data, index) => (
                                <div key={index} className="my-4">
                                  <p className="bg-sky-600 rounded p-2 my-3 text-center text-base md:text-lg selection:bg-violet-700 selection:text-violet-100">
                                    Resolusi : {data?.resolusi}
                                  </p>
                                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
                                    <For
                                      each={data?.link_download}
                                      render={(data, index) => (
                                        <Link
                                          key={index}
                                          href={data?.link}
                                          passHref
                                        >
                                          <a target="_blank">
                                            <Button
                                              width="w-full"
                                              bgcolor="bg-slate-700"
                                            >
                                              {data?.platform}
                                            </Button>
                                          </a>
                                        </Link>
                                      )}
                                    />
                                  </div>
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </RenderIfTrue>
          <RenderIfFalse isFalse={Object.keys(detailAnime).length > 0}>
            <AlertWarning message="Gagal mengambil data dari api." />
          </RenderIfFalse>
        </RenderIfFalse>
      </section>
    </Layout>
  );
};

export default DetailAnime;
