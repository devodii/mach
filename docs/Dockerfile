# Local preview for the MACH Gitbook.
#
# GitBook.com is hosted SaaS with no offline renderer, so we preview with honkit,
# the maintained fork of the legacy GitBook CLI. It reads the same SUMMARY.md
# that GitBook.com reads, so the navigation here is the navigation that ships.
FROM node:20-bookworm-slim

# The toolchain lives outside /docs so the bind mount cannot shadow it. The
# symlink at /node_modules is what lets Node (and honkit's plugin loader)
# resolve upward from /docs and find it.
WORKDIR /opt/honkit
COPY runtime.package.json ./package.json
RUN npm install --no-audit --no-fund \
 && ln -s /opt/honkit/node_modules /node_modules

# Local plugins, kept in the repo under docs/.honkit/ so the source of truth is
# versioned rather than baked into this image.
#   machhints:   teaches honkit GitBook's {% hint %} tag
#   machmermaid: renders ```mermaid fences with a current Mermaid
COPY .honkit/plugin-hints   /opt/honkit/node_modules/honkit-plugin-machhints
COPY .honkit/plugin-mermaid /opt/honkit/node_modules/honkit-plugin-machmermaid

# Vendor Mermaid into the plugin's assets, byte for byte.
#
# Do NOT wrap this bundle. It is an esbuild IIFE whose final statement is
# `globalThis.mermaid = globalThis.__esbuild_esm_mermaid.default`, and that
# relies on its top-level `var` actually landing on the global object. Wrapping
# it in a function makes the var function-scoped, the global assignment throws,
# and mermaid never registers. It uses no AMD branch, so RequireJS is a non-issue.
RUN cp /opt/honkit/node_modules/mermaid/dist/mermaid.min.js \
       /opt/honkit/node_modules/honkit-plugin-machmermaid/assets/mermaid.vendor.js

ENV PATH="/opt/honkit/node_modules/.bin:${PATH}"
ENV NODE_OPTIONS="--max-old-space-size=2048"

WORKDIR /docs
EXPOSE 4000 35729

# honkit never prunes its output directory, so a renamed or deleted page keeps
# serving from a previous run. Clearing _book on start makes the preview always
# reflect the current SUMMARY.md.
CMD ["sh", "-c", "rm -rf /docs/_book/* /docs/_book/.[!.]* 2>/dev/null; exec honkit serve --port 4000 --lrport 35729"]
