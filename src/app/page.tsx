import CardAnime from "@/components/CardAnime";
import { axiosInstance } from "@/config";
import { ResponseGetAllType } from "@/interfaces";
import Link from "next/link";

export default async function Home(props: any): Promise<JSX.Element> {
    const page = props.searchParams.page || 1;
    const res = await axiosInstance.get(`/page/${page}`);
    const anime = res.data.data.anime;

    return (
        <main className="min-h-full">
            <div className="min-w-full text-white">
                <section
                    className="bg-slate-800 min-w-full bg-cover bg-center bg-no-repeat object-cover"
                    style={{
                        backgroundImage: `url(${anime[0]?.link?.image})`,
                    }}
                >
                    <div className="min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] xl:min-h-[80vh] 2xl:min-h-[75vh] bg-slate-800 bg-opacity-30 backdrop-blur-lg backdrop-brightness-105 flex items-center justify-start px-2 md:px-6 pb-6">
                        <div className="container max-w-full px-3 lg:px-0 lg:max-w-3xl">
                            <div className="my-6">
                                <h1 className="text-slate-50 text-2xl md:text-4xl font-bold mb-4 selection:bg-red-700 selection:text-red-200">
                                    {anime[0]?.title}
                                </h1>
                            </div>
                            <div className="my-6">
                                <p className="text-lg md:text-2xl text-slate-200 font-semibold truncate selection:bg-teal-400 selection:text-teal-900">
                                    {anime[0]?.release}
                                </p>
                            </div>
                            <div className="my-6">
                                <Link
                                    href={`/anime/${anime[0]?.link?.endpoint}`}
                                    passHref
                                >
                                    <button className="px-1 py-1.5 bg-slate-900 rounded-full text-slate-5 active:ring active:ring-sky-500 hover:border-sky-500 border-2 border-transparent transition-all duration-300 selection:bg-orange-500 selection:text-orange-900 text-base md:text-lg font-semibold w-full h-full">
                                        Detail
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="min-h-screen min-w-full bg-gradient-to-tl from-slate-900 via-slate-800 to-slate-900 py-10">
                    <div id="update-now">
                        <div className="mb-6 container px-3 md:px-4">
                            <h1 className="text-sky-300 font-bold text-2xl md:text-3xl lg:text-4xl selection:bg-teal-500 selection:text-teal-900 ">
                                Updatetan Terbaru
                            </h1>
                        </div>
                        <div className="container px-3 md:px-4">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6">
                                {anime.map(
                                    (
                                        item: ResponseGetAllType,
                                        index: number
                                    ) => (
                                        <CardAnime
                                            key={index}
                                            path={`/anime/${item?.link?.endpoint}`}
                                            src={item?.link?.image}
                                            title={item?.title}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="batas">
                        <div className="container my-12">
                            <hr className="border-t border-t-slate-600" />
                        </div>
                    </div>
                    {/* <div id="recommendations">
                        <div className="mb-6 container">
                        <TitleSection>Rekomendasi Anime</TitleSection>
                        <br />
                        <Recommendations />
                        </div>
                    </div> */}
                </section>
            </div>
        </main>
    );
}
