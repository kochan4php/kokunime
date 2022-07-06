import KUSONIME_API from "../config/kusonime";

export const getAnimeDetail = async (slug) => {
  const res = await fetch(`${KUSONIME_API}/anime/${slug}`);
  if (res.ok) return res.json();
  else return undefined;
};

export const getAnimeWithPagination = async (page) => {
  const res = await fetch(`${KUSONIME_API}/page/${page ?? 1}`);
  if (res.ok) return res.json();
  else return undefined;
};

export const getAnimeRecommendations = async () => {
  const res = await fetch(`${KUSONIME_API}/rekomendasi`);
  if (res.ok) return res.json();
  else return undefined;
};

export const getAnimeSearch = async (keyword) => {
  const res = await fetch(`${KUSONIME_API}/cari/${keyword}`);
  if (res.ok) return res.json();
  else return undefined;
};

export const getGenreList = async () => {
  const res = await fetch(`${KUSONIME_API}/genres`);
  if (res.ok) return res.json();
  else return undefined;
};

export const getGenre = async (genreName, page) => {
  const res = await fetch(`${KUSONIME_API}/genres/${genreName}/${page ?? 1}`);
  if (res.ok) return res.json();
  else return undefined;
};

export const getSeasonList = async () => {
  const res = await fetch(`${KUSONIME_API}/seasons`);
  if (res.ok) return res.json();
  else return undefined;
};

export const getSeason = async (seasonName, page) => {
  const res = await fetch(`${KUSONIME_API}/seasons/${seasonName}/${page ?? 1}`);
  if (res.ok) return res.json();
  else return undefined;
};
