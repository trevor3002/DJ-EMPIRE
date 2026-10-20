# DJ EMPIRE: FROM BEDROOM TO MAINSTAGE — Implementation Plan

A comprehensive, mobile-first idle music tycoon game built for iOS Safari and mobile browsers as an installable Progressive Web App (PWA). Players rise from an unknown bedroom DJ with R1,000 cash and basic gear to a global festival headliner and music mogul.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification:
> - **In-Game Audio**: Procedural Web Audio API electronic synthesizer loop with customizable beat patterns, drop triggers, and sound effects (vinyl scratches, crowd roar, cash chimes) with full user volume and mute controls.
> - **DJ Performance Mode**: Pure idle mechanics — automatic gig timers, audience excitement scaling, and streamlined earnings collection with auto-gig management.
> - **Visual Direction**: Neon Cyber Underground aesthetic led by deep obsidian blacks (`#0B0813`), electric cyan (`#00F2FE`), vibrant neon purple (`#7928CA`), and hot magenta (`#FF007A`) accents with responsive SVG stage graphics and crowd animations.

---

## 1. Overview & Core Concept

- **What It Does**: Simulates a high-energy electronic music career. The player mixes tracks, upgrades DJ consoles and studio hardware, produces and drops singles/EPs/albums across 10 electronic genres, signs record deals, hires managers, manages world tours across 10 international hubs, and builds a nightclub empire.
- **Target Audience / Platform**: Optimized specifically for mobile browsers (iPhone 13 viewport with notch & home-indicator safe-area margins) and desktop viewports, installable as a PWA with full offline play support.
- **Key Value**: Deep, satisfying idle tycoon progression balanced in South African Rand (R), combining tactile stage visuals, rich multi-tier equipment upgrades, a realistic streaming royalty engine, and offline welcome-back calculations.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Title Screen & New Game**: Neon logo lockup, DJ avatar creation/selection, audio consent button, and introduction with starting balance (R1,000) and entry gear.
2. **Bottom Navigation Bar (5 Primary Hubs)**:
   - **PERFORM (Stage & Venues)**: Animated DJ booth with turntables, audio visualizer, crowd silhouettes, venue selector (10 venues from Bedroom Stream to Global Mega-Festival), active gig timer, crowd hype meter, and reward collector.
   - **STUDIO (Production & Releases)**: Multi-genre track creation (House, Techno, EDM, Trance, Drum & Bass, Afro House, etc.), DAW upgrades, release distribution (Singles, EPs, Albums), and Simulated Streaming Top 10 Charts.
   - **SHOP (Gear & Audio Systems)**: Illustrated cards across 4 categories (Controllers & Decks, Audio & Monitors, Studio Production, Performance FX & Lighting) with visible tier upgrades and stat multipliers.
   - **EMPIRE (Business & World Tour)**: Sub-tabs for **Venues & Clubs**, **World Tour** (interactive route map from Johannesburg to Ibiza and Tokyo), **Staff & Management** (10 hireable roles), **Sponsors & Labels**, and **Merchandise**.
   - **CAREER (Stats & Milestones)**: 10 Career Ranks (Bedroom DJ to DJ Legend), Fan Milestones, Achievements, Financial Dashboard (revenue streams vs expenses), and Settings/PWA Install.
3. **Offline Welcome-Back Modal**: Calculates idle time (up to 8h baseline, expandable), shows itemized summary of gig profits, streaming royalties, fan increases, and automated staff activities.

### Visual Identity & Theme
- **Color Palette**:
  - Base Canvas: Deep Space Obsidian (`#090610`, `#120E22`)
  - Elevated Surfaces: Dark Indigo Slate (`#1A1530`, `#231D40`) with crisp hairline borders (`rgba(255,255,255,0.08)`)
  - Primary Accents: Cyber Cyan (`#00F2FE`), Electric Purple (`#8B5CF6`), Hot Pink (`#EC4899`), Neon Gold (`#F59E0B`)
