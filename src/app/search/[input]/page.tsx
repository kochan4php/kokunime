import CardAnime from "@/components/CardAnime";
import MainController from "@/controllers/main.controller";
import { AnimeType } from "@/interfaces";
import MainLayout from "@/layouts/MainLayout";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import { JSX } from "react";

const SearchAnime = async (props: any): Promise<JSX.Element> => {
  const { input } = (await props.params) ?? "";
  const query = input.split("%2B").join("+");
  const anime: AnimeType[] = await MainController.searchAnime(query);

  return (
    <MainLayout>
      <section className="container px-4 py-12 md:py-20">
        <Reveal>
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Hasil pencarian
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
            <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-cyan bg-clip-text text-transparent">
              “{query.split("+").join(" ")}”
            </span>
          </h1>
        </Reveal>
        {anime.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {anime.map((item: AnimeType, index: number) => (
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
        ) : (
          <Reveal>
            <div className="card-shell mt-12 max-w-xl">
              <div className="card-core flex flex-col gap-4 p-8 md:p-10">
                <p className="text-ink-muted">
                  Tidak ada hasil untuk kata kunci tersebut. Coba kata kunci lain atau kembali ke beranda.
                </p>
                <Link href="/" className="btn-primary w-max">
                  Kembali ke beranda
                </Link>
              </div>
            </div>
          </Reveal>
        )}
      </section>
    </MainLayout>
  );
};

export default SearchAnime;
