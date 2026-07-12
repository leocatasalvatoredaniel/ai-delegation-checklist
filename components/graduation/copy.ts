/**
 * Guest-facing copy in both languages. The reserved admin panel stays
 * Italian on purpose (it's Daniel's own dashboard), and the RSVP radio
 * VALUES submitted to the sheet stay Italian too — the panel's counters
 * match on "sì"/"si", so only the visible labels are translated.
 */
export type Lang = "it" | "en";

export interface StatSlide {
  num: string;
  title: string;
  description: string;
}

export interface Copy {
  docLang: string;
  skip: string;
  muteAria: string;
  navLogoSuffix: string;
  navStats: string;
  navProgram: string;
  navPlaces: string;
  navRsvp: string;
  heroLabel: string;
  heroInvite: string;
  heroSub: string;
  scrollHint: string;
  statsTag: string;
  statsTitle: [string, string];
  statsDesc: string;
  stats: StatSlide[];
  termPrompt: string;
  termLines: string[];
  termSig: string;
  cdTag: string;
  cdTitle: string;
  cdDesc: string;
  cdDays: string;
  cdHours: string;
  cdMinutes: string;
  cdSeconds: string;
  programTag: string;
  programTitle: [string, string];
  programDesc: string;
  ev1Date: string;
  ev1City: string;
  ev1Title: string;
  ev1Desc: string;
  ev1Badge: string;
  ev2Date: string;
  ev2City: string;
  ev2Time: string;
  ev2Title: string;
  ev2Desc: string;
  ev2Badge: string;
  locTag: string;
  locTitle: string;
  locDesc: string;
  loc1Tag: string;
  loc1MapTitle: string;
  loc2Tag: string;
  loc2MapTitle: string;
  calBtn1: string;
  calBtn1Aria: string;
  calBtn2: string;
  calBtn2Aria: string;
  icsProclamaSummary: string;
  icsProclamaDesc: string;
  icsFestaSummary: string;
  icsFestaDesc: string;
  rsvpTag: string;
  rsvpTitle: [string, string];
  rsvpDescPre: string;
  rsvpDescStrong: string;
  rsvpDescPost: string;
  fFirstName: string;
  fFirstNamePh: string;
  fLastName: string;
  fLastNamePh: string;
  fEmail: string;
  fEmailPh: string;
  fPartyQ: string;
  fPartyYes: string;
  fPartyNo: string;
  fCeremonyQ: string;
  fCeremonyYes: string;
  fCeremonyNo: string;
  fAdults: string;
  fChildren: string;
  fDiet: string;
  fDietPh: string;
  fMessage: string;
  fMessagePh: string;
  submit: string;
  sending: string;
  toastMissing: string;
  toastSent: string;
  footerSub: string;
  footerWait: string;
  rsvpFloatAria: string;
  scrollTopAria: string;
  reservedBtn: string;
  reservedBtnAria: string;
  loginTitle: string;
  loginDesc: string;
  loginCancel: string;
  loginSubmit: string;
  loginClose: string;
  toastWrongPwd: string;
}

