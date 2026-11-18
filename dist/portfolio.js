const sectionLinks = Array.from(document.querySelectorAll(".site-header nav a"));
const scrollTopButton = document.querySelector(".scroll-top");
const wordmark = document.querySelector(".wordmark");

function updateCurrentSection() {
  const target = document.getElementById(location.hash.slice(1));
  const section = target?.closest("section");
  const current = sectionLinks.find((link) => link.hash === "#" + section?.id) ?? sectionLinks[0];

  for (const link of sectionLinks) {
    if (link === current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}

function updateScrollTopButton() {
  const atTop = window.scrollY < 1;
  if (scrollTopButton.inert === atTop) return;
  if (atTop && document.activeElement === scrollTopButton) wordmark.focus({ preventScroll: true });
  scrollTopButton.inert = atTop;
}

window.addEventListener("hashchange", updateCurrentSection);
window.addEventListener("scroll", updateScrollTopButton, { passive: true });
window.addEventListener("pageshow", updateScrollTopButton);
scrollTopButton.addEventListener("click", () => {
  wordmark.focus({ preventScroll: true });
  if (location.hash && location.hash !== "#top") {
    history.pushState(null, "", "#top");
    updateCurrentSection();
  }
  window.scrollTo({ top: 0 });
});
updateCurrentSection();
updateScrollTopButton();

const commandForm = document.querySelector("#terminal-form");
const commandInput = document.querySelector("#terminal-input");
const terminalOutput = document.querySelector("#terminal-output");
const lastCommand = document.querySelector("#last-command");
const terminalHint = document.querySelector("#terminal-hint");
const initialFacts = terminalOutput.firstElementChild.cloneNode(true);

const commands = new Map([
  ["help", () => [...commands.keys()].join(" · ")],
  ["whoami", () => initialFacts.cloneNode(true)],
  ["skills", () => sectionLink("See the toolkit", "#skills")],
  ["projects", () => sectionLink("Browse projects and collaborations", "#projects")],
  ["contact", () => sectionLink("Open the contact section", "#contacts")],
  ["clear", () => ""],
]);

function sectionLink(text, href) {
  const link = document.createElement("a");
  link.textContent = text;
  link.href = href;
  return link;
}

function runCommand(value) {
  const command = value.trim().toLowerCase();
  commandInput.value = "";
  if (!command) return;

  const result = commands.get(command);
  lastCommand.parentElement.hidden = command === "clear";
  lastCommand.textContent = command;
  terminalOutput.replaceChildren(result ? result() : "Unknown command. Type help to see available commands.");
}

commandForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(commandInput.value);
});

document.querySelector("#terminal-help").addEventListener("click", () => {
  runCommand("help");
  commandInput.focus();
});

commandForm.hidden = false;
terminalHint.hidden = false;

const palette = document.querySelector("#palette");
const colors = Array.from(palette.querySelectorAll("[data-color]"));
const accentKey = "maarij-portfolio-accent";
const themeColor = document.querySelector('meta[name="theme-color"]');

function setAccent(color) {
  const root = document.documentElement;
  root.dataset.accent = color;
  themeColor.content = getComputedStyle(root).getPropertyValue("--body").trim();
  for (const button of colors) {
    button.setAttribute("aria-pressed", String(button.dataset.color === color));
  }
}

try {
  const saved = localStorage.getItem(accentKey);
  if (colors.some((button) => button.dataset.color === saved)) setAccent(saved);
} catch {
  // Accent selection also works when storage is unavailable.
}

for (const button of colors) {
  button.addEventListener("click", () => {
    const color = button.dataset.color;
    setAccent(color);
    try {
      localStorage.setItem(accentKey, color);
    } catch {
      // The selected accent still applies for this page view.
    }
  });
}

palette.hidden = false;

const contactForm = document.querySelector("#contact-form");
const contactMessage = contactForm.elements.namedItem("message");

contactMessage.addEventListener("input", () => contactMessage.setCustomValidity(""));

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = new FormData(contactForm);
  const message = fields.get("message").trim().replace(/\r?\n/g, "\r\n");
  if (!message) {
    contactMessage.setCustomValidity("Enter a message.");
    contactMessage.reportValidity();
    return;
  }

  const subject = encodeURIComponent(fields.get("topic"));
  const body = encodeURIComponent([
    message,
    "",
    fields.get("name").trim(),
    fields.get("email").trim(),
  ].join("\r\n"));
  window.location.href = contactForm.getAttribute("action") + "?subject=" + subject + "&body=" + body;
});
