import Reveal from "@/components/reveal";
import { JSX } from "react";

const Synopsis = ({ anime }: any): JSX.Element => (
  <Reveal>
    <div className="card-shell">
      <div className="card-core p-7 md:p-10">
        <span className="chip">Sinopsis</span>
        <p className="mt-5 text-[15px] leading-loose text-ink-muted">{anime.synopsis}</p>
      </div>
    </div>
  </Reveal>
);

export default Synopsis;
