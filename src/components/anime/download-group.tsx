import { DownloadOption, DownloadResolution, DownloadTarget } from "@/interfaces";
import DownloadPlatform from "./download-platform";
import { JSX } from "react";

const DownloadGroup = ({ group }: { group: DownloadOption }): JSX.Element => (
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
              {res.link.map((platform: DownloadTarget, i: number) => (
                <DownloadPlatform key={i} name={platform.platform} url={platform.url} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DownloadGroup;
