import React, { useState, useEffect } from 'react';
import type { LeaderboardResponse } from '../api/client';
import { fetchLeaderboard } from '../api/client';
import { Trophy, Users, GraduationCap, Globe, Award } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const [category, setCategory] = useState<'global' | 'college' | 'friends'>('global');
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchLeaderboard(category)
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [category]);

  return (
    <div style={{ animation: 'fadeIn 0.2s ease' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
          borderBottom: '2px solid var(--hf-ink)',
          paddingBottom: 12,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div className="pixel-steps">
              <span className="sq-orange" />
              <span className="sq-sky" />
              <span className="sq-ochre" />
              <span className="sq-pink" />
            </div>
            <span className="eyebrow-mono coral">Participant Standings</span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)',
              fontWeight: 900,
              color: 'var(--hf-ink)',
              lineHeight: 1.1,
            }}
          >
            Outdoor Leaderboards, <span style={{ color: 'var(--hf-coral)' }}>ranked by verified XP.</span>
          </h1>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'global', label: 'Global', icon: Globe },
            { id: 'college', label: 'College', icon: GraduationCap },
            { id: 'friends', label: 'Friends', icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            const isSel = category === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCategory(item.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  background: isSel ? 'var(--hf-teal-dark)' : '#ffffff',
                  color: isSel ? '#ffffff' : 'var(--hf-ink)',
                  border: '2px solid var(--hf-ink)',
                  boxShadow: isSel ? '2px 2px 0 var(--hf-ink)' : '2px 2px 0 var(--hf-ink)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transform: isSel ? 'translate(-1px, -1px)' : 'none',
                }}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Standing Highlight Box */}
      {data && data.user_standing && (
        <div
          style={{
            background: 'var(--hf-yellow)',
            border: '2px solid var(--hf-ink)',
            boxShadow: '4px 4px 0 var(--hf-ink)',
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 22,
                fontWeight: 900,
                color: 'var(--hf-ink)',
              }}
            >
              #{data.user_standing.rank}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>{data.user_standing.avatar}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: 'var(--hf-ink)' }}>
                  {data.user_standing.username}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--hf-ink)',
                    color: '#ffffff',
                    padding: '2px 6px',
                    fontWeight: 800,
                  }}
                >
                  YOU
                </span>
              </div>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--hf-ink)', marginTop: 2 }}>
                Level {data.user_standing.level} • {data.user_standing.level_title}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 18, color: 'var(--hf-ink)' }}>
                {data.user_standing.xp.toLocaleString()} XP
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--hf-ink)' }}>
                {data.user_standing.badges_count} Badges Earned
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="brutal-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr
              style={{
                background: '#f2f2eb',
                borderBottom: '2px solid var(--hf-ink)',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: 'var(--hf-ink)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              <th style={{ padding: '14px 18px', width: 70 }}>Rank</th>
              <th style={{ padding: '14px 18px' }}>Player</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Level</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>XP</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Badges</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} style={{ padding: 32, textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--hf-ink-muted)' }}>
                  Loading rankings...
                </td>
              </tr>
            ) : (
              data?.users.map((player) => {
                const isCurrent = player.is_current_user;
                return (
                  <tr
                    key={`${player.rank}-${player.username}`}
                    style={{
                      borderBottom: '1.5px solid var(--hf-ink)',
                      background: isCurrent ? '#fef3c7' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          fontSize: 14,
                          color:
                            player.rank === 1
                              ? '#b45309'
                              : player.rank === 2
                              ? '#475569'
                              : player.rank === 3
                              ? '#854d0e'
                              : 'var(--hf-ink)',
                        }}
                      >
                        #{player.rank}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 18 }}>{player.avatar}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 800,
                                fontSize: 16,
                                color: 'var(--hf-ink)',
                              }}
                            >
                              {player.username}
                            </span>
                          </div>
                          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--hf-ink-muted)' }}>
                            {player.level_title}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: 'var(--hf-ink)',
                        }}
                      >
                        LVL {player.level}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          fontSize: 13,
                          color: 'var(--hf-coral)',
                        }}
                      >
                        {player.xp.toLocaleString()}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Award size={13} color="var(--hf-ink)" />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>
                          {player.badges_count}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
