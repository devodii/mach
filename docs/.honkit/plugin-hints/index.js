/**
 * GitBook.com renders `{% hint style="..." %}` natively; honkit does not know
 * the tag and fails the page outright. Rather than strip hints from the source
 * — which would make the local preview diverge from what actually ships — we
 * translate them into blockquotes.
 *
 * The source stays valid GitBook. Both renderers show a callout.
 */

const LABELS = {
  info: "Note",
  success: "Note",
  warning: "Warning",
  danger: "Important",
};

module.exports = {
  blocks: {
    hint: {
      process(blk) {
        const style = (blk.kwargs && blk.kwargs.style) || "info";
        const label = LABELS[style] || LABELS.info;
        const body = String(blk.body || "").trim();

        const quoted = body
          .split("\n")
          .map((line) => (line.length ? `> ${line}` : ">"))
          .join("\n");

        // `parse: true` runs the result back through the markdown pipeline.
        // Returning a bare string instead would be inserted post-render and
        // HTML-escaped, printing the markup literally.
        return {
          body: `> **${label}**\n>\n${quoted}\n`,
          parse: true,
        };
      },
    },
  },
};
