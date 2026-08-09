import { getAnimeDetail } from "@/lib/api-client";
import blurDataUrl from "@/data/blur-data-url";
import { AnimeGenresType, AnimeLinkPlatformType } from "@/interfaces";
import MainLayout from "@/layouts/main-layout";
import NewSeriesAnime from "@/sections/new-series-anime";
import Reveal from "@/components/reveal";
import isGif from "@/utils/is-gif";
import Image from "next/image";
import { JSX } from "react";

const chipColors = ["bg-accent/10 text-accent", "bg-accent-2/10 text-accent-2", "bg-accent-cyan/10 text-accent-cyan"];

const ArrowDown = (): JSX.Element => (
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
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);

const DownloadIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3 w-3"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);

const GenreTags = ({ anime }: any): JSX.Element => (
  <div className="flex flex-wrap gap-2">
    {(anime.genre ?? []).map((item: AnimeGenresType, index: number) => (
      <span
        key={index}
        className={`rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider ${chipColors[index % chipColors.length]}`}
      >
        {item.name}
      </span>
    ))}
  </div>
);

const MetaItem = ({ label, value }: { label: string; value?: string }): JSX.Element => (
  <div className="rounded-2xl border border-border bg-surface px-4 py-3">
    <dt className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{label}</dt>
    <dd className="mt-1 text-sm font-semibold text-ink">{value || "—"}</dd>
  </div>
);

const DetailMeta = ({ anime }: any): JSX.Element => {
  const items = [
    { label: "Japanese", value: anime.japanese },
    { label: "Release", value: anime.release_on },
    { label: "Musim", value: anime.season?.name },
    { label: "Total Episode", value: anime.total_episode },
    { label: "Durasi", value: anime.duration },
    { label: "Skor", value: anime.score },
  ];

  return (
    <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <MetaItem key={index} label={item.label} value={item.value} />
      ))}
    </dl>
  );
};

const InfoSide = ({ anime }: any): JSX.Element => (
  <div className="card-shell">
    <div className="card-core flex flex-col justify-between gap-6 p-7 md:p-8">
      <div>
        <span className="chip">Info</span>
        <ul className="mt-5 space-y-3 text-sm">
          {[
            { label: "Tipe", value: anime.type },
            { label: "Status", value: anime.status },
            { label: "Durasi", value: anime.duration },
            { label: "Produser", value: anime.producer },
          ].map((item, index) => (
            <li key={index} className="flex items-start justify-between gap-4">
              <span className="text-ink-muted">{item.label}</span>
              <span className="text-right font-semibold text-ink">{item.value || "—"}</span>
            </li>
          ))}
        </ul>
      </div>
      {anime.download?.length > 0 && (
        <a href="#download" className="btn-primary w-full justify-center">
          Lihat Download
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
            <ArrowDown />
          </span>
        </a>
      )}
    </div>
  </div>
);

const DownloadPlatform = ({ name, url }: { name: string; url?: string }): JSX.Element => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent"
  >
    <span>{name}</span>
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface-muted text-ink-muted transition-all duration-300 group-hover:bg-accent group-hover:text-white">
      <DownloadIcon />
    </span>
  </a>
);

const DownloadGroup = ({ group }: any): JSX.Element => (
  <div className="card-shell">
    <div className="card-core p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold tracking-tight text-ink">{group.title}</h3>
        <span className="chip">{group.link_download.length} kualitas</span>
      </div>
      <div className="mt-6 flex flex-col gap-5">
        {group.link_download.map((res: any, index: number) => (
          <div key={index} className="border-t border-border pt-5 first:border-0 first:pt-0">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
              Resolusi <span className="text-ink">{res.resolusi}</span>
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
              {res.link.map((platform: AnimeLinkPlatformType, i: number) => (
                <DownloadPlatform key={i} name={platform.platform} url={platform.url} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SectionDetailAnime = ({ anime, slug }: any): JSX.Element => (
  <section className="container px-4 py-8 md:py-12">
    <Reveal>
      <div className="card-shell">
        <div className="card-core grid md:grid-cols-[320px_1fr]">
          <div className="relative aspect-[3/4] md:aspect-auto md:min-h-full">
            {anime.image && (
              <Image
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                src={anime.image}
                alt={anime.title}
                unoptimized={isGif(anime.image)}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {anime.score && (
              <span className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 font-mono text-xs font-medium text-white backdrop-blur-md">
                Skor {anime.score}
              </span>
            )}
          </div>
          <div className="p-7 md:p-10">
            <GenreTags anime={anime} />
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-ink md:text-4xl">
              {anime.title}
            </h1>
            <p className="mt-2 text-ink-muted">{anime.release_on}</p>
            <DetailMeta anime={anime} />
          </div>
        </div>
      </div>
    </Reveal>

    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
      <Reveal>
        <div className="card-shell">
          <div className="card-core p-7 md:p-10">
            <span className="chip">Sinopsis</span>
            <p className="mt-5 text-[15px] leading-loose text-ink-muted">{anime.synopsis}</p>
          </div>
        </div>
      </Reveal>
      <Reveal delay={100}>
        <InfoSide anime={anime} />
      </Reveal>
    </div>

    <div id="download" className="mt-16 scroll-mt-28">
      <Reveal>
        <div className="mb-6 flex items-center gap-4">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Download
          </span>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">Pilih Kualitas</h2>
        </div>
      </Reveal>
      <div className="grid gap-6">
        {(anime.download ?? []).map((group: any, index: number) => (
          <Reveal key={index} delay={index * 80}>
            <DownloadGroup group={group} />
          </Reveal>
        ))}
      </div>
    </div>

    <div className="mt-20">
      <Reveal>
        <div className="mb-6 flex items-center gap-4">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
            Lainnya
          </span>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">New Add Series</h2>
        </div>
      </Reveal>
      <NewSeriesAnime slug={slug} />
    </div>
  </section>
);

const Anime = async (props: any): Promise<JSX.Element> => {
  const { slug } = (await props.params) ?? "";
  const anime: any = await getAnimeDetail(slug);

  return (
    <MainLayout>
      <SectionDetailAnime anime={anime} slug={slug} />
    </MainLayout>
  );
};

export default Anime;
