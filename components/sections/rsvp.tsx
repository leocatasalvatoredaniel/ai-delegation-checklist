"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { RSVP_BACKEND } from "@/lib/config";
import { fetchResponses, fmtDate, isSi, submitRsvp, type RsvpRow } from "@/lib/rsvp";

const inputCls =
  "rounded-[10px] border border-white/[0.12] bg-white/[0.05] px-3.5 py-3 font-sans text-sm text-ink outline-none transition-all duration-150 focus:border-gold focus:shadow-[0_0_0_3px_rgba(245,200,66,0.14)]";
const labelCls = "font-mono text-[10px] uppercase tracking-[0.14em] text-dim";

const EMPTY = { nome: "", cognome: "", email: "", presenza: "", proclamazione: "No", note: "" };

export function Rsvp() {
  const [form, setForm] = useState({ ...EMPTY });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [msg, setMsg] = useState("");
  const [toast, setToast] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [rows, setRows] = useState<RsvpRow[] | null>(null);
  const [loadErr, setLoadErr] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const showToast = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(""), 3000);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.cognome.trim() || !form.email.trim() || !form.presenza) {
      showToast("Compila i campi obbligatori.");
      return;
    }
    setStatus("sending");
    await submitRsvp(form);
    setStatus("sent");
    setMsg("Grazie! Salvatore ti aspetta (o ti perdona se non vieni).");
    setTimeout(() => {
      setStatus("idle");
      setMsg("");
      setForm({ ...EMPTY });
    }, 5000);
  }

  async function loadResponses() {
    setRows(null);
    setLoadErr(false);
    try {
      setRows(await fetchResponses());
    } catch {
      setLoadErr(true);
    }
  }

  function checkPwd() {
    if (pwd.trim() === RSVP_BACKEND.reservedPassword) {
      setUnlocked(true);
      void loadResponses();
    } else {
      setPwdError(true);
      setTimeout(() => setPwdError(false), 800);
      showToast("Password errata.");
    }
  }

  function closeModal() {
    setModalOpen(false);
    setUnlocked(false);
    setPwd("");
  }

  const si = rows ? rows.filter((r) => isSi(r.Presenza)).length : 0;
  const no = rows ? rows.length - si : 0;
  const proc = rows ? rows.filter((r) => isSi(r.Proclamazione)).length : 0;

  return (
    <section
      id="rsvp"
      className="relative z-[6] border-t border-white/[0.07] bg-navy px-6 pb-[clamp(120px,16vh,160px)] pt-[clamp(80px,12vh,140px)] sm:px-12 md:px-24"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">// rsvp</p>
      <h2 className="mb-12 text-[clamp(32px,6vw,80px)] font-bold tracking-[-0.03em]">Ci sei?</h2>

      <form onSubmit={handleSubmit} noValidate className="flex max-w-[560px] flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls} htmlFor="f-nome">Nome</label>
            <input id="f-nome" className={inputCls} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Mario" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls} htmlFor="f-cog">Cognome</label>
            <input id="f-cog" className={inputCls} value={form.cognome} onChange={(e) => set("cognome", e.target.value)} placeholder="Rossi" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls} htmlFor="f-email">Email</label>
          <input id="f-email" type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="mario@esempio.it" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls} htmlFor="f-pres">Presenza alla festa</label>
            <select id="f-pres" className={`${inputCls} cursor-pointer`} value={form.presenza} onChange={(e) => set("presenza", e.target.value)}>
              <option className="bg-navy-2" value="">—</option>
              <option className="bg-navy-2" value="Sì, ci sarò!">Sì, ci sarò! 🎉</option>
              <option className="bg-navy-2" value="No, mi dispiace">No, mi dispiace 😢</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls} htmlFor="f-proc">Proclamazione (16 set)</label>
            <select id="f-proc" className={`${inputCls} cursor-pointer`} value={form.proclamazione} onChange={(e) => set("proclamazione", e.target.value)}>
              <option className="bg-navy-2" value="No">No</option>
              <option className="bg-navy-2" value="Sì">Sì</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelCls} htmlFor="f-note">Note / Dieta / Messaggio</label>
          <textarea id="f-note" className={`${inputCls} min-h-[80px] resize-y`} value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="Sono vegano. Oppure: in bocca al lupo Salvo!" />
        </div>

        <HoverBorderGradient type="submit" disabled={status !== "idle"} containerClassName="mt-1 disabled:opacity-50">
          {status === "sending" ? "Invio..." : status === "sent" ? "✓ Risposta inviata!" : "Invia risposta"}
        </HoverBorderGradient>
        <p className="min-h-[18px] font-mono text-[13px] tracking-[0.04em] text-gold">{msg}</p>
      </form>

      {/* reserved-area trigger */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 z-[200] rounded-full border border-gold/20 bg-navy/90 px-4 py-2.5 font-mono text-[11px] tracking-[0.05em] text-dim backdrop-blur-md transition-all duration-150 hover:border-gold/55 hover:text-gold active:scale-[0.97]"
      >
        // area riservata
      </button>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 12, x: "-50%" }}
            className="fixed bottom-20 left-1/2 z-[9989] whitespace-nowrap rounded-full border border-gold/20 bg-[#0d1b2e]/95 px-5 py-2.5 font-mono text-xs"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* reserved-area modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && closeModal()}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-[#020812]/80 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="max-h-[90vh] w-[min(760px,95vw)] overflow-y-auto rounded-[20px] border border-gold/20 bg-navy-2 p-9"
            >
              {!unlocked ? (
                <>
                  <h3 className="mb-2 text-xl font-bold tracking-[-0.02em]">Area Riservata</h3>
                  <p className="mb-6 text-[13px] leading-[1.6] text-dim">
                    Inserisci la password. Suggerimento: le iniziali di chi si laurea + l&apos;anno.
                  </p>
                  <input
                    type="password"
                    autoFocus
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && checkPwd()}
                    placeholder="········"
                    className={`mb-4 w-full rounded-[10px] border bg-white/[0.06] px-4 py-3 font-mono text-[15px] tracking-[0.15em] text-ink outline-none transition-colors ${pwdError ? "border-red-500" : "border-gold/20 focus:border-gold"}`}
                  />
                  <div className="flex gap-3">
                    <button onClick={closeModal} className="flex-1 rounded-[10px] border-[1.5px] border-gold/20 py-3 text-sm font-medium text-dim transition-colors hover:border-gold/55 hover:text-ink">
                      Annulla
                    </button>
                    <button onClick={checkPwd} className="flex-[2] rounded-[10px] bg-gold py-3 text-sm font-bold text-navy">
                      Accedi
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-[-0.02em]">Conferme ricevute</h3>
                    <button onClick={loadResponses} className="rounded-md border border-gold/30 px-3 py-1.5 font-mono text-[11px] text-gold">
                      ↻ Aggiorna
                    </button>
                  </div>

                  {rows === null && !loadErr && <p className="text-sm text-dim">Caricamento...</p>}
                  {loadErr && <p className="text-sm text-dim">Errore nel caricamento.</p>}
                  {rows !== null && rows.length === 0 && <p className="text-sm text-dim">Nessuna risposta ancora.</p>}

                  {rows !== null && rows.length > 0 && (
                    <>
                      <div className="mb-5 grid grid-cols-4 gap-2">
                        {[
                          { n: rows.length, l: "Risposte", c: "text-ink" },
                          { n: si, l: "Confermati", c: "text-[#3FB950]" },
                          { n: no, l: "Non vengono", c: "text-[#F87171]" },
                          { n: proc, l: "Proclamazione", c: "text-gold" },
                        ].map((card) => (
                          <div key={card.l} className="rounded-[10px] border border-white/[0.08] bg-white/[0.04] p-3 text-center">
                            <span className={`block text-[22px] font-bold ${card.c}`}>{card.n}</span>
                            <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.08em] text-dim-2">{card.l}</span>
                          </div>
                        ))}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-[13px]">
                          <thead>
                            <tr>
                              {["Ospite", "Presenza", "Proclamaz.", "Note", "Data"].map((h) => (
                                <th key={h} className="whitespace-nowrap border-b border-white/[0.08] px-2.5 py-2 text-left font-mono text-[10px] uppercase tracking-[0.1em] text-gold/75">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((r, i) => {
                              const ok = isSi(r.Presenza);
                              return (
                                <tr key={i}>
                                  <td className="border-b border-white/[0.05] p-2.5 align-top">
                                    <div className="font-medium text-ink">{r.Nome || "—"}</div>
                                    <div className="mt-0.5 font-mono text-[11px] text-dim-2">{r.Email || ""}</div>
                                  </td>
                                  <td className="border-b border-white/[0.05] p-2.5 align-top">
                                    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ok ? "border border-[#3FB950]/20 bg-[#3FB950]/[0.12] text-[#3FB950]" : "border border-red-500/20 bg-red-500/10 text-[#F87171]"}`}>
                                      {ok ? "✓ Sì" : "✗ No"}
                                    </span>
                                  </td>
                                  <td className="border-b border-white/[0.05] p-2.5 align-top text-dim">{isSi(r.Proclamazione) ? "✓ Sì" : "✗ No"}</td>
                                  <td className="max-w-[140px] break-words border-b border-white/[0.05] p-2.5 align-top text-xs text-dim">{r.Note || "—"}</td>
                                  <td className="whitespace-nowrap border-b border-white/[0.05] p-2.5 align-top font-mono text-[10px] text-dim-2">{fmtDate(r.Timestamp)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  <button onClick={closeModal} className="mt-5 w-full rounded-[10px] border-[1.5px] border-gold/20 py-3 text-sm text-dim transition-colors hover:border-gold/55 hover:text-ink">
                    Chiudi
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
