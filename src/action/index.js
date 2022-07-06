import axios from "axios";
import KUSONIME_API from "../config/kusonime";

export const getAnimeDetail = async (slug) =>
  await axios.get(`${KUSONIME_API}/anime/${slug}`);

export const getAnimeWithPagination = async (page) =>
  await axios.get(`${KUSONIME_API}/page/${page ?? 1}`);

export const getAnimeRecommendations = async () =>
  await axios.get(`${KUSONIME_API}/rekomendasi`);

export const getAnimeSearch = async (keyword) =>
  await axios.get(`${KUSONIME_API}/cari/${keyword}`);

export const getGenreList = async () =>
  await axios.get(`${KUSONIME_API}/genres`);

export const getGenre = async (genreName, page) =>
  await axios.get(`${KUSONIME_API}/genres/${genreName}/${page ?? 1}`);

export const getSeasonList = async () =>
  await axios.get(`${KUSONIME_API}/seasons`);

export const getSeason = async (seasonName, page) =>
  await axios.get(`${KUSONIME_API}/seasons/${seasonName}/${page ?? 1}`);
