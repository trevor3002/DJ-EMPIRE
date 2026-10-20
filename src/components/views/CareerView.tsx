import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  DollarSign,
  Flame,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { GameState } from '../../game/types';
import { CAREER_RANKS } from '../../game/constants';
import { formatRand, formatNumber } from '../HeaderHUD';

interface CareerViewProps {
  state: GameState;
  onClaimAchievement: (achId: string) => void;
  onClaimDailyMission: (missionId: string) => void;
  onResetGame: () => void;
}

type CareerSubTab = 'ranks' | 'missions' | 'achievements' | 'finances';

export const CareerView: React.FC<CareerViewProps> = ({
  state,
  onClaimAchievement,
  onClaimDailyMission,
  onResetGame,
}) => {
  const [subTab, setSubTab] = useState<CareerSubTab>('ranks');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentRank = CAREER_RANKS[state.careerRankIndex] || CAREER_RANKS[0];
  const nextRank = CAREER_RANKS[state.careerRankIndex + 1];

  let rankProgress = 100;
  if (nextRank) {
    const prevMin = currentRank.minFans;
    const nextMin = nextRank.minFans;
    rankProgress = Math.min(100, Math.max(0, ((state.fans - prevMin) / (nextMin - prevMin)) * 100));
  }

  // Financial calculations
  const totalRevenue =
    state.finances.gigRevenue +
    state.finances.streamingRoyalties +
    state.finances.merchRevenue +
    state.finances.sponsorshipRevenue;

  const totalExpenses =
    state.finances.equipmentExpenses +
    state.finances.productionExpenses +
    state.finances.staffSalariesPaid +
    state.finances.venueExpenses +
    state.finances.tourExpenses;

  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-4 pb-20">
      {/* Career Overview Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#170e2b] to-[#120822] border border-cyan-500/30 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentRank.badge}</span>
            <div>
              <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                Current Career Tier
              </div>
              <h2 className="text-base font-extrabold text-white">{currentRank.title}</h2>
            </div>
          </div>
          <div className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/40">
            Rank {state.careerRankIndex + 1} / {CAREER_RANKS.length}
          </div>
        </div>

        {/* Progress to Next Rank */}
        {nextRank && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Next: {nextRank.title}</span>
              <span className="font-mono text-cyan-300 font-bold">
                {formatNumber(state.fans)} / {formatNumber(nextRank.minFans)} Fans ({Math.round(rankProgress)}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-black/60 border border-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300 rounded-full"
                style={{ width: `${rankProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Sub-tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-black/50 rounded-xl border border-white/5 pt-1">
          <button
            onClick={() => setSubTab('ranks')}
            className={`py-2 text-xs font-bold rounded-lg transition-all min-h-[40px] ${
              subTab === 'ranks'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ranks
          </button>
          <button
            onClick={() => setSubTab('missions')}
            className={`py-2 text-xs font-bold rounded-lg transition-all min-h-[40px] ${
              subTab === 'missions'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Missions
          </button>
          <button
            onClick={() => setSubTab('achievements')}
            className={`py-2 text-xs font-bold rounded-lg transition-all min-h-[40px] ${
              subTab === 'achievements'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Milestones
          </button>
          <button
            onClick={() => setSubTab('finances')}
            className={`py-2 text-xs font-bold rounded-lg transition-all min-h-[40px] ${
              subTab === 'finances'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Finances
          </button>
        </div>
      </div>

      {/* 1. CAREER RANKS LADDER */}
      {subTab === 'ranks' && (
        <div className="space-y-2.5">
          {CAREER_RANKS.map((r, idx) => {
            const isUnlocked = state.careerRankIndex >= idx;
            const isCurrent = state.careerRankIndex === idx;

            return (
              <div
                key={r.title}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#20133b] to-[#120824] border-cyan-400 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                    : isUnlocked
                    ? 'bg-[#150f28] border-purple-500/30'
                    : 'bg-black/30 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{r.badge}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{r.title}</span>
                        {isCurrent && (
                          <span className="text-[9px] uppercase font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/40">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{r.perk}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs">
                    <div className="text-purple-300 font-bold">{formatNumber(r.minFans)} Fans</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. DAILY MISSIONS */}
      {subTab === 'missions' && (
        <div className="space-y-2.5">
          {state.dailyMissions.map((m) => {
            const canClaim = !m.claimed;
            return (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl bg-[#140e26] border border-white/10 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{m.title}</div>
                    <p className="text-[11px] text-slate-400">{m.description}</p>
                    <div className="text-[11px] font-mono text-cyan-300 font-semibold pt-1">
                      Reward: {formatRand(m.rewardCash)} + {m.rewardFans} Fans
                    </div>
                  </div>

                  {m.claimed ? (
                    <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Claimed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onClaimDailyMission(m.id)}
                      className="min-h-[40px] px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xs shadow-md active:scale-95"
                    >
                      Complete & Claim
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. CAREER ACHIEVEMENTS */}
      {subTab === 'achievements' && (
        <div className="space-y-2.5">
          {state.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                ach.unlocked
                  ? 'bg-gradient-to-r from-purple-950/60 to-slate-900 border-cyan-400/40 shadow-sm'
                  : 'bg-[#140e26] border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-xl shrink-0">
                    {ach.icon}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{ach.title}</div>
                    <p className="text-[11px] text-slate-400">{ach.description}</p>
                    <div className="text-[11px] font-mono text-cyan-300 font-semibold pt-0.5">
                      Reward: {formatRand(ach.rewardCash)} · {ach.rewardReputation} Rep
                    </div>
                  </div>
                </div>

                {ach.unlocked ? (
                  <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Unlocked</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onClaimAchievement(ach.id)}
                    className="min-h-[40px] px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/60 text-purple-200 font-bold text-xs active:scale-95 shrink-0"
                  >
                    Claim
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. FINANCIAL LEDGER DASHBOARD */}
      {subTab === 'finances' && (
        <div className="space-y-4">
          {/* Net Profit Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#181033] to-[#100a22] border border-cyan-500/30 shadow-md">
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              Lifetime Net Empire Balance
            </div>
            <div
              className={`text-2xl font-black font-mono mt-1 ${
                netProfit >= 0 ? 'text-cyan-300' : 'text-red-400'
              }`}
            >
              {formatRand(netProfit)}
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="p-4 rounded-2xl bg-[#140e26] border border-white/10 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Revenue Streams (R)</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">DJ Performance Payouts</span>
                <span className="text-emerald-400 font-bold">
                  {formatRand(state.finances.gigRevenue)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Streaming Royalties</span>
                <span className="text-emerald-400 font-bold">
                  {formatRand(state.finances.streamingRoyalties)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Merchandise Sales</span>
                <span className="text-emerald-400 font-bold">
                  {formatRand(state.finances.merchRevenue)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Record Label Advances</span>
                <span className="text-emerald-400 font-bold">
                  {formatRand(state.finances.sponsorshipRevenue)}
                </span>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="p-4 rounded-2xl bg-[#140e26] border border-white/10 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <TrendingDown className="w-4 h-4 text-pink-400" />
              <span>Operating Expenses (R)</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Equipment Purchases</span>
                <span className="text-pink-400 font-bold">
                  {formatRand(state.finances.equipmentExpenses)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Studio & DAW Upgrades</span>
                <span className="text-pink-400 font-bold">
                  {formatRand(state.finances.productionExpenses)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Staff Salaries Paid</span>
                <span className="text-pink-400 font-bold">
                  {formatRand(state.finances.staffSalariesPaid)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Venue Upgrades & Gigs</span>
                <span className="text-pink-400 font-bold">
                  {formatRand(state.finances.venueExpenses)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">World Tour Travel</span>
                <span className="text-pink-400 font-bold">
                  {formatRand(state.finances.tourExpenses)}
                </span>
              </div>
            </div>
          </div>

          {/* Reset Save Button */}
          <div className="pt-2">
            {showResetConfirm ? (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-3">
                <div className="text-xs text-red-300 font-semibold">
                  Reset entire career progress back to R1,000 bedroom setup?
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onResetGame();
                      setShowResetConfirm(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-red-400 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Career Save</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
