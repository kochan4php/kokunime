import KUSONIME_API from "../config/kusonime";

export const getAnimeDetail = async (slug) => {
  const res = await fetch(`${KUSONIME_API}/anime/${slug}`);
  return res.ok ? res.json() : undefined;
};

export const getAnimeWithPagination = async (page = undefined) => {
  const res = await fetch(`${KUSONIME_API}/page/${page ?? 1}`);
  return res.ok ? res.json() : undefined;
};

export const getAnimeRecommendations = async () => {
  const res = await fetch(`${KUSONIME_API}/rekomendasi`);
  return res.ok ? res.json() : undefined;
};

export const getAnimeSearch = async (keyword) => {
  const res = await fetch(`${KUSONIME_API}/cari/${keyword}`);
  return res.ok ? res.json() : undefined;
};

export const getGenreList = async () => {
  const res = await fetch(`${KUSONIME_API}/genres`);
  return res.ok ? res.json() : undefined;
};

export const getGenre = async (genreName, page) => {
  const res = await fetch(`${KUSONIME_API}/genres/${genreName}/${page ?? 1}`);
  return res.ok ? res.json() : undefined;
};

export const getSeasonList = async () => {
  const res = await fetch(`${KUSONIME_API}/seasons`);
  return res.ok ? res.json() : undefined;
};

export const getSeason = async (seasonName, page) => {
  const res = await fetch(`${KUSONIME_API}/seasons/${seasonName}/${page ?? 1}`);
  return res.ok ? res.json() : undefined;
};
