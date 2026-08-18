const GENRE_TRANSLATIONS: Record<string, string> = {
  action: "Aksi",
  adventure: "Petualangan",
  comedy: "Komedi",
  drama: "Drama",
  fantasy: "Fantasi",
  "sci-fi": "Fiksi Ilmiah",
  mystery: "Misteri",
  horror: "Horor",
  psychological: "Psikologis",
  romance: "Romantis",
  "slice of life": "Sepenggal Kehidupan",
  supernatural: "Supranatural",
  thriller: "Mendebarkan",
  sports: "Olahraga",
  music: "Musik",
  mecha: "Robot / Mecha",
  historical: "Sejarah",
  school: "Sekolah",
  military: "Militer",
  magic: "Sihir",
  isekai: "Dunia Lain (Isekai)",
  demons: "Iblis",
  vampire: "Vampir",
  "martial arts": "Bela Diri",
  space: "Luar Angkasa",
  parody: "Parodi",
  shounen: "Shounen",
  shoujo: "Shoujo",
  seinen: "Seinen",
  josei: "Josei",
};

export function getGenreIndonesian(englishGenre: string): string {
  if (!englishGenre) return "";
  const key = englishGenre.trim().toLowerCase();
  return GENRE_TRANSLATIONS[key] || englishGenre;
}
