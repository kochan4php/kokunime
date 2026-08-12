import { ArrowDownIcon } from "@/components/icons";
import { AnimeDetail } from "@/interfaces";
import { JSX } from "react";

const InfoSide = ({ anime }: { anime: AnimeDetail }): JSX.Element => (
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
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/15">
            <ArrowDownIcon className="h-3.5 w-3.5" />
          </span>
        </a>
      )}
    </div>
  </div>
);

export default InfoSide;
