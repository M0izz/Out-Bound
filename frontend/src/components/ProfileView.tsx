import React, { useState, useEffect } from 'react';
import type { UserProfile, Badge, RewardTransaction } from '../api/client';
import { fetchUserBadges, fetchUserTransactions } from '../api/client';
import { Flame, Award, History } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile | null;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'badges' | 'ledger'>('badges');

  useEffect(() => {
    fetchUserBadges().then(setBadges).catch(console.error);
    fetchUserTransactions().then(setTransactions).catch(console.error);
  }, []);

  if (!user) return <div style={{ fontFamily: 'var(--font-mono)' }}>Loading player profile...</div>;

  const xpPercent = Math.min(100, Math.round((user.xp / user.xp_to_next_level) * 100));

  const weekDays = [
    { day: 'M', done: true },
    { day: 'T', done: true },
    { day: 'W', done: true },
    { day: 'T', done: true },
    { day: 'F', done: true },
    { day: 'S', done: true },
    { day: 'S', done: true },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.2s ease' }}>
      {/* Player Hero Card */}
      <div
        className="brutal-card-teal"
        style={{
          marginBottom: 28,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
            marginBottom: 24,
          }}
        >
          {/* Avatar & Player Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 76,
                height: 76,
                background: '#ffffff',
                border: '3px solid var(--hf-ink)',
                boxShadow: '4px 4px 0 var(--hf-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 38,
              }}
            >
              {user.avatar}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                    fontWeight: 900,
                    letterSpacing: 1.2,
                    color: '#ffffff',
                    lineHeight: 1,
                  }}
                >
                  {user.username}
                </h1>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    color: 'var(--hf-ink)',
                    background: 'var(--hf-yellow)',
                    padding: '2px 8px',
                    border: '1.5px solid var(--hf-ink)',
                    letterSpacing: '0.04em',
                  }}
                >
                  VERIFIED PLAYER
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--hf-salmon)',
                  fontWeight: 800,
                  marginTop: 6,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.06em',
                }}
              >
                LEVEL {user.level} — {user.level_title.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Currency Pods */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              background: '#1d332e',
              padding: '12px 20px',
              border: '2px solid var(--hf-ink)',
              boxShadow: '3px 3px 0 var(--hf-ink)',
            }}
          >
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--hf-salmon)', textTransform: 'uppercase', fontWeight: 800 }}>
                GRASS Vault
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 900, color: '#86efac', marginTop: 2 }}>
                🌱 {user.grass_balance}
              </div>
            </div>
            <div style={{ width: 1, background: 'var(--hf-teal-header)' }} />
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--hf-salmon)', textTransform: 'uppercase', fontWeight: 800 }}>
                Active Streak
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 900, color: 'var(--hf-coral)', marginTop: 2 }}>
                🔥 {user.current_streak}d
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12.5,
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            <span style={{ color: '#d1e0dc' }}>Progression to Level {user.level + 1}</span>
            <span style={{ color: 'var(--hf-yellow)' }}>
              {user.xp} / {user.xp_to_next_level} XP ({xpPercent}%)
            </span>
          </div>
          <div className="brutal-progress-bg" style={{ height: 16 }}>
            <div className="brutal-progress-fill yellow" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>

        {/* 4-Stat Matrix */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12,
            paddingTop: 18,
            borderTop: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#d1e0dc', textTransform: 'uppercase', fontWeight: 700 }}>
              Completed Quests
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 900, color: '#ffffff', marginTop: 3 }}>
              {user.completed_quests_count}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#d1e0dc', textTransform: 'uppercase', fontWeight: 700 }}>
              Hours Outside
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 900, color: '#86efac', marginTop: 3 }}>
              {user.outdoor_hours} hrs
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#d1e0dc', textTransform: 'uppercase', fontWeight: 700 }}>
              Global Rank
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 900, color: 'var(--hf-yellow)', marginTop: 3 }}>
              #{user.global_rank}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#d1e0dc', textTransform: 'uppercase', fontWeight: 700 }}>
              College Rank
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 900, color: 'var(--hf-sky)', marginTop: 3 }}>
              #{user.college_rank}
            </div>
          </div>
        </div>
      </div>

      {/* Streak Calendar Banner */}
      <div
        className="brutal-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Flame size={20} color="var(--hf-coral)" />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: 'var(--hf-ink)' }}>
              {user.current_streak}-DAY STREAK (Longest: {user.longest_streak}d)
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--hf-ink-muted)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>
            Target: {user.streak_milestone}. The AI respects your rest and prevents burnout.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {weekDays.map((d, i) => (
            <div
              key={i}
              style={{
                width: 36,
                height: 48,
                background: '#fef3c7',
                border: '2px solid var(--hf-ink)',
                boxShadow: '2px 2px 0 var(--hf-ink)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#78350f' }}>{d.day}</span>
              <span style={{ fontSize: 13, color: 'var(--hf-coral)', fontWeight: 900 }}>✓</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <button
          onClick={() => setActiveSubTab('badges')}
          className={activeSubTab === 'badges' ? 'btn-salmon' : 'btn-white'}
          style={{ padding: '9px 18px', fontSize: 12 }}
        >
          <Award size={15} />
          <span>Badge Pack ({badges.filter((b) => b.unlocked).length}/{badges.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('ledger')}
          className={activeSubTab === 'ledger' ? 'btn-salmon' : 'btn-white'}
          style={{ padding: '9px 18px', fontSize: 12 }}
        >
          <History size={15} />
          <span>Reward Ledger</span>
        </button>
      </div>

      {/* Badges Collection (Sticker Pack Style) */}
      {activeSubTab === 'badges' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {badges.map((b) => (
            <div
              key={b.id}
              className="brutal-card"
              style={{
                background: b.unlocked ? '#ffffff' : '#f2f2eb',
                border: b.unlocked ? '2px solid var(--hf-ink)' : '2px dashed var(--hf-ink)',
                opacity: b.unlocked ? 1 : 0.55,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>{b.icon}</span>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: 'var(--hf-ink)' }}>
                    {b.name}
                  </h4>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      color: b.unlocked ? 'var(--hf-green-dark)' : 'var(--hf-ink-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {b.unlocked ? '✓ Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--hf-ink-muted)', lineHeight: 1.45 }}>
                {b.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Audit Ledger */}
      {activeSubTab === 'ledger' && (
        <div className="brutal-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  background: '#f2f2eb',
                  borderBottom: '2px solid var(--hf-ink)',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--hf-ink)',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                }}
              >
                <th style={{ padding: '14px 18px' }}>Action</th>
                <th style={{ padding: '14px 18px' }}>Description</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>GRASS Amount</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1.5px solid var(--hf-ink)' }}>
                  <td style={{ padding: '12px 18px', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                    {t.transaction_type}
                  </td>
                  <td style={{ padding: '12px 18px', fontSize: 13, color: 'var(--hf-ink)' }}>
                    {t.description}
                  </td>
                  <td
                    style={{
                      padding: '12px 18px',
                      fontSize: 13,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      textAlign: 'right',
                      color: t.amount > 0 ? 'var(--hf-green-dark)' : '#b91c1c',
                    }}
                  >
                    {t.amount > 0 ? `+${t.amount}` : t.amount} 🌱
                  </td>
                  <td style={{ padding: '12px 18px', fontSize: 13, fontFamily: 'var(--font-mono)', textAlign: 'right', color: 'var(--hf-ink-muted)' }}>
                    {t.balance_after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
