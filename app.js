import { calculateScore } from "./calculator.js";

const yesNo = (id, label, weight) => ({
  id,
  label,
  options: [
    ["Oui", weight],
    ["Non", 0],
  ],
});

const sections = [
  {
    title: "Ta situation financière actuelle et anticipée",
    questions: [
      {
        id: "income",
        label: "Montant net mensuel de l'ensemble de tes revenus et prestations sociales, après cotisations et impôt sur le revenu",
        type: "income",
      },
      yesNo("physical-work", "Ton emploi a des conséquences sur ton corps, hors stress", -50),
      yesNo("precarious-work", "Tu estimes que ton emploi est précaire, par exemple un statut d'indépendant par contrainte", -100),
      yesNo("unpayable-debt", "Tu as des dettes que tu ne peux pas payer, hors emprunt immobilier", -50),
      {
        id: "financial-assets",
        label: "Valeur totale de ton patrimoine financier : comptes, épargne, actions ou parts dans une entreprise",
        options: [
          ["Moins de 5 000 €", 0],
          ["5 000 à 15 000 €", 50],
          ["15 000 à 30 000 €", 100],
          ["30 000 à 60 000 €", 150],
          ["Plus de 60 000 €", 200],
        ],
      },
      yesNo("home-owner", "Tu es propriétaire de ton logement, même avec un emprunt en cours", 150),
      yesNo("other-property", "Tu possèdes d'autres biens immobiliers que ton logement", 250),
      yesNo("no-housing-cost", "Tu n'as ni loyer ni remboursement d'emprunt immobilier", 100),
      {
        id: "inheritance",
        label: "Au cours de ta vie, tu vas recevoir un héritage ou une donation d'une valeur estimée à",
        options: [
          ["Aucun ou autre montant", 0],
          ["50 000 à 100 000 €", 50],
          ["150 000 à 300 000 €", 100],
          ["300 000 à 500 000 €", 150],
          ["Plus de 500 000 €", 250],
        ],
      },
      yesNo("parents-home-help", "Tes parents ont les moyens de t'aider à acheter un bien immobilier, indépendamment de vos relations et de ton envie d'acheter", 100),
      yesNo("family-support", "Ta famille peut te soutenir financièrement sans faire de sacrifices", 50),
      yesNo("support-relatives", "Tu envoies structurellement de l'argent à ta famille ou à des proches en difficulté", -100),
    ],
  },
  {
    title: "Ta situation personnelle",
    questions: [
      yesNo("ableism-health", "Tu subis du validisme ou les conséquences d'une maladie ou d'un handicap", -100),
      yesNo("discrimination", "Tu subis de la discrimination à l'emploi ou au logement liée notamment au racisme, à l'origine, à la religion, à la langue, au genre ou à l'orientation sexuelle", -100),
      yesNo("multiple-discriminations", "Tu subis plusieurs discriminations", -100),
      yesNo("police-fear", "Tu as peur de la justice ou de la police en raison de discriminations", -50),
      yesNo("network-help", "Tes parents ou ton entourage te permettent d'obtenir plus facilement un emploi ou un logement, par leur réseau ou leur caution", 50),
      {
        id: "education",
        label: "Le niveau d'études le plus haut que tu as atteint",
        options: [
          ["Bac ou moins", -75],
          ["Licence, BTS, DUT ou équivalent", 50],
          ["Master ou plus", 100],
        ],
      },
      yesNo("grande-ecole", "Tu es diplômé·e d'une grande école : ingénierie, Sciences Po, commerce, architecture…", 50),
    ],
  },
  {
    title: "Ta situation familiale",
    questions: [
      yesNo("couple", "Tu vis en couple", 100),
      yesNo("partner-discrimination", "Si tu vis en couple, ton ou ta partenaire subit des discriminations", -50),
      yesNo("higher-income-partner", "Si tu vis en couple, ton ou ta partenaire gagne plus que toi et tu en bénéficies", 50),
      {
        id: "dependants",
        label: "Nombre d'enfants ou de personnes à charge",
        type: "number",
        multiplier: -100,
      },
      yesNo("single-parent", "Tu élèves seul·e un ou plusieurs enfants", -100),
    ],
  },
  {
    title: "L'environnement dans lequel tu as grandi",
    questions: [
      yesNo("support-precarious-work", "Tes soutiens financiers avaient des contrats courts, précaires ou un travail physique", -50),
      yesNo("support-physical-work", "Leur emploi a eu des conséquences sur leur corps, hors stress", -20),
      yesNo("support-no-secondary", "Ton soutien financier n'a pas terminé ses études secondaires", -25),
      yesNo("support-higher-education", "Un ou plusieurs de tes soutiens financiers ont fait des études supérieures", 50),
      yesNo("shared-clothes", "Pour des raisons financières, tu as dû partager tes vêtements avec tes adelphes", -20),
      yesNo("costly-hobby", "Tu as pratiqué la musique, le dessin, le hockey, le tennis ou l'escalade", 30),
      yesNo("restaurants", "Tu allais au restaurant durant ton enfance ou ton adolescence", 10),
      yesNo("youth-movement", "Toi ou tes adelphes avez fait partie d'un mouvement de jeunesse, comme les scouts", 10),
      yesNo("pocket-money", "Tu avais de l'argent de poche durant ton enfance ou ton adolescence", 10),
      yesNo("culture", "Tu participais à des activités culturelles, hors cinéma, durant ton enfance ou ton adolescence", 20),
      yesNo("doctor", "Tu allais régulièrement chez le médecin, hors transition de genre, handicap ou maladie chronique", 10),
      yesNo("alternative-medicine", "Tu consultais des médecines alternatives, hors médecines traditionnelles de ta culture", 25),
      yesNo("foreign-holidays", "Toi ou tes adelphes partiez souvent à l'étranger, hors retours dans le pays d'origine de tes parents", 30),
      yesNo("parents-properties", "Tes parents possèdent plusieurs biens immobiliers, hors maison dans leur pays d'origine s'ils ont immigré", 75),
      yesNo("study-support", "Tes parents te soutiennent ou t'ont soutenu·e financièrement pendant tes études", 50),
    ],
  },
];

