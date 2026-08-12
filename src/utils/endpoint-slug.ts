export const endpointSlug = (endpoint: string | undefined, prefix: string): string | null => {
  const slug = endpoint?.replace(`${prefix}/`, "").replace(/\/+$/, "");
  return slug ? slug : null;
};

export const animeSlug = (endpoint: string | undefined): string | null => {
  const slug = endpoint?.replace(/^\/+|\/+$/g, "");
  return slug ? slug : null;
};
