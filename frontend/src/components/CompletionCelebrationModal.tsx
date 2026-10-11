import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { VerificationResult } from '../api/client';
import { CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface CompletionCelebrationModalProps {
  result: VerificationResult;
  onClose: () => void;
}

export const CompletionCelebrationModal: React.FC<CompletionCelebrationModalProps> = ({
  result,
  onClose,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FA5438', '#f5b726', '#8bb2de', '#e97b77', '#2C4D46'],
      });
    } catch (e) {}
  }, []);

  return (
    <div className="modal-overlay">
      <div
        className="modal-content-brutal"
        style={{
          textAlign: 'center',
          maxWidth: 500,
        }}
      >
        {/* Pixel Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div className="pixel-steps">
            <span className="sq-orange" />
            <span className="sq-sky" />
            <span className="sq-ochre" />
            <span className="sq-pink" />
          </div>
        </div>

        {/* Big Check Badge */}
        <div
          style={{
            width: 64,
            height: 64,
            background: 'var(--hf-green)',
            border: '2px solid var(--hf-ink)',
            boxShadow: '4px 4px 0 var(--hf-ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#ffffff',
          }}
        >
          <CheckCircle2 size={36} />
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: 1,
            color: 'var(--hf-ink)',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
        >
          Quest Complete ✓
        </h1>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 12px',
            background: '#dcfce7',
            border: '1.5px solid var(--hf-ink)',
            fontSize: 12,
            color: '#166534',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          <ShieldCheck size={14} />
          Evidence Authenticated ({Math.round(result.confidence_score * 100)}% Confidence)
        </div>

        {/* Rewards Box */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {/* XP Card */}
          <div
            style={{
              padding: '16px',
              background: '#fef3c7',
              border: '2px solid var(--hf-ink)',
              boxShadow: '3px 3px 0 var(--hf-ink)',
            }}
          >
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#78350f', textTransform: 'uppercase' }}>
              XP Progression
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 28,
                fontWeight: 900,
                color: '#b45309',
                marginTop: 4,
              }}
            >
              +{result.xp_awarded} XP
            </div>
          </div>

          {/* GRASS Card */}
          <div
            style={{
              padding: '16px',
              background: '#dcfce7',
              border: '2px solid var(--hf-ink)',
              boxShadow: '3px 3px 0 var(--hf-ink)',
            }}
          >
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
              GRASS Currency
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 28,
                fontWeight: 900,
                color: 'var(--hf-green-dark)',
                marginTop: 4,
              }}
            >
              +{result.grass_awarded} 🌱
            </div>
          </div>
        </div>

        {/* Level Up Banner */}
        {result.level_up && (
          <div
            style={{
              padding: '12px',
              background: 'var(--hf-yellow)',
              border: '2px solid var(--hf-ink)',
              boxShadow: '3px 3px 0 var(--hf-ink)',
              color: 'var(--hf-ink)',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 16,
            }}
          >
            <Sparkles size={16} />
            LEVEL UP! ADVANCED TO LEVEL {result.new_level}!
          </div>
        )}

        {/* Badge Unlocked */}
        {result.badges_unlocked && result.badges_unlocked.length > 0 && (
          <div
            style={{
              padding: '14px',
              background: '#ede9fe',
              border: '2px solid var(--hf-ink)',
              boxShadow: '3px 3px 0 var(--hf-ink)',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 28 }}>{result.badges_unlocked[0].icon}</span>
            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#6d28d9', fontWeight: 800, textTransform: 'uppercase' }}>
                New Badge Unlocked!
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--hf-ink)' }}>
                {result.badges_unlocked[0].name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--hf-ink-muted)' }}>
                {result.badges_unlocked[0].description}
              </div>
            </div>
          </div>
        )}

        {/* Reflection */}
        <div
          style={{
            padding: '14px',
            background: '#f2f2eb',
            border: '2px solid var(--hf-ink)',
            fontSize: 13,
            color: 'var(--hf-ink-muted)',
            lineHeight: 1.5,
            marginBottom: 20,
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--hf-ink)', textTransform: 'uppercase', marginBottom: 4 }}>
            Game Master Reflection:
          </div>
          {result.game_master_reflection}
        </div>

        {/* Philosophy line */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12.5,
            fontWeight: 700,
            color: 'var(--hf-coral)',
            marginBottom: 20,
          }}
        >
          “You've done enough today. Go enjoy the outside.” 🌱
        </div>

        <button
          onClick={onClose}
          className="btn-salmon"
          style={{ width: '100%', padding: '12px' }}
        >
          <span>Continue</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
