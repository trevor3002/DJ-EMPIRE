/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useGameStore } from './game/state';
import { NavigationTab } from './game/types';
import { HeaderHUD } from './components/HeaderHUD';
import { BottomNav } from './components/BottomNav';
import { PerformView } from './components/views/PerformView';
import { StudioView } from './components/views/StudioView';
import { ShopView } from './components/views/ShopView';
import { EmpireView } from './components/views/EmpireView';
import { CareerView } from './components/views/CareerView';





import { OfflineReportModal } from './components/OfflineReportModal';
import { PWAInstallModal, usePWAInstall } from './components/PWAInstallModal';
import { TitleScreen } from './components/TitleScreen';



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
          
          <PerformView
            state={gameState}
            onStartGig={startGig}
            onStopGig={stopGig}
            onSelectVenue={selectVenue}
            onUpgradeVenue={upgradeVenue}
            onTriggerDrop={triggerManualDrop}
          />
        
        )}

        {activeTab === 'STUDIO' && (
          
          <StudioView
            state={gameState}
            onStartProduction={startTrackProduction}
            onUpgradeStudioModule={upgradeStudioModule}
            onPromoteTrack={promoteTrack}
          />
        
        )}

        {activeTab === 'SHOP' && (
          
          <ShopView
            state={gameState}
            onUpgradeEquipment={upgradeEquipment}
          />
        
        )}

        {activeTab === 'EMPIRE' && (
          
          <EmpireView
            state={gameState}
            onHireStaff={hireStaff}
            onSignLabel={signLabel}
            onTravelToCity={travelToCity}
            onManufactureMerch={manufactureMerch}
            onUnlockMerch={unlockMerchItem}
          />
        
        )}

        {activeTab === 'CAREER' && (
          
          <CareerView
            state={gameState}
            onClaimAchievement={claimAchievement}
            onClaimDailyMission={claimDailyMission}
            onResetGame={resetGame}
          />
        
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
