# Typecheck findings

Bugs and inconsistencies surfaced by enabling `npm run build` (`tsc --project
jsconfig.json` over JSDoc-typed `.js`) on the `js-docs` branch. Grouped by how
risky/urgent they are to fix.

Baseline: 91 errors when JS typecheck was first enabled. Currently: 68.

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

- **Simple type/guard fixes** — `@types/pg` installed; `FinishRotating.js`
  extra argument removed and given a `player` guard;
  `RequestCharacterCreate.js` guards `getInitialStartPoint()` returning
  `undefined`; `RequestMagicSkillUse.js` and `RequestBuyItem.js` got the
  missing `player`/`entity`/`npc` guards; `NpcDeathHandler.js`'s hit history
  is now typed as the `Map` it actually is instead of an array.
- **`MoveToLocation` called with wrong arguments — 4 call sites.**
  `EntitiesManager.js:75`, `EntitiesManager.js:296`, `VisibilityManager.js:60`,
  `VisibilityManager.js:85` all did:
  ```js
  new serverPackets.MoveToLocation(path, npc.objectId)
  ```
  but the constructor signature is
  `(objectId, targetX, targetY, targetZ, originX, originY, originZ)` — 7
  numbers. Verified on Node v22: this did **not** throw. `Buffer.writeInt32LE`
  silently coerced the non-number `path` object to `0`, so the packet sent to
  every client that could see the moving NPC/bot ended up with `objectId=0`,
  `targetX` set to the NPC/bot's real objectId (misplaced into a coordinate
  field), and `targetY/targetZ/originX/originY/originZ` all `0` (unsupplied
  args). No crash, no log line — just a silently corrupted movement packet on
  every broadcast, which would have shown up as move/teleport glitches on the
  client. Pre-existing in `main`, not introduced by this branch — typecheck
  just caught it. Fixed by reordering to
  `new serverPackets.MoveToLocation(npc.objectId, path.target.x, path.target.y, path.target.z, path.origin.x, path.origin.y, path.origin.z)`
  at all 4 call sites. Verified with a hex dump of the resulting buffer.
- **`VisibilityManager.js` nullable target/origin.** `path.target.x/y/z` and
  `path.origin.x/y/z` are `number | null | undefined`, but were passed
  straight into `MoveToLocation`'s non-null `number` params. Added a guard
  that skips the broadcast entirely when any coordinate is missing, instead
  of sending a packet with a fake value. See the "Real bugs" entry below for
  why this is null in practice.

## Real bugs (not just annotations)

- **`Npc`/`Bot` movement never actually sets a target — `doAction`/
  `changeState` silently drop the move payload.** Traced while deciding
  whether `VisibilityManager.js`'s nullable `path.target.x/y/z` (see "Fixed"
  below) could really be null: it always is, for NPCs and bots.
  `MoveState.enter()` (`core/states/MoveState.js`) reads
  `this.character.targetX/Y/Z` — it never looks at whatever payload was
  passed into `changeState`. `Player.doAction('move', x, y, z)`
  (`Player.js:262-265`) correctly sets `this.targetX/Y/Z` *before* calling
  `changeState('move')`, so players work. But:
  - `Npc.doAction('move', payload)` (`Npc.js`) just calls
    `this.changeState('move', payload)`, and `Npc.changeState()` never
    reads `payload` — `state.enter()` is called with no arguments.
  - `Bot.doAction('move', payload)` (`Bot.js`) stores
    `state.payload = payload` (comment: `// remove`), but no state
    (including `MoveState`) ever reads `this.payload` — dead code.
  - The only live NPC move trigger, `DefaultNpc.addFleeDesire()`
    (`datapack/ai/DefaultNpc.js:162`), calls `changeState('move', path)`
    directly, bypassing `doAction` entirely — same result.
  - `Npc.doAction('move', ...)` itself has no other call sites in the
    codebase currently — dead code path.

  Net effect: NPC/bot `targetX/Y/Z` are never set, so `MoveState` always
  runs with a `null` target for them. Fix is to mirror `Player.doAction`:
  unpack `payload.target.x/y/z` into `this.targetX/Y/Z` before calling
  `changeState('move', ...)` in both `Npc.js` and `Bot.js`, and likely
  `DefaultNpc.addFleeDesire()` too. Real gameplay-behavior fix (NPC
  patrol / bot movement), not just typing — needs its own small commits
  per file, not done here.

## Simple, safe fixes remaining (types/guards only)

None currently tracked here.

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
