export const endpointSlug = (endpoint: string | undefined, prefix: string): string | null => {
  const slug = endpoint?.replace(`${prefix}/`, "").replace(/\/+$/, "");
  return slug ? slug : null;
};