export const COPY: Record<Lang, Copy> = {
  it: {
    docLang: "it",
    skip: "salta",
    muteAria: "Attiva o disattiva audio",
    navLogoSuffix: "// invito",
    navStats: "// stats",
    navProgram: "Programma",
    navPlaces: "Luoghi",
    navRsvp: "Conferma →",
    heroLabel: "// invito ufficiale · 2026",
    heroInvite: "Ho il piacere di invitarti a celebrare la mia laurea",
    heroSub: "Ingegneria Informatica · Politecnico di Torino",
    scrollHint: "scorri per scoprire",
    statsTag: "// 3 anni in numeri",
    statsTitle: ["I veri numeri dei", "miei ultimi 3 anni."],
    statsDesc: "Molto più onesto di un profilo LinkedIn. (Scorri)",
    stats: [
      {
        num: "1.847",
        title: "Ore di sonno sacrificate",
        description:
          "Notti in bianco tra progetti consegnati all'ultimo secondo e sveglie all'alba. Il caffè ringrazia, le occhiaie un po' meno.",
      },
      {
        num: "312",
        title: "Gin tonic di sopravvivenza",
        description:
          "Stima cautelativa. Ogni esame superato meritava un brindisi — e anche qualcuno di quelli andati male, per consolazione.",
      },
      {
        num: "12k+",
        title: "Ore fissando uno schermo",
        description:
          "Tra IDE aperti, slide infinite e bug che esistevano solo sul mio portatile. La vista non è più quella di prima.",
      },
      {
        num: "50+",
        title: "Voli tra Catania e Torino",
        description:
          "Tre anni da pendolare dei cieli: valigia sempre mezza pronta, bagaglio a mano ottimizzato al grammo e il check-in ormai a occhi chiusi.",
      },
      {
        num: "∞",
        title: "Volte che l'AI mi ha salvato",
        description:
          "Presenza fissa nelle nottate pre-esame. Orgogliosamente grato per il supporto tecnico e morale.",
      },
    ],
    termPrompt: "$ cat grazie.txt",
    termLines: [
      "Grazie per essere qui a festeggiare. Dietro questo traguardo",
      "ci sono ore di codice, caffè a fiumi e qualche assistente",
      "virtuale a fare il turno di notte... ma nulla di tutto ciò",
      "avrebbe avuto valore senza il vostro supporto, le serate",
      "per staccare la spina e la certezza di avervi sempre dalla mia parte.",
      "",
      "Grazie di cuore.",
    ],
    termSig: "— Daniel Leocata, Dott. in Ingegneria Informatica 🎓",
    cdTag: "// count down",
    cdTitle: "Mancano ancora",
    cdDesc: "Al gran festeggiamento del 3 ottobre 2026",
    cdDays: "Giorni",
    cdHours: "Ore",
    cdMinutes: "Minuti",
    cdSeconds: "Secondi",
    programTag: "// programma",
    programTitle: ["Due momenti,", "un solo traguardo"],
    programDesc:
      "Due appuntamenti speciali per celebrare questo percorso. Saremo felici di averti con noi.",
    ev1Date: "16 Settembre 2026",
    ev1City: "Torino",
    ev1Title: "Proclamazione",
    ev1Desc:
      "La cerimonia ufficiale di laurea presso il Politecnico di Torino. Il momento in cui anni di studio diventano un titolo. Dopo la cerimonia seguirà un bellissimo aperitivo.",
    ev1Badge: "Cerimonia Accademica",
    ev2Date: "3 Ottobre 2026",
    ev2City: "Biancavilla",
    ev2Time: "ore 20:00",
    ev2Title: "Festeggiamenti",
    ev2Desc:
      "La festa per celebrare insieme questo traguardo. Una serata speciale al Beauty Garden Banqueting, tra cibo, musica e affetti.",
    ev2Badge: "Cena di Gala",
    locTag: "// luoghi",
    locTitle: "Dove ci troviamo",
    locDesc: "Due luoghi, due momenti da non perdere.",
    loc1Tag: "16 Settembre · 10:00",
    loc1MapTitle: "Mappa: Politecnico di Torino, Corso Duca degli Abruzzi 24",
    loc2Tag: "3 Ottobre · 21:00",
    loc2MapTitle: "Mappa: Beauty Garden Banqueting, Contrada Don Assenzio, Biancavilla (Catania)",
    calBtn1: "Aggiungi Proclamazione",
    calBtn1Aria: "Aggiungi Proclamazione al calendario",
    calBtn2: "Aggiungi Festeggiamenti",
    calBtn2Aria: "Aggiungi Festeggiamenti al calendario",
    icsProclamaSummary: "Proclamazione di Laurea - Daniel Leocata",
    icsProclamaDesc: "Cerimonia di proclamazione di laurea in Ingegneria Informatica",
    icsFestaSummary: "Festeggiamenti Laurea - Daniel Leocata",
    icsFestaDesc: "Cena e festeggiamenti per la laurea",
    rsvpTag: "// rsvp",
    rsvpTitle: ["Conferma la tua", "presenza"],
    rsvpDescPre: "Facci sapere ",
    rsvpDescStrong: "entro i primi di settembre 2026",
    rsvpDescPost:
      " se potrai essere con noi — per entrambi gli eventi. L'invito è esteso anche ai tuoi accompagnatori.",
    fFirstName: "Nome",
    fFirstNamePh: "Mario",
    fLastName: "Cognome",
    fLastNamePh: "Rossi",
    fEmail: "Email",
    fEmailPh: "mario@esempio.it",
    fPartyQ: "Parteciperai alla festa del 3 ottobre?",
    fPartyYes: "Sì, ci sarò!",
    fPartyNo: "Purtroppo no",
    fCeremonyQ: "Verrai anche alla proclamazione (16 sett.)?",
    fCeremonyYes: "Sì",
    fCeremonyNo: "No",
    fAdults: "Adulti",
    fChildren: "Bambini",
    fDiet: "Note alimentari / allergie",
    fDietPh: "Vegetariano, celiaco, ecc. (opzionale)",
    fMessage: "Un messaggio per Daniel (opzionale)",
    fMessagePh: "Scrivi qualcosa di speciale…",
    submit: "Invia conferma",
    sending: "Invio in corso…",
    toastMissing: "Compila tutti i campi obbligatori.",
    toastSent: "Risposta inviata! A presto 🎓",
    footerSub: "Ingegneria Informatica · Politecnico di Torino · 2026",
    footerWait: "Ti aspettiamo 🎓",
    rsvpFloatAria: "Vai alla conferma di presenza",
    scrollTopAria: "Torna su",
    reservedBtn: "// area riservata",
    reservedBtnAria: "Area riservata — conferme RSVP",
    loginTitle: "Area Riservata",
    loginDesc: "Inserisci la password per accedere alle conferme ricevute.",
    loginCancel: "Annulla",
    loginSubmit: "Accedi",
    loginClose: "Chiudi",
    toastWrongPwd: "Password errata.",
  },
  en: {
    docLang: "en",
    skip: "skip",
    muteAria: "Toggle sound",
    navLogoSuffix: "// invitation",
    navStats: "// stats",
    navProgram: "Program",
    navPlaces: "Locations",
    navRsvp: "RSVP →",
    heroLabel: "// official invitation · 2026",
    heroInvite: "I'm delighted to invite you to celebrate my graduation",
    heroSub: "Computer Engineering · Politecnico di Torino",
    scrollHint: "scroll to discover",
    statsTag: "// 3 years in numbers",
    statsTitle: ["The real numbers of", "my last 3 years."],
    statsDesc: "Far more honest than a LinkedIn profile. (Scroll)",
    stats: [
      {
        num: "1,847",
        title: "Hours of sleep sacrificed",
        description:
          "Sleepless nights between projects submitted at the very last second and dawn alarms. Coffee says thanks; the dark circles, not so much.",
      },
      {
        num: "312",
        title: "Survival gin & tonics",
        description:
          "A conservative estimate. Every exam passed deserved a toast — and so did a few of the failed ones, for consolation.",
      },
      {
        num: "12k+",
        title: "Hours staring at a screen",
        description:
          "Between open IDEs, endless slides and bugs that only existed on my laptop. My eyesight has seen better days.",
      },
      {
        num: "50+",
        title: "Flights between Catania and Turin",
        description:
          "Three years as a sky commuter: suitcase always half-packed, carry-on optimised to the gram, and check-in done with my eyes closed.",
      },
      {
        num: "∞",
        title: "Times AI saved me",
        description:
          "A steady presence on pre-exam nights. Proudly grateful for the technical and moral support.",
      },
    ],
    termPrompt: "$ cat thanks.txt",
    termLines: [
      "Thank you for being here to celebrate. Behind this milestone",
      "are hours of code, rivers of coffee and the odd virtual",
      "assistant covering the night shift... but none of it",
      "would have meant anything without your support, the evenings",
      "spent unplugging, and the certainty of having you by my side.",
      "",
      "Thank you from the bottom of my heart.",
    ],
    termSig: "— Daniel Leocata, BSc in Computer Engineering 🎓",
    cdTag: "// count down",
    cdTitle: "Time left",
    cdDesc: "Until the big celebration on October 3, 2026",
    cdDays: "Days",
    cdHours: "Hours",
    cdMinutes: "Minutes",
    cdSeconds: "Seconds",
    programTag: "// program",
    programTitle: ["Two moments,", "one milestone"],
    programDesc:
      "Two special occasions to celebrate this journey. We'll be delighted to have you with us.",
    ev1Date: "September 16, 2026",
    ev1City: "Turin",
    ev1Title: "Graduation Ceremony",
    ev1Desc:
      "The official graduation ceremony at Politecnico di Torino. The moment years of study become a degree. A lovely aperitivo will follow the ceremony.",
    ev1Badge: "Academic Ceremony",
    ev2Date: "October 3, 2026",
    ev2City: "Biancavilla",
    ev2Time: "8:00 PM",
    ev2Title: "The Party",
    ev2Desc:
      "The party to celebrate this milestone together. A special evening at Beauty Garden Banqueting — food, music and loved ones.",
    ev2Badge: "Gala Dinner",
    locTag: "// locations",
    locTitle: "Where to find us",
    locDesc: "Two places, two moments not to miss.",
    loc1Tag: "September 16 · 10:00 AM",
    loc1MapTitle: "Map: Politecnico di Torino, Corso Duca degli Abruzzi 24",
    loc2Tag: "October 3 · 9:00 PM",
    loc2MapTitle: "Map: Beauty Garden Banqueting, Contrada Don Assenzio, Biancavilla (Catania)",
    calBtn1: "Add Ceremony",
    calBtn1Aria: "Add the Graduation Ceremony to your calendar",
    calBtn2: "Add Party",
    calBtn2Aria: "Add the Party to your calendar",
    icsProclamaSummary: "Graduation Ceremony - Daniel Leocata",
    icsProclamaDesc: "Graduation ceremony - BSc in Computer Engineering",
    icsFestaSummary: "Graduation Party - Daniel Leocata",
    icsFestaDesc: "Dinner and graduation celebrations",
    rsvpTag: "// rsvp",
    rsvpTitle: ["Confirm your", "attendance"],
    rsvpDescPre: "Let us know ",
    rsvpDescStrong: "by early September 2026",
    rsvpDescPost:
      " whether you can join us — for both events. The invitation extends to your plus-ones too.",
    fFirstName: "First name",
    fFirstNamePh: "John",
    fLastName: "Last name",
    fLastNamePh: "Smith",
    fEmail: "Email",
    fEmailPh: "john@example.com",
    fPartyQ: "Will you join the party on October 3?",
    fPartyYes: "Yes, I'll be there!",
    fPartyNo: "Sadly not",
    fCeremonyQ: "Will you also attend the ceremony (Sept 16)?",
    fCeremonyYes: "Yes",
    fCeremonyNo: "No",
    fAdults: "Adults",
    fChildren: "Children",
    fDiet: "Dietary notes / allergies",
    fDietPh: "Vegetarian, gluten-free, etc. (optional)",
    fMessage: "A message for Daniel (optional)",
    fMessagePh: "Write something special…",
    submit: "Send RSVP",
    sending: "Sending…",
    toastMissing: "Please fill in all required fields.",
    toastSent: "RSVP sent! See you soon 🎓",
    footerSub: "Computer Engineering · Politecnico di Torino · 2026",
    footerWait: "See you there 🎓",
    rsvpFloatAria: "Go to the RSVP form",
    scrollTopAria: "Back to top",
    reservedBtn: "// private area",
    reservedBtnAria: "Private area — RSVP responses",
    loginTitle: "Private Area",
    loginDesc: "Enter the password to view the RSVPs received.",
    loginCancel: "Cancel",
    loginSubmit: "Log in",
    loginClose: "Close",
    toastWrongPwd: "Wrong password.",
  },
};
