import axiosInstance from "@/config/axiosInstance";
import AnimeController from "@/controllers/AnimeController";
import blurDataUrl from "@/data/blur-data-url";
import { AnimeDownloadOptionType, AnimeGenresType, AnimeLinkDownloadType, AnimeLinkPlatformType } from "@/interfaces";
import MainLayout from "@/layouts/MainLayout";
import NewSeriesAnime from "@/sections/NewSeriesAnime";
import RekomendasiAnime from "@/sections/RekomendasiAnime";
import Image from "next/image";
import Link from "next/link";

const Anime = async (props: any): Promise<JSX.Element> => {
    const { slug } = props.params;
    const { data } = await axiosInstance.get(`/anime/${slug}`);
    const anime = data.data;

    const SectionDetailAnime = () => {
        const AnimeDetail = () => {
            const Genres = () => {
                return (
                    <span>
                        {anime.genre.map((item: AnimeGenresType, index: number) => {
                            const { genre } = anime;
                            const coma = genre.length - 1 === index ? "" : ", ";

                            return (
                                <Link
                                    href="/"
                                    key={index}
                                    className="hover:text-pink-500 transition-colors duration-300 font-bold"
                                >
                                    {`${item.name}${coma}`}
                                </Link>
                            );
                        })}
                    </span>
                );
            };

            return (
                <>
                    <div className="flex justify-center items-center selection:bg-pink-500">
                        <Image
                            src={anime.image}
                            alt={anime.title}
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: "100%", height: "auto" }}
                            className="rounded shadow shadow-slate-800 w-[100%]"
                            placeholder="blur"
                            blurDataURL={blurDataUrl}
                            loading="lazy"
                        />
                    </div>
                    <div className="flex flex-col justify-start lg:col-start-2 lg:col-end-4 py-4 px-2 lg:px-4 lg:py-0">
                        <div className="gap-3 mt-3 md:mt-0 md:mb-4 text-2xl lg:text-3xl flex items-center selection:bg-emerald-500 selection:text-emerald-900">
                            <span className="font-bold">{anime.score}</span>
                        </div>
                        <h1 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold my-6 md:my-0 md:mb-7 selection:bg-violet-500 selection:text-violet-900">
                            {anime.title}
                        </h1>
                        <div className="text-lg selection:bg-pink-500 selection:text-pink-900">
                            <div className="lg:flex lg:justify-between lg:gap-3 font-medium">
                                <div className="lg:px-2">
                                    <div className="text-base md:text-lg 2xl:text-xl">
                                        <p className="font-semibold my-1 w-full">
                                            Japanese : <span className="font-bold">{anime.japanase}</span>
                                        </p>
                                    </div>
                                    <div className="text-base md:text-lg 2xl:text-xl">
                                        <p className="font-semibold my-1 w-full">
                                            Release : <span className="font-bold">{anime.release_on}</span>
                                        </p>
                                    </div>
                                    <div className="text-base md:text-lg 2xl:text-xl">
                                        <p className="font-semibold my-1 w-full">
                                            Season : <span className="font-bold">{anime.season.name}</span>
                                        </p>
                                    </div>
                                    <div className="text-base md:text-lg 2xl:text-xl">
                                        <p className="font-semibold my-1 w-full">
                                            Total Eps : <span className="font-bold">{anime.total_episode}</span>
                                        </p>
                                    </div>
                                    <div className="text-base md:text-lg 2xl:text-xl">
                                        <p className="font-semibold my-1 w-full">
                                            Duration : <span className="font-bold">{anime.duration}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="lg:px-2 lg:w-2/3">
                                    <div className="text-base md:text-lg 2xl:text-xl">
                                        <p className="font-semibold my-1 w-full">
                                            Genre : <Genres />
                                        </p>
                                    </div>
                                    <div className="text-base md:text-lg 2xl:text-xl">
                                        <p className="font-semibold my-1 w-full">
                                            Producers : <span className="font-bold">{anime.producer}</span>
                                        </p>
                                    </div>
                                    <div className="text-base md:text-lg 2xl:text-xl">
                                        <p className="font-semibold my-1 w-full">
                                            Type : <span className="font-bold">{anime.type}</span>
                                        </p>
                                    </div>
                                    <div className="text-base md:text-lg 2xl:text-xl">
                                        <p className="font-semibold my-1 w-full">
                                            Status : <span className="font-bold">{anime.status}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        };

        const AnimeSynopsis = () => {
            return (
                <>
                    <h1 className="text-3xl md:text-4xl 2xl:text-5xl mb-7 selection:bg-emerald-500 selection:text-emerald-900 font-bold">
                        Sinopsis
                    </h1>
                    <div className="text-lg lg:text-xl selection:bg-green-500 selection:text-green-900 font-medium">
                        <p className="leading-loose text-left md:text-justify">{anime.synopsis}</p>
                    </div>
                </>
            );
        };

        const LinkDownload = () => {
            const DownloadResolutionAndPlatform = ({ link_download }: AnimeDownloadOptionType) => {
                const LinkPlatform = ({ link }: AnimeLinkDownloadType) => {
                    return (
                        <div className="mt-5 grid grid-cols-3 lg:grid-cols-5 gap-4">
                            {link.map((item: AnimeLinkPlatformType, index: number) => (
                                <Link
                                    key={index}
                                    href={item?.url}
                                    target="_blank"
                                    className="px-1 py-1.5 text-slate-5 active:ring active:ring-sky-500 hover:border-sky-500 border-2 border-transparent transition-all duration-300 selection:bg-orange-500 selection:text-orange-900 text-base bg-slate-700 w-full h-full text-center rounded font-medium"
                                >
                                    {item.platform}
                                </Link>
                            ))}
                        </div>
                    );
                };

                return (
                    <div className="divide-y-2 divide-slate-700">
                        {link_download.map((data: AnimeLinkDownloadType, index: number) => (
                            <div key={index} className="py-4">
                                <p className="bg-slate-700 rounded p-4 selection:bg-pink-700 selection:text-pink-200 text-center font-semibold text-base">
                                    {`Resolusi : ${data.resolusi}`}
                                </p>
                                <LinkPlatform link={data.link} />
                            </div>
                        ))}
                    </div>
                );
            };

            const DownloadOption = () => {
                return (
                    <div className="flex flex-col gap-8 mt-5">
                        {anime.download.map((item: AnimeDownloadOptionType, index: number) => (
                            <div key={index}>
                                <p className="bg-sky-600 rounded p-2 my-3 text-center text-base md:text-lg selection:bg-violet-700 selection:text-violet-100 font-bold">
                                    {item.title}
                                </p>
                                <DownloadResolutionAndPlatform link_download={item.link_download} />
                            </div>
                        ))}
                    </div>
                );
            };

            return (
                <>
                    <h1 className="text-3xl md:text-4xl 2xl:text-5xl mb-3 selection:bg-emerald-500 selection:text-emerald-900 text-center font-semibold hover:text-warning transition-all duration-200">
                        Link Download
                    </h1>
                    <div className="lg:container lg:max-w-4xl font-medium">
                        <DownloadOption />
                    </div>
                </>
            );
        };

        return (
            <section>
                <div className="container mt-4 p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
                        <AnimeDetail />
                    </div>
                    <div className="mt-10 lg:mt-0 md:pt-10 lg:pt-16">
                        <AnimeSynopsis />
                    </div>
                    <div className="mt-10 lg:mt-0 md:pt-10 lg:pt-16">
                        <LinkDownload />
                    </div>
                </div>
            </section>
        );
    };

    const SectionNewSeriesAnime = () => {
        return (
            <section className="my-12 px-4">
                <div className="container mb-12">
                    <hr className="border-t border-t-slate-600" />
                </div>
                <div className="container">
                    <h1 className="text-2xl md:text-3xl mb-6 text-sky-300 selection:bg-emerald-500 selection:text-emerald-900 font-bold">
                        New Add Series
                    </h1>
                    <NewSeriesAnime slug={slug} />
                </div>
            </section>
        );
    };

    const SectionRekomendasiAnime = () => {
        return (
            <section className="my-12 px-4">
                <div className="container mb-12">
                    <hr className="border-t border-t-slate-600" />
                </div>
                <div className="container">
                    <h1 className="text-2xl md:text-3xl mb-6 text-sky-300 selection:bg-emerald-500 selection:text-emerald-900 font-bold">
                        Rekomendasi Anime
                    </h1>
                    <RekomendasiAnime />
                </div>
            </section>
        );
    };

    return (
        <MainLayout>
            <div className="min-w-full text-white py-3">
                <SectionDetailAnime />
                <SectionNewSeriesAnime />
                <SectionRekomendasiAnime />
            </div>
        </MainLayout>
    );
};

export default Anime;
