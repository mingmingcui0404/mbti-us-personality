window.MBTI_SITE_CONFIG = Object.assign({
  siteUrl: "https://mbti-us-personality.pages.dev",
  amazonTag: "REPLACE_WITH_AMAZON_ASSOCIATE_TAG",
  analyticsToken: "REPLACE_WITH_CLOUDFLARE_WEB_ANALYTICS_TOKEN"
}, window.MBTI_SITE_CONFIG || {});

const MBTI_TYPES = {
  ISTJ: ["The Logistician", "Practical, steady, detail-led, and dependable under pressure."],
  ISFJ: ["The Protector", "Warm, dutiful, observant, and quietly committed to people."],
  INFJ: ["The Advocate", "Insightful, principled, private, and driven by meaning."],
  INTJ: ["The Strategist", "Independent, analytical, future-oriented, and exacting."],
  ISTP: ["The Virtuoso", "Hands-on, calm, adaptive, and good at solving immediate problems."],
  ISFP: ["The Composer", "Gentle, aesthetic, values-led, and responsive to the moment."],
  INFP: ["The Mediator", "Imaginative, empathetic, idealistic, and personally authentic."],
  INTP: ["The Analyst", "Curious, skeptical, abstract, and happiest inside complex ideas."],
  ESTP: ["The Dynamo", "Energetic, direct, tactical, and ready to test what works."],
  ESFP: ["The Performer", "Expressive, social, generous, and tuned to lived experience."],
  ENFP: ["The Campaigner", "Enthusiastic, possibility-seeking, people-centered, and inventive."],
  ENTP: ["The Debater", "Fast, experimental, strategic, and energized by challenge."],
  ESTJ: ["The Executive", "Organized, decisive, direct, and motivated by measurable progress."],
  ESFJ: ["The Consul", "Community-minded, attentive, helpful, and relationship-aware."],
  ENFJ: ["The Mentor", "Charismatic, values-driven, encouraging, and focused on growth."],
  ENTJ: ["The Commander", "Ambitious, structured, confident, and built for long-range action."]
};

function withAmazonTag(url) {
  const tag = window.MBTI_SITE_CONFIG.amazonTag;
  const target = new URL(url);
  if (tag && !tag.startsWith("REPLACE_")) {
    target.searchParams.set("tag", tag);
  }
  return target.toString();
}

function initAffiliateLinks() {
  document.querySelectorAll("a[data-amazon]").forEach((link) => {
    link.href = withAmazonTag(link.href);
    link.rel = "sponsored nofollow noopener";
    link.target = "_blank";
  });
}

function initTypeGrid() {
  const grid = document.querySelector("[data-type-grid]");
  if (!grid) return;
  grid.innerHTML = Object.entries(MBTI_TYPES).map(([code, [role, summary]]) => `
    <a class="type-card" href="/en/results/${code.toLowerCase()}.html">
      <div class="type-code">${code}</div>
      <div class="type-role">${role}</div>
      <p>${summary}</p>
    </a>
  `).join("");
}

function initQuiz() {
  const form = document.querySelector("[data-quiz]");
  const result = document.querySelector("[data-quiz-result]");
  if (!form || !result) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const axes = { EI: 0, SN: 0, TF: 0, JP: 0 };
    for (const [name, value] of data.entries()) {
      axes[name] += Number(value);
    }
    const code = [
      axes.EI >= 0 ? "E" : "I",
      axes.SN >= 0 ? "S" : "N",
      axes.TF >= 0 ? "T" : "F",
      axes.JP >= 0 ? "J" : "P"
    ].join("");
    const [role, summary] = MBTI_TYPES[code];
    result.classList.add("is-visible");
    result.innerHTML = `
      <h3>Your likely type: ${code}, ${role}</h3>
      <p>${summary}</p>
      <a href="/en/results/${code.toLowerCase()}.html">Read the full ${code} result page</a>
    `;
    window.dispatchEvent(new CustomEvent("mbti:quiz-complete", { detail: { type: code } }));
  });
}

function initPageViews() {
  const key = `mbti-us:pv:${location.pathname}`;
  const views = Number(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, String(views));
  document.querySelectorAll("[data-local-pv]").forEach((node) => {
    node.textContent = `${views} local view${views === 1 ? "" : "s"}`;
  });

  const token = window.MBTI_SITE_CONFIG.analyticsToken;
  if (token && !token.startsWith("REPLACE_")) {
    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.setAttribute("data-cf-beacon", JSON.stringify({ token }));
    document.head.appendChild(script);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initAffiliateLinks();
  initTypeGrid();
  initQuiz();
  initPageViews();
});

