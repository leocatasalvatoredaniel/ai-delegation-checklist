/**
 * RSVP backend wiring. These values are client-side by design (same as the
 * original static site) — no new secrets are exposed here.
 */
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
