# Kitty Cards: Advanced Mode — FINAL Implementation Plan

## Summary
Advanced Mode is a single-game (no 3-round match) variant that adds an Assist Card deck, a two-phase turn system (Assist Phase → Number Phase), and 12 unique Assist Cards. Match tracker is hidden.

---

## Board Layout

The center grid cell renders as a **dual-deck cell** — two mini decks side-by-side:
- **Left**: Number Card back + count (draw during Number Phase)  
- **Right**: Assist Card back + count (draw during Assist Phase)

All 8 remaining grid cells are cups (same as normal mode).

---

## Turn Flow

startPlayerTurn() → Deal 1 Assist Card from assist deck (burn if hand ≥ 10) → Show "🐾 Assist Phase" banner → if playerSkipAssist: auto-skip → jump to Number Phase → else: Player plays 1 Assist Card OR draws from Assist Deck OR passes → If player plays: show Meow This! interrupt to AI (if AI holds one) → resolveAssistCard() → Show "🔍 Number Phase" banner → if playerSkipNumber: auto-skip, end turn → else: Player plays 1 Number Card OR draws from Number Deck → if pawComboActive: player plays a second Number Card (sequential) → endPlayerTurn()
---

## Assist Card Reference

| Card | Key | Effect |
|---|---|---|
| Skip | `skip` | Opponent skips their Number Phase next turn |
| Freeze | `freeze` | Opponent skips their Assist Phase next turn |
| Meow This! | `meow_this` | Reactive interrupt — cancels opponent's assist card when they play one |
| Cat-Ching! | `cat_ching` | Draw 2 Number Cards (burn extras over 10) |
| Kitty Plot | `kitty_plot` | Draw 2 Assist Cards, then discard 1 card from your hand |
| Purrceive | `purrceive` | See 3 random opponent cards; pick 1 to discard |
| Meowster | `meowster` | Pick from last ≤5 of opponent's played assist cards; add to hand |
| Purrator | `purrator` | Select a cup and change its color (any color, including white) |
| Kitty Pow! | `kitty_pow` | Both players discard ALL number cards |
| Magic Paw | `magic_paw` | Select opponent-owned cup → reduce card value to 1 pt |
| Bye-Bye! | `bye_bye` | Select any occupied cup → discard the card there |
| Paw Combo | `paw_combo` | Play 2 Number Cards this turn (sequential) |

---

## AI Assist Playstyles (Advanced Mode)

### Xavier — "The Patient Tactician / Soft-Hearted"
**Card Preferences**: Magic Paw, Bye-Bye!, Meow This!  
**Behavior**:
- Hoards Assist Cards in early-to-mid game, appearing passive.
- Primary aggression: steal or destroy **already-claimed cups** (Bye-Bye!, Magic Paw) rather than racing to empty ones.
- Will intentionally make suboptimal plays if the player is significantly losing (his "soft-hearted" mechanic).
- **Meow This!**: Very selective. Only cancels cards that would cause a major point swing (Bye-Bye! on a high-value cup, Purrator, or Kitty Pow!). Never wastes it on minor cards.
- **Sleep Exploit (existing cheat)** remains — when triggered, player can peek at Xavier's hand or swap one of his kitties.
- Late game: Unleashes Magic Paw + Bye-Bye! combos to flip the board state when player feels safe.

### Zayne — "The Late-Game Ambusher"
**Card Preferences**: Purrator, Kitty Pow!, Magic Paw, Skip, Freeze (all hoarded)  
**Behavior**:
- Near-zero assist card usage in the first half of the game — purely conservative.
- Keeps hand close to the 10-card limit by hoarding both assist and number cards.
- Final 3–4 turns: drops everything in rapid succession — color flips, demolishes kitties, freezes/skips the player.
- **Meow This!**: Moderately used; prioritizes canceling Purrator or Kitty Pow! from the player that would undo his color setup.
- Players see a quiet early game followed by a devastating board sweep.

### Rafayel — "The Impulsive Defender"
**Card Preferences**: Bye-Bye!, Purrator, Purrceive  
**Behavior**:
- Reacts emotionally — if losing, tends to play disruptive cards faster and more impulsively.
- Hoards cards like Zayne but with less discipline; may use them mid-game rather than waiting.
- Primary goal is blocking the player's lead — changes cup colors to deny points, demolishes placed kitties.
- **Meow This!**: Reactively triggered when losing significantly. Less strategic than Xavier or Zayne.
- Existing cheat mechanic (switching cards on occupied cups) remains and works as before.

### Sylus — "The Manipulative Adaptor"
**Card Preferences**: Purrator, Paw Combo, Kitty Plot, Meowster  
**Behavior**:
- Early game: intentionally throws via low-value plays or assists that seemingly help the player (his "lenient" side).
- Changes unmarked cup colors to lock the player out of scoring combos (Purrator).
- Trade mechanic already exists and remains his signature.
- **Ruthless pivot**: Once Sylus gains a ≥4pt lead, his behavior flips — he snowballs aggressively with Paw Combo and Kitty Plot to build an overwhelming hand.
- **Meow This!**: Uses it primarily to deny Bye-Bye! on cups he has claimed, or to deny Kitty Pow! when he is ahead.

### Caleb — "The Mind Game Artist"
**Card Preferences**: Skip, Freeze, Cat-Ching!, Paw Combo  
**Behavior**:
- Aggressive opening as before: plays number cards hard early.
- In advanced mode, adds Skip/Freeze to lock the player out of their phases mid-game.
- Cat-Ching! to refill hand rapidly after his aggressive plays.
- **Meow This!**: Plays it semi-randomly to keep the player off guard; cancels cards 40% of the time regardless of their value (unpredictable).
- Still has his cheat (Play Tricks button) during thinking phase.

### Valko — "The Alpha Hunter / Executive Bluff"
**Card Preferences**: Purrator, Magic Paw, Bye-Bye!, Freeze, Skip  
**Behavior**:
- Aggressively locks down clusters of cups early (using existing lock cheat + Purrator to color-change contested cups).
- Does not waste assist cards; deploys them precisely when the player establishes a lead.
- **Meow This!**: Cold and strategic. Saves it to protect his highest-value cup from Bye-Bye! or Magic Paw. Will cancel if his lead is being threatened.
- Existing extortion cheat mechanic remains — if he locks a cup, the player deals with it the same way.
- "Executive Bluff": intentionally hoards 1–2 high-value assist cards he never plays to keep the player guessing.

---

## New State Fields
```js
state.assistDeck          // shuffled assist card draw pile  
state.playerAssistHand    // player's assist cards (separate array)  
state.aiAssistHand        // ai's assist cards (interleaved face-down in AI hand display)  
state.advancedPhase       // 'assist' | 'number'  
state.playerSkipNumber    // bool  
state.playerSkipAssist    // bool  
state.aiSkipNumber        // bool  
state.aiSkipAssist        // bool  
state.pawComboActive      // bool  
state.pawComboCount       // 0 or 1 (how many placed so far this turn)  
state.playerAssistHistory // last 5 assist cards player played (for Meowster)  
state.aiAssistHistory     // last 5 assist cards AI played (for Meowster)  
