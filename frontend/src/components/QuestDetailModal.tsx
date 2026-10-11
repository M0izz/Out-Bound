import React from 'react';
import type { Quest } from '../api/client';
import { Clock, Shield, ArrowRight } from 'lucide-react';

interface QuestDetailModalProps {
  quest: Quest;
  onClose: () => void;
  onAccept: (quest: Quest) => void;
  isAccepting: boolean;
}

export const QuestDetailModal: React.FC<QuestDetailModalProps> = ({
  quest,
  onClose,
  onAccept,
  isAccepting,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content-brutal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="pixel-steps">
              <span className="sq-orange" />
              <span className="sq-sky" />
              <span className="sq-ochre" />
              <span className="sq-pink" />
            </div>
            <span className={`rarity-tag ${quest.rarity}`}>
              {quest.rarity}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '2px solid var(--hf-ink)',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26,
            fontWeight: 900,
            color: 'var(--hf-ink)',
            lineHeight: 1.2,
            marginBottom: 10,
          }}
        >
          {quest.title}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            <Clock size={13} color="var(--hf-coral)" />
            <span>{quest.duration_minutes} MINS</span>
          </div>
          <span className="category-pill">{quest.category}</span>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#b45309', fontWeight: 800, textTransform: 'uppercase' }}>
            {quest.difficulty} intensity
          </span>
        </div>

        <p style={{ fontSize: 14.5, color: 'var(--hf-ink-muted)', lineHeight: 1.6, marginBottom: 20 }}>
          {quest.description}
        </p>

        {/* AI Intel Box */}
        <div
          style={{
            padding: '14px',
            background: '#fef3c7',
            border: '2px solid var(--hf-ink)',
            marginBottom: 20,
            fontSize: 13,
            color: '#78350f',
          }}
        >
          <strong style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>AI Game Master Intel: </strong>
          {quest.generation_reason}
        </div>

        {/* Steps */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--hf-ink)', textTransform: 'uppercase', marginBottom: 10 }}>
            Mission Protocol Steps
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {quest.steps.map((st, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    background: 'var(--hf-sky)',
                    border: '1.5px solid var(--hf-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    color: 'var(--hf-ink)',
                    marginTop: 2,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <span style={{ fontSize: 13.5, color: 'var(--hf-ink)', lineHeight: 1.45 }}>
                  {st}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Requirement */}
        <div
          style={{
            padding: '12px',
            background: '#f7f5f0',
            border: '2px solid var(--hf-ink)',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 12.5,
            color: 'var(--hf-ink-muted)',
          }}
        >
          <Shield size={16} color="var(--hf-teal-dark)" />
          <span>{quest.proof_hint}</span>
        </div>

        {/* Rewards Box */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 18px',
            background: '#ffffff',
            border: '2px solid var(--hf-ink)',
            boxShadow: '3px 3px 0 var(--hf-ink)',
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--hf-ink)', textTransform: 'uppercase', fontWeight: 800 }}>
            Deterministic Rewards
          </span>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13, color: '#b45309' }}>
              +{quest.xp_reward} XP
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13, color: 'var(--hf-green-dark)' }}>
              +{quest.grass_reward} 🌱 GRASS
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} className="btn-white" style={{ flex: 1 }}>
            Close
          </button>
          <button
            onClick={() => onAccept(quest)}
            disabled={isAccepting}
            className="btn-salmon"
            style={{ flex: 1.8 }}
          >
            <span>Accept Mission</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
