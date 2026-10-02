# `export * from "./x.js"` (TypeScript NodeNext) silently disables live rebinding of a shared singleton

Minimal reproduction for `@module-federation/vite` 1.23.0 + Vite 8.3.2.

Two workspace packages are shared as singletons. They are identical except for one line in their entry file:

| Package        | `src/index.ts`                                          |
| -------------- | ------------------------------------------------------- |
| `shared-named` | `export { ValueContext, useValue } from "./context.js";` |
| `shared-star`  | `export * from "./context.js";`                          |

Both follow the TypeScript `moduleResolution: "NodeNext"` convention: relative specifiers carry the emitted extension (`./context.js`), while the file on disk is `context.ts` (`pnpm typecheck` passes).

The host renders a provider for both contexts and loads `remote/Widget`, which reads both contexts.

## Steps

```bash
pnpm install
pnpm build
pnpm check     # prints the canLiveRebind flag generated for each share of the remote
pnpm preview   # host on http://localhost:4173, remote on http://localhost:4174
```

Open http://localhost:4173.

## Expected

Both lines show `provided by host`: the remote uses the host's singleton instance of both packages.

## Actual

```
shared-named (export { ... } from "./context.js"): provided by host
shared-star (export * from "./context.js"): null - remote used its own copy
```

`pnpm check`:

```
react          canLiveRebind: true
react/jsx-runtime canLiveRebind: true
react-dom      canLiveRebind: true
shared-named   canLiveRebind: true
shared-star    canLiveRebind: false
```

No warning is emitted during the build.

## Cause

`resolveRelativeModule` (`src/virtualModules/virtualShared_preBuild.ts`) cannot resolve `./context.js` to `context.ts`. It tries the exact path, then appends extensions (`./context.js.ts`, …), then `index.*`. The `export *` target is never found, so the export scan is incomplete and the share is generated with `canLiveRebind: false`.

`suggested-fix.patch` (against the published `lib/index.js`) maps `.js`/`.jsx` → `.ts`/`.tsx`, `.mjs` → `.mts` and `.cjs` → `.cts` after the exact-path check. With it applied, `pnpm check` reports `true` for `shared-star` and both lines show `provided by host`. To try it:

```bash
pnpm patch @module-federation/vite@1.23.0          # prints <dir>
patch -p1 -d <dir> < suggested-fix.patch
pnpm patch-commit <dir>
pnpm build && pnpm check
```
