/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useState } from 'react';
import { useGameStore } from './game/state';
import { NavigationTab } from './game/types';
import { HeaderHUD } from './components/HeaderHUD';
import { BottomNav } from './components/BottomNav';





import { OfflineReportModal } from './components/OfflineReportModal';
import { PWAInstallModal, usePWAInstall } from './components/PWAInstallModal';
import { TitleScreen } from './components/TitleScreen';

const PerformView = lazy(() => import('./components/views/PerformView').then((m) => ({ default: m.PerformView })));
const StudioView = lazy(() => import('./components/views/StudioView').then((m) => ({ default: m.StudioView })));
const ShopView = lazy(() => import('./components/views/ShopView').then((m) => ({ default: m.ShopView })));
const EmpireView = lazy(() => import('./components/views/EmpireView').then((m) => ({ default: m.EmpireView })));
const CareerView = lazy(() => import('./components/views/CareerView').then((m) => ({ default: m.CareerView })));


export default function App() {
  const {
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
  } = useGameStore();

  const { isInstallable, isIOS, install, hasDeferredPrompt } = usePWAInstall();

  const [activeTab, setActiveTab] = useState<NavigationTab>('PERFORM');
  const [showTitleScreen, setShowTitleScreen] = useState<boolean>(() => {
    // Show title screen if first time in session or brand new game
    return !sessionStorage.getItem('dj_empire_started');
  });
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  const handleStartGame = (djName: string) => {
    sessionStorage.setItem('dj_empire_started', 'true');
    setShowTitleScreen(false);
  };

  const hasUnclaimedAchievements = gameState.achievements.some((a) => !a.unlocked && a.progress >= a.target);

  return (
    <div className="min-h-screen bg-[#090610] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* 1. Title Screen Overlay (First play / Audio consent) */}
      {showTitleScreen && <TitleScreen onStartGame={handleStartGame} />}

      {/* 2. Top Header HUD with Cash, Fans, Rank & Sound */}
      <HeaderHUD
        state={gameState}
        onToggleSound={toggleSoundMute}
        onOpenInstall={() => setShowInstallModal(true)}
        isInstallable={isInstallable}
      />

      {/* 3. Main Viewport Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-3 pt-3">
        {activeTab === 'PERFORM' && (
          <Suspense fallback={<div className="min-h-[45vh] flex items-center justify-center text-cyan-300 text-sm">Loading section…</div>}>
          <PerformView
            state={gameState}
            onStartGig={startGig}
            onStopGig={stopGig}
            onSelectVenue={selectVenue}
            onUpgradeVenue={upgradeVenue}
            onTriggerDrop={triggerManualDrop}
          />
        </Suspense>
        )}

        {activeTab === 'STUDIO' && (
          <Suspense fallback={<div className="min-h-[45vh] flex items-center justify-center text-cyan-300 text-sm">Loading section…</div>}>
          <StudioView
            state={gameState}
            onStartProduction={startTrackProduction}
            onUpgradeStudioModule={upgradeStudioModule}
            onPromoteTrack={promoteTrack}
          />
        </Suspense>
        )}

        {activeTab === 'SHOP' && (
          <Suspense fallback={<div className="min-h-[45vh] flex items-center justify-center text-cyan-300 text-sm">Loading section…</div>}>
          <ShopView
            state={gameState}
            onUpgradeEquipment={upgradeEquipment}
          />
        </Suspense>
        )}

        {activeTab === 'EMPIRE' && (
          <Suspense fallback={<div className="min-h-[45vh] flex items-center justify-center text-cyan-300 text-sm">Loading section…</div>}>
          <EmpireView
            state={gameState}
            onHireStaff={hireStaff}
            onSignLabel={signLabel}
            onTravelToCity={travelToCity}
            onManufactureMerch={manufactureMerch}
            onUnlockMerch={unlockMerchItem}
          />
        </Suspense>
        )}

        {activeTab === 'CAREER' && (
          <Suspense fallback={<div className="min-h-[45vh] flex items-center justify-center text-cyan-300 text-sm">Loading section…</div>}>
          <CareerView
            state={gameState}
            onClaimAchievement={claimAchievement}
            onClaimDailyMission={claimDailyMission}
            onResetGame={resetGame}
          />
        </Suspense>
        )}
      </main>

      {/* 4. Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasUnclaimedAchievements={hasUnclaimedAchievements}
      />

      {/* 5. Welcome-Back Offline Earnings Modal */}
      {offlineReport && (
        <OfflineReportModal
          report={offlineReport}
          onDismiss={dismissOfflineReport}
        />
      )}

      {/* 6. PWA Install Guide Modal */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        isIOS={isIOS}
        hasDeferredPrompt={hasDeferredPrompt}
        onInstall={install}
      />
    </div>
  );
}
