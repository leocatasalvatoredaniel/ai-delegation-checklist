import emailjs from "@emailjs/browser";
import { RSVP_BACKEND } from "./config";

export interface RsvpData {
  nome: string;
  cognome: string;
  email: string;
  presenza: string;
  proclamazione: string;
  note: string;
}

export interface RsvpRow {
  Nome: string;
  Email: string;
  Presenza: string;
  Proclamazione: string;
  Note: string;
  Timestamp: string;
}

/**
 * Submit an RSVP. Writes to the Google Sheet via a CORS-free image ping
 * and fires an EmailJS notification. Mirrors the original static-site flow.
 */
export async function submitRsvp(d: RsvpData): Promise<void> {
  const fullName = `${d.nome} ${d.cognome}`.trim();

  // 1 — append the row to the sheet (GET ping side-steps CORS on Apps Script)
  const params = new URLSearchParams({
    action: "write",
    nome: fullName,
    email: d.email,
    presenza: d.presenza,
    proclamazione: d.proclamazione || "No",
    note: d.note || "",
  });
  new Image().src = `${RSVP_BACKEND.sheetsUrl}?${params.toString()}`;

  // 2 — notify the host by email (non-blocking; failures are swallowed)
  try {
    await emailjs.send(
      RSVP_BACKEND.emailjs.serviceId,
      RSVP_BACKEND.emailjs.templateId,
      {
        nome_ospite: fullName,
        email_ospite: d.email,
        partecipa: d.presenza,
        proclamazione: d.proclamazione || "No",
        note: d.note || "—",
      },
      { publicKey: RSVP_BACKEND.emailjs.publicKey },
    );
  } catch {
    /* notification is best-effort */
  }
}

/** True for any "yes"-like Italian answer. */
export const isSi = (v: string): boolean => {
  const l = (v || "").toLowerCase();
  return l.includes("sì") || l.includes("si");
};

/** Minimal CSV parser that respects quoted fields. */
function parseCSV(text: string): RsvpRow[] {
  const rows = text.trim().split("\n");
  if (rows.length < 2) return [];
  const headers = rows[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim());
  return rows.slice(1).map((row) => {
    const vals: string[] = [];
    let cur = "";
    let inQ = false;
    for (const c of row) {
      if (c === '"') inQ = !inQ;
      else if (c === "," && !inQ) {
        vals.push(cur);
        cur = "";
      } else cur += c;
    }
    vals.push(cur);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = (vals[i] || "").replace(/^"|"$/g, "").trim();
    });
    return obj as unknown as RsvpRow;
  });
}

/** Read all confirmations from the published CSV (reserved area). */
export async function fetchResponses(): Promise<RsvpRow[]> {
  const res = await fetch(RSVP_BACKEND.csvUrl);
  if (!res.ok) throw new Error("CSV fetch failed");
  return parseCSV(await res.text());
}

/** Format the sheet timestamp "dd/mm/yyyy, hh:mm:ss" → "3 ott · 20:00". */
export function fmtDate(s: string): string {
  if (!s) return "—";
  const p = s.split(", ");
  if (p.length < 2) return s;
  const [d, m] = p[0].split("/");
  const mesi = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  return `${parseInt(d)} ${mesi[parseInt(m) - 1]} · ${p[1].slice(0, 5)}`;
}
