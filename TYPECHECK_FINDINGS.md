# Typecheck findings

Bugs and inconsistencies surfaced by enabling `npm run build` (`tsc --project
jsconfig.json` over JSDoc-typed `.js`) on the `js-docs` branch. Grouped by how
risky/urgent they are to fix.

Baseline: 91 errors when JS typecheck was first enabled. Currently: 83.

## Fixed

- **`Character.target` unset-target sentinel inconsistency.** `Character.target`
  moved from `number | null` to `number` (default `0`) so
  `serverPackets.Attack`'s `writeD()` wouldn't crash on a null target, but
  `Player`/`Bot` kept resetting it to `null` and several call sites compared
  against `null`. Aligned everything on the `0` sentinel
  (`Player.js`, `Bot.js`, `DeadState.js`, `VisibilityManager.js`,
  `RequestTargetCancel.js`, `Action.js`).
- **`InitialParametersManager` start point type.** `_initialStartPoint` holds a
  polygon (`Point[]`, per `datapack/settings.json`) but was typed/returned as a
  single `Point`, which `getRandomPointInPolygon` (expects `Point[]`) silently
  tolerated only because JS doesn't check shapes at runtime. Fixed the type and
  added the `Point[]` cast the JSON import needed.
  (Originally flagged in [Lineage2JS/game-server#1][issue-1].)

[issue-1]: https://github.com/Lineage2JS/game-server/issues/1#issuecomment-4815669559

## Real bugs (not just annotations)

- **`MoveToLocation` called with wrong arguments — 4 call sites.**
  `EntitiesManager.js:75`, `EntitiesManager.js:296`, `VisibilityManager.js:60`,
  `VisibilityManager.js:85` all do:
  ```js
  new serverPackets.MoveToLocation(path, npc.objectId)
  ```
  but the constructor signature is
  `(objectId, targetX, targetY, targetZ, originX, originY, originZ)` — 7
  numbers. At runtime this passes a `path` object where `objectId` (a number)
  is expected, so `.writeD(objectId)` calls `Buffer.writeInt32LE(path, ...)`
  and throws. Pre-existing in `main`, not introduced by this branch — typecheck
  just caught it. Fix: reorder to
  `new serverPackets.MoveToLocation(npc.objectId, path.target.x, path.target.y, path.target.z, path.origin.x, path.origin.y, path.origin.z)`.

## Simple, safe fixes (types/guards only)

- **Missing `@types/pg`** — `database/index.js(1,28)`. `npm i -D @types/pg`.
- **`FinishRotating.js` (client packet) extra argument** —
  `new serverPackets.FinishRotating(player, degree, 0)` but the packet
  constructor only takes 2 args. The extra `0` is silently ignored at runtime;
  just remove it.
- **`RequestCharacterCreate.js:198`** — `getInitialStartPoint()` can return
  `undefined`; needs `if (!startPoints) return;` before
  `getRandomPointInPolygon`.
- **`RequestMagicSkillUse.js`** — 5 errors, all from missing
  `if (!player) return;` at the top of `handle()` (the guard pattern already
  used in every other client packet).
- **`RequestBuyItem.js`** — needs a guard on `npc` (possibly `undefined`) and
  a guard/cast on a `number | null` argument.
- **`NpcDeathHandler.js:37`** — `npc.getHitHistory()` returns a
  `Map<number, HitEntry>`, but is cast as `HitEntry[]`. Works at runtime by
  coincidence (`Map.forEach` also yields the value first), but the annotation
  is wrong — retype as `Map<number, HitEntry>`.

## Needs verification before fixing (not pure typing)

- **`Player.js:420,442,528`** — `Item` not assignable to `ItemWeapon` (3
  spots handling the active weapon). Probably just needs a cast, but should
  confirm the calling code actually guarantees a weapon first.
- **`Bot.js:19` / `Player.js:20`** — `Character`'s constructor requires an
  argument; `Bot` calls `super()` with none. Need to decide the intended
  contract (should `props` be optional on `Character`?).
- **`NewCharacter.js:11`** — the character templates array doesn't satisfy
  `CharacterTemplate[]`; likely some class entries in the JSON are missing
  fields other entries have.
- **`SkillsManager.js:45`** — DB rows have `target_type: string`, the type
  says `number`. Could be a real schema/type mismatch, not just an annotation
  bug — needs checking against the actual column values.
- **`datapack/ai/Rapunzel.js:13`** — not a typing issue: the teleport
  coordinate array has a string label (`"The Village of Gludin"`) where a
  numeric location id belongs, unlike the commented-out reference line above
  it. Looks like a content mistake, not something to guess-fix without
  knowing the correct id.

## Architectural (not simple — separate effort)

- **`core/states/*.js`** (Attack/Cast/Follow/Idle/Move/PickupState,
  ~50 errors) — states are typed against `Character`, but call
  `Player`/`Bot`-only members (`action`, `changeState`, `moveTo`, `attack`,
  `isDead`, `timeSinceLastAttack`, `attackDelay`, `lastAttackTimestamp`,
  `castTimestamp`, `clearAction`, `getClient`, `ai`, `lastTalkedNpcId`).
  Needs a real interface for "entities that run through the state machine",
  not a type patch.
- **`Entity` union too broad** in `core/clientPackets/*` — `Player | Npc | Bot
  | DropItem` doesn't share `isDead`/`canBeAttacked`/`ai`. Needs `instanceof`
  narrowing at each call site instead of accessing members directly on the
  union.
