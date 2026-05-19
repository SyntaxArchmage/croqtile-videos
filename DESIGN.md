---
name: CroqTile Videos
description: Cinematic promotional video system for a GPU kernel DSL
colors:
  mint-primary: "#6EE7B7"
  emerald-deep: "#059669"
  abyss-base: "#0A0E1A"
  slate-card: "#111827"
  slate-elevated: "#1F2937"
  snow-text: "#F9FAFB"
  ash-secondary: "#9CA3AF"
  graphite-muted: "#4B5563"
  code-mint: "#A7F3D0"
  indigo-annotation: "#818CF8"
  amber-highlight: "#FCD34D"
  danger-red: "#F87171"
typography:
  display:
    fontFamily: "'Inter', 'PingFang SC', 'Noto Sans SC', sans-serif"
    fontSize: "72px"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "'Inter', 'PingFang SC', 'Noto Sans SC', sans-serif"
    fontSize: "52px"
    fontWeight: 700
    lineHeight: 1.15
  title:
    fontFamily: "'Inter', 'PingFang SC', 'Noto Sans SC', sans-serif"
    fontSize: "38px"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "'Inter', 'PingFang SC', 'Noto Sans SC', sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
  code:
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.58
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  xl: "32px"
  full: "9999px"
spacing:
  scene-pad-y: "72px"
  scene-pad-x: "96px"
  section-gap: "40px"
  element-gap: "24px"
  tight-gap: "12px"
components:
  cta-button:
    backgroundColor: "linear-gradient(145deg, {colors.mint-primary}, #5EEAD4, #34D399)"
    textColor: "{colors.abyss-base}"
    rounded: "{rounded.lg}"
    padding: "14px 34px"
  cta-button-border:
    backgroundColor: "linear-gradient(135deg, {colors.mint-primary}, #34D399, {colors.emerald-deep})"
    rounded: "{rounded.lg}"
    padding: "2px"
  section-tag:
    textColor: "{colors.mint-primary}"
    backgroundColor: "transparent"
    padding: "0"
  code-block:
    backgroundColor: "{colors.slate-card}"
    textColor: "{colors.code-mint}"
    rounded: "{rounded.md}"
    padding: "24px 32px"
  github-badge:
    backgroundColor: "rgba(17,24,39,0.72)"
    textColor: "rgba(209,213,219,0.92)"
    rounded: "{rounded.full}"
    padding: "9px 22px"
---

# Design System: CroqTile Videos

## 1. Overview

**Creative North Star: "The Terminal Cinema"**

CroqTile Videos treats every frame as a film shot composed inside a developer's terminal. The aesthetic is cinematic production quality applied to a developer-native dark interface: deep abyss backgrounds, mint-green accents that glow like phosphor traces, noise-textured surfaces that feel analog, and spring-physics animations timed to voiceover beats. The system rejects anything that looks like a slide deck, a stock-illustration explainer, or a gaming RGB showcase.

The bilingual presentation (Chinese and English) is structural, not cosmetic. Both languages share the same typographic hierarchy, the same timing, the same emphasis. Neither is a subtitle of the other.

Code is the protagonist. Real CUDA snippets and CroqTile kernel patterns occupy center frame, rendered in monospaced type at readable sizes, syntax-highlighted with the palette's semantic colors. Everything else (titles, annotations, transitions) exists to direct attention toward the code.

**Key Characteristics:**
- Dark, noise-textured surfaces with glow-based depth
- Mint/emerald green as the sole chromatic accent
- Spring-physics animations with organic damping
- Code blocks as hero visual elements
- Bilingual parity in every composition
- Cinematic pacing aligned to voiceover cues

## 2. Colors: The Phosphor Palette

A restrained palette: tinted neutrals plus one accent held below 15% of any frame. The mint green reads like a phosphor trace on a dark oscilloscope, functional and precise.

