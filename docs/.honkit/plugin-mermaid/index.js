/**
 * Mermaid for the local honkit preview.
 *
 * The obvious choice, gitbook-plugin-mermaid-gb3, bundles a mermaid from the
 * v7 era. It silently renders an empty box for anything modern — `autonumber`,
 * `stateDiagram-v2`, `flowchart` — which is most of this specification. We
 * vendor a current Mermaid instead (see the Dockerfile) and drive it ourselves.
 *
 * GitBook.com renders ```mermaid fences natively, so none of this affects what
 * actually publishes; it exists so the preview tells the truth.
 */

module.exports = {
  book: {
    assets: "./assets",
    js: ["mermaid.vendor.js", "mermaid-init.js"],
    css: ["mermaid.css"],
  },

  hooks: {
    // honkit has already turned the fence into <pre><code class="lang-mermaid">.
    // Swapping it for a div leaves the source HTML-escaped, which is what we
    // want: the browser decodes the entities, and the init script reads the
    // original text back out with textContent.
    page(page) {
      page.content = page.content.replace(
        /<pre><code class="lang-mermaid">([\s\S]*?)<\/code><\/pre>/g,
        (_match, code) => `<div class="mermaid">${code}</div>`
      );
      return page;
    },
  },
};
