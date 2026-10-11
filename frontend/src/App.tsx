import React, { useState, useEffect } from 'react';
import type {
  UserProfile,
  Quest,
  Challenge,
  VerificationResult,
} from './api/client';
import {
  fetchUserProfile,
  fetchDailyQuests,
  fetchActiveQuest,
  fetchChallenges,
  acceptQuest,
  abandonQuest,
} from './api/client';
import { Navbar } from './components/Navbar';
import { DailyQuestDrop } from './components/DailyQuestDrop';
import { AIGameMasterGenerator } from './components/AIGameMasterGenerator';
import { ActiveQuestView } from './components/ActiveQuestView';
import { ProofSubmissionModal } from './components/ProofSubmissionModal';
import { CompletionCelebrationModal } from './components/CompletionCelebrationModal';
import { ChallengesView } from './components/ChallengesView';
import { LeaderboardView } from './components/LeaderboardView';
import { FogOfWarMapView } from './components/FogOfWarMapView';
import { GrassShopView } from './components/GrassShopView';
import { ProfileView } from './components/ProfileView';
import { QuestDetailModal } from './components/QuestDetailModal';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  // Modals
  const [inspectQuest, setInspectQuest] = useState<Quest | null>(null);
  const [provingQuest, setProvingQuest] = useState<{ quest: Quest; minutes: number } | null>(null);
  const [celebrationResult, setCelebrationResult] = useState<VerificationResult | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshAllData = async () => {
    try {
      const [u, d, a, c] = await Promise.all([
        fetchUserProfile(),
        fetchDailyQuests(),
        fetchActiveQuest(),
        fetchChallenges(),
      ]);
      setUser(u);
      setDailyQuests(d);
      setActiveQuest(a);
      setChallenges(c);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAcceptQuest = async (quest: Quest) => {
    try {
      setIsAccepting(true);
      const accepted = await acceptQuest(quest.id);
      setActiveQuest(accepted);
      setInspectQuest(null);
      setActiveTab('home');
      showToast(`Quest Accepted: "${quest.title}". Put your phone away and head outside!`);
    } catch (err) {
      console.error(err);
      alert('Could not accept quest.');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleAbandonQuest = async () => {
    if (!activeQuest) return;
    if (confirm('Are you sure you want to abandon this active outdoor quest?')) {
      try {
        await abandonQuest(activeQuest.id);
        setActiveQuest(null);
        showToast('Quest abandoned. You can select another mission.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFinishActiveQuest = (minutes: number) => {
    if (!activeQuest) return;
    setProvingQuest({ quest: activeQuest, minutes });
  };

  const handleVerified = (result: VerificationResult) => {
    setProvingQuest(null);
    setActiveQuest(null);
    setCelebrationResult(result);
    refreshAllData();
  };

  return (
    <div>
      {/* Sticky Header */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveQuest={!!activeQuest}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 76,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'var(--hf-teal-dark)',
            color: '#ffffff',
            border: '2px solid var(--hf-ink)',
            boxShadow: '4px 4px 0 var(--hf-ink)',
            padding: '10px 20px',
            fontFamily: 'var(--font-mono)',
            fontSize: 12.5,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'fadeIn 0.15s ease',
          }}
        >
          <Sparkles size={16} color="var(--hf-yellow)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="app-container">
        {/* TAB 1: HOME (LAUNCHER) */}
        {activeTab === 'home' && (
          <div>
            {/* If an active quest is running, show the minimal 'PUT YOUR PHONE AWAY' screen */}
            {activeQuest ? (
              <ActiveQuestView
                quest={activeQuest}
                onFinish={handleFinishActiveQuest}
                onAbandon={handleAbandonQuest}
              />
            ) : (
              <div>
                {/* Hacktoberfest styled Hero Header */}
                <div
                  className="brutal-card-teal"
                  style={{
                    marginBottom: 32,
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div className="pixel-steps">
                      <span className="sq-orange" />
                      <span className="sq-sky" />
                      <span className="sq-ochre" />
                      <span className="sq-pink" />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        fontWeight: 800,
                        color: 'var(--hf-salmon)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      AI Game Master for the Real World
                    </span>
                  </div>

                  <h1
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                      fontWeight: 900,
                      color: '#ffffff',
                      lineHeight: 1.05,
                      letterSpacing: -0.5,
                      marginBottom: 14,
                    }}
                  >
                    Complete quests, <span style={{ color: 'var(--hf-coral)' }}>touch grass.</span>
                  </h1>

                  <p
                    style={{
                      fontSize: 16,
                      color: '#d1e0dc',
                      maxWidth: 720,
                      lineHeight: 1.6,
                      marginBottom: 24,
                    }}
                  >
                    Hacktoberfest turns open source into a game. OUT BOUND turns physical outdoor activity into a game. Put your phone away, explore your neighborhood, provide evidence, and earn verified XP and GRASS.
                  </p>

                  {/* Featured Quest Preview inside Hero */}
                  {dailyQuests.length > 1 && (
                    <div
                      style={{
                        background: '#ffffff',
                        color: 'var(--hf-ink)',
                        border: '2px solid var(--hf-ink)',
                        boxShadow: '4px 4px 0 var(--hf-ink)',
                        padding: '20px 24px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                          flexWrap: 'wrap',
                          gap: 8,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10,
                              fontWeight: 800,
                              background: 'var(--hf-yellow)',
                              color: 'var(--hf-ink)',
                              padding: '2px 8px',
                              border: '1.5px solid var(--hf-ink)',
                              textTransform: 'uppercase',
                            }}
                          >
                            Featured Daily Quest
                          </span>
                          <span className={`rarity-tag ${dailyQuests[1].rarity}`}>
                            {dailyQuests[1].rarity}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>
                            <Clock size={13} color="var(--hf-coral)" />
                            <span>{dailyQuests[1].duration_minutes} MINS</span>
                          </div>
                          <span className="category-pill">{dailyQuests[1].category}</span>
                        </div>
                      </div>

                      <h2
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                          fontWeight: 900,
                          color: 'var(--hf-ink)',
                          marginBottom: 6,
                        }}
                      >
                        {dailyQuests[1].title}
                      </h2>

                      <p style={{ fontSize: 13.5, color: 'var(--hf-ink-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                        {dailyQuests[1].description}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: 12,
                          paddingTop: 12,
                          borderTop: '1.5px solid var(--hf-ink)',
                        }}
                      >
                        <div style={{ display: 'flex', gap: 14 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13, color: '#b45309' }}>
                            +{dailyQuests[1].xp_reward} XP
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13, color: 'var(--hf-green-dark)' }}>
                            +{dailyQuests[1].grass_reward} GRASS 🌱
                          </span>
                        </div>

                        <button
                          onClick={() => handleAcceptQuest(dailyQuests[1])}
                          disabled={isAccepting}
                          className="btn-salmon"
                        >
                          <span>Accept Featured Quest</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3-Drop Daily Quests */}
                <DailyQuestDrop
                  dailyQuests={dailyQuests}
                  onSelectQuest={(q) => setInspectQuest(q)}
                  onAcceptQuest={handleAcceptQuest}
                  isAccepting={isAccepting}
                />

                {/* Gemma AI Game Master */}
                <AIGameMasterGenerator
                  onQuestGenerated={(q) => {
                    showToast(`Game Master synthesized new quest: "${q.title}"`);
                  }}
                  onAcceptQuest={handleAcceptQuest}
                  isAccepting={isAccepting}
                />

                {/* Hacktoberfest Campaign Teaser */}
                {challenges.length > 0 && (
                  <div
                    onClick={() => setActiveTab('challenges')}
                    className="brutal-card"
                    style={{
                      marginTop: 36,
                      cursor: 'pointer',
                      borderLeft: '8px solid var(--hf-coral)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 20 }}>🌳</span>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: 'var(--hf-ink)' }}>
                            {challenges[0].title}
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 11,
                              fontWeight: 800,
                              background: '#dcfce7',
                              color: '#166534',
                              padding: '2px 8px',
                              border: '1.5px solid var(--hf-ink)',
                            }}
                          >
                            {challenges[0].current_count}/{challenges[0].target_count} COMPLETED
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--hf-ink-muted)', marginTop: 4 }}>
                          {challenges[0].tagline} • Click to view Hacktoberfest activity track
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--hf-coral)' }}>
                        <span>View Activities</span>
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVITIES / CHALLENGES */}
        {activeTab === 'challenges' && (
          <ChallengesView
            challenges={challenges}
            onGoToQuests={() => setActiveTab('home')}
          />
        )}

        {/* TAB 3: FOG OF WAR MAP */}
        {activeTab === 'map' && <FogOfWarMapView />}

        {/* TAB 4: LEADERBOARD */}
        {activeTab === 'leaderboard' && <LeaderboardView />}

        {/* TAB 5: SHOP */}
        {activeTab === 'shop' && (
          <GrassShopView
            user={user}
            onBalanceUpdated={refreshAllData}
          />
        )}

        {/* TAB 6: PLAYER PROFILE */}
        {activeTab === 'profile' && <ProfileView user={user} />}
      </main>

      {/* Hacktoberfest styled Footer */}
      <footer
        style={{
          borderTop: '2px solid var(--hf-ink)',
          background: 'var(--hf-teal-header)',
          color: '#f7f7f2',
          padding: '28px 16px',
          marginTop: 48,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="pixel-steps">
              <span className="sq-orange" />
              <span className="sq-sky" />
              <span className="sq-ochre" />
              <span className="sq-pink" />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>
              OUT BOUND 2026 • Your AI Game Master for the real world
            </span>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#d1e0dc' }}>
            What if your AI rewarded you for closing the app? 🌱
          </div>
        </div>
      </footer>

      {/* MODAL: Quest Detail Inspector */}
      {inspectQuest && (
        <QuestDetailModal
          quest={inspectQuest}
          onClose={() => setInspectQuest(null)}
          onAccept={handleAcceptQuest}
          isAccepting={isAccepting}
        />
      )}

      {/* MODAL: Proof of Action Submission */}
      {provingQuest && (
        <ProofSubmissionModal
          quest={provingQuest.quest}
          initialMinutes={provingQuest.minutes}
          onClose={() => setProvingQuest(null)}
          onVerified={handleVerified}
        />
      )}

      {/* MODAL: Quest Completion & Celebration */}
      {celebrationResult && (
        <CompletionCelebrationModal
          result={celebrationResult}
          onClose={() => setCelebrationResult(null)}
        />
      )}
    </div>
  );
};

export default App;
