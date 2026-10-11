import React, { useState } from 'react';
import type { Quest } from '../api/client';
import { generateCustomQuest } from '../api/client';
import { Bot, ArrowRight } from 'lucide-react';

interface AIGameMasterGeneratorProps {
  onQuestGenerated: (quest: Quest) => void;
  onAcceptQuest: (quest: Quest) => void;
  isAccepting: boolean;
}

export const AIGameMasterGenerator: React.FC<AIGameMasterGeneratorProps> = ({
  onQuestGenerated,
  onAcceptQuest,
  isAccepting,
}) => {
  const [availableTime, setAvailableTime] = useState(25);
  const [category, setCategory] = useState<string>('exploration');
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuest, setGeneratedQuest] = useState<Quest | null>(null);
  const [generationStep, setGenerationStep] = useState(0);

  const categories = [
    { id: 'exploration', label: 'Exploration', icon: '🗺️' },
    { id: 'nature', label: 'Nature', icon: '🌿' },
    { id: 'photography', label: 'Photography', icon: '📸' },
    { id: 'movement', label: 'Movement', icon: '🚶' },
    { id: 'environment', label: 'Environment', icon: '🌍' },
    { id: 'wellness', label: 'Wellness', icon: '🧠' },
  ];

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setGeneratedQuest(null);
      setGenerationStep(1);

      const timer1 = setTimeout(() => setGenerationStep(2), 500);
      const timer2 = setTimeout(() => setGenerationStep(3), 1100);

      const quest = await generateCustomQuest({
        available_time: availableTime,
        category: category,
        difficulty: difficulty,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      setGeneratedQuest(quest);
      onQuestGenerated(quest);
    } catch (err) {
      console.error(err);
      alert('Could not contact Gemma AI Game Master. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  return (
    <div
      className="brutal-card-teal"
      style={{
        marginTop: 36,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
          borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
          paddingBottom: 14,
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
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--hf-salmon)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Open-Weight AI Intelligence
            </span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.15,
            }}
          >
            Gemma AI Game Master, <span style={{ color: 'var(--hf-yellow)' }}>synthesize a custom quest.</span>
          </h3>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 800,
            background: '#ffffff',
            color: 'var(--hf-ink)',
            padding: '4px 10px',
            border: '2px solid var(--hf-ink)',
            boxShadow: '2px 2px 0 var(--hf-ink)',
            textTransform: 'uppercase',
          }}
        >
          Model: Gemma-2 9B
        </div>
      </div>

      {/* Parameter Selectors */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 18,
          marginBottom: 20,
        }}
      >
        {/* Time Selector */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#d1e0dc',
              letterSpacing: '0.06em',
              marginBottom: 8,
            }}
          >
            Outdoor Time Budget
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[15, 25, 45, 60].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setAvailableTime(t)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  background: availableTime === t ? 'var(--hf-yellow)' : '#243a35',
                  color: availableTime === t ? 'var(--hf-ink)' : '#f7f7f2',
                  border: '2px solid var(--hf-ink)',
                  boxShadow: availableTime === t ? '2px 2px 0 var(--hf-ink)' : 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  transform: availableTime === t ? 'translate(-1px, -1px)' : 'none',
                }}
              >
                {t}m
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Selector */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#d1e0dc',
              letterSpacing: '0.06em',
              marginBottom: 8,
            }}
          >
            Intensity Tier
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {['easy', 'medium', 'hard', 'epic'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  background: difficulty === d ? 'var(--hf-salmon)' : '#243a35',
                  color: difficulty === d ? 'var(--hf-ink)' : '#f7f7f2',
                  border: '2px solid var(--hf-ink)',
                  boxShadow: difficulty === d ? '2px 2px 0 var(--hf-ink)' : 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transform: difficulty === d ? 'translate(-1px, -1px)' : 'none',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div style={{ marginBottom: 22 }}>
        <label
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#d1e0dc',
            letterSpacing: '0.06em',
            marginBottom: 8,
          }}
        >
          Activity Focus
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                background: category === c.id ? '#ffffff' : '#243a35',
                color: category === c.id ? 'var(--hf-ink)' : '#f7f7f2',
                border: '2px solid var(--hf-ink)',
                boxShadow: category === c.id ? '2px 2px 0 var(--hf-ink)' : 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Action Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="btn-salmon"
        style={{
          width: '100%',
          padding: '13px',
          fontSize: 13,
          boxShadow: '4px 4px 0 #10201d',
        }}
      >
        <Bot size={17} />
        <span>
          {isGenerating
            ? generationStep === 1
              ? 'Evaluating player context (Level 12 MOIZ)...'
              : generationStep === 2
              ? 'Invoking Gemma-2 9B Open-Weight Inference...'
              : 'Synthesizing real-world field constraints...'
            : 'Generate Custom Real-World Quest'}
        </span>
      </button>

      {/* Result Card */}
      {generatedQuest && (
        <div
          style={{
            marginTop: 24,
            padding: '24px',
            background: '#ffffff',
            color: 'var(--hf-ink)',
            border: '2px solid var(--hf-ink)',
            boxShadow: '4px 4px 0 var(--hf-ink)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <span className={`rarity-tag ${generatedQuest.rarity}`}>
              {generatedQuest.rarity}
            </span>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 800,
                color: 'var(--hf-ink)',
                background: '#f2f2eb',
                padding: '3px 8px',
                border: '1.5px solid var(--hf-ink)',
              }}
            >
              +{generatedQuest.xp_reward} XP • +{generatedQuest.grass_reward} GRASS
            </div>
          </div>

          <h4
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 800,
              color: 'var(--hf-ink)',
              marginBottom: 8,
            }}
          >
            {generatedQuest.title}
          </h4>

          <p style={{ fontSize: 14, color: 'var(--hf-ink-muted)', lineHeight: 1.5, marginBottom: 14 }}>
            {generatedQuest.description}
          </p>

          <div
            style={{
              padding: '12px',
              background: '#fef3c7',
              border: '2px solid var(--hf-ink)',
              marginBottom: 16,
              fontSize: 12.5,
              color: '#78350f',
            }}
          >
            <strong style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Game Master Intel: </strong>
            {generatedQuest.generation_reason}
          </div>

          <div style={{ marginBottom: 18 }}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                color: 'var(--hf-ink)',
                marginBottom: 6,
              }}
            >
              Field Steps:
            </span>
            <ul style={{ paddingLeft: 20, fontSize: 13, color: 'var(--hf-ink-muted)', lineHeight: 1.6 }}>
              {generatedQuest.steps.map((st, i) => (
                <li key={i}>{st}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onAcceptQuest(generatedQuest)}
            disabled={isAccepting}
            className="btn-salmon"
            style={{ width: '100%' }}
          >
            <span>Accept Generated Quest</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
