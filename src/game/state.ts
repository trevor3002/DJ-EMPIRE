import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GameState,
  OfflineReport,
  MusicGenre,
  ReleaseType,
  Track,
} from './types';
import {
  CAREER_RANKS,
  INITIAL_VENUES,
  INITIAL_EQUIPMENT,
  INITIAL_STAFF,
  INITIAL_LABELS,
  INITIAL_CITIES,
  INITIAL_MERCH,
  INITIAL_ACHIEVEMENTS,
  INITIAL_DAILY_MISSIONS,
  GENRE_PRESETS,
} from './constants';
import { sound } from '../audio/synth';

const SAVE_KEY = 'dj_empire_save_v1';

export const INITIAL_GAME_STATE: GameState = {
  djName: 'DJ Nova',
  cash: 1000,
  fans: 0,
  reputation: 0,
  careerRankIndex: 0,
  lastSavedTimestamp: Date.now(),
  offlineHoursLimit: 8,

  currentVenueId: 'v1_bedroom',
  isGigActive: false,
  gigElapsedSeconds: 0,
  audienceExcitement: 70,
  gigStreak: 0,

  tracks: [
    {
      id: 't_init_1',
      title: 'Bedroom Session Vol. 1',
      genre: 'House',
      releaseType: 'single',
      quality: 55,
      popularity: 45,
      totalStreams: 1250,
      dailyStreams: 180,
      royaltiesEarned: 240,
      releasedAt: Date.now() - 86400000,
      isHit: false,
    },
  ],
  currentProduction: null,
  studioDawLevel: 1,
  masteringLevel: 1,
  marketingLevel: 1,

  venues: INITIAL_VENUES,
  equipment: INITIAL_EQUIPMENT,
  staff: INITIAL_STAFF,
  labels: INITIAL_LABELS,
  worldTourCities: INITIAL_CITIES,
  merch: INITIAL_MERCH,
  achievements: INITIAL_ACHIEVEMENTS,
  dailyMissions: INITIAL_DAILY_MISSIONS,

  finances: {
    gigRevenue: 0,
    streamingRoyalties: 240,
    merchRevenue: 0,
    sponsorshipRevenue: 0,
    equipmentExpenses: 0,
    productionExpenses: 0,
    staffSalariesPaid: 0,
    venueExpenses: 0,
    tourExpenses: 0,
  },

  musicEnabled: true,
  sfxEnabled: true,
  hasStartedAudio: false,
};

