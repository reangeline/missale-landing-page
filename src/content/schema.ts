// Contrato de conteúdo: pt.json, en.json e es.json têm exatamente estas chaves.
// Todos os valores são texto puro (sem HTML nem Markdown).

export interface DayStep {
  /** Rótulo curto da etapa: "Manhã", "Tarde", "Noite". */
  label: string;
  title: string;
  body: string;
  /** Texto alternativo do print do app mostrado na etapa. */
  alt: string;
}

export interface Feature {
  title: string;
  body: string;
  /** Texto alternativo do print do app; vazio quando o cartão não tem imagem. */
  alt: string;
}

export interface Content {
  meta: {
    title: string;
    description: string;
    /** Texto alternativo da imagem de Open Graph. */
    ogAlt: string;
  };
  nav: {
    skip: string;
    day: string;
    features: string;
    privacy: string;
    pricing: string;
    /** Rótulo acessível do seletor de idioma. */
    language: string;
  };
  cta: {
    download: string;
    soon: string;
    /** Linha discreta ao lado do "Em breve" (aparelhos em que o app chega). */
    soonNote: string;
  };
  hero: {
    title: string;
    subtitle: string;
    greeting: { neutral: string; morning: string; afternoon: string; night: string };
    /** Frase curta em destaque conforme a hora; `neutral` é usada sem JavaScript. */
    line: { neutral: string; morning: string; afternoon: string; night: string };
    video: { caption: string; play: string; pause: string };
  };
  day: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: { morning: DayStep; afternoon: DayStep; night: DayStep };
  };
  gratitude: {
    eyebrow: string;
    /** A pergunta, usada como título e como rótulo do campo. */
    question: string;
    placeholder: string;
    submit: string;
    note: string;
    done: string;
    again: string;
  };
  features: {
    eyebrow: string;
    title: string;
    intro: string;
    items: { word: Feature; rosary: Feature; checkin: Feature; bible: Feature; formation: Feature };
  };
  guidance: {
    eyebrow: string;
    title: string;
    intro: string;
    /** Três passos: você escreve, o app escolhe, você recebe. */
    steps: { title: string; body: string }[];
    care: string;
    disclaimer: string;
  };
  privacy: {
    eyebrow: string;
    title: string;
    lead: string;
    exceptionsTitle: string;
    /** Exatamente duas: orientação sob toque; personalização opcional de assinantes. */
    exceptions: { title: string; body: string }[];
    points: string[];
    link: string;
  };
  pricing: {
    eyebrow: string;
    title: string;
    intro: string;
    free: { title: string; tagline: string; items: string[] };
    premium: { title: string; tagline: string; items: string[] };
    trial: string;
    priceNote: string;
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
  footer: {
    privacy: string;
    terms: string;
    support: string;
    contact: string;
    languages: string;
    help: string;
    line: string;
  };
  legal: {
    privacyTitle: string;
    privacyDescription: string;
    termsTitle: string;
    termsDescription: string;
    /** Nota acima dos termos: link para o EULA padrão da Apple. */
    eulaNote: string;
    eulaLink: string;
    back: string;
  };
  support: {
    title: string;
    description: string;
    intro: string;
    emailLabel: string;
    sections: { title: string; body: string[] }[];
  };
}
