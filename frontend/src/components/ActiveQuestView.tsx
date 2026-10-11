import React, { useState, useEffect } from 'react';
import type { Quest } from '../api/client';
import { Smartphone, CheckCircle, PauseCircle, PlayCircle, XCircle } from 'lucide-react';

interface ActiveQuestViewProps {
  quest: Quest;
  onFinish: (elapsedMinutes: number) => void;
  onAbandon: () => void;
}

export const ActiveQuestView: React.FC<ActiveQuestViewProps> = ({
  quest,
  onFinish,
  onAbandon,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const targetSeconds = quest.duration_minutes * 60;
  const progressPct = Math.min(100, Math.round((secondsElapsed / targetSeconds) * 100));

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '24px auto',
        padding: '36px 28px',
        background: '#ffffff',
        border: '3px solid var(--hf-ink)',
        boxShadow: '8px 8px 0px var(--hf-ink)',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Eyebrow & Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <div className="pixel-steps">
          <span className="sq-orange" />
          <span className="sq-sky" />
          <span className="sq-ochre" />
          <span className="sq-pink" />
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 800,
            background: 'var(--hf-coral)',
            color: '#ffffff',
            padding: '3px 10px',
            border: '2px solid var(--hf-ink)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Active Real-World Mission
        </div>
      </div>

      {/* Quest Title & Rarity */}
      <div style={{ marginBottom: 24 }}>
        <span className={`rarity-tag ${quest.rarity}`} style={{ marginBottom: 10 }}>
          {quest.rarity}
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 900,
            color: 'var(--hf-ink)',
            lineHeight: 1.15,
            marginTop: 8,
          }}
        >
          {quest.title}
        </h1>
        <p
          style={{
            fontSize: 15,
            color: 'var(--hf-ink-muted)',
            marginTop: 8,
            maxWidth: 540,
            margin: '8px auto 0',
          }}
        >
          {quest.description}
        </p>
      </div>

      {/* PHILOSOPHY BANNER: PUT YOUR PHONE AWAY */}
      <div
        style={{
          background: 'var(--hf-teal-dark)',
          color: '#ffffff',
          border: '2px solid var(--hf-ink)',
          boxShadow: '4px 4px 0 var(--hf-ink)',
          padding: '24px',
          margin: '24px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            background: '#ffffff',
            border: '2px solid var(--hf-ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--hf-coral)',
            boxShadow: '2px 2px 0 var(--hf-ink)',
          }}
        >
          <Smartphone size={26} />
        </div>
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              fontWeight: 900,
              letterSpacing: 1.5,
              color: 'var(--hf-salmon)',
              textTransform: 'uppercase',
            }}
          >
            PUT YOUR PHONE AWAY.
          </h2>
          <p
            style={{
              fontSize: 14,
              color: '#d1e0dc',
              marginTop: 6,
              maxWidth: 460,
              lineHeight: 1.5,
            }}
          >
            Look up. Touch grass. Observe your environment. Your active mission timer is safely running in the background.
          </p>
        </div>
      </div>

      {/* Large Stopwatch display */}
      <div
        style={{
          margin: '28px 0',
          padding: '24px',
          background: '#f2f2eb',
          border: '2px solid var(--hf-ink)',
          boxShadow: '4px 4px 0 var(--hf-ink)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(3rem, 7vw, 4.5rem)',
            fontWeight: 800,
            color: 'var(--hf-ink)',
            letterSpacing: 2,
            lineHeight: 1,
          }}
        >
          {formattedTime}
        </div>
        <div
          style={{
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            color: 'var(--hf-ink-muted)',
            marginTop: 10,
            fontWeight: 700,
          }}
        >
          Target: {quest.duration_minutes}:00 mins ({progressPct}% complete)
        </div>

        {/* Progress Bar */}
        <div
          className="brutal-progress-bg"
          style={{ maxWidth: 420, margin: '14px auto 0', height: 16 }}
        >
          <div
            className="brutal-progress-fill green"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Quest Steps Checklist */}
      <div
        style={{
          textAlign: 'left',
          background: '#ffffff',
          border: '2px solid var(--hf-ink)',
          padding: '20px',
          marginBottom: 28,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--hf-ink)',
            }}
          >
            Field Protocol Steps
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {quest.steps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  background: 'var(--hf-yellow)',
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
                {idx + 1}
              </div>
              <span style={{ fontSize: 13.5, color: 'var(--hf-ink)', lineHeight: 1.45 }}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Action Controls */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="btn-white"
          style={{ padding: '12px 18px' }}
        >
          {isPaused ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>

        <button
          onClick={onAbandon}
          className="btn-danger-brutal"
          style={{ padding: '12px 18px' }}
        >
          <XCircle size={16} />
          <span>Abandon</span>
        </button>

        <button
          onClick={() => onFinish(Math.max(1, Math.round(secondsElapsed / 60)))}
          className="btn-salmon"
          style={{ padding: '12px 24px', fontSize: 14 }}
        >
          <CheckCircle size={16} />
          <span>Complete & Submit Proof</span>
        </button>
      </div>
    </div>
  );
};