### Primary
- **Mint Primary** (#6EE7B7): The accent. Used for logo emphasis ("Tile"), section tags, code highlights, CTA button fills, and glow halos. Never as a background fill for large surfaces.
- **Emerald Deep** (#059669): Dark anchor for gradients and the deepest stop in CTA borders. Grounds the mint without letting it float.

### Neutral
- **Abyss Base** (#0A0E1A): The canvas. Every scene begins here. Tinted toward deep blue-black, never pure black.
- **Slate Card** (#111827): Elevated surface for code blocks, cards, and panels. One step above the abyss.
- **Slate Elevated** (#1F2937): Second elevation tier. Used sparingly for nested containers or hover states on cards.
- **Snow Text** (#F9FAFB): Primary text. Warm-tinted off-white, never `#FFF`.
- **Ash Secondary** (#9CA3AF): Secondary text, subtitles, and supporting copy.
- **Graphite Muted** (#4B5563): Tertiary text, timestamps, and de-emphasized labels.

### Tertiary
- **Code Mint** (#A7F3D0): Syntax-highlighted code text. Lighter and less saturated than the primary mint to maintain readability against slate backgrounds.
- **Indigo Annotation** (#818CF8): Annotation callouts, diagram connectors, and secondary visual markers. Used when mint would create confusion with primary UI.
- **Amber Highlight** (#FCD34D): Warm attention markers, warning states, and emphasis that must contrast with the cool palette.
- **Danger Red** (#F87171): Error states, crossed-out patterns, and "before" comparisons in pain-point segments.

### Named Rules
**The Phosphor Rule.** Mint green appears on no more than 15% of any frame's surface area. Its impact comes from scarcity. A scene drenched in mint is a failed scene.

**The No Pure Black Rule.** `#000000` is prohibited. The darkest value is Abyss Base (#0A0E1A), tinted toward blue. Pure black kills the noise texture and flattens depth.

## 3. Typography

**Display Font:** Inter (with PingFang SC and Noto Sans SC for CJK fallback)
**Code Font:** JetBrains Mono (with Fira Code and Cascadia Code fallback)

**Character:** Inter's tight metrics and negative letter-spacing at display sizes create a dense, confident presence that reads as engineering-grade rather than editorial. JetBrains Mono for all code, labels, and monospaced UI elements: its ligatures and distinct glyph shapes make CUDA syntax scannable at video resolution.

### Hierarchy
- **Display** (800, 72px, line-height 1.05, -0.03em tracking): Logo text and hero statements. One per scene maximum. The tightest tracking in the system.
- **Headline** (700, 52px, line-height 1.15): Scene titles and bilingual hero lines. Used in PageContainer's title slot.
- **Title** (600, 38px, line-height 1.2): Section headers within a scene, comparison labels, feature names.
- **Body** (400-500, 20px, line-height 1.5): Subtitle text, descriptive copy, and voiceover-aligned text blocks.
- **Label** (400, 14px, 0.1em tracking, uppercase): Section tags, segment identifiers, and metadata. Always in monospace. Always uppercase.
- **Code** (400, 19px, line-height 1.58): All code blocks. Line height tuned for CUDA/C++ readability at 1080p with 30px line-height rendering.

### Named Rules
**The Code Protagonist Rule.** In any scene that shows code, the code block's type size must be at least as large as the body text. Code is never subordinate to prose.

**The CJK Parity Rule.** Chinese and English headlines occupy the same visual weight. If the Chinese line is 60px, the English line is no smaller than 56px. Neither language is an afterthought.

## 4. Elevation: The Glow Layer

This system does not use traditional drop shadows for depth. Elevation is conveyed through **glow halos**: radial gradients and blurred mint discs that emanate from behind elevated elements, as if lit from within.

### Shadow Vocabulary
- **Card Shadow** (`0 4px 24px rgba(0,0,0,0.5)`): Structural anchoring for code blocks and panels. Dark, diffuse, uncolored. Creates ground plane without adding visual weight.
- **Glow Standard** (`0 0 32px rgba(110,231,183,0.3)`): Mint halo behind the logo, CTA buttons, and highlighted elements. The primary depth signal.
- **Glow Small** (`0 0 12px rgba(110,231,183,0.2)`): Subtle mint ring for section tags, active states, and minor accents.
- **Inset Highlight** (`inset 0 1px 0 rgba(255,255,255,0.06)`): Top-edge light catch on cards and buttons. Creates the illusion of a single overhead light source.

### Named Rules
**The Glow-Not-Shadow Rule.** Depth comes from light emission (colored glow halos), not from dark shadows falling downward. If a new element needs to feel elevated, add a mint glow behind it, not a drop shadow beneath it. The card shadow is the sole exception: it anchors, it doesn't elevate.

## 5. Components

### CTA Button
- **Shape:** Generously curved edges (20px radius)
- **Primary:** Gradient fill from Mint Primary through teal to emerald. Text in Abyss Base (dark on light). Wrapped in a 2px gradient border container for depth.
- **Shadow:** Combined glow halo (`0 0 56px rgba(110,231,183,0.32)`) plus structural shadow (`0 18px 48px rgba(0,0,0,0.45)`) plus inset highlight.
- **Typography:** 24px, weight 600, 0.02em tracking. Sans-serif.

### Code Block
- **Shape:** Medium curve (12px radius)
- **Background:** Slate Card (#111827)
- **Text:** Code Mint (#A7F3D0) for default, with semantic highlighting: Mint Primary for keywords, Amber Highlight for strings, Indigo Annotation for comments, Danger Red for errors.
- **Line rendering:** 19px font, 30px line height. Lines appear via interpolated opacity (typewriter reveal, not instant).
- **Behavior:** Code blocks enter with fade + slight upward translate. Lines reveal sequentially timed to voiceover.

### Section Tag
- **Shape:** No background, no border. A 6px mint dot followed by uppercase monospaced text.
- **Typography:** Label scale (14px mono, 0.1em tracking, uppercase).
- **Color:** Mint Primary for both dot and text.

### GitHub Badge
- **Shape:** Pill (full radius)
- **Background:** Semi-transparent dark (`rgba(17,24,39,0.72)`) with 1px mint border at 14% opacity.
- **Typography:** Monospace, 13px, 0.06em tracking.
- **Shadow:** Card shadow plus faint mint glow ring.

### Logo Block
- **Structure:** "Croq" in Snow Text + "Tile" in Mint Primary. Display scale (72-78px, weight 800).
- **Glow:** Animated mint disc behind the text, driven by spring physics. Blur radius pulses between 32-48px.
- **Entrance:** Scale from 0.6 to 1.0 via spring (damping 14, stiffness 120, mass 0.8).

### Noise Overlay
- **Implementation:** SVG feTurbulence (fractalNoise, baseFrequency 0.9, 4 octaves, stitch tiles).
- **Default opacity:** 0.04, blend mode overlay.
- **Purpose:** Adds analog film grain to every scene. Prevents the dark backgrounds from feeling digitally flat.

### PageContainer
- **Padding:** 72px vertical, 96px horizontal. Generous margins that give code blocks room to breathe.
- **Structure:** Optional section tag at top, optional title (Headline scale), optional subtitle (Body scale), then free-form content area.

## 6. Do's and Don'ts

### Do:
- **Do** use spring physics for all entrance animations. Default config: damping 13-14, stiffness 120-128, mass 0.78-0.8. Organic, not mechanical.
- **Do** use the noise overlay on every scene. It is the texture that unifies the system.
- **Do** start from the Abyss Base (#0A0E1A) background. Every scene shares the same canvas.
- **Do** render real CUDA/CroqTile code in code blocks. Placeholder `lorem ipsum` code is prohibited.
- **Do** time animations to voiceover cue points. Every entrance has a frame-accurate trigger.
- **Do** give Chinese and English equal typographic weight and timing.
- **Do** use the Inset Highlight (`inset 0 1px 0 rgba(255,255,255,0.06)`) on elevated surfaces for directional light.

### Don't:
- **Don't** use generic SaaS explainer aesthetics: stock illustrations, bouncy cartoon transitions, pastel gradients.
- **Don't** use corporate keynote slide layouts: bullet-point lists, centered title slides with no visual substance.
- **Don't** use gaming/RGB aesthetics: rainbow neon, particle explosions, chromatic aberration.
- **Don't** use design-agency reel style that prioritizes form over code substance.
- **Don't** use tutorial screencast conventions: webcam overlays, casual narration tone, screen-recording borders.
- **Don't** use `#000000` or `#FFFFFF`. Tint all neutrals toward the palette.
- **Don't** use linear easing or CSS `ease`. All motion uses exponential ease-out (quart/quint) or spring physics.
- **Don't** use border-left/right accents thicker than 1px as decorative stripes.
- **Don't** let mint green exceed 15% of any frame's surface area.
- **Don't** use bounce or elastic easing. Spring damping stays above 12.

## 7. Code Panel Standards

### Syntax Highlighting Palette
All code displayed in any segment MUST use syntax highlighting with the following color palette:
- **KW** (#C678DD, purple): Keywords (`def`, `for`, `in`, `parallel`, `by`, `global`)
- **FN** (#61AFEF, blue): Function names (`matmul`, `zeros`, `range`, `load_tile`, `store`, `partition`)
- **TYPE** (#E5C07B, yellow): Type annotations (`f16`, `M`, `N`, `K`)
- **STR** (#98C379, green): String literals
- **OP** (#56B6C2, cyan): Operators (`=`, `+=`, `@`)
- **IDENT** (#ABB2BF, gray): Identifiers and default text
- **DECORATOR** (#D19A66, orange): Decorators (`@kernel`)

### Code Panel Implementation
- Use `<pre>` elements with `whiteSpace: "pre-wrap"` and monospace font
- Wrap each code token in `<span>` with the appropriate color
- Font size: `THEME.fontSize.base` (16px) for primary code panels, `THEME.fontSize.lg` (20px) for secondary/supporting panels
- Never render code as plain unstyled text

### Code Panel Minimum Height
Any `DeviceShell` or code panel displaying multi-line code must show at least 8–10 visible lines without scrolling. At `fontSize: 20px` with `lineHeight: 1.6`, this means a minimum content height of ~320px (plus padding). Recommended: 400–420px for panels with 8–12 lines. Never set code panel height below 360px. Height should be proportional to actual content — avoid large empty areas.

### Named Rules
**The Code Styling Rule.** Code is never displayed as plain text. Every code element receives syntax highlighting. If a code panel looks like a gray text block, it's a failed panel.

## 8. Animation Standards

### Pacing
- Minimize blank/idle animation periods. Visual elements (cards, arrows, panels) should begin entering as soon as the previous animation completes.
- Stagger delays for sequential element entry: 8–12 frames per item (not 20+).
- Phase transitions should overlap by a few frames rather than leaving gaps.
- If voiceover starts at frame N, visible animation activity should already be present by frame N−10 at latest.
- "Dead air" (static frames with no visual change and no speech) should not exceed 15 frames (~0.5s).

### Interactive Element Prominence
Key interactive elements that the voiceover refers to (compile commands, flags, key annotations) must be visually prominent:
- Minimum `THEME.fontSize.lg` (20px), `fontWeight: 600`
- Colored background glow matching the element's semantic color
- Entrance animation: flash pulse via `interpolate` + `filter: brightness()` + `boxShadow` glow
- These elements must never be rendered at body-text size or without visual emphasis
- If the voiceover mentions an element, it must be the most attention-grabbing element on screen at that moment

### Named Rules
**The No Dead Air Rule.** Static frames with no visual change and no speech must not exceed 0.5 seconds. Every second of video must have either visual motion or spoken narration (preferably both).

**The Voiceover-Visual Sync Rule.** When the voiceover references a specific UI element, that element must be visually prominent at that exact moment — not before, not after.

## 9. Subtitle Standards

### Single-Line Rule
Each subtitle cue must contain at most ONE line of Chinese text and ONE line of English text. Long voiceover sentences must be split into multiple sequential subtitle cues with frame-accurate timing. Target: ~15–25 Chinese characters per cue, ~8–15 English words per cue. Subtitles should align with natural speech pauses, not sentence boundaries.

### Typography Parity
Chinese and English subtitle lines must have comparable font sizes — neither language significantly smaller than the other. Minimum font size: `THEME.fontSize.body` (20px) for both languages. Neither language should appear as a footnote to the other.

### Centering
Subtitles must be horizontally centered on screen.

### Named Rules
**The Subtitle Readability Rule.** A viewer should be able to read each subtitle cue comfortably at normal playback speed. If a subtitle requires pausing to read, it's too long.

## 10. Scene Composition

### Visual Balance
Every animation scene must maintain appropriate proportions between visual elements (code panels, cards, diagrams) and negative space (whitespace/padding). Visual elements should occupy approximately 60–75% of the frame area, with the remaining space providing breathing room. Avoid both extremes: elements too small in a sea of empty space, or elements crammed edge-to-edge with no margins. The `PageContainer` padding (72px vertical, 96px horizontal) establishes the baseline — internal elements should fill their allocated area without appearing sparse or overcrowded.

### Named Rules
**The Breathing Room Rule.** No visual element should touch the edge of its container or another element without explicit padding. But equally, no scene should be mostly empty space with tiny elements in the center.

---
