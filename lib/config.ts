/**
 * Single source of truth for all event content + backend wiring.
 * These backend values are client-side by design (same as the original
 * static site) — no new secrets are exposed here.
 */

export const SITE = {
  name: "Salvatore Daniel Leocata",
  degree: "Ingegneria Informatica",
  university: "Politecnico di Torino",
  years: "2023–2026",
  tag: "SDL // laurea.exe",
  place: "3 ott · Biancavilla, CT",
} as const;

export const JOURNEY: { text: string; strong?: string; aside?: boolean }[] = [
  { text: "Si parte da Adrano. Ai piedi dell'Etna.", strong: "Adrano." },
  { text: "Una valigia, 1.400 km, sola andata.", strong: "1.400 km," },
  { text: "Destinazione: Torino.", strong: "Torino." },
  { text: "Tre inverni. (Il primo è stato un trauma.)", strong: "trauma." },
  { text: "Notti sui libri, caffè industriali, esami infiniti." },
  { text: "Un po' di talento, un po' di AI, tanta testardaggine.", strong: "AI," },
  { text: "Dall'Etna alla Mole.", strong: "Mole." },
  { text: "Ce l'ha fatta.", strong: "fatta." },
  { text: "(più o meno da solo)", aside: true },
];

export const STATS = [
  {
    n: "1.400",
    emoji: "🧳",
    desc: "Chilometri da Adrano a Torino",
    note: "// sola andata, ritorno col pezzo di carta",
  },
  {
    n: "∞",
    emoji: "🤖",
    desc: "Prompt mandati all'AI",
    note: "// ha studiato lo stesso, giuro",
  },
  {
    n: "1",
    emoji: "🎓",
    desc: "Laurea in Ingegneria Informatica",
    note: "// 3 anni, zero rimpianti (quasi)",
  },
] as const;

export const MILESTONES = [
  {
    tag: "Tappa 01 · La proclamazione",
    day: "16",
    month: "SET",
    venue: "Politecnico di Torino",
    meta: ["Mercoledì 16 settembre 2026", "Corso Duca degli Abruzzi, 24 · Torino"],
    maps: "https://www.google.com/maps/search/?api=1&query=Politecnico+di+Torino",
    target: "2026-09-16T09:00:00+02:00",
    done: "🎓 Dottore!",
  },
  {
    tag: "Tappa 02 · La festa",
    day: "3",
    month: "OTT",
    venue: "Beauty Garden Banqueting",
    meta: ["Sabato 3 ottobre 2026 · ore 20:00", "Biancavilla, Catania"],
    maps: "https://www.google.com/maps/search/?api=1&query=Beauty+Garden+Banqueting+Biancavilla",
    target: "2026-10-03T20:00:00+02:00",
    done: "🎉 È stasera!",
  },
] as const;

export const RSVP_BACKEND = {
  emailjs: {
    publicKey: "D2o-gKXMSKYU2JqdQ",
    serviceId: "service_yguijtb",
    templateId: "template_ud4dvgj",
  },
  sheetsUrl:
    "https://script.google.com/macros/s/AKfycbzl_guEsSz3xgq_UKeFb64dJTu-KKtuaRXDT31jOycV9oK1CUiRiRQwYWnekpqndY8U/exec",
  csvUrl:
    "https://docs.google.com/spreadsheets/d/1OK2ONnYEXpUsRxft2hus5tuOyhmKKICABlmgliQCwNE/export?format=csv&sheet=RSVP",
  reservedPassword: "SDL2026",
} as const;
