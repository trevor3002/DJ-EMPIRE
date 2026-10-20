import React, { useState } from 'react';
import {
  Disc,
  Flame,
  TrendingUp,
  Sparkles,
  Sliders,
  Radio,
  Share2,
  CheckCircle2,
  Music,
} from 'lucide-react';
import { GameState, MusicGenre, ReleaseType } from '../../game/types';
import { GENRE_PRESETS } from '../../game/constants';
import { formatRand, formatNumber } from '../HeaderHUD';

interface StudioViewProps {
  state: GameState;
  onStartProduction: (title: string, genre: MusicGenre, releaseType: ReleaseType) => void;
  onUpgradeStudioModule: (type: 'daw' | 'mastering' | 'marketing') => void;
  onPromoteTrack: (trackId: string) => void;
}

const SAMPLE_TRACK_TITLES = [
  'Neon Eclipse',
  'Subterranean Pulse',
  'Midnight Velocity',
  'Quantum Odyssey',
  'Jozi Sunset Groove',
  'Cape Point Awakening',
  'Ibiza Euphoria',
  'Acid Strobe Dream',
  'Deep Horizon',
  'Mainstage Resonance',
  'BPM Overdrive',
  'Electric Mirage',
];

export const StudioView: React.FC<StudioViewProps> = ({
  state,
  onStartProduction,
  onUpgradeStudioModule,
  onPromoteTrack,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<MusicGenre>('House');
  const [selectedReleaseType, setSelectedReleaseType] = useState<ReleaseType>('single');
  const [customTitle, setCustomTitle] = useState('');
  const [studioTab, setStudioTab] = useState<'create' | 'catalog' | 'charts'>('create');

  const preset = GENRE_PRESETS.find((p) => p.genre === selectedGenre) || GENRE_PRESETS[0];

  let calculatedCost = preset.baseCost;
  let calculatedDuration = preset.durationSeconds;
  if (selectedReleaseType === 'ep') {
    calculatedCost = Math.round(calculatedCost * 2.2);
    calculatedDuration = Math.round(calculatedDuration * 1.8);
  } else if (selectedReleaseType === 'album') {
    calculatedCost = Math.round(calculatedCost * 4.5);
    calculatedDuration = Math.round(calculatedDuration * 3.0);
  }

  const canAfford = state.cash >= calculatedCost;
  const isProducing = state.currentProduction !== null;

  const handleCreate = () => {
    const title = customTitle.trim() || SAMPLE_TRACK_TITLES[Math.floor(Math.random() * SAMPLE_TRACK_TITLES.length)];
    onStartProduction(title, selectedGenre, selectedReleaseType);
    setCustomTitle('');
  };

  const dawCost = Math.round(1500 * Math.pow(1.8, state.studioDawLevel));
  const masteringCost = Math.round(2400 * Math.pow(1.85, state.masteringLevel));
  const marketingCost = Math.round(3500 * Math.pow(1.9, state.marketingLevel));

  // Sort tracks for charts
  const sortedCatalog = [...state.tracks].sort((a, b) => b.totalStreams - a.totalStreams);

  return (
    <div className="space-y-4 pb-20">
      {/* Studio Header & Segmented Tabs */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#181033] to-[#120a24] border border-cyan-500/30 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">Music Production Studio</h2>
          </div>
          <div className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 rounded-lg px-2.5 py-1">
            Catalog: {state.tracks.length} Releases
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-black/50 rounded-xl border border-white/5">
          <button
            onClick={() => setStudioTab('create')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all min-h-[36px] ${
              studioTab === 'create'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Produce Music
          </button>
          <button
            onClick={() => setStudioTab('catalog')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all min-h-[36px] ${
              studioTab === 'catalog'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Catalog ({state.tracks.length})
          </button>
          <button
            onClick={() => setStudioTab('charts')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all min-h-[36px] ${
              studioTab === 'charts'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Top 10 Charts
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCE MUSIC */}
      {studioTab === 'create' && (
        <div className="space-y-4">
          {/* Active Production Banner */}
          {isProducing && state.currentProduction && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#22123d] to-[#140b26] border border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.2)] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                  <span className="text-xs uppercase font-extrabold text-pink-400 tracking-wider">
                    Rendering in Studio
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-white">
                  {Math.round(
                    (state.currentProduction.progressSeconds / state.currentProduction.durationSeconds) * 100
                  )}
                  %
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{state.currentProduction.title}</h3>
                <p className="text-xs text-slate-400">
                  {state.currentProduction.genre} · {state.currentProduction.releaseType.toUpperCase()}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-black/60 border border-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-200 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (state.currentProduction.progressSeconds / state.currentProduction.durationSeconds) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* New Track Form Card */}
          <div className="p-4 rounded-2xl bg-[#140e26] border border-white/10 space-y-3.5">
            <div>
              <h3 className="text-sm font-bold text-white">Produce New Electronic Release</h3>
              <p className="text-xs text-slate-400">Select genre, package format, and track title</p>
            </div>

            {/* Track Title Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Track Title (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={`e.g. ${SAMPLE_TRACK_TITLES[0]}`}
                  className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={() =>
                    setCustomTitle(
                      SAMPLE_TRACK_TITLES[Math.floor(Math.random() * SAMPLE_TRACK_TITLES.length)]
                    )
                  }
                  className="min-h-[40px] px-3 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/40 text-purple-300 font-semibold text-xs active:scale-95"
                >
                  Randomize
                </button>
              </div>
            </div>

            {/* Release Type Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Release Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['single', 'ep', 'album'] as ReleaseType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedReleaseType(type)}
                    className={`py-2 px-1 rounded-xl border text-center transition-all min-h-[44px] ${
                      selectedReleaseType === type
                        ? 'bg-purple-900/60 border-cyan-400 text-white font-bold shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs uppercase">{type}</div>
                    <div className="text-[10px] text-cyan-300/80 font-mono">
                      {type === 'single' ? '1 Track' : type === 'ep' ? '4 Tracks' : '10 Tracks'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Electronic Genre Grid (10 Genres) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Music Genre
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {GENRE_PRESETS.map((p) => {
                  const isSelected = selectedGenre === p.genre;
                  return (
                    <button
                      key={p.genre}
                      onClick={() => setSelectedGenre(p.genre)}
                      className={`p-2.5 rounded-xl border text-left transition-all min-h-[50px] ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#251545] to-[#160d2b] border-cyan-400 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                          : 'bg-black/30 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{p.genre}</span>
                        <span className="text-[9px] font-mono text-cyan-400">{p.tempo}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{p.vibe}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Production Costs and Action CTA */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Production Cost:</span>
                <span className="text-cyan-300 font-bold">{formatRand(calculatedCost)}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Duration:</span>
                <span className="text-purple-300 font-bold">{calculatedDuration}s</span>
              </div>

              <button
                onClick={handleCreate}
                disabled={isProducing || !canAfford}
                className={`w-full min-h-[48px] rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${
                  isProducing
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : canAfford
                    ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white shadow-[0_0_16px_rgba(0,242,254,0.4)]'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <Disc className="w-4 h-4" />
                <span>
                  {isProducing
                    ? 'Studio Busy (Rendering)'
                    : canAfford
                    ? `Start Production (${formatRand(calculatedCost)})`
                    : `Need ${formatRand(calculatedCost)}`}
                </span>
              </button>
            </div>
          </div>

          {/* Studio Hardware & DAW Upgrades */}
          <div className="p-4 rounded-2xl bg-[#140e26] border border-white/10 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-white">Studio Facility Upgrades</h3>
              <p className="text-xs text-slate-400">Improve track audio fidelity, hit probability & promotion</p>
            </div>

            <div className="space-y-2">
              {/* DAW Software Upgrade */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">
                    DAW Suite (Lvl {state.studioDawLevel})
                  </div>
                  <div className="text-[11px] text-slate-400">+8 Track Quality score</div>
                </div>
                <button
                  onClick={() => onUpgradeStudioModule('daw')}
                  disabled={state.cash < dawCost}
                  className={`min-h-[38px] px-3 rounded-lg text-xs font-bold transition-all ${
                    state.cash >= dawCost
                      ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300'
                      : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  Upgrade ({formatRand(dawCost)})
                </button>
              </div>

              {/* Mixing & Mastering Upgrade */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">
                    Mastering Chain (Lvl {state.masteringLevel})
                  </div>
                  <div className="text-[11px] text-slate-400">+12% Daily Stream conversion</div>
                </div>
                <button
                  onClick={() => onUpgradeStudioModule('mastering')}
                  disabled={state.cash < masteringCost}
                  className={`min-h-[38px] px-3 rounded-lg text-xs font-bold transition-all ${
                    state.cash >= masteringCost
                      ? 'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400 text-purple-300'
                      : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  Upgrade ({formatRand(masteringCost)})
                </button>
              </div>

              {/* Playlist Marketing Upgrade */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">
                    Playlist Promo Engine (Lvl {state.marketingLevel})
                  </div>
                  <div className="text-[11px] text-slate-400">+5% Hit Song probability</div>
                </div>
                <button
                  onClick={() => onUpgradeStudioModule('marketing')}
                  disabled={state.cash < marketingCost}
                  className={`min-h-[38px] px-3 rounded-lg text-xs font-bold transition-all ${
                    state.cash >= marketingCost
                      ? 'bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400 text-pink-300'
                      : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  Upgrade ({formatRand(marketingCost)})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY MUSIC CATALOG */}
      {studioTab === 'catalog' && (
        <div className="space-y-3">
          {state.tracks.map((track) => (
            <div
              key={track.id}
              className="p-3.5 rounded-2xl bg-[#140e26] border border-white/10 space-y-2.5 shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{track.title}</span>
                    {track.isHit && (
                      <span className="text-[9px] uppercase font-extrabold text-amber-300 bg-amber-950/80 border border-amber-500/50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5" /> Hit
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{track.genre}</span>
                    <span>·</span>
                    <span className="uppercase text-purple-300 font-mono">{track.releaseType}</span>
                    <span>·</span>
                    <span className="text-cyan-400 font-mono">Q: {track.quality}/100</span>
                  </div>
                </div>

                {/* Promote Button */}
                <button
                  onClick={() => onPromoteTrack(track.id)}
                  disabled={state.cash < 1200}
                  className={`min-h-[38px] px-3 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 ${
                    state.cash >= 1200
                      ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300'
                      : 'bg-slate-800/60 border border-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Promote ({formatRand(1200)})</span>
                </button>
              </div>

              {/* Streaming Stats Strip */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-xs">
                <div className="p-2 rounded-xl bg-black/40">
                  <div className="text-[10px] text-slate-400 uppercase">Total Streams</div>
                  <div className="font-mono font-bold text-white">
                    {formatNumber(track.totalStreams)}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-black/40">
                  <div className="text-[10px] text-slate-400 uppercase">Daily Streams</div>
                  <div className="font-mono font-bold text-cyan-300">
                    {formatNumber(track.dailyStreams)}/day
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-black/40">
                  <div className="text-[10px] text-slate-400 uppercase">Royalties</div>
                  <div className="font-mono font-bold text-purple-300">
                    {formatRand(track.royaltiesEarned)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: TOP 10 CHARTS */}
      {studioTab === 'charts' && (
        <div className="p-4 rounded-2xl bg-[#140e26] border border-white/10 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-white">Electronic Music Top Charts</h3>
            <p className="text-xs text-slate-400">Global weekly dance streaming rankings</p>
          </div>

          <div className="space-y-2">
            {sortedCatalog.slice(0, 10).map((t, idx) => (
              <div
                key={t.id}
                className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono font-black text-sm w-5 text-center ${
                      idx === 0
                        ? 'text-amber-400'
                        : idx === 1
                        ? 'text-slate-300'
                        : idx === 2
                        ? 'text-amber-600'
                        : 'text-slate-500'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">{t.title}</div>
                    <div className="text-[10px] text-slate-400">{t.genre} · {state.djName}</div>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-cyan-300 font-bold">
                  {formatNumber(t.totalStreams)} streams
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
