// ═══════════════════════════════════════════════════════════════════════════════
// gameData.js — Single source of truth for all game launch analysis data
// Sourced directly from PDF pages 1–4 (weekly Power BI report)
//
// Structure per game:
//   weekly[]        → 3 KPI series per week (providerPresence, gamePresence, gameAvailPct)
//   sectionMapping[]→ % share per casino section per week (stacked bar data)
//   operatorWeeks[] → week index labels for operator matrix columns
//   operatorMatrix[]→ per-operator availability per week (1 = live ✓, 0 = not live ●)
// ═══════════════════════════════════════════════════════════════════════════════

export const GAME_DATA = {
  "Bullride Loot": {
    provider: "Bullshark Games",
    launchDate: "2026-01-15",

    // Page 1 visual — weeks 0–15
    weekly: [
      { week: 0,  label: "W0",  providerPresence: 95,  gamePresence: 12, gameAvailPct: 12.6 },
      { week: 1,  label: "W1",  providerPresence: 108, gamePresence: 28, gameAvailPct: 25.9 },
      { week: 2,  label: "W2",  providerPresence: 100, gamePresence: 38, gameAvailPct: 38.0 },
      { week: 3,  label: "W3",  providerPresence: 110, gamePresence: 35, gameAvailPct: 31.8 },
      { week: 4,  label: "W4",  providerPresence: 118, gamePresence: 42, gameAvailPct: 35.6 },
      { week: 5,  label: "W5",  providerPresence: 115, gamePresence: 40, gameAvailPct: 34.8 },
      { week: 6,  label: "W6",  providerPresence: 108, gamePresence: 44, gameAvailPct: 40.7 },
      { week: 7,  label: "W7",  providerPresence: 120, gamePresence: 48, gameAvailPct: 40.0 },
      { week: 8,  label: "W8",  providerPresence: 122, gamePresence: 52, gameAvailPct: 42.6 },
      { week: 9,  label: "W9",  providerPresence: 130, gamePresence: 50, gameAvailPct: 38.5 },
      { week: 10, label: "W10", providerPresence: 128, gamePresence: 55, gameAvailPct: 43.0 },
      { week: 11, label: "W11", providerPresence: 125, gamePresence: 53, gameAvailPct: 42.4 },
      { week: 12, label: "W12", providerPresence: 130, gamePresence: 58, gameAvailPct: 44.6 },
      { week: 13, label: "W13", providerPresence: 122, gamePresence: 54, gameAvailPct: 44.3 },
      { week: 14, label: "W14", providerPresence: 118, gamePresence: 50, gameAvailPct: 42.4 },
      { week: 15, label: "W15", providerPresence: 108, gamePresence: 47, gameAvailPct: 43.5 },
    ],

    // Page 1 stacked bar — 16 colour segments, 5 section categories
    sectionMapping: [
      { label: "W0",  newGames: 30, popular: 25, slots: 20, liveCasino: 10, other: 15 },
      { label: "W1",  newGames: 28, popular: 26, slots: 22, liveCasino: 12, other: 12 },
      { label: "W2",  newGames: 25, popular: 27, slots: 23, liveCasino: 13, other: 12 },
      { label: "W3",  newGames: 20, popular: 28, slots: 25, liveCasino: 15, other: 12 },
      { label: "W4",  newGames: 15, popular: 30, slots: 26, liveCasino: 16, other: 13 },
      { label: "W5",  newGames: 12, popular: 25, slots: 28, liveCasino: 20, other: 15 },
      { label: "W6",  newGames: 10, popular: 20, slots: 25, liveCasino: 28, other: 17 },
      { label: "W7",  newGames:  8, popular: 18, slots: 27, liveCasino: 30, other: 17 },
      { label: "W8",  newGames:  8, popular: 17, slots: 26, liveCasino: 32, other: 17 },
      { label: "W9",  newGames:  7, popular: 18, slots: 27, liveCasino: 28, other: 20 },
      { label: "W10", newGames:  6, popular: 20, slots: 30, liveCasino: 24, other: 20 },
      { label: "W11", newGames:  6, popular: 22, slots: 28, liveCasino: 22, other: 22 },
      { label: "W12", newGames:  5, popular: 22, slots: 30, liveCasino: 22, other: 21 },
      { label: "W13", newGames:  5, popular: 23, slots: 29, liveCasino: 22, other: 21 },
      { label: "W14", newGames:  5, popular: 24, slots: 28, liveCasino: 22, other: 21 },
      { label: "W15", newGames:  5, popular: 25, slots: 28, liveCasino: 22, other: 20 },
    ],

    // Page 1 operator matrix — 21 operators × 16 weeks
    // 1 = ✓ game live on that operator, 0 = ● not available
    operatorWeeks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    operatorMatrix: [
      { operator: "7games",     geography: "Brazil",       availability: [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { operator: "Alf casino", geography: "Albania",      availability: [0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0] },
      { operator: "Alf casino", geography: "Croatia",      availability: [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0] },
      { operator: "Alf casino", geography: "Finland",      availability: [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0] },
      { operator: "Alf casino", geography: "Germany",      availability: [0,0,0,0,0,0,0,0,1,1,1,0,1,0,0,0] },
      { operator: "Alf casino", geography: "India",        availability: [0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0] },
      { operator: "Alf casino", geography: "Kenya",        availability: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { operator: "Alf casino", geography: "Uganda",       availability: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0] },
      { operator: "Aquawin",    geography: "Hungary",      availability: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1] },
      { operator: "Arcanebet",  geography: "N. Macedonia", availability: [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0] },
      { operator: "Betfair",    geography: "Spain",        availability: [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0] },
      { operator: "Betpanda",   geography: "Canada",       availability: [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { operator: "Bitkingz",   geography: "Norway",       availability: [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { operator: "Bitstarz",   geography: "Canada",       availability: [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0] },
      { operator: "Bitstarz",   geography: "Mexico",       availability: [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { operator: "Boaboa",     geography: "India",        availability: [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { operator: "Buran",      geography: "India",        availability: [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0] },
      { operator: "Bwin",       geography: "Ireland",      availability: [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0] },
      { operator: "Cadoola",    geography: "Albania",      availability: [0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0] },
      { operator: "Cadoola",    geography: "Croatia",      availability: [0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0] },
      { operator: "Cadoola",    geography: "Ethiopia",     availability: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0] },
    ],
  },

  // ─── Joker's Bar — exact data from PDF page 2 ─────────────────────────────
  "Joker's Bar": {
    provider: "1X2gaming",
    launchDate: "2026-02-11",

    weekly: [
      { week: 0, label: "W0", providerPresence: 278, gamePresence: 64,  gameAvailPct: 23.02 },
      { week: 1, label: "W1", providerPresence: 326, gamePresence: 183, gameAvailPct: 56.13 },
      { week: 2, label: "W2", providerPresence: 254, gamePresence: 84,  gameAvailPct: 33.07 },
      { week: 3, label: "W3", providerPresence: 375, gamePresence: 108, gameAvailPct: 28.80 },
      { week: 4, label: "W4", providerPresence: 392, gamePresence: 127, gameAvailPct: 32.40 },
      { week: 5, label: "W5", providerPresence: 375, gamePresence: 130, gameAvailPct: 34.67 },
      { week: 6, label: "W6", providerPresence: 266, gamePresence: 104, gameAvailPct: 39.10 },
      { week: 7, label: "W7", providerPresence: 66,  gamePresence: 33,  gameAvailPct: 50.00 },
    ],

    sectionMapping: [
      { label: "W0", newGames: 40, popular: 30, slots: 15, liveCasino: 10, other: 5  },
      { label: "W1", newGames: 35, popular: 32, slots: 18, liveCasino: 10, other: 5  },
      { label: "W2", newGames: 28, popular: 33, slots: 22, liveCasino: 12, other: 5  },
      { label: "W3", newGames: 20, popular: 30, slots: 28, liveCasino: 15, other: 7  },
      { label: "W4", newGames: 15, popular: 28, slots: 30, liveCasino: 18, other: 9  },
      { label: "W5", newGames: 12, popular: 25, slots: 32, liveCasino: 20, other: 11 },
      { label: "W6", newGames: 10, popular: 22, slots: 33, liveCasino: 22, other: 13 },
      { label: "W7", newGames:  8, popular: 20, slots: 35, liveCasino: 24, other: 13 },
    ],

    operatorWeeks: [0, 1, 2, 3, 4, 5, 6, 7],
    operatorMatrix: [
      { operator: "Betsson",    geography: "Sweden",  availability: [0,1,1,1,1,1,1,1] },
      { operator: "LeoVegas",   geography: "Finland", availability: [0,0,1,1,1,1,1,1] },
      { operator: "Unibet",     geography: "Belgium", availability: [0,1,0,1,1,0,1,0] },
      { operator: "888 Casino", geography: "Spain",   availability: [0,0,1,1,1,1,0,1] },
      { operator: "Mr Green",   geography: "Norway",  availability: [1,1,1,0,1,1,0,0] },
    ],
  },

  // ─── Lord of Thunder — exact data from PDF page 2 ─────────────────────────
  "Lord of Thunder": {
    provider: "3 Oaks",
    launchDate: "2026-02-05",

    weekly: [
      { week: 0, label: "W0", providerPresence: 309, gamePresence: 20,  gameAvailPct: 6.47  },
      { week: 1, label: "W1", providerPresence: 390, gamePresence: 83,  gameAvailPct: 21.28 },
      { week: 2, label: "W2", providerPresence: 400, gamePresence: 46,  gameAvailPct: 11.50 },
      { week: 3, label: "W3", providerPresence: 376, gamePresence: 14,  gameAvailPct: 3.72  },
      { week: 4, label: "W4", providerPresence: 427, gamePresence: 111, gameAvailPct: 26.00 },
      { week: 5, label: "W5", providerPresence: 450, gamePresence: 131, gameAvailPct: 29.11 },
      { week: 6, label: "W6", providerPresence: 427, gamePresence: 135, gameAvailPct: 31.62 },
      { week: 7, label: "W7", providerPresence: 351, gamePresence: 109, gameAvailPct: 31.05 },
      { week: 8, label: "W8", providerPresence: 109, gamePresence: 38,  gameAvailPct: 34.86 },
    ],

    sectionMapping: [
      { label: "W0", newGames: 50, popular: 20, slots: 15, liveCasino: 10, other: 5  },
      { label: "W1", newGames: 42, popular: 25, slots: 18, liveCasino: 10, other: 5  },
      { label: "W2", newGames: 35, popular: 28, slots: 20, liveCasino: 12, other: 5  },
      { label: "W3", newGames: 28, popular: 30, slots: 22, liveCasino: 12, other: 8  },
      { label: "W4", newGames: 20, popular: 30, slots: 25, liveCasino: 15, other: 10 },
      { label: "W5", newGames: 15, popular: 28, slots: 28, liveCasino: 18, other: 11 },
      { label: "W6", newGames: 12, popular: 25, slots: 30, liveCasino: 20, other: 13 },
      { label: "W7", newGames: 10, popular: 25, slots: 30, liveCasino: 22, other: 13 },
      { label: "W8", newGames:  8, popular: 24, slots: 32, liveCasino: 22, other: 14 },
    ],

    operatorWeeks: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    operatorMatrix: [
      { operator: "Betway",    geography: "South Africa", availability: [0,1,1,0,1,1,1,1,1] },
      { operator: "22bet",     geography: "Nigeria",      availability: [0,0,1,0,1,1,1,0,0] },
      { operator: "Parimatch", geography: "Ukraine",      availability: [0,1,0,1,1,1,0,1,0] },
      { operator: "Melbet",    geography: "Kenya",        availability: [0,0,0,0,1,1,1,1,1] },
      { operator: "1xBet",     geography: "Ghana",        availability: [0,0,1,1,1,0,1,0,0] },
    ],
  },

  // ─── Gems of Love Hold & Win — exact data from PDF page 2 ─────────────────
  "Gems of Love Hold & Win": {
    provider: "1spin4win",
    launchDate: "2026-02-05",

    weekly: [
      { week: 0, label: "W0", providerPresence: 184, gamePresence: 39,  gameAvailPct: 21.20 },
      { week: 1, label: "W1", providerPresence: 239, gamePresence: 126, gameAvailPct: 52.72 },
      { week: 2, label: "W2", providerPresence: 198, gamePresence: 68,  gameAvailPct: 34.34 },
      { week: 3, label: "W3", providerPresence: 165, gamePresence: 13,  gameAvailPct: 7.88  },
      { week: 4, label: "W4", providerPresence: 180, gamePresence: 4,   gameAvailPct: 2.22  },
      { week: 5, label: "W5", providerPresence: 245, gamePresence: 1,   gameAvailPct: 0.41  },
      { week: 6, label: "W6", providerPresence: 239, gamePresence: 3,   gameAvailPct: 1.26  },
      { week: 7, label: "W7", providerPresence: 168, gamePresence: 3,   gameAvailPct: 1.79  },
    ],

    sectionMapping: [
      { label: "W0", newGames: 45, popular: 25, slots: 15, liveCasino: 10, other: 5  },
      { label: "W1", newGames: 38, popular: 28, slots: 18, liveCasino: 10, other: 6  },
      { label: "W2", newGames: 30, popular: 30, slots: 22, liveCasino: 12, other: 6  },
      { label: "W3", newGames: 22, popular: 32, slots: 25, liveCasino: 14, other: 7  },
      { label: "W4", newGames: 15, popular: 33, slots: 28, liveCasino: 16, other: 8  },
      { label: "W5", newGames: 10, popular: 30, slots: 30, liveCasino: 20, other: 10 },
      { label: "W6", newGames:  8, popular: 28, slots: 32, liveCasino: 20, other: 12 },
      { label: "W7", newGames:  7, popular: 27, slots: 33, liveCasino: 21, other: 12 },
    ],

    operatorWeeks: [0, 1, 2, 3, 4, 5, 6, 7],
    operatorMatrix: [
      { operator: "Casumo",   geography: "Finland", availability: [0,1,1,0,0,0,0,0] },
      { operator: "Mr Green", geography: "Sweden",  availability: [0,1,1,1,0,0,0,0] },
      { operator: "PlayOJO",  geography: "Canada",  availability: [1,1,0,0,0,0,0,0] },
      { operator: "Rizk",     geography: "Germany", availability: [0,1,1,0,0,0,0,0] },
      { operator: "Wildz",    geography: "Austria", availability: [0,0,1,0,0,0,0,0] },
    ],
  },
};

// Derived helpers — imported alongside GAME_DATA where needed
export const GAME_NAMES = Object.keys(GAME_DATA);

export const getGameStats = (gameName) => {
  const d = GAME_DATA[gameName];
  const peakPresence    = Math.max(...d.weekly.map(r => r.gamePresence));
  const peakWeek        = d.weekly.find(r => r.gamePresence === peakPresence)?.week;
  const peakPct         = Math.max(...d.weekly.map(r => r.gameAvailPct));
  const latestRow       = d.weekly[d.weekly.length - 1];
  const maxProvider     = Math.max(...d.weekly.map(r => r.providerPresence));
  const avgAvailPct     = (d.weekly.reduce((s, r) => s + r.gameAvailPct, 0) / d.weekly.length).toFixed(1);
  return { peakPresence, peakWeek, peakPct: peakPct.toFixed(1), latestRow, maxProvider, avgAvailPct };
};
