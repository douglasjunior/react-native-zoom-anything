# Repository Instructions

These instructions tell AI coding tools (and contributors) how to work in this repository. Keep messages, code, and docs consistent with the following guidance.

## Language policy (important)
- Chat responses: match the author's language 
- Commit messages: ALWAYS write in English. Never use other languages in commit messages.
- Use Conventional Commits format and imperative mood.

## Project overview
- Name: `react-native-zoom-anything`
- Purpose: A pinch-to-zoom, pan, and double-tap zoom container for React Native using `react-native-gesture-handler` and the built-in `Animated` API (no Reanimated required).
- Target environment: React Native >= 0.69, TypeScript 5.
- Public API: `Zoom` component exported from `src/index.ts`.

## Tech & structure
- Language: TypeScript
- Source files: `src/Zoom.tsx`, `src/index.ts`
- Package entry fields: `main`, `react-native` -> `src`
- Build: `yarn build` (runs `tsc`) — optional for consumers, since TS sources are shipped
- Publish helper: `yarn publish-script` (delegates to `scripts/publish.js`)

## Coding conventions
- Use strict TypeScript where practical.
- Prefer explicit types for public APIs and event payloads.
- Keep the component unopinionated: layout and sizing are controlled by the consumer.
- Avoid adding heavy dependencies. This lib should remain lightweight.

## React Native specifics
- Use `react-native-gesture-handler` gestures (Pinch, Pan, Tap) and `Animated` for transforms.
- Do not add `react-native-reanimated` as a dependency.
- Ensure styles are platform-safe (Android/iOS) and avoid layout assumptions.

## Dependencies
- peerDependencies: `react-native` (>= 0.69), `react-native-gesture-handler` (>= 2.5)
- No direct peer dependency on `react` in this package.

## Documentation
- Write docs in English.
- Update `README.md` when public APIs or requirements change.

## Tests
- If you add tests, prefer lightweight unit tests. Keep them out of any publishable output.

## Commit messages (English only)
- All commit messages must be written in English.
- Always follow Conventional Commits strictly:
  - Format: `<type>(<scope>): <short imperative summary>`
  - Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`.
  - Scope: required (use a concise area like `zoom`, `pan`, `readme`, `config`).
  - Subject: imperative mood, max 72 characters. If longer, rewrite to be concise and move details to the body.
  - Line wrap: body lines wrapped at ~72 chars.

Template:

```
<type>(<scope>): <short imperative summary>

Why: <optional one-liner>
What: <optional one-liner>
```

Good examples:
- `feat(zoom): add double-tap to toggle between mid and max scale`
- `fix(pan): clamp inertia projection to container bounds`
- `docs(readme): add installation notes for RNGH`
- `chore(gitattributes): vendorize scripts directory for linguist`

Avoid (too long subject):
- `chore: update .gitattributes to include scripts directory as linguist-vendored`
  -> Prefer: `chore(gitattributes): vendorize scripts directory for linguist`

## Pull requests
- Keep PRs focused and small when possible.
- Include a short summary, screenshots/video if UI behavior changes.
- Update docs and types along with code changes.

## Issue reporting
- Use English when opening issues.
- Include RN versions, platform(s), reproduction steps, and logs.

## Non-goals
- No additional gesture or animation frameworks beyond RNGH and Animated.
- No platform-specific code unless necessary to fix a real bug.
