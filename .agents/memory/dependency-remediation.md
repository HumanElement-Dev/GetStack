---
name: Dependency remediation decisions
description: Security-driven Tailwind upgrade and npm override verification pitfalls.
---

Tailwind was upgraded to v4 for security remediation, not for a redesign. Retain the existing visual theme and component behavior.

**Why:** On 2026-10-09, `braces` had no patched release. Tailwind v3's dependency chain included it even on the latest v3 release, whereas v4 removed that chain. This deliberately adopts v4's modern browser baseline (Safari 16.4+, Chrome 111+, Firefox 128+).

**How to apply:** Do not downgrade styling tools to resolve incidental compatibility issues without checking whether that reintroduces the unpatched dependency. Reevaluate available fixes if older-browser support becomes a requirement.

Check the installed dependency tree as well as vulnerability scans after modifying npm overrides.

**Why:** A parent-scoped selector-parser override left an older nested dependency installed and marked invalid despite a successful install; a global override resolved it.

**How to apply:** Use `npm ls --all` and the dependency scanner before declaring remediation complete. A successful installation alone does not prove the override took effect.