// Helper: load initial state from localStorage or return defaults
export function loadSavedState(): { state: GameState; offlineReport: OfflineReport | null } {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return { state: INITIAL_GAME_STATE, offlineReport: null };
    }
    const parsed: GameState = JSON.parse(raw);

    // Merge missing fields in case of schema additions
    const state: GameState = {
      ...INITIAL_GAME_STATE,
      ...parsed,
      venues: INITIAL_VENUES.map((v) => {
        const saved = parsed.venues?.find((sv) => sv.id === v.id);
        return saved ? { ...v, ...saved } : v;
      }),
      equipment: INITIAL_EQUIPMENT.map((eq) => {
        const saved = parsed.equipment?.find((seq) => seq.id === eq.id);
        return saved ? { ...eq, ...saved } : eq;
      }),
      staff: INITIAL_STAFF.map((st) => {
        const saved = parsed.staff?.find((sst) => sst.id === st.id);
        return saved ? { ...st, ...saved } : st;
      }),
      labels: INITIAL_LABELS.map((lb) => {
        const saved = parsed.labels?.find((slb) => slb.id === lb.id);
        return saved ? { ...lb, ...saved } : lb;
      }),
      worldTourCities: INITIAL_CITIES.map((c) => {
        const saved = parsed.worldTourCities?.find((sc) => sc.id === c.id);
        return saved ? { ...c, ...saved } : c;
      }),
      merch: INITIAL_MERCH.map((m) => {
        const saved = parsed.merch?.find((sm) => sm.id === m.id);
        return saved ? { ...m, ...saved } : m;
      }),
    };

    // Calculate offline gains
    const now = Date.now();
    const elapsedSeconds = Math.max(0, (now - (parsed.lastSavedTimestamp || now)) / 1000);
    const maxOfflineSeconds = (state.offlineHoursLimit || 8) * 3600;
    const cappedSeconds = Math.min(elapsedSeconds, maxOfflineSeconds);

    if (cappedSeconds >= 45) {
      // 1. Streaming royalties while away
      let totalRoyalties = 0;
      let totalStreams = 0;
      state.tracks.forEach((t) => {
        const streams = Math.floor((t.dailyStreams / 86400) * cappedSeconds);
        const royalties = streams * 0.22; // R0.22 per stream
        t.totalStreams += streams;
        t.royaltiesEarned += royalties;
        totalRoyalties += royalties;
        totalStreams += streams;
      });

      // 2. Automated gigs if DJ Assistant hired
      let automatedGigs = 0;
      let gigCash = 0;
      let fansGained = 0;
      const hasAutoDj = state.staff.find((s) => s.id === 'staff_assistant')?.hired;
      const currentVenue = state.venues.find((v) => v.id === state.currentVenueId) || state.venues[0];

      if (hasAutoDj && currentVenue) {
        automatedGigs = Math.floor(cappedSeconds / currentVenue.durationSeconds);
        if (automatedGigs > 0) {
          const payoutPerGig = currentVenue.basePayout * (1 + (currentVenue.level - 1) * 0.3);
          gigCash = automatedGigs * payoutPerGig;
          fansGained = automatedGigs * currentVenue.fanGain;
        }
      }

      // 3. Merch sales while away
      let merchEarned = 0;
      state.merch.forEach((m) => {
        if (m.unlocked && m.stock > 0) {
          const sellRatePerMin = Math.max(0.2, (state.fans / 2500));
          const potentialUnits = Math.floor((cappedSeconds / 60) * sellRatePerMin);
          const unitsSold = Math.min(m.stock, potentialUnits);
          m.stock -= unitsSold;
          m.totalSold += unitsSold;
          merchEarned += unitsSold * m.sellPrice;
        }
      });

      const totalCashEarned = Math.round(totalRoyalties + gigCash + merchEarned);
      state.cash += totalCashEarned;
      state.fans += Math.round(fansGained);
      state.finances.streamingRoyalties += totalRoyalties;
      state.finances.gigRevenue += gigCash;
      state.finances.merchRevenue += merchEarned;
      state.lastSavedTimestamp = now;

      const report: OfflineReport = {
        secondsOffline: Math.round(cappedSeconds),
        cashEarned: totalCashEarned,
        streamsGenerated: Math.round(totalStreams),
        fansGained: Math.round(fansGained),
        performancesCompleted: automatedGigs,
        royaltiesEarned: Math.round(totalRoyalties),
        merchEarned: Math.round(merchEarned),
      };

      return { state, offlineReport: report };
    }

    state.lastSavedTimestamp = now;
    return { state, offlineReport: null };
  } catch {
    return { state: INITIAL_GAME_STATE, offlineReport: null };
  }
}

