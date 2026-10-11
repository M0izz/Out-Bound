import React from 'react';
import type { Challenge } from '../api/client';
import { Award, Calendar, CheckCircle } from 'lucide-react';

interface ChallengesViewProps {
  challenges: Challenge[];
  onGoToQuests: () => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  challenges,
  onGoToQuests,
}) => {
  return (
    <div style={{ animation: 'fadeIn 0.2s ease' }}>
      {/* Hacktoberfest styled Activities Hero */}
      <div
        className="brutal-card-teal"
        style={{
          marginBottom: 32,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
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
            The Hacktoberfest Inspiration
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: 12,
          }}
        >
          Activities, <span style={{ color: 'var(--hf-coral)' }}>and your real-world progress.</span>
        </h1>

        <p
          style={{
            fontSize: 15,
            color: '#d1e0dc',
            maxWidth: 680,
            lineHeight: 1.6,
            marginBottom: 20,
          }}
        >
          Hacktoberfest turns open-source contributions into a global celebration. OUT BOUND does the exact same thing with outdoor exploration: touch grass, record verified physical activity, and unlock official badges.
        </p>

        {/* Contrast Comparison Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
            background: '#1d332e',
            border: '2px solid var(--hf-ink)',
            padding: '16px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 800,
                color: 'var(--hf-coral)',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              Hacktoberfest Model
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#ffffff' }}>
              Action → Pull Request → Open Source
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 800,
                color: 'var(--hf-yellow)',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              OUT BOUND Model
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--hf-yellow)' }}>
              Action → Real World → Touch Grass
            </div>
          </div>
        </div>
      </div>

      {/* Campaign List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {challenges.map((c) => {
          return (
            <div key={c.id} className="brutal-card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{c.badge_icon}</span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 24,
                        fontWeight: 900,
                        color: 'var(--hf-ink)',
                      }}
                    >
                      {c.title}
                    </h3>
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--hf-coral)',
                      fontWeight: 700,
                      marginTop: 3,
                    }}
                  >
                    {c.tagline}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    color: 'var(--hf-ink-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    background: '#f2f2eb',
                    padding: '4px 8px',
                    border: '1.5px solid var(--hf-ink)',
                  }}
                >
                  <Calendar size={13} />
                  <span>{c.end_date}</span>
                </div>
              </div>

              <p style={{ fontSize: 14, color: 'var(--hf-ink-muted)', lineHeight: 1.55, marginBottom: 18 }}>
                {c.description}
              </p>

              {/* Progress Bar & Counters */}
              <div style={{ marginBottom: 18 }}>
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
                  <span style={{ color: 'var(--hf-ink-muted)' }}>Progress:</span>
                  <span style={{ color: 'var(--hf-ink)' }}>
                    {c.current_count} / {c.target_count} Completed ({c.progress_percentage}%)
                  </span>
                </div>

                <div className="brutal-progress-bg" style={{ height: 16 }}>
                  <div
                    className="brutal-progress-fill coral"
                    style={{ width: `${c.progress_percentage}%` }}
                  />
                </div>
              </div>

              {/* Rewards Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#f7f5f0',
                  border: '2px solid var(--hf-ink)',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Award size={16} color="var(--hf-coral)" />
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--hf-ink)', fontFamily: 'var(--font-mono)' }}>
                      {c.badge_name}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fontSize: 12,
                      color: '#b45309',
                    }}
                  >
                    +{c.xp_reward} XP
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fontSize: 12,
                      color: 'var(--hf-green-dark)',
                    }}
                  >
                    +{c.grass_reward} GRASS
                  </div>
                </div>

                <button
                  onClick={onGoToQuests}
                  className="btn-salmon"
                  style={{ padding: '8px 14px', fontSize: 11 }}
                >
                  Contribute Quest
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
