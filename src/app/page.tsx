import CardAnime from "@/components/CardAnime";
import { axiosInstance } from "@/config";
import { ResponseGetAllType, ResponseGetRekomendasiType } from "@/interfaces";
import strLimit from "@/utils/strLimit";
import Image from "next/image";
import Link from "next/link";

const Home = async (props: any): Promise<JSX.Element> => {
    const page = props.searchParams.page || 1;
    const getAll = await axiosInstance.get(`/page/${page}`);
    const getRekomendasi = await axiosInstance.get("/rekomendasi");
    const latestAnime = getAll.data.data.anime;
    const rekomendasiAnime = getRekomendasi.data.data;

    return (
        <main className="min-h-full">
            <div className="min-w-full">
                <section
                    className="bg-slate-800 min-w-full bg-cover bg-center bg-no-repeat object-cover"
                    style={{
                        backgroundImage: `url(${latestAnime[0]?.link?.image})`,
                    }}
                >
                    <div className="min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] xl:min-h-[80vh] 2xl:min-h-[75vh] bg-slate-800 bg-opacity-30 backdrop-blur-lg backdrop-brightness-105 flex items-center justify-start px-2 md:px-6 pb-6">
                        <div className="container max-w-full px-3 lg:px-0 lg:max-w-3xl">
                            <div className="my-6">
                                <h1 className="text-slate-50 text-2xl md:text-4xl font-bold mb-4 selection:bg-red-700 selection:text-red-200">
                                    {latestAnime[0]?.title}
                                </h1>
                            </div>
                            <div className="my-6">
                                <p className="text-lg md:text-2xl text-slate-200 font-semibold truncate selection:bg-teal-400 selection:text-teal-900">
                                    {latestAnime[0]?.release}
                                </p>
                            </div>
                            <div className="my-6">
                                <Link
                                    href={`/anime/${latestAnime[0]?.link?.endpoint}`}
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
                        <div className="container px-3 md:px-4">
                            <h1 className="text-sky-300 mb-6 font-bold text-2xl md:text-3xl lg:text-4xl selection:bg-teal-500 selection:text-teal-900 ">
                                Update Terbaru
                            </h1>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6">
                                {latestAnime.map(
                                    (
                                        item: ResponseGetAllType,
                                        index: number
                                    ) => (
                                        <CardAnime
                                            key={index}
                                            path={`/anime/${item?.link?.endpoint}`}
                                            src={item?.link?.image}
                                            title={item?.title}
                                            alt={item?.title}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="batas">
                        <div className="container my-12 px-3 md:px-4">
                            <hr className="border-t border-t-slate-600" />
                        </div>
                    </div>
                    <div id="recommendations">
                        <div className="mb-6 container px-3 md:px-4">
                            <h1 className="text-sky-300 mb-6 font-bold text-2xl md:text-3xl lg:text-4xl selection:bg-teal-500 selection:text-teal-900 ">
                                Rekomendasi Anime
                            </h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4">
                                {rekomendasiAnime.map(
                                    (
                                        item: ResponseGetRekomendasiType,
                                        index: number
                                    ) => (
                                        <div
                                            className="w-full grid grid-cols-3 gap-3 pt-4 group"
                                            key={index}
                                        >
                                            <div>
                                                <div className="bg-cover bg-center h-full bg-no-repeat selection:bg-violet-500 rounded overflow-hidden bg-slate-700">
                                                    <div className="min-w-full h-full py-3">
                                                        <Link
                                                            href={`/anime/${item.endpoint}`}
                                                        >
                                                            <div className="cursor-pointer group px-2 relative min-h-full">
                                                                <div className="group px-1 relative min-h-full">
                                                                    <Image
                                                                        src={
                                                                            item.image
                                                                        }
                                                                        alt="thumbnail"
                                                                        width="0"
                                                                        height="0"
                                                                        sizes="100vw"
                                                                        className="rounded-sm"
                                                                        style={{
                                                                            width: "100%",
                                                                            height: "auto",
                                                                        }}
                                                                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAY"
                                                                        placeholder="blur"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2 py-2">
                                                <Link
                                                    href={`/anime/${item.endpoint}`}
                                                    className="text-lg font-semibold group-hover:text-pink-500 transition-colors duration-300"
                                                >
                                                    {strLimit(item.title, 40)}
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Home;
