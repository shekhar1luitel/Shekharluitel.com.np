const storageKey = "site-theme";
const doc = document.documentElement;
const select = document.querySelector("[data-theme-select]");

const prefersDark = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : { matches: false };

function applyTheme(value, persist = true) {
  if (value === "system" || !value) {
    const systemTheme = prefersDark.matches ? "dark" : "light";
    doc.dataset.theme = "system";
    doc.dataset.resolvedTheme = systemTheme;
    if (persist) {
      window.localStorage.removeItem(storageKey);
    }
    return;
  }

  doc.dataset.theme = value;
  doc.dataset.resolvedTheme = value === "dark" ? "dark" : "light";
  if (persist) {
    window.localStorage.setItem(storageKey, value);
  }
}

if (select) {
  const stored = window.localStorage.getItem(storageKey);
  const initial = stored || doc.dataset.theme || "system";
  applyTheme(initial, false);
  select.value = initial;

  select.addEventListener("change", () => {
    applyTheme(select.value);
  });
}

const handleSystemChange = () => {
  if (doc.dataset.theme === "system") {
    applyTheme("system", false);
  }
};

if (prefersDark && typeof prefersDark.addEventListener === "function") {
  prefersDark.addEventListener("change", handleSystemChange);
} else if (prefersDark && typeof prefersDark.addListener === "function") {
  prefersDark.addListener(handleSystemChange);
}
