import DetailHero from "./detail-hero";
import DownloadSection from "./download-section";
import InfoSide from "./info-side";
import NewSeriesSection from "./new-series-section";
import Synopsis from "./synopsis";
import Reveal from "@/components/reveal";
import { JSX } from "react";

const SectionDetail = ({ anime, slug }: any): JSX.Element => (
  <section className="container px-4 py-8 md:py-12">
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
