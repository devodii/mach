/* global require */
require(["gitbook"], function (gitbook) {
  var seq = 0;

  function render() {
    if (!window.mermaid) return;

    var nodes = [].slice.call(
      document.querySelectorAll("div.mermaid:not([data-processed])")
    );
    if (!nodes.length) return;

    window.mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      securityLevel: "loose",
      fontFamily: "inherit",
    });

    nodes.forEach(function (node) {
      var source = (node.textContent || "").trim();
      // Mark first: honkit fires page.change more than once per navigation and
      // a second pass would render into a node already holding an SVG.
      node.setAttribute("data-processed", "true");

      window.mermaid
        .render("mermaid-svg-" + seq++, source)
        .then(function (result) {
          node.innerHTML = result.svg;
        })
        .catch(function (err) {
          // Surface the parse error instead of leaving a silent empty box —
          // that failure mode is exactly what this plugin exists to fix.
          node.innerHTML =
            '<pre class="mermaid-error">Mermaid error: ' +
            String((err && err.message) || err) +
            "</pre>";
        });
    });
  }

  gitbook.events.bind("start", render);
  gitbook.events.bind("page.change", render);
});
