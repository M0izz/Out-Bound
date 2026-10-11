import React from 'react';
import type { Quest } from '../api/client';
import { Clock, ArrowRight } from 'lucide-react';

interface DailyQuestDropProps {
  dailyQuests: Quest[];
  onSelectQuest: (quest: Quest) => void;
  onAcceptQuest: (quest: Quest) => void;
  isAccepting: boolean;
}

export const DailyQuestDrop: React.FC<DailyQuestDropProps> = ({
  dailyQuests,
  onSelectQuest,
  onAcceptQuest,
  isAccepting,
}) => {
  return (
    <div style={{ marginTop: 36 }}>
      {/* Hacktoberfest styled section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
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
            <span className="eyebrow-mono coral">Daily Field Missions</span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
              fontWeight: 900,
              color: 'var(--hf-ink)',
              lineHeight: 1.1,
              letterSpacing: 0.5,
            }}
          >
            Today's Quest Drop, <span style={{ color: 'var(--hf-coral)' }}>choose your mission.</span>
          </h2>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 700,
            background: 'var(--hf-teal-dark)',
            color: '#ffffff',
            padding: '5px 12px',
            border: '2px solid var(--hf-ink)',
            boxShadow: '2px 2px 0 var(--hf-ink)',
          }}
        >
          3 of 3 Available Today
        </div>
      </div>

      {/* Grid of 3 Daily Missions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: 20,
        }}
      >
        {dailyQuests.map((quest) => {
          const tier = quest.drop_tier || 'explorer';
          const tierEmoji = tier === 'chill' ? '🌱' : tier === 'explorer' ? '🗺️' : '🔥';
          const tierColor =
            tier === 'chill'
              ? 'var(--hf-green)'
              : tier === 'explorer'
              ? 'var(--hf-sky)'
              : 'var(--hf-coral)';

          return (
            <div
              key={quest.id}
              className="brutal-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: `6px solid ${tierColor}`,
              }}
            >
              <div>
                {/* Header Tag */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{tierEmoji}</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        fontSize: 12,
                        textTransform: 'uppercase',
                        color: 'var(--hf-ink)',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {tier}
                    </span>
                  </div>

                  <span className={`rarity-tag ${quest.rarity}`}>
                    {quest.rarity}
                  </span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => onSelectQuest(quest)}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    fontWeight: 800,
                    color: 'var(--hf-ink)',
                    lineHeight: 1.25,
                    marginBottom: 10,
                    cursor: 'pointer',
                  }}
                >
                  {quest.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: 13.5,
                    color: 'var(--hf-ink-muted)',
                    lineHeight: 1.55,
                    marginBottom: 16,
                  }}
                >
                  {quest.description}
                </p>

                {/* Requirements / Duration metadata */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--hf-ink)',
                    }}
                  >
                    <Clock size={13} color="var(--hf-coral)" />
                    <span>{quest.duration_minutes} MINS</span>
                  </div>
                  <span className="category-pill">{quest.category}</span>
                </div>
              </div>

              {/* Bottom Rewards & Actions */}
              <div>
                {/* Reward pill box */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: '#f7f5f0',
                    border: '1.5px solid var(--hf-ink)',
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12, color: '#b45309' }}>★</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        fontSize: 12,
                        color: '#b45309',
                      }}
                    >
                      +{quest.xp_reward} XP
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12 }}>🌱</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        fontSize: 12,
                        color: 'var(--hf-green-dark)',
                      }}
                    >
                      +{quest.grass_reward} GRASS
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onSelectQuest(quest)}
                    className="btn-white"
                    style={{ flex: 1, padding: '9px 10px', fontSize: 11 }}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onAcceptQuest(quest)}
                    disabled={isAccepting}
                    className="btn-salmon"
                    style={{ flex: 1.5, padding: '9px 12px', fontSize: 11 }}
                  >
                    <span>Accept</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
