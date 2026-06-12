---
name: TanStack Query stale error caching
description: Global queryClient defaults cache errors forever; auth-gated or volatile endpoints need per-query overrides.
---

The global queryClient in this project sets `staleTime: Infinity` and `retry: false`. This means if a query ever errors (e.g. due to a wrong URL, a 403, or a transient DNS failure), the error is cached permanently for that queryKey. Subsequent renders of the same component will immediately show the error state without re-fetching.

**Why:** The defaults are set this way to avoid hammering APIs, but they're too aggressive for endpoints that may fail transiently or whose query keys change between sessions.

**How to apply:** For any endpoint that is auth-gated, premium-gated, or depends on external resources (DNS, third-party APIs), set `staleTime: 0` and `retry: 1` on the individual `useQuery` call to ensure fresh fetches on mount and one automatic retry.

```ts
useQuery({
  queryKey: [...],
  staleTime: 0,
  retry: 1,
})
```
