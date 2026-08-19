# AGENTS.md

## Cursor Cloud specific instructions

### What this repository is

This is a **documentation / knowledge repository**, not a software project. There is no
package manager, build system, test suite, linter, or backend service.

- `Agent/` — an Obsidian vault of markdown "paper cards" about LLM agents (each `.md` has
  YAML frontmatter), with `Agent/README.md` acting as a wikilink index.
- `article/` — a Chinese markdown article and one standalone static HTML explainer,
  `article/craft-kdd-cup-2026-academic.html` (CRAFT / KDD Cup 2026). This HTML file is the
  only runnable "application".
- `表1-Agent.base` — an Obsidian "Bases" plugin table view definition over `Agent/`.
- `.agents/skills/` + `skills-lock.json` — Cursor skill definitions. The Python stubs under
  `.agents/skills/*/scripts/run.py` import an external `tooling` package that does **not**
  exist in this repo, so they are **not runnable here** (they are scaffolding pointing at
  external GitHub sources listed in `skills-lock.json`). Do not treat them as an app.

### Running the "application"

The HTML article is fully self-contained (inline CSS; KaTeX loaded from a CDN, so network
access is required for formulas to render). Serve the repo root with any static server and
open the article, e.g.:

```
python3 -m http.server 8000    # from the repo root
# then open http://localhost:8000/article/craft-kdd-cup-2026-academic.html
```

`python3` is preinstalled; nothing needs to be installed to run this.

### Lint / test / build

None are configured. There is nothing to compile or unit-test. "Editing" this repo means
editing markdown/HTML; verification is visual (render the HTML in a browser and confirm the
KaTeX formulas typeset as math rather than raw `$...$` text).

### Notes

- `.gitignore` excludes `.obsidian/`; the Obsidian workspace config is intentionally not
  committed, so the vault is meant to be opened in a local Obsidian install (not available
  in the cloud VM) — use a plain markdown viewer or the static server above instead.
- There are no environment variables or secrets required.
