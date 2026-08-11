import DetailHero from "./detail-hero";
import DownloadSection from "./download-section";
import InfoSide from "./info-side";
import NewSeriesSection from "./new-series-section";
import Synopsis from "./synopsis";
import Reveal from "@/components/reveal";
import { AnimeDetail } from "@/interfaces";
import { JSX } from "react";

const SectionDetail = ({ anime, slug }: { anime: AnimeDetail; slug: string }): JSX.Element => (
  <section className="container px-4 pb-8 pt-12 md:pb-12 md:pt-16">
    <Reveal>
      <DetailHero anime={anime} />
    </Reveal>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
      <Synopsis anime={anime} />
      <Reveal delay={100}>
        <InfoSide anime={anime} />
      </Reveal>
    </div>
    <DownloadSection anime={anime} />
    <NewSeriesSection slug={slug} />
  </section>
);

export default SectionDetail;
