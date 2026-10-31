/**
 * Plain text from user-entered content that may contain HTML (older
 * assignment descriptions were rich text). Parsing with DOMParser never
 * executes scripts, unlike injecting the HTML into the page, so this is
 * safe to render as text.
 */
export const htmlToText = (html) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(
    String(html)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li)>/gi, "$&\n"),
    "text/html",
  );
  return doc.body.textContent.replace(/\n{3,}/g, "\n\n").trim();
};

/** Single-line preview, truncated with an ellipsis. */
export const previewText = (html, max = 120) => {
  const text = htmlToText(html).replace(/\s+/g, " ");
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
};
