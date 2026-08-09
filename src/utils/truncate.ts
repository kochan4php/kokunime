export const truncate = (text: string | undefined, max: number): string => {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
};
