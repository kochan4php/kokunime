import axios from "axios";
import KUSONIME_API from "../config/kusonime";

export const getAnimeDetail = async (slug) => {
  const res = await axios.get(`${KUSONIME_API}/anime/${slug}`);
  return res;
};

export const getAnimeWithPagination = async (page) => {
  const res = await axios.get(`${KUSONIME_API}/page/${page ?? 1}`);
  return res;
};

export const getAnimeRecommendations = async () => {
  const res = await axios.get(`${KUSONIME_API}/rekomendasi`);
  return res;
};

export const getAnimeSearch = async (keyword) => {
  const res = await axios.get(`${KUSONIME_API}/cari/${keyword}`);
  return res;
};

export const getGenreList = async () => {
  const res = await axios.get(`${KUSONIME_API}/genres`);
  return res;
};

export const getGenre = async (genreName, page) => {
  const res = await axios.get(
    `${KUSONIME_API}/genres/${genreName}/${page ?? 1}`
  );
  return res;
};

export const getSeasonList = async () => {
  const res = await axios.get(`${KUSONIME_API}/seasons`);
  return res;
};

export const getSeason = async (seasonName, page) => {
  const res = await axios.get(
    `${KUSONIME_API}/seasons/${seasonName}/${page ?? 1}`
  );
  return res;
};
