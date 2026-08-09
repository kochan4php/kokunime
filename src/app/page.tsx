import CardAnime from "@/components/CardAnime";
import MainController from "@/controllers/main.controller";
import { AnimeType } from "@/interfaces";
import MainLayout from "@/layouts/MainLayout";
import Pagination from "@/sections/Pagination";
import RekomendasiAnime from "@/sections/RekomendasiAnime";
import Reveal from "@/components/Reveal";
import isGif from "@/utils/isGif";
import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";

const DownloadIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);

const Home = async ({ searchParams }: any): Promise<JSX.Element> => {
  const page = Number((await searchParams)?.page) || 1;
  const { anime: latestAnime = [], pagination } = await MainController.getAnimePerPage(page);
  const featured = latestAnime[0];

  return (
    <MainLayout>
      <section className="container px-4 pt-6 md:pt-10">
        <Reveal>
          <div className="card-shell group">
            <div className="card-core">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[26rem]">
                  {featured?.link?.image && (
                    <Image
                      src={featured.link.image}
                      alt=""
                      fill
                      priority
                      unoptimized={isGif(featured.link.image)}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r" />
                  <span className="absolute left-5 top-5 rounded-full bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white backdrop-blur-md">
                    Update Terbaru
                  </span>
                </div>
                <div className="flex flex-col justify-center gap-4 p-7 md:p-12">
                  <h1 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-ink md:text-5xl">
                    {featured?.title ?? "Katalog anime terbaru"}
                  </h1>
                  <p className="text-ink-muted">{featured?.release ?? "Koleksi anime terbaru setiap hari."}</p>
                  {featured?.link?.endpoint && (
                    <Link
                      href={`/anime/${featured.link.endpoint.split("/").join(" ").trim()}`}
                      className="btn-primary mt-2 w-max"
                    >
                      Download Anime
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-0.5">
                        <DownloadIcon />
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container px-4 py-16 md:py-24">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <span className="chip">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Katalog
              </span>
              <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
                Update Terbaru
              </h2>
            </div>
            <p className="hidden font-mono text-xs uppercase tracking-widest text-ink-muted md:block">
              Halaman {pagination?.current_page ?? 1} dari {pagination?.total_page ?? 1}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {latestAnime.map((item: AnimeType, index: number) => (
            <Reveal key={index} className="h-full" delay={(index % 5) * 80}>
              <CardAnime
                path={`/anime/${item?.link?.endpoint?.split("/").join(" ").trim()}`}
                src={item?.link?.image as string}
                title={item?.title}
                meta={item?.release}
              />
            </Reveal>
          ))}
        </div>
        <Pagination pagination={pagination} />
      </section>

      <section className="container px-4 pb-16 md:pb-24">
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
              Rekomendasi
            </span>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">Rekomendasi Anime</h2>
          </div>
        </Reveal>
        <Reveal>
          <RekomendasiAnime />
        </Reveal>
      </section>
    </MainLayout>
  );
};

export default Home;
