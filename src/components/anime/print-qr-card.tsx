"use client";

import { qrEncode, qrSvgPath } from "@/utils/qr";
import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

interface PrintQrCardProps {
  url: string;
}

// Print/scan bridge for the detail page: a QR of the canonical URL plus a
// print button. QR colours are hard-coded (not theme tokens) so the code stays
// scannable in dark mode and on paper; when the URL exceeds what the encoder
// supports the code is dropped instead of drawn unscannable.
const PrintQrCard = ({ url }: PrintQrCardProps): JSX.Element => {
  const { t } = useTranslation();
  const modules = qrEncode(url);

  return (
    <div className="card-shell" data-print-qr>
      <div className="card-core flex flex-col items-center gap-4 p-5 text-center sm:flex-row sm:text-left md:p-6">
        {modules && (
          <svg
            viewBox={`0 0 ${modules.length} ${modules.length}`}
            className="h-32 w-32 shrink-0 rounded-sm border-2 border-border bg-white"
            aria-hidden="true"
            shapeRendering="crispEdges"
          >
            <path d={qrSvgPath(modules)} fill="#000000" />
          </svg>
        )}
        <div className="min-w-0 space-y-1.5">
          <p className="font-display text-sm font-bold text-ink">{t("print_qr.title")}</p>
          <p className="break-all font-mono text-[11px] text-ink-muted">{url}</p>
          <p className="text-xs text-ink-muted">{t("print_qr.hint")}</p>
          <button type="button" onClick={() => window.print()} className="btn-primary mt-1 print:hidden">
            {t("print_qr.button")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintQrCard;
