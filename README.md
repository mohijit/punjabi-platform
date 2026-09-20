# Learn Punjabi

A beginner's course in **Gurmukhi** and **spoken Punjabi**, built around the chain most
resources break: letter → sound → word → meaning → sentence → conversation.

Live at [punjabi.mohijitsingh.com](https://punjabi.mohijitsingh.com).

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export into out/
npm run check    # types, stray characters, transliteration, content
npm run lint
```

Node 22 (see `.node-version`).

## How it is put together

| Directory | What lives there |
|---|---|
| `app/` | Routes. Server Components by default; the lesson player is the client boundary. |
| `components/` | UI only. `exercise/` is one component per exercise type, all sharing one contract. |
| `content/` | Every Punjabi fact in the app, as typed data validated by Zod at module load. |
| `lib/` | Transliteration, audio, storage, progress, SRS and exercise checking. |
| `scripts/` | The checks behind `npm run check`. |

Two rules hold the thing together:

1. **No lesson content inside components.** A lesson is a data file listing steps; the
   player renders any lesson without bespoke code. Fixing a Punjabi mistake is a one-line
   edit in `content/`, never a change to UI.
2. **Nothing in `content/` imports React**, so the same data can back a future mobile app.

Learner data — progress, settings, saved words — is local-first. It lives in the browser's
own storage behind a `StorageAdapter`; there are no accounts and no server.

Punjabi audio plays from recordings only. There was a speech-synthesis fallback, reading
Gurmukhi through whatever `pa-IN` (or `hi-IN`) voice the device happened to ship; it
flattened the aspirates, missed the retroflexes and put the tone in the wrong place, so it
was removed rather than tuned. A beginner with no reference would have learned the wrong
pronunciation from the first lesson.

Every content entry keeps its `audio` field, so a recording drops in without touching a
component: `AudioButton` renders nothing until one exists, and a listening exercise with no
recording behind it is filtered out of the lesson rather than played in silence.
`npm run check` reports how many entries have recordings and which exercises are hidden.

## Correcting the Punjabi

Content accuracy matters more here than content volume. `content/SOURCES.md` records the
references used and the facts beginner resources commonly get wrong. `npm run check`
cross-checks hand-written romanisation against the transliteration engine, verifies that
every lesson reference resolves, and fails the build on a broken one.

If you spot an error, the fix is in `content/` — open the relevant file, correct the entry,
and run `npm run check`.

## Deploying

See [DEPLOY.md](DEPLOY.md).
