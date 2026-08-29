(function () {
  "use strict";

  var seq = 0;

  function draw(node) {
    var source = (node.textContent || "").trim();
    if (!source) return;

    // Mark before rendering: honkit fires its page events more than once per
    // navigation, and a second pass would render into a node that already
    // holds an SVG.
    node.setAttribute("data-processed", "true");

    window.mermaid
      .render("mermaid-svg-" + seq++, source)
      .then(function (result) {
        node.innerHTML = result.svg;
      })
      .catch(function (err) {
        // Show the parse error rather than leaving a silent block of raw
        // source, which is the failure this plugin exists to prevent.
        node.innerHTML =
          '<pre class="mermaid-error">Mermaid error: ' +
          String((err && err.message) || err) +
          "</pre>";
      });
  }

  function render() {
    var nodes = document.querySelectorAll("div.mermaid:not([data-processed])");
    if (!nodes.length) return true;
    if (!window.mermaid) return false;

    window.mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      securityLevel: "loose",
      fontFamily: "inherit",
    });

    Array.prototype.forEach.call(nodes, draw);
    return true;
  }

  // Poll briefly rather than binding to a single lifecycle event. The vendor
  // bundle and this file are separate <script> tags, and honkit's own "start"
  // event can fire before either has run, so any one hook is a race.
  function renderWhenReady() {
    var attempts = 0;
    (function attempt() {
      if (render()) return;
      if (++attempts > 100) return; // ~10s, then give up quietly
      setTimeout(attempt, 100);
    })();
  }

  renderWhenReady();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderWhenReady);
  }
  window.addEventListener("load", renderWhenReady);

  // honkit swaps page content in place when navigating between pages.
  if (window.gitbook && window.gitbook.events) {
    window.gitbook.events.bind("page.change", renderWhenReady);
  } else if (typeof window.require === "function") {
    window.require(["gitbook"], function (gitbook) {
      gitbook.events.bind("page.change", renderWhenReady);
    });
  }
})();
