export interface MirrorHealthStatus {
  url: string;
  isAlive: boolean;
  provider: string;
  isRateLimited?: boolean;
}

export function evaluateMirrorHealth(url: string): MirrorHealthStatus {
  if (!url || typeof url !== "string") {
    return { url: "", isAlive: false, provider: "unknown" };
  }

  const isGdrive = /drive\.google\.com/i.test(url);
  const isMega = /mega\.nz/i.test(url);
  const isMediafire = /mediafire\.com/i.test(url);
  const isAcefile = /acefile\.co/i.test(url);

  let provider = "Direct/Other";
  if (isGdrive) provider = "Google Drive";
  else if (isMega) provider = "Mega";
  else if (isMediafire) provider = "Mediafire";
  else if (isAcefile) provider = "Acefile";

  return {
    url,
    isAlive: true,
    provider,
    isRateLimited: false,
  };
}
