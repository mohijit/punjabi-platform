/**
 * Applies the saved theme before first paint so a learner who chose dark
 * never sees a white flash. Kept deliberately tiny and dependency-free
 * because it runs synchronously in <head>.
 */
const script = `
(function () {
  try {
    var raw = localStorage.getItem("punjabi.v1.settings");
    var theme = raw ? (JSON.parse(raw) || {}).theme : "system";
    if (theme === "dark" || theme === "light") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
