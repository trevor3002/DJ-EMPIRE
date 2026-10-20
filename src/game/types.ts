/**
 * DJ EMPIRE: Core Type Definitions
 */

export type NavigationTab = 'PERFORM' | 'STUDIO' | 'SHOP' | 'EMPIRE' | 'CAREER';

export type EquipmentCategory = 'decks' | 'audio' | 'studio' | 'lights';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  tier: number;
  maxLevel: number;
  level: number;
  baseCost: number;
  costMultiplier: number;
  description: string;
  benefitText: string;
  earningsMultiplier: number;
  productionSpeedBonus: number;
  fanGainBonus: number;
  iconType: string;
}

export interface Venue {
  id: string;
  name: string;
  tier: number;
  category: string;
  location: string;
  minReputation: number;
  bookingFee: number;
  durationSeconds: number;
  baseAudience: number;
  basePayout: number;
  fanGain: number;
  unlocked: boolean;
  level: number;
  capacityUpgradeCost: number;
  description: string;
  visualTheme: string;
}

export type MusicGenre =
  | 'House'
  | 'Techno'
  | 'EDM'
  | 'Trance'
  | 'Drum & Bass'
  | 'Hip-Hop Beats'
  | 'Afro House'
  | 'Deep House'
  | 'Tech House'
  | 'Hardstyle';

export type ReleaseType = 'single' | 'ep' | 'album';

export interface Track {
  id: string;
  title: string;
  genre: MusicGenre;
  releaseType: ReleaseType;
  quality: number; // 1 to 100
  popularity: number; // 1 to 100
  totalStreams: number;
  dailyStreams: number;
  royaltiesEarned: number;
  releasedAt: number;
  isHit: boolean;
}

export interface InProgressProduction {
  title: string;
  genre: MusicGenre;
  releaseType: ReleaseType;
  cost: number;
  durationSeconds: number;
  progressSeconds: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  hired: boolean;
  hireCost: number;
  salaryPerSec: number;
  perkTitle: string;
  perkDescription: string;
  autoPerformsGigs?: boolean;
  fanGrowthBonus?: number;
  royaltyBonus?: number;
  productionSpeedBonus?: number;
  gigEarningsBonus?: number;
}

export interface RecordLabel {
  id: string;
  name: string;
  tier: number;
  minFans: number;
  signingBonus: number;
  royaltyRateMultiplier: number;
  festivalAccess: boolean;
  description: string;
  signed: boolean;
}

export interface WorldTourCity {
  id: string;
  name: string;
  country: string;
  continent: string;
  unlocked: boolean;
  minFans: number;
  travelCost: number;
  stadiumCapacity: number;
  ticketPrice: number;
  tourRewardMultiplier: number;
  festivalName: string;
  completedGigsCount: number;
}

export interface MerchItem {
  id: string;
  name: string;
  costToMake: number;
  sellPrice: number;
  unlocked: boolean;
  stock: number;
  totalSold: number;
  unitsPerProductionBatch: number;
  batchCost: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCash: number;
  rewardReputation: number;
  unlocked: boolean;
  icon: string;
  progress: number;
  target: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  rewardCash: number;
  rewardFans: number;
  completed: boolean;
  claimed: boolean;
  progress: number;
  target: number;
}

export interface FinancialStats {
  gigRevenue: number;
  streamingRoyalties: number;
  merchRevenue: number;
  sponsorshipRevenue: number;
  equipmentExpenses: number;
  productionExpenses: number;
  staffSalariesPaid: number;
  venueExpenses: number;
  tourExpenses: number;
}

export interface OfflineReport {
  secondsOffline: number;
  cashEarned: number;
  streamsGenerated: number;
  fansGained: number;
  performancesCompleted: number;
  royaltiesEarned: number;
  merchEarned: number;
}

export interface GameState {
  djName: string;
  cash: number;
  fans: number;
  reputation: number;
  careerRankIndex: number;
  lastSavedTimestamp: number;
  offlineHoursLimit: number;

  // Active Performance
  currentVenueId: string;
  isGigActive: boolean;
  gigElapsedSeconds: number;
  audienceExcitement: number; // 0 to 100
  gigStreak: number;

  // Music Studio
  tracks: Track[];
  currentProduction: InProgressProduction | null;
  studioDawLevel: number;
  masteringLevel: number;
  marketingLevel: number;

  // Subsystems
  venues: Venue[];
  equipment: Equipment[];
  staff: StaffMember[];
  labels: RecordLabel[];
  worldTourCities: WorldTourCity[];
  merch: MerchItem[];
  achievements: Achievement[];
  dailyMissions: DailyMission[];

  // Finance tracking
  finances: FinancialStats;

  // Audio settings
  musicEnabled: boolean;
  sfxEnabled: boolean;
  hasStartedAudio: boolean;
}