export function useGameStore() {
  const [gameState, setGameState] = useState<GameState>(() => loadSavedState().state);
  const [offlineReport, setOfflineReport] = useState<OfflineReport | null>(() => loadSavedState().offlineReport);
  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  // Persist to localStorage
  const saveToStorage = useCallback((stateToSave: GameState) => {
    try {
      const stateWithTime = { ...stateToSave, lastSavedTimestamp: Date.now() };
      localStorage.setItem(SAVE_KEY, JSON.stringify(stateWithTime));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, []);

  // Multiplier calculations from equipment and staff
  const getMultipliers = useCallback((s: GameState) => {
    let gigEarningsMultiplier = 1.0;
    let productionSpeedMultiplier = 1.0;
    let fanGainMultiplier = 1.0;
    let royaltyMultiplier = 1.0;

    // Equipment bonuses
    s.equipment.forEach((eq) => {
      if (eq.level > 0) {
        const factor = eq.level;
        gigEarningsMultiplier += (eq.earningsMultiplier - 1) * factor;
        productionSpeedMultiplier += eq.productionSpeedBonus * factor;
        fanGainMultiplier += eq.fanGainBonus * factor;
      }
    });

    // Staff bonuses
    s.staff.forEach((st) => {
      if (st.hired) {
        if (st.gigEarningsBonus) gigEarningsMultiplier += st.gigEarningsBonus;
        if (st.productionSpeedBonus) productionSpeedMultiplier += st.productionSpeedBonus;
        if (st.fanGrowthBonus) fanGainMultiplier += st.fanGrowthBonus;
        if (st.royaltyBonus) royaltyMultiplier += st.royaltyBonus;
      }
    });

    // Signed Label multiplier
    const signedLabel = s.labels.find((l) => l.signed);
    if (signedLabel) {
      royaltyMultiplier *= signedLabel.royaltyRateMultiplier;
    }

    return {
      gigEarningsMultiplier,
      productionSpeedMultiplier,
      fanGainMultiplier,
      royaltyMultiplier,
    };
  }, []);

  // TICK LOOP (runs every 250ms for smooth UI and accurate simulation)
  useEffect(() => {
    let saveAccumulator = 0;

    const interval = window.setInterval(() => {
      setGameState((prev) => {
        const dt = 0.25; // seconds
        saveAccumulator += dt;

        let nextCash = prev.cash;
        let nextFans = prev.fans;
        let nextReputation = prev.reputation;
        let nextStreak = prev.gigStreak;
        let nextExcitement = prev.audienceExcitement;

        const {
          gigEarningsMultiplier,
          productionSpeedMultiplier,
          fanGainMultiplier,
          royaltyMultiplier,
        } = getMultipliers(prev);

        // 1. GIG PROGRESSION
        let gigElapsed = prev.gigElapsedSeconds;
        let isGigActive = prev.isGigActive;
        const currentVenue = prev.venues.find((v) => v.id === prev.currentVenueId) || prev.venues[0];
        const hasAutoDj = prev.staff.find((s) => s.id === 'staff_assistant')?.hired;

        if (isGigActive) {
          gigElapsed += dt;

          // Audience excitement fluctuates dynamically
          nextExcitement = Math.min(100, Math.max(30, nextExcitement + (Math.random() * 2 - 0.95)));

          if (gigElapsed >= currentVenue.durationSeconds) {
            // Gig Complete!
            gigElapsed = 0;
            const excitementFactor = nextExcitement / 100;
            const levelBonus = 1 + (currentVenue.level - 1) * 0.35;
            const payout = Math.round(
              currentVenue.basePayout * levelBonus * gigEarningsMultiplier * excitementFactor
            );
            const fansEarned = Math.round(
              currentVenue.fanGain * levelBonus * fanGainMultiplier * (0.8 + excitementFactor * 0.4)
            );
            const repEarned = Math.max(5, Math.round(currentVenue.tier * 8 * excitementFactor));

            nextCash += payout;
            nextFans += fansEarned;
            nextReputation += repEarned;
            nextStreak += 1;

            if (prev.sfxEnabled) {
              sound.playCashChime();
            }

            // Record finances
            prev.finances.gigRevenue += payout;

            // If auto assistant is not hired, end gig; if hired, continue running
            if (!hasAutoDj) {
              isGigActive = false;
            }
          }
        } else if (hasAutoDj && !isGigActive) {
          // Auto start if assistant hired
          isGigActive = true;
          gigElapsed = 0;
        }

        // 2. MUSIC PRODUCTION PROGRESSION
        let currentProd = prev.currentProduction;
        let updatedTracks = [...prev.tracks];

        if (currentProd) {
          const effectiveSpeed = 1 * productionSpeedMultiplier;
          const newProgress = currentProd.progressSeconds + dt * effectiveSpeed;

          if (newProgress >= currentProd.durationSeconds) {
            // Track completed!
            const qualityBonus = Math.floor(Math.random() * 25) + prev.studioDawLevel * 8 + prev.masteringLevel * 6;
            const finalQuality = Math.min(100, 45 + qualityBonus);
            const isHit = Math.random() < (0.15 + finalQuality / 200 + prev.marketingLevel * 0.05);

            const initialStreams = isHit ? 5000 : 800;
            const dailyStreams = Math.round(initialStreams * (finalQuality / 50));

            const newTrack: Track = {
              id: 'track_' + Date.now(),
              title: currentProd.title,
              genre: currentProd.genre,
              releaseType: currentProd.releaseType,
              quality: finalQuality,
              popularity: Math.min(100, Math.floor(finalQuality * (isHit ? 1.2 : 0.9))),
              totalStreams: initialStreams,
              dailyStreams,
              royaltiesEarned: Math.round(initialStreams * 0.22),
              releasedAt: Date.now(),
              isHit,
            };

            updatedTracks = [newTrack, ...updatedTracks];
            nextFans += Math.round(finalQuality * (isHit ? 3.5 : 1.2));
            nextReputation += Math.round(finalQuality * 0.3);
            currentProd = null;

            if (prev.sfxEnabled) {
              sound.playLevelUp();
            }
          } else {
            currentProd = { ...currentProd, progressSeconds: newProgress };
          }
        }

        // 3. CONTINUOUS STREAMING ROYALTIES
        let royaltyTick = 0;
        updatedTracks = updatedTracks.map((t) => {
          const streamsPerSec = t.dailyStreams / 86400;
          const streamGain = streamsPerSec * dt;
          const rGain = streamGain * 0.22 * royaltyMultiplier;
          royaltyTick += rGain;
          return {
            ...t,
            totalStreams: t.totalStreams + streamGain,
            royaltiesEarned: t.royaltiesEarned + rGain,
          };
        });

        if (royaltyTick > 0) {
          nextCash += royaltyTick;
          prev.finances.streamingRoyalties += royaltyTick;
        }

        // 4. MERCHANDISE SALES
        let updatedMerch = [...prev.merch];
        updatedMerch = updatedMerch.map((m) => {
          if (m.unlocked && m.stock > 0) {
            const sellChance = (Math.max(1, nextFans) / 3500) * dt;
            if (Math.random() < sellChance) {
              m.stock -= 1;
              m.totalSold += 1;
              const revenue = m.sellPrice;
              nextCash += revenue;
              prev.finances.merchRevenue += revenue;
            }
          }
          return m;
        });

        // 5. DEDUCT STAFF SALARIES
        let totalSalary = 0;
        prev.staff.forEach((st) => {
          if (st.hired) {
            totalSalary += st.salaryPerSec * dt;
          }
        });
        if (totalSalary > 0) {
          nextCash = Math.max(0, nextCash - totalSalary);
          prev.finances.staffSalariesPaid += totalSalary;
        }

        // 6. CHECK CAREER RANK
        let nextRankIndex = prev.careerRankIndex;
        for (let i = CAREER_RANKS.length - 1; i >= 0; i--) {
          if (nextFans >= CAREER_RANKS[i].minFans) {
            if (i > nextRankIndex) {
              nextRankIndex = i;
              if (prev.sfxEnabled) {
                sound.playLevelUp();
              }
            }
            break;
          }
        }

        // 7. CHECK VENUE UNLOCKS
        const updatedVenues = prev.venues.map((v) => {
          if (!v.unlocked && nextReputation >= v.minReputation) {
            return { ...v, unlocked: true };
          }
          return v;
        });

        // 8. CHECK CITY UNLOCKS
        const updatedCities = prev.worldTourCities.map((c) => {
          if (!c.unlocked && nextFans >= c.minFans) {
            return { ...c, unlocked: true };
          }
          return c;
        });

        // Periodic auto-save every 8 seconds
        if (saveAccumulator >= 8) {
          saveAccumulator = 0;
          saveToStorage({
            ...prev,
            cash: nextCash,
            fans: nextFans,
            reputation: nextReputation,
            careerRankIndex: nextRankIndex,
            currentVenueId: prev.currentVenueId,
            isGigActive,
            gigElapsedSeconds: gigElapsed,
            audienceExcitement: nextExcitement,
            gigStreak: nextStreak,
            tracks: updatedTracks,
            currentProduction: currentProd,
            venues: updatedVenues,
            worldTourCities: updatedCities,
            merch: updatedMerch,
          });
        }

        return {
          ...prev,
          cash: nextCash,
          fans: nextFans,
          reputation: nextReputation,
          careerRankIndex: nextRankIndex,
          isGigActive,
          gigElapsedSeconds: gigElapsed,
          audienceExcitement: nextExcitement,
          gigStreak: nextStreak,
          tracks: updatedTracks,
          currentProduction: currentProd,
          venues: updatedVenues,
          worldTourCities: updatedCities,
          merch: updatedMerch,
        };
      });
    }, 250);

    return () => clearInterval(interval);
  }, [getMultipliers, saveToStorage]);

  // --- ACTIONS ---

  const startGig = useCallback((venueId?: string) => {
    setGameState((prev) => {
      const targetVenueId = venueId || prev.currentVenueId;
      const venue = prev.venues.find((v) => v.id === targetVenueId);
      if (!venue || !venue.unlocked) return prev;
      if (prev.cash < venue.bookingFee) return prev;

      if (prev.sfxEnabled) {
        sound.playScratch();
      }

      return {
        ...prev,
        currentVenueId: targetVenueId,
        isGigActive: true,
        gigElapsedSeconds: 0,
        cash: prev.cash - venue.bookingFee,
        finances: {
          ...prev.finances,
          venueExpenses: prev.finances.venueExpenses + venue.bookingFee,
        },
      };
    });
  }, []);

  const stopGig = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isGigActive: false,
      gigElapsedSeconds: 0,
    }));
  }, []);

  const selectVenue = useCallback((venueId: string) => {
    setGameState((prev) => {
      const venue = prev.venues.find((v) => v.id === venueId);
      if (!venue || !venue.unlocked) return prev;
      return {
        ...prev,
        currentVenueId: venueId,
        gigElapsedSeconds: 0,
        isGigActive: false,
      };
    });
  }, []);

  const upgradeVenue = useCallback((venueId: string) => {
    setGameState((prev) => {
      const venue = prev.venues.find((v) => v.id === venueId);
      if (!venue || prev.cash < venue.capacityUpgradeCost) return prev;

      const nextLevel = venue.level + 1;
      const cost = venue.capacityUpgradeCost;
      const nextCost = Math.round(cost * 1.85);

      if (prev.sfxEnabled) {
        sound.playCashChime();
      }

      return {
        ...prev,
        cash: prev.cash - cost,
        venues: prev.venues.map((v) =>
          v.id === venueId
            ? {
                ...v,
                level: nextLevel,
                baseAudience: Math.round(v.baseAudience * 1.3),
                basePayout: Math.round(v.basePayout * 1.35),
                capacityUpgradeCost: nextCost,
              }
            : v
        ),
        finances: {
          ...prev.finances,
          venueExpenses: prev.finances.venueExpenses + cost,
        },
      };
    });
  }, []);

  const upgradeEquipment = useCallback((equipmentId: string) => {
    setGameState((prev) => {
      const eq = prev.equipment.find((e) => e.id === equipmentId);
      if (!eq) return prev;

      const cost = Math.round(eq.baseCost * Math.pow(eq.costMultiplier, eq.level));
      if (prev.cash < cost || eq.level >= eq.maxLevel) return prev;

      if (prev.sfxEnabled) {
        sound.playCashChime();
      }

      return {
        ...prev,
        cash: prev.cash - cost,
        reputation: prev.reputation + eq.tier * 15,
        equipment: prev.equipment.map((e) =>
          e.id === equipmentId ? { ...e, level: e.level + 1 } : e
        ),
        finances: {
          ...prev.finances,
          equipmentExpenses: prev.finances.equipmentExpenses + cost,
        },
      };
    });
  }, []);

  const startTrackProduction = useCallback(
    (title: string, genre: MusicGenre, releaseType: ReleaseType) => {
      setGameState((prev) => {
        if (prev.currentProduction) return prev; // Already producing
        const preset = GENRE_PRESETS.find((p) => p.genre === genre) || GENRE_PRESETS[0];

        let cost = preset.baseCost;
        let duration = preset.durationSeconds;

        if (releaseType === 'ep') {
          cost *= 2.2;
          duration *= 1.8;
        } else if (releaseType === 'album') {
          cost *= 4.5;
          duration *= 3.0;
        }

        if (prev.cash < cost) return prev;

        if (prev.sfxEnabled) {
          sound.playScratch();
        }

        return {
          ...prev,
          cash: prev.cash - cost,
          currentProduction: {
            title: title || `${genre} Anthem #${prev.tracks.length + 1}`,
            genre,
            releaseType,
            cost,
            durationSeconds: Math.round(duration),
            progressSeconds: 0,
          },
          finances: {
            ...prev.finances,
            productionExpenses: prev.finances.productionExpenses + cost,
          },
        };
      });
    },
    []
  );

  const upgradeStudioModule = useCallback((type: 'daw' | 'mastering' | 'marketing') => {
    setGameState((prev) => {
      let cost = 0;
      let nextDaw = prev.studioDawLevel;
      let nextMastering = prev.masteringLevel;
      let nextMarketing = prev.marketingLevel;

      if (type === 'daw') {
        cost = Math.round(1500 * Math.pow(1.8, prev.studioDawLevel));
        if (prev.cash < cost) return prev;
        nextDaw += 1;
      } else if (type === 'mastering') {
        cost = Math.round(2400 * Math.pow(1.85, prev.masteringLevel));
        if (prev.cash < cost) return prev;
        nextMastering += 1;
      } else {
        cost = Math.round(3500 * Math.pow(1.9, prev.marketingLevel));
        if (prev.cash < cost) return prev;
        nextMarketing += 1;
      }

      if (prev.sfxEnabled) {
        sound.playCashChime();
      }

      return {
        ...prev,
        cash: prev.cash - cost,
        studioDawLevel: nextDaw,
        masteringLevel: nextMastering,
        marketingLevel: nextMarketing,
        finances: {
          ...prev.finances,
          productionExpenses: prev.finances.productionExpenses + cost,
        },
      };
    });
  }, []);

  const hireStaff = useCallback((staffId: string) => {
    setGameState((prev) => {
      const staff = prev.staff.find((s) => s.id === staffId);
      if (!staff || staff.hired || prev.cash < staff.hireCost) return prev;

      if (prev.sfxEnabled) {
        sound.playCashChime();
      }

      return {
        ...prev,
        cash: prev.cash - staff.hireCost,
        reputation: prev.reputation + 40,
        staff: prev.staff.map((s) => (s.id === staffId ? { ...s, hired: true } : s)),
      };
    });
  }, []);

  const signLabel = useCallback((labelId: string) => {
    setGameState((prev) => {
      const label = prev.labels.find((l) => l.id === labelId);
      if (!label || label.signed || prev.fans < label.minFans) return prev;

      if (prev.sfxEnabled) {
        sound.playLevelUp();
      }

      return {
        ...prev,
        cash: prev.cash + label.signingBonus,
        reputation: prev.reputation + label.tier * 100,
        labels: prev.labels.map((l) => ({
          ...l,
          signed: l.id === labelId,
        })),
        finances: {
          ...prev.finances,
          sponsorshipRevenue: prev.finances.sponsorshipRevenue + label.signingBonus,
        },
      };
    });
  }, []);

  const travelToCity = useCallback((cityId: string) => {
    setGameState((prev) => {
      const city = prev.worldTourCities.find((c) => c.id === cityId);
      if (!city || !city.unlocked || prev.cash < city.travelCost) return prev;

      const hasTourMgr = prev.staff.find((s) => s.id === 'staff_tour_manager')?.hired;
      const actualCost = hasTourMgr ? Math.round(city.travelCost * 0.5) : city.travelCost;
      if (prev.cash < actualCost) return prev;

      // Calculate tour concert revenue
      const attendees = Math.min(city.stadiumCapacity, Math.max(1000, prev.fans * 0.15));
      const concertRevenue = Math.round(attendees * (city.ticketPrice * 0.3) * city.tourRewardMultiplier);
      const fansGained = Math.round(attendees * 0.25);
      const repGained = Math.round(city.tourRewardMultiplier * 150);

      if (prev.sfxEnabled) {
        sound.playCheer();
      }

      return {
        ...prev,
        cash: prev.cash - actualCost + concertRevenue,
        fans: prev.fans + fansGained,
        reputation: prev.reputation + repGained,
        worldTourCities: prev.worldTourCities.map((c) =>
          c.id === cityId ? { ...c, completedGigsCount: c.completedGigsCount + 1 } : c
        ),
        finances: {
          ...prev.finances,
          tourExpenses: prev.finances.tourExpenses + actualCost,
          gigRevenue: prev.finances.gigRevenue + concertRevenue,
        },
      };
    });
  }, []);

  const manufactureMerch = useCallback((merchId: string) => {
    setGameState((prev) => {
      const item = prev.merch.find((m) => m.id === merchId);
      if (!item || prev.cash < item.batchCost) return prev;

      if (prev.sfxEnabled) {
        sound.playCashChime();
      }

      return {
        ...prev,
        cash: prev.cash - item.batchCost,
        merch: prev.merch.map((m) =>
          m.id === merchId
            ? { ...m, stock: m.stock + m.unitsPerProductionBatch, unlocked: true }
            : m
        ),
      };
    });
  }, []);

  const unlockMerchItem = useCallback((merchId: string) => {
    setGameState((prev) => ({
      ...prev,
      merch: prev.merch.map((m) => (m.id === merchId ? { ...m, unlocked: true } : m)),
    }));
  }, []);

  const promoteTrack = useCallback((trackId: string) => {
    setGameState((prev) => {
      const promoCost = 1200;
      if (prev.cash < promoCost) return prev;

      const track = prev.tracks.find((t) => t.id === trackId);
      if (!track) return prev;

      const streamBoost = Math.round(track.dailyStreams * 0.6) + 500;
      const fanBoost = Math.round(streamBoost * 0.08);

      if (prev.sfxEnabled) {
        sound.playCheer();
      }

      return {
        ...prev,
        cash: prev.cash - promoCost,
        fans: prev.fans + fanBoost,
        tracks: prev.tracks.map((t) =>
          t.id === trackId
            ? {
                ...t,
                dailyStreams: t.dailyStreams + streamBoost,
                popularity: Math.min(100, t.popularity + 15),
              }
            : t
        ),
        finances: {
          ...prev.finances,
          productionExpenses: prev.finances.productionExpenses + promoCost,
        },
      };
    });
  }, []);

  const triggerManualDrop = useCallback(() => {
    setGameState((prev) => {
      if (!prev.isGigActive) return prev;
      if (prev.sfxEnabled) {
        sound.playDrop();
      }
      return {
        ...prev,
        audienceExcitement: Math.min(100, prev.audienceExcitement + 8),
      };
    });
  }, []);

  const claimAchievement = useCallback((achId: string) => {
    setGameState((prev) => {
      const ach = prev.achievements.find((a) => a.id === achId);
      if (!ach || ach.unlocked) return prev;

      if (prev.sfxEnabled) {
        sound.playCashChime();
      }

      return {
        ...prev,
        cash: prev.cash + ach.rewardCash,
        reputation: prev.reputation + ach.rewardReputation,
        achievements: prev.achievements.map((a) =>
          a.id === achId ? { ...a, unlocked: true } : a
        ),
      };
    });
  }, []);

  const claimDailyMission = useCallback((missionId: string) => {
    setGameState((prev) => {
      const m = prev.dailyMissions.find((dm) => dm.id === missionId);
      if (!m || m.claimed) return prev;

      if (prev.sfxEnabled) {
        sound.playCashChime();
      }

      return {
        ...prev,
        cash: prev.cash + m.rewardCash,
        fans: prev.fans + m.rewardFans,
        dailyMissions: prev.dailyMissions.map((dm) =>
          dm.id === missionId ? { ...dm, claimed: true, completed: true } : dm
        ),
      };
    });
  }, []);

  const toggleSoundMute = useCallback(() => {
    setGameState((prev) => {
      const nextMute = !prev.musicEnabled;
      sound.setMute(!nextMute);
      if (nextMute && !sound.getIsMusicPlaying()) {
        sound.startMusic();
      } else if (!nextMute && sound.getIsMusicPlaying()) {
        sound.stopMusic();
      }
      return {
        ...prev,
        musicEnabled: nextMute,
        sfxEnabled: nextMute,
      };
    });
  }, []);

  const dismissOfflineReport = useCallback(() => {
    setOfflineReport(null);
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setGameState(INITIAL_GAME_STATE);
  }, []);

  return {
    gameState,
    offlineReport,
    startGig,
    stopGig,
    selectVenue,
    upgradeVenue,
    upgradeEquipment,
    startTrackProduction,
    upgradeStudioModule,
    hireStaff,
    signLabel,
    travelToCity,
    manufactureMerch,
    unlockMerchItem,
    promoteTrack,
    triggerManualDrop,
    claimAchievement,
    claimDailyMission,
    toggleSoundMute,
    dismissOfflineReport,
    resetGame,
  };
}