- **Typography**:
  - Display: Sans-serif geometric athletic titles (`Plus Jakarta Sans` / `Outfit`)
  - Numbers & Metrics: High-contrast `tabular-nums font-mono` for money (R), fans, and stream counts
- **Mobile Ergonomics**:
  - Fixed bottom tab bar within thumb reach ($\ge 44\text{px}$ touch targets, safe-area inset padding)
  - Sticky HUD under 15% mobile viewport height displaying Cash (R), Fan count, Current Venue, and Audio Mute toggle

---

## 3. Key Product Decisions & Trade-Offs

- **Procedural Web Audio API Engine vs External Audio Files**:
  - *Chosen Approach*: Web Audio API synthesized beat generator (4/4 kick drum, 16-step closed/open hi-hat, sub-bassline, and synth arpeggios) alongside procedural sound effects (scratch, applause, coins).
  - *Why*: Zero external network dependencies, instant loading, no copyright risks, works offline, and scales BPM dynamically to match gig hype.
- **LocalStorage State Persistence with Migrations**:
  - *Chosen Approach*: Resilient typed state store in `localStorage` with timestamped delta-time offline calculations and export/import capability.
  - *Why*: Enables instant reload and offline play without requiring external server authentication, completely PWA-compliant.
- **Vector SVG DJ Booth & Animated Crowd**:
  - *Chosen Approach*: Bespoke inline SVGs for DJ consoles, equalizers, lighting beams, and SVG dancing crowd silhouettes with CSS keyframe pulses.
  - *Why*: Crisp rendering across all pixel densities without fuzzy rasterization or broken image placeholders.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DJ EMPIRE GAME SHELL                            │
│  ┌───────────────────────────┬───────────────────────────────────────┐ │
│  │ Mobile Status HUD         │ Cash (R) · Fans · Rank · Sound Toggle │ │
│  └───────────────────────────┴───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Active View Container (Routed via Bottom Navigation)             │ │
│  │  ├─ PerformView: DJ Booth SVG, Audio Visualizer, Venue Gigs       │ │
│  │  ├─ StudioView: Track Producer, Genres, Release Hub, Top Charts   │ │
│  │  ├─ ShopView: 4 Equipment Categories (Decks, Sound, DAW, Lights)  │ │
│  │  ├─ EmpireView: World Tour Map, Clubs, Staff, Labels, Merch Store │ │
│  │  └─ CareerView: Career Ranks, Achievements, Financial Dashboard  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────┬───────────────────────────────────────┐ │
│  │ PWA & Offline Modals      │ Welcome-Back Report · iOS PWA Install │ │
│  └───────────────────────────┴───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Fixed Bottom Navigation: [CAREER | PERFORM | STUDIO | SHOP | EMPIRE]│
│  └───────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                                ▲
                                │ reactive state