const form = document.querySelector("#questionnaire");
const sectionsContainer = document.querySelector("#sections");
const result = document.querySelector("#result");
const score = document.querySelector("#score");
const error = document.querySelector("#form-error");

function renderQuestion(question) {
  if (question.type === "income" || question.type === "number") {
    const minimum = question.type === "income" ? 0 : 0;
    return `
      <div class="question">
        <label class="number-label" for="${question.id}">${question.label}</label>
        <input id="${question.id}" name="${question.id}" type="number" min="${minimum}" step="1" inputmode="numeric" required>
      </div>`;
  }

  const choices = question.options
    .map(([label, value], index) => `
      <label class="choice">
        <input type="radio" name="${question.id}" value="${value}" ${index === 0 ? "required" : ""}>
        <span>${label}</span>
      </label>`)
    .join("");

  return `<fieldset class="question"><legend>${question.label}</legend><div class="choices">${choices}</div></fieldset>`;
}

sectionsContainer.innerHTML = sections
  .map((section, index) => `
    <section class="question-section" aria-labelledby="section-${index}">
      <h2 id="section-${index}">${section.title}</h2>
      ${section.questions.map(renderQuestion).join("")}
    </section>`)
  .join("");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    error.textContent = "Réponds à toutes les questions avant de lancer le calcul.";
    error.hidden = false;
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const weightedAnswers = [];

  for (const section of sections) {
    for (const question of section.questions) {
      if (question.type === "income") continue;
      const value = Number(data.get(question.id));
      weightedAnswers.push(question.type === "number" ? value * question.multiplier : value);
    }
  }

  score.value = calculateScore(data.get("income"), weightedAnswers);
  error.hidden = true;
  result.hidden = false;
  result.focus();
  result.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#restart").addEventListener("click", () => {
  form.reset();
  result.hidden = true;
  error.hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
});
