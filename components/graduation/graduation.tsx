"use client";

import { useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { RSVP_BACKEND } from "@/lib/config";
import { StickyScroll, type StickyItem } from "@/components/ui/sticky-scroll-reveal";

/** Stats narrative for the sticky-scroll reveal. Add `img:"/img/…"` per item
 *  to swap the emoji placeholder for a generated photo. */
const STATS_CONTENT: StickyItem[] = [
  {
    num: "1.847",
    title: "Ore di sonno sacrificate",
    description:
      "Notti in bianco tra progetti consegnati all'ultimo secondo e sveglie all'alba. Il caffè ringrazia, le occhiaie un po' meno.",
    emoji: "😴",
    gradient: "linear-gradient(160deg,#1A3A6B 0%,#0F2347 60%,#0A1628 100%)",
  },
  {
    num: "312",
    title: "Gin tonic di sopravvivenza",
    description:
      "Stima cautelativa. Ogni esame superato meritava un brindisi — e anche qualcuno di quelli andati male, per consolazione.",
    emoji: "🍸",
    gradient: "linear-gradient(160deg,#10243f 0%,#13314f 55%,#091522 100%)",
  },
  {
    num: "12k+",
    title: "Ore fissando uno schermo",
    description:
      "Tra IDE aperti, slide infinite e bug che esistevano solo sul mio portatile. La vista non è più quella di prima.",
    emoji: "👁️",
    gradient: "linear-gradient(160deg,#1d3a5f 0%,#0e2747 60%,#0a1628 100%)",
  },
  {
    num: "∞",
    title: "Volte che l'AI mi ha salvato",
    description:
      "Compagni fedeli delle sessioni impossibili. Sì, li ringrazio. No, non me ne vergogno. (Ho comunque studiato, giuro.)",
    emoji: "🤖",
    gradient: "linear-gradient(160deg,#16335a 0%,#0c244a 55%,#081320 100%)",
  },
];

const SHEETS_URL = RSVP_BACKEND.sheetsUrl;
const CSV_URL = RSVP_BACKEND.csvUrl;
const MONO = "var(--font-jetbrains),monospace";

/** Terminal boot sequence shown on the splash screen. */
const TERMINAL_LINES: { text: string; cls: string; delay: number }[] = [
  { text: '$ sudo run graduation.exe --name="SDL"', cls: "t-prompt t-cmd", delay: 0 },
  { text: "[sudo] password for root: ··········", cls: "t-dim", delay: 600 },
  { text: "", cls: "", delay: 1000 },
  { text: "  Booting graduation sequence...", cls: "t-ok", delay: 1100 },
  { text: "  Loading thesis_defense.pdf    [OK]", cls: "t-dim", delay: 1500 },
  { text: "  Mounting campus_memories/     [OK]", cls: "t-dim", delay: 1800 },
  { text: "  Compiling 3 years of effort   [OK]", cls: "t-dim", delay: 2100 },
  { text: "", cls: "", delay: 2400 },
  { text: "  ╔═══════════════════════════════╗", cls: "t-title-line", delay: 2500 },
  { text: "  ║   LAUREA IN INFORMATICA      ║", cls: "t-title-line", delay: 2600 },
  { text: "  ╚═══════════════════════════════╝", cls: "t-title-line", delay: 2700 },
  { text: "", cls: "", delay: 2800 },
  { text: "  Student:    Salvatore Daniel Leocata", cls: "t-data", delay: 2900 },
  { text: "  Degree:     Ingegneria Informatica", cls: "t-data", delay: 3050 },
  { text: "  University: Politecnico di Torino", cls: "t-data", delay: 3200 },
  { text: "  Date:       16 September 2026", cls: "t-data", delay: 3350 },
  { text: "", cls: "", delay: 3500 },
  { text: '$ echo "Congratulazioni, Dott. Leocata!" ', cls: "t-prompt t-cmd", delay: 3600 },
];
const PROG_LABELS = ["Loading assets", "Mounting memories", "Compiling 3 years", "Almost there...", "Ready!"];

export function Graduation() {
  const splashDone = useRef(false);

  const $ = (id: string) => document.getElementById(id);

  function showToast(msg: string, dur = 4000) {
    const t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    window.setTimeout(() => t.classList.remove("show"), dur);
  }

  function dismissSplash() {
    if (!splashDone.current) return;
    $("splash")?.classList.add("hidden");
    $("main")?.classList.add("visible");
  }

  function openModal() {
    $("modalOverlay")?.classList.add("open");
    window.setTimeout(() => $("modalPwd")?.focus(), 60);
  }
  function closeModal() {
    $("modalOverlay")?.classList.remove("open");
    const login = $("loginSection");
    if (login) login.style.display = "block";
    $("reservedContent")?.classList.remove("visible");
    const pwd = $("modalPwd") as HTMLInputElement | null;
    if (pwd) pwd.value = "";
  }
  function closeModalOutside(e: React.MouseEvent) {
    if (e.target === $("modalOverlay")) closeModal();
  }

  function checkPwd() {
    const input = $("modalPwd") as HTMLInputElement | null;
    if (!input) return;
    if (input.value.trim() === RSVP_BACKEND.reservedPassword) {
      const login = $("loginSection");
      if (login) login.style.display = "none";
      $("reservedContent")?.classList.add("visible");
      void loadRsvpResponses();
    } else {
      input.style.borderColor = "#EF4444";
      window.setTimeout(() => (input.style.borderColor = ""), 800);
      showToast("Password errata.");
    }
  }

  function downloadICS(type: "proclama" | "festa") {
    const ics =
      type === "proclama"
        ? `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//SDL Laurea//IT\r\nBEGIN:VEVENT\r\nUID:proclama-2026@sdl\r\nDTSTART:20260916T080000Z\r\nDTEND:20260916T120000Z\r\nSUMMARY:Proclamazione di Laurea - Salvatore Daniel Leocata\r\nDESCRIPTION:Cerimonia di proclamazione di laurea in Ingegneria Informatica\r\nLOCATION:Politecnico di Torino\\, Corso Duca degli Abruzzi 24\\, Torino\r\nEND:VEVENT\r\nEND:VCALENDAR`
        : `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//SDL Laurea//IT\r\nBEGIN:VEVENT\r\nUID:festa-2026@sdl\r\nDTSTART:20261003T190000Z\r\nDTEND:20261004T010000Z\r\nSUMMARY:Festeggiamenti Laurea - Salvatore Daniel Leocata\r\nDESCRIPTION:Cena e festeggiamenti per la laurea\r\nLOCATION:Beauty Garden Banqueting\\, Biancavilla\\, Catania\r\nEND:VEVENT\r\nEND:VCALENDAR`;
    const a = document.createElement("a");
    a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
    a.download = type === "proclama" ? "proclamazione-sdl.ics" : "festa-laurea-sdl.ics";
    a.click();
  }

  function parseCSV(text: string): Record<string, string>[] {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const hdrs = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim());
    return lines.slice(1).map((line) => {
      const vals: string[] = [];
      let cur = "";
      let inQ = false;
      for (const c of line) {
        if (c === '"') inQ = !inQ;
        else if (c === "," && !inQ) {
          vals.push(cur);
          cur = "";
        } else cur += c;
      }
      vals.push(cur);
      const obj: Record<string, string> = {};
      hdrs.forEach((h, i) => (obj[h] = (vals[i] || "").replace(/^"|"$/g, "").trim()));
      return obj;
    });
  }

  async function loadRsvpResponses() {
    const wrap = $("rsvpTableWrap");
    if (!wrap) return;
    wrap.innerHTML = '<p class="reserved-msg">Caricamento...</p>';
    try {
      const res = await fetch(CSV_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = parseCSV(await res.text());
      if (!rows.length) {
        wrap.innerHTML = '<p class="reserved-msg">Nessuna conferma ancora ricevuta.</p>';
        return;
      }
      const isSi = (p: string) => {
        const l = (p || "").toLowerCase();
        return l.includes("sì") || l.includes("si");
      };
      const si = rows.filter((r) => isSi(r.Presenza)).length;
      const no = rows.length - si;
      const proc = rows.filter((r) => isSi(r.Proclamazione)).length;
      const fmtDate = (s: string) => {
        if (!s) return "—";
        const parts = s.split(", ");
        if (parts.length < 2) return s;
        const [d, m] = parts[0].split("/");
        const mesi = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
        return `${parseInt(d)} ${mesi[parseInt(m) - 1]} · ${parts[1].slice(0, 5)}`;
      };
      wrap.innerHTML = `
        <div class="rsvp-stats">
          <div class="rsvp-stat"><span class="rsvp-stat-n">${rows.length}</span><span class="rsvp-stat-l">Risposte</span></div>
          <div class="rsvp-stat"><span class="rsvp-stat-n" style="color:#3FB950">${si}</span><span class="rsvp-stat-l">Confermati</span></div>
          <div class="rsvp-stat"><span class="rsvp-stat-n" style="color:#F87171">${no}</span><span class="rsvp-stat-l">Non vengono</span></div>
          <div class="rsvp-stat"><span class="rsvp-stat-n" style="color:#93C5FD">${proc}</span><span class="rsvp-stat-l">Proclamazione</span></div>
        </div>
        <table class="rsvp-table">
          <thead><tr><th>Ospite</th><th>Presenza</th><th>Proclamaz.</th><th>Note</th><th>Data</th></tr></thead>
          <tbody>${rows
            .map((r) => {
              const ok = isSi(r.Presenza);
              return `<tr>
            <td><div class="rsvp-nome">${r.Nome || "—"}</div><div class="rsvp-email">${r.Email || ""}</div></td>
            <td><span class="rsvp-pill ${ok ? "si" : "no"}">${ok ? "✓ Sì" : "✗ No"}</span></td>
            <td style="color:rgba(255,255,255,.6)">${isSi(r.Proclamazione) ? "✓ Sì" : "✗ No"}</td>
            <td style="max-width:160px;word-break:break-word;color:rgba(255,255,255,.5);font-size:12px">${r.Note || "—"}</td>
            <td style="white-space:nowrap;font-size:11px;font-family:${MONO};color:rgba(255,255,255,.25)">${fmtDate(r.Timestamp)}</td>
          </tr>`;
            })
            .join("")}</tbody>
        </table>`;
    } catch {
      wrap.innerHTML =
        '<p class="reserved-msg">Errore nel caricamento.<br>Assicurati che il foglio sia condiviso come <strong>Visualizzatore per chiunque con il link</strong>.</p>';
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = $("submitBtn") as HTMLButtonElement | null;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    if (!data.nome || !data.cognome || !data.email_ospite || !data.partecipa) {
      showToast("Compila tutti i campi obbligatori.");
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Invio in corso…";
    }

    const params = {
      nome: data.nome,
      cognome: data.cognome,
      partecipa: data.partecipa,
      proclamazione: data.proclamazione || "Non specificato",
      adulti: data.adulti,
      bambini: data.bambini,
      dieta: data.dieta || "Nessuna",
      messaggio: data.messaggio || "",
      email_ospite: data.email_ospite,
      data_invio: new Date().toLocaleString("it-IT"),
    };

    // Fire-and-forget write to the sheet (Image ping side-steps CORS).
    const writeParams = new URLSearchParams({
      action: "write",
      nome: `${data.nome} ${data.cognome}`,
      email: data.email_ospite,
      presenza: data.partecipa,
      proclamazione: data.proclamazione || "Non specificato",
      note: [data.dieta ? `Dieta: ${data.dieta}` : "", data.messaggio || ""].filter(Boolean).join(" | "),
    });
    new Image().src = `${SHEETS_URL}?${writeParams}`;

    try {
      await emailjs.send(RSVP_BACKEND.emailjs.serviceId, RSVP_BACKEND.emailjs.templateId, params, {
        publicKey: RSVP_BACKEND.emailjs.publicKey,
      });
    } catch (err) {
      console.warn("EmailJS:", err);
    }
    showToast("Risposta inviata! A presto 🎓", 5000);
    form.reset();
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Invia conferma";
    }
  }

  // ── Imperative effects ported 1:1 from the original script ──
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const reduceMotion = matchMedia("(prefers-reduced-motion:reduce)").matches;

    // TERMINAL SPLASH
    const body = $("termBody");
    const bar = $("progBar");
    const lbl = $("progLabel");
    if (body) body.innerHTML = "";
    TERMINAL_LINES.forEach((l) => {
      const el = document.createElement("div");
      el.className = "t-line " + (l.cls || "");
      el.textContent = l.text;
      body?.appendChild(el);
      const t = window.setTimeout(() => el.classList.add("visible"), l.delay);
      cleanups.push(() => clearTimeout(t));
    });
    const progSteps: [string, number, number][] = [
      ["20%", 500, 0],
      ["45%", 1100, 1],
      ["70%", 2000, 2],
      ["90%", 3000, 3],
      ["100%", 3800, 4],
    ];
    progSteps.forEach(([w, ms, li]) => {
      const t = window.setTimeout(() => {
        if (bar) bar.style.width = w;
        if (lbl) lbl.textContent = PROG_LABELS[li];
        if (ms === 3800) splashDone.current = true;
      }, ms);
      cleanups.push(() => clearTimeout(t));
    });

    // STARS
    const starC = $("stars");
    if (starC) {
      starC.innerHTML = "";
      for (let i = 0; i < 120; i++) {
        const s = document.createElement("div");
        s.className = "star";
        const size = Math.random() * 2 + 0.5;
        s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;--dur:${2 + Math.random() * 4}s;--delay:-${Math.random() * 4}s;`;
        starC.appendChild(s);
      }
    }

    // CHIP
    const face = $("chipFace");
    if (face) {
      face.innerHTML = "";
      const active = [1, 3, 6, 8, 11, 13, 18, 20, 23];
      for (let i = 0; i < 25; i++) {
        const cell = document.createElement("div");
        cell.className = "chip-cell" + (active.includes(i) ? " active" : "");
        if (active.includes(i)) cell.style.setProperty("--cd", Math.random() * 2 + "s");
        face.appendChild(cell);
      }
    }
    (["pinsLeft", "pinsRight", "pinsTop", "pinsBottom"] as const).forEach((id) => {
      const el = $(id);
      if (!el) return;
      el.innerHTML = "";
      for (let i = 0; i < 6; i++) {
        const p = document.createElement("div");
        p.className = "pin";
        el.appendChild(p);
      }
    });

    // COUNTDOWN
    const target = new Date("2026-10-03T19:00:00Z");
    const updateCD = () => {
      const diff = +target - Date.now();
      const ids = ["cd-d", "cd-h", "cd-m", "cd-s"] as const;
      if (diff <= 0) {
        ids.forEach((id) => {
          const el = $(id);
          if (el) el.textContent = "0";
        });
        return;
      }
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      const s = Math.floor((diff % 6e4) / 1e3);
      const setT = (id: string, v: number) => {
        const el = $(id);
        if (el) el.textContent = String(v).padStart(2, "0");
      };
      setT("cd-d", d);
      setT("cd-h", h);
      setT("cd-m", m);
      const sEl = $("cd-s");
      if (sEl) {
        sEl.textContent = String(s).padStart(2, "0");
        if (!reduceMotion) {
          sEl.classList.remove("tick");
          void sEl.offsetWidth;
          sEl.classList.add("tick");
        }
      }
    };
    updateCD();
    const cdInt = window.setInterval(updateCD, 1000);
    cleanups.push(() => clearInterval(cdInt));

    // SCROLL ANIMATIONS (fade-up)
    const fadeObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".fade-up").forEach((el) => fadeObs.observe(el));
    cleanups.push(() => fadeObs.disconnect());

    // ESCAPE closes modal
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && $("modalOverlay")?.classList.contains("open")) closeModal();
    };
    document.addEventListener("keydown", onKey);
    cleanups.push(() => document.removeEventListener("keydown", onKey));

    // AURORAS
    if (!reduceMotion) {
      const plan: Record<string, [string, string, string, string, string][]> = {
        stats: [
          ["a-blue", "-12%", "-10%", "clamp(280px,42vw,520px)", "0.14"],
          ["a-cyan", "78%", "82%", "clamp(220px,34vw,420px)", "0.20"],
        ],
        countdown: [
          ["a-blue", "40%", "-8%", "clamp(260px,40vw,480px)", "0.16"],
          ["a-gold", "60%", "90%", "clamp(200px,30vw,360px)", "0.10"],
        ],
        rsvp: [
          ["a-cyan", "-6%", "85%", "clamp(280px,44vw,520px)", "0.18"],
          ["a-blue", "82%", "-6%", "clamp(240px,36vw,440px)", "0.12"],
        ],
      };
      Object.entries(plan).forEach(([id, blobs]) => {
        const sec = $(id);
        if (!sec) return;
        blobs.forEach(([cls, top, left, size, speed]) => {
          const b = document.createElement("div");
          b.className = "aurora " + cls;
          b.dataset.parallax = speed;
          b.style.cssText = `top:${top};left:${left};width:${size};height:${size};transform:translate(-50%,-50%);`;
          sec.prepend(b);
        });
      });
    }

    // PARALLAX + SCROLL PROGRESS + SCROLL-TO-TOP
    const progressEl = $("scrollProgress");
    const stars = $("stars");
    const chipW = document.querySelector(".chip-wrap") as HTMLElement | null;
    const heroSec = $("hero");
    const scrollTopBtn = $("scrollTop");
    let ticking = false;
    const onScroll = () => {
      const y = window.pageYOffset;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressEl) progressEl.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      if (scrollTopBtn) scrollTopBtn.classList.toggle("show", y > window.innerHeight * 0.9);
      if (reduceMotion) {
        ticking = false;
        return;
      }
      if (heroSec && y < window.innerHeight * 1.2) {
        if (stars) stars.style.transform = `translate3d(0, ${y * 0.45}px, 0)`;
        if (chipW) {
          chipW.style.transform = `translate3d(0, ${y * 0.22}px, 0)`;
          chipW.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.7)));
        }
      }
      const mid = window.innerHeight / 2;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        const delta = mid - (r.top + r.height / 2);
        const base = el.classList.contains("aurora") ? "translate(-50%,-50%) " : "";
        el.style.transform = `${base}translate3d(0, ${delta * parseFloat(el.dataset.parallax || "0")}px, 0)`;
      });
      ticking = false;
    };
    const requestTick = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    };
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener("scroll", requestTick));
    cleanups.push(() => window.removeEventListener("resize", requestTick));

    const onTop = () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    scrollTopBtn?.addEventListener("click", onTop);
    cleanups.push(() => scrollTopBtn?.removeEventListener("click", onTop));

    // COUNT-UP on stats
    const countEls = document.querySelectorAll<HTMLElement>("[data-count]");
    const fmt = (el: HTMLElement, v: number) =>
      (el.dataset.sep === "1" ? v.toLocaleString("it-IT") : v) + (el.dataset.suffix || "");
    if (reduceMotion) {
      countEls.forEach((el) => (el.textContent = fmt(el, parseFloat(el.dataset.count || "0"))));
    } else {
      countEls.forEach((el) => (el.textContent = "0" + (el.dataset.suffix || "")));
      const co = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target as HTMLElement;
            const tgt = parseFloat(el.dataset.count || "");
            if (!isNaN(tgt)) {
              const dur = 1500;
              const start = performance.now();
              const frame = (now: number) => {
                const p = Math.min(1, (now - start) / dur);
                el.textContent = fmt(el, Math.round(tgt * (1 - Math.pow(1 - p, 3))));
                if (p < 1) requestAnimationFrame(frame);
              };
              requestAnimationFrame(frame);
            }
            co.unobserve(el);
          }),
        { threshold: 0.5 },
      );
      countEls.forEach((el) => co.observe(el));
      cleanups.push(() => co.disconnect());
    }

    // NAV active-chapter highlight
    const navMap: Record<string, HTMLAnchorElement> = {};
    document.querySelectorAll<HTMLAnchorElement>(".nav-links a").forEach((a) => {
      navMap[a.getAttribute("href")!.slice(1)] = a;
    });
    const navObs = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          const a = navMap[e.target.id];
          if (!a || !e.isIntersecting) return;
          Object.values(navMap).forEach((x) => {
            x.classList.remove("active");
            x.removeAttribute("aria-current");
          });
          a.classList.add("active");
          a.setAttribute("aria-current", "true");
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["stats", "program", "locations", "rsvp"].forEach((id) => {
      const s = $(id);
      if (s) navObs.observe(s);
    });
    cleanups.push(() => navObs.disconnect());

    // 3D tilt on event cards
    if (!reduceMotion && matchMedia("(hover:hover) and (pointer:fine)").matches) {
      document.querySelectorAll<HTMLElement>(".event-card").forEach((card) => {
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-5px)`;
        };
        const leave = () => (card.style.transform = "");
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        });
      });
    }

    return () => cleanups.forEach((f) => f());
  }, []);

  return (
    <>
      <div id="scrollProgress" aria-hidden="true" />
      <div id="grain" aria-hidden="true" />

      {/* SPLASH */}
      <div id="splash" onClick={dismissSplash}>
        <div className="terminal">
          <div className="terminal-bar">
            <div className="t-dot" />
            <div className="t-dot" />
            <div className="t-dot" />
            <span className="t-title">graduation.exe — zsh</span>
          </div>
          <div className="terminal-body" id="termBody" />
          <div style={{ padding: "0 28px 24px" }}>
            <div className="progress-wrap">
              <div className="progress-label" id="progLabel">
                Initializing...
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" id="progBar" />
              </div>
            </div>
            <div className="splash-hint">[ tocca per continuare ]</div>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav>
        <div className="nav-logo">
          SDL <span>// laurea</span>
        </div>
        <div className="nav-links">
          <a href="#stats">// stats</a>
          <a href="#program">Programma</a>
          <a href="#locations">Luoghi</a>
          <a href="#rsvp">RSVP</a>
        </div>
      </nav>

      <main id="main">
        {/* HERO */}
        <section id="hero">
          <div className="stars" id="stars" />
          <div className="hero-vignette" aria-hidden="true" />
          <div className="hero-sweep" aria-hidden="true" />

          <div className="chip-wrap">
            <div className="chip" id="chip">
              <div className="chip-glow" />
              <div className="chip-face" id="chipFace" />
              <div className="chip-pins left" id="pinsLeft" />
              <div className="chip-pins right" id="pinsRight" />
              <div className="chip-pins top" id="pinsTop" />
              <div className="chip-pins bottom" id="pinsBottom" />
            </div>
          </div>

          <div className="hero-label">// proclama · 2026</div>
          <h1 className="cine-title">
            <span className="first">Salvatore Daniel</span>
            <br />
            Leocata
          </h1>
          <p className="hero-sub">Ingegneria Informatica</p>
          <p className="hero-uni">Politecnico di Torino — A.A. 2025/2026</p>

          <div className="scroll-hint">
            <div className="scroll-mouse">
              <div className="scroll-wheel" />
            </div>
            <span>scroll</span>
          </div>
        </section>

        {/* STATS */}
        <section id="stats">
          <div className="section-inner">
            <div className="section-tag fade-up">// 3 anni in numeri</div>
            <h2 className="fade-up delay-1">
              Le statistiche che
              <br />
              non mette nella laurea
            </h2>
            <p className="section-desc fade-up delay-2">
              Dati verificati. La tesi meno. (Scorri.)
            </p>

            <div className="fade-up delay-2">
              <StickyScroll content={STATS_CONTENT} />
            </div>

            <div className="about-terminal fade-up delay-3">
              <div className="at-prompt">$ cat grazie.txt</div>
              <div className="at-output">
                Grazie per essere qui a festeggiare con me.
                <br />
                Questo traguardo appartiene anche a voi —
                <br />
                che mi abbiate supportato, sopportato,
                <br />
                portato un gin tonic o semplicemente detto
                <br />
                &quot;dai, ce la fai&quot; alle 3 di notte.
                <br />
                <br />
                Un ringraziamento speciale a ChatGPT e Claude,
                <br />
                fedeli compagni delle sessioni impossibili.
                <br />
                (Sì, li ringrazio. No, non me ne vergogno.)
                <br />
                <span className="at-sig">
                  — Salvatore Daniel Leocata, Dott. in Ingegneria Informatica 🎓
                </span>
              </div>
              <div className="at-prompt">
                ${" "}
                <span className="t-cursor" />
              </div>
            </div>
          </div>
        </section>

        {/* COUNTDOWN */}
        <section id="countdown">
          <div className="section-inner">
            <div className="section-tag fade-up">// count down</div>
            <h2 className="fade-up delay-1">Mancano ancora</h2>
            <p className="section-desc fade-up delay-2">Al gran festeggiamento del 3 ottobre 2026</p>
            <div className="cd-grid fade-up delay-2">
              <div className="cd-box">
                <div className="cd-num" id="cd-d">
                  --
                </div>
                <div className="cd-label">Giorni</div>
              </div>
              <div className="cd-box">
                <div className="cd-num" id="cd-h">
                  --
                </div>
                <div className="cd-label">Ore</div>
              </div>
              <div className="cd-box">
                <div className="cd-num" id="cd-m">
                  --
                </div>
                <div className="cd-label">Minuti</div>
              </div>
              <div className="cd-box">
                <div className="cd-num" id="cd-s">
                  --
                </div>
                <div className="cd-label">Secondi</div>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRAM */}
        <section id="program">
          <div className="section-inner">
            <div className="section-tag fade-up">// programma</div>
            <h2 className="fade-up delay-1">
              Due momenti,
              <br />
              un solo traguardo
            </h2>
            <p className="section-desc fade-up delay-2">
              Due appuntamenti speciali per celebrare questo percorso.
            </p>
            <div className="program-grid">
              <div className="event-card fade-up delay-1">
                <div className="event-idx" data-parallax="0.06">
                  01
                </div>
                <div className="event-header">
                  <div className="event-date">
                    16 Settembre 2026
                    <br />
                    Torino
                  </div>
                  <div className="event-time">ore 10:00</div>
                </div>
                <div className="event-title">Proclamazione</div>
                <div className="event-desc">
                  La cerimonia ufficiale di laurea presso il Politecnico di Torino. Il momento in cui
                  anni di studio diventano un titolo.
                </div>
                <div className="event-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                  Cerimonia Accademica
                </div>
              </div>
              <div className="event-card fade-up delay-2">
                <div className="event-idx" data-parallax="0.06">
                  02
                </div>
                <div className="event-header">
                  <div className="event-date">
                    3 Ottobre 2026
                    <br />
                    Biancavilla
                  </div>
                  <div className="event-time">ore 21:00</div>
                </div>
                <div className="event-title">Festeggiamenti</div>
                <div className="event-desc">
                  La festa per celebrare insieme questo traguardo. Una serata speciale al Beauty
                  Garden Banqueting, tra cibo, musica e affetti.
                </div>
                <div className="event-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Cena di Gala
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOCATIONS */}
        <section id="locations">
          <div className="section-inner">
            <div className="section-tag fade-up">// luoghi</div>
            <h2 className="fade-up delay-1">Dove ci troviamo</h2>
            <p className="section-desc fade-up delay-2">Due luoghi, due momenti da non perdere.</p>
            <div className="loc-grid fade-up delay-2">
              <div className="loc-card">
                <iframe
                  className="loc-map"
                  title="Mappa: Politecnico di Torino, Corso Duca degli Abruzzi 24"
                  src="https://maps.google.com/maps?q=Politecnico+di+Torino,+Corso+Duca+degli+Abruzzi+24,+Torino&output=embed&z=15"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="loc-info">
                  <div className="loc-tag">16 Settembre · 10:00</div>
                  <div className="loc-name" style={{ marginTop: "10px" }}>
                    Politecnico di Torino
                  </div>
                  <div className="loc-addr">
                    Corso Duca degli Abruzzi, 24
                    <br />
                    10129 Torino TO
                  </div>
                </div>
              </div>
              <div className="loc-card">
                <iframe
                  className="loc-map"
                  title="Mappa: Beauty Garden Banqueting, Biancavilla (Catania)"
                  src="https://maps.google.com/maps?q=Beauty+Garden+Banqueting+Biancavilla&output=embed&z=15"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="loc-info">
                  <div className="loc-tag">3 Ottobre · 21:00</div>
                  <div className="loc-name" style={{ marginTop: "10px" }}>
                    Beauty Garden Banqueting
                  </div>
                  <div className="loc-addr">
                    Biancavilla, Catania
                    <br />
                    Sicilia
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{ marginTop: "32px", display: "flex", gap: "12px", flexWrap: "wrap" }}
              className="fade-up delay-3"
            >
              <button
                className="cal-btn"
                onClick={() => downloadICS("proclama")}
                aria-label="Aggiungi Proclamazione al calendario"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Aggiungi Proclamazione
              </button>
              <button
                className="cal-btn"
                onClick={() => downloadICS("festa")}
                aria-label="Aggiungi Festeggiamenti al calendario"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Aggiungi Festeggiamenti
              </button>
            </div>
          </div>
        </section>

        {/* RSVP */}
        <section id="rsvp">
          <div className="section-inner">
            <div className="section-tag fade-up">// rsvp</div>
            <h2 className="fade-up delay-1">
              Conferma la tua
              <br />
              presenza
            </h2>
            <p className="section-desc fade-up delay-2">
              Facci sapere entro il{" "}
              <strong style={{ color: "rgba(255,255,255,.8)" }}>25 settembre 2026</strong> se potrai
              essere con noi.
            </p>
            <form className="rsvp-form fade-up delay-2" id="rsvpForm" noValidate onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="field">
                  <label>Nome</label>
                  <input type="text" name="nome" placeholder="Mario" required />
                </div>
                <div className="field">
                  <label>Cognome</label>
                  <input type="text" name="cognome" placeholder="Rossi" required />
                </div>
              </div>

              <div className="field">
                <label>Email</label>
                <input type="email" name="email_ospite" placeholder="mario@esempio.it" required />
              </div>

              <div className="field">
                <label>Parteciperai alla festa del 3 ottobre?</label>
                <div className="radio-group">
                  <label className="radio-opt">
                    <input type="radio" name="partecipa" value="Sì, ci sarò!" required />
                    <span>Sì, ci sarò!</span>
                  </label>
                  <label className="radio-opt">
                    <input type="radio" name="partecipa" value="Purtroppo no" />
                    <span>Purtroppo no</span>
                  </label>
                </div>
              </div>

              <div className="field">
                <label>Verrai anche alla proclamazione (16 sett.)?</label>
                <div className="radio-group">
                  <label className="radio-opt">
                    <input type="radio" name="proclamazione" value="Sì" />
                    <span>Sì</span>
                  </label>
                  <label className="radio-opt">
                    <input type="radio" name="proclamazione" value="No" />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>Adulti</label>
                  <div className="select-wrap">
                    <select name="adulti" defaultValue="1">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Bambini</label>
                  <div className="select-wrap">
                    <select name="bambini" defaultValue="0">
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4+">4+</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <label>Note alimentari / allergie</label>
                <input type="text" name="dieta" placeholder="Vegetariano, celiaco, ecc. (opzionale)" />
              </div>

              <div className="field">
                <label>Un messaggio per Salvatore Daniel (opzionale)</label>
                <textarea name="messaggio" placeholder="Scrivi qualcosa di speciale…" />
              </div>

              <button type="submit" className="submit-btn" id="submitBtn">
                Invia conferma
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-name">Salvatore Daniel Leocata</div>
        <div className="footer-sub">Ingegneria Informatica · Politecnico di Torino · 2026</div>
      </footer>

      {/* TOAST */}
      <div id="toast" />

      {/* SCROLL TO TOP */}
      <button id="scrollTop" aria-label="Torna su">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>

      {/* AREA RISERVATA */}
      <button className="reserved-btn" onClick={openModal} aria-label="Area riservata — conferme RSVP">
        // area riservata
      </button>

      <div className="modal-overlay" id="modalOverlay" onClick={closeModalOutside}>
        <div className="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div id="loginSection">
            <h3 id="modalTitle">Area Riservata</h3>
            <p>Inserisci la password per accedere alle conferme ricevute.</p>
            <input
              type="password"
              className="modal-input"
              id="modalPwd"
              placeholder="Password"
              onKeyDown={(e) => e.key === "Enter" && checkPwd()}
            />
            <div className="modal-actions">
              <button className="modal-cancel" onClick={closeModal}>
                Annulla
              </button>
              <button className="modal-send" onClick={checkPwd}>
                Accedi
              </button>
            </div>
          </div>
          <div className="modal-content" id="reservedContent">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                gap: "12px",
              }}
            >
              <h3 style={{ margin: 0 }}>Conferme ricevute</h3>
              <button
                onClick={loadRsvpResponses}
                style={{
                  background: "none",
                  border: "1px solid rgba(96,165,250,.3)",
                  color: "var(--blue-l)",
                  fontFamily: MONO,
                  fontSize: "11px",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ↻ Aggiorna
              </button>
            </div>
            <div id="rsvpTableWrap">
              <p className="reserved-msg">Caricamento...</p>
            </div>
            <button className="modal-cancel" onClick={closeModal} style={{ marginTop: "20px", width: "100%" }}>
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