┌────────────────────────────────────────────────────────────────────────┐
│ Game State Engine (`src/game/state.ts` + `useGameStore`)               │
│  - Player Stats: Cash (R), Lifetime Earnings, Fans, Reputation, Rank   │
│  - Gigs & Venues: Active gig timers, venue unlock states, residency    │
│  - Music Catalog: Tracks, Releases (Singles/EPs/Albums), Streams/day  │
│  - Equipment Tiers: Purchased levels and multiplier calculations       │
│  - Staff Roster: Automated tasks, active managers, salary costs       │
│  - Merch & World Tour: Stock, sales rates, tour booking states         │
└────────────────────────────────────────────────────────────────────────┘
                                ▲
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
┌───────────────────────────────┐     ┌─────────────────────────────────┐
│ Web Audio Synthesizer Engine  │     │ PWA Service Worker & Storage    │
│ - 4-Track Procedural Synth    │     │ - Offline Precaching (Vite PWA) │
│ - Beat generator & SFX        │     │ - LocalStorage Auto-Save & Delta│
│ - Mute & Volume controllers   │     │ - Manifest & iOS Touch Setup    │
└───────────────────────────────┘     └─────────────────────────────────┘
```

### Data Models
- **PlayerState**: `cash: number`, `fans: number`, `reputation: number`, `careerRankIndex: number`, `lastSavedTimestamp: number`, `offlineHoursLimit: number`.
- **Venue**: `id: string`, `name: string`, `category: string`, `bookingFee: number`, `durationSeconds: number`, `baseAudience: number`, `minReputation: number`, `basePayout: number`, `fanGain: number`.
- **EquipmentItem**: `id: string`, `category: 'decks' | 'audio' | 'studio' | 'lights'`, `tier: number`, `name: string`, `cost: number`, `benefitDescription: string`, `earningsMultiplier: number`, `productionSpeedBonus: number`.
- **Track**: `id: string`, `title: string`, `genre: string`, `quality: number`, `popularity: number`, `streams: number`, `dailyRoyalties: number`, `releaseType: 'single' | 'ep' | 'album'`.
- **StaffMember**: `id: string`, `name: string`, `role: string`, `salaryPerSec: number`, `hired: boolean`, `perk: string`.
- **WorldTourCity**: `id: string`, `name: string`, `country: string`, `continent: string`, `unlocked: boolean`, `tourRewardBonus: number`, `festivalName: string`.

---

## 5. Implementation Sequence & Plan

1. **Step 1: PWA Configuration & Vite Setup**
   - Configure `vite-plugin-pwa` in `vite.config.ts` with web manifest (`DJ Empire`), standalone display, theme colors, and icons.
   - Update `index.html` with title, meta tags, and mobile viewport safe-area compatibility.
   - Update `metadata.json` with official name and description.
2. **Step 2: Core Game Architecture & State Engine**
   - Implement `src/game/types.ts` defining all entities (venues, equipment, tracks, releases, staff, labels, cities, financial ledger).
   - Implement `src/game/constants.ts` seeded with accurate progression, 10 venues, 20+ equipment upgrades, 10 electronic genres, 10 world tour destinations, and 10 staff roles.
   - Implement `src/game/state.ts` with automatic saving, offline calculations, tick loop, and immutable mutations.
3. **Step 3: Web Audio Synthesizer & Sound FX Engine**
   - Implement procedural synthesizer in `src/audio/synth.ts` with kick, snare, hats, synth chords, bassline, and interactive SFX triggers (cash, cheer, scratch).
4. **Step 4: DJ Performance Screen & Animated Stage**
   - Build `PerformView.tsx` with high-detail SVG DJ console, turntables, audio equalizer bars, spotlights/lasers, dancing crowd silhouette animations, venue selector drawer, and gig progress handler.
5. **Step 5: Music Studio & Streaming Releases**
   - Build `StudioView.tsx` with genre selector, track producer timer, EP/Album packager, marketing campaign booster, and the Fictional Global Top 10 Streaming Chart.
6. **Step 6: Equipment Shop & Tier Upgrades**
   - Build `ShopView.tsx` featuring visual equipment cards across Controllers, Audio, Studio, and Stage FX with purchase and upgrade handlers.
7. **Step 7: Empire Hub (Venues, World Tour, Staff, Labels, Merch)**
   - Build `EmpireView.tsx` with segmented tabs:
     - Venue Ownership & Upgrades
     - World Tour Map (Johannesburg, London, Berlin, Ibiza, Las Vegas, Tokyo, etc.)
     - Staff Management (Tour managers, sound engineers, social media agents)
     - Record Label & Sponsorship Deals
     - Merchandise Manufacturing & Sales
8. **Step 8: Career Hub, Achievements & Financial Ledger**
   - Build `CareerView.tsx` with Career Progression ranks, Daily Missions, Career Achievements, and detailed Financial Dashboard (income vs expense ledger in R).
9. **Step 9: Mobile Polish, Offline Welcome-Back & PWA Install**
   - Add Welcome-Back offline earnings summary dialog.
   - Add iOS and Android PWA Install prompt modal with step-by-step instructions.
   - Verify layout responsiveness on mobile (iPhone 13 portrait) and desktop.
10. **Step 10: Compilation & Verification**
    - Run `compile_applet` and verify zero TypeScript or bundler errors.
