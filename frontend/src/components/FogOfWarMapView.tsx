import React, { useState, useEffect } from 'react';
import type { ExplorationSummary, ExplorationSector } from '../api/client';
import { fetchExplorationSummary } from '../api/client';
import { Map, Navigation } from 'lucide-react';

export const FogOfWarMapView: React.FC = () => {
  const [summary, setSummary] = useState<ExplorationSummary | null>(null);
  const [selectedSector, setSelectedSector] = useState<ExplorationSector | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchExplorationSummary()
      .then((data) => {
        if (isMounted) {
          setSummary(data);
          if (data.sectors.length > 0) {
            setSelectedSector(data.sectors[0]);
          }
        }
      })
      .catch((err) => console.error(err));
    return () => {
      isMounted = false;
    };
  }, []);

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
            <span className="eyebrow-mono coral">Real-World Map</span>
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
            Fog-of-War Discovery, <span style={{ color: 'var(--hf-coral)' }}>uncover your world.</span>
          </h1>
        </div>

        {summary && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--hf-teal-dark)',
              border: '2px solid var(--hf-ink)',
              boxShadow: '3px 3px 0 var(--hf-ink)',
              padding: '8px 16px',
              color: '#ffffff',
            }}
          >
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--hf-salmon)', textTransform: 'uppercase', fontWeight: 800 }}>
                Regional Discovery
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 900, color: 'var(--hf-yellow)' }}>
                {summary.explored_percentage}% EXPLORED
              </div>
            </div>
            <div style={{ width: 64, height: 10, background: '#1d332e', border: '1.5px solid var(--hf-ink)' }}>
              <div
                style={{
                  width: `${summary.explored_percentage}%`,
                  height: '100%',
                  background: 'var(--hf-green)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid and Intel split */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        {/* Tactical Discovery Grid */}
        <div className="brutal-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--hf-ink)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Navigation size={14} color="var(--hf-coral)" />
              <span>Campus Sector Grid (3 × 4)</span>
            </div>
            <span>Radius: 4.5 km</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
            }}
          >
            {summary?.sectors.map((sec) => {
              const isSelected = selectedSector?.id === sec.id;
              const isUnexplored = sec.fog_status === 'unexplored';
              return (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSector(sec)}
                  className={`brutal-sector ${sec.fog_status}`}
                  style={{
                    cursor: 'pointer',
                    outline: isSelected ? '3px solid var(--hf-coral)' : 'none',
                    outlineOffset: 2,
                  }}
                >
                  <span style={{ fontSize: isUnexplored ? 16 : 22, marginBottom: 4 }}>
                    {isUnexplored ? '🌫️' : sec.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 12,
                      fontWeight: 800,
                      lineHeight: 1.2,
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isUnexplored ? 'Uncharted' : sec.sector_name}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      marginTop: 2,
                    }}
                  >
                    {isUnexplored ? '???' : sec.fog_status.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginTop: 18,
              paddingTop: 12,
              borderTop: '2px solid var(--hf-ink)',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--hf-ink-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: 'var(--hf-teal-dark)', border: '1px solid var(--hf-ink)' }} />
              <span>Mastered</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: '#ffffff', border: '1px solid var(--hf-ink)' }} />
              <span>Discovered</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: '#e5e5dc', border: '1px dashed var(--hf-ink)' }} />
              <span>Fog of War</span>
            </div>
          </div>
        </div>

        {/* Selected Sector Intel */}
        <div className="brutal-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {selectedSector ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    background: '#f2f2eb',
                    padding: '3px 8px',
                    border: '1.5px solid var(--hf-ink)',
                  }}
                >
                  SECTOR [{selectedSector.grid_x}, {selectedSector.grid_y}]
                </span>

                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color:
                      selectedSector.fog_status === 'mastered'
                        ? 'var(--hf-green-dark)'
                        : selectedSector.fog_status === 'discovered'
                        ? '#0369a1'
                        : '#78716c',
                  }}
                >
                  Status: {selectedSector.fog_status}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: '#f7f5f0',
                    border: '2px solid var(--hf-ink)',
                    boxShadow: '3px 3px 0 var(--hf-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                  }}
                >
                  {selectedSector.fog_status === 'unexplored' ? '🌫️' : selectedSector.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      fontWeight: 900,
                      color: 'var(--hf-ink)',
                    }}
                  >
                    {selectedSector.fog_status === 'unexplored' ? 'Uncharted Perimeter' : selectedSector.sector_name}
                  </h3>
                  <p style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--hf-ink-muted)' }}>
                    Zone: {selectedSector.zone}
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: '14px',
                  background: '#f7f5f0',
                  border: '2px solid var(--hf-ink)',
                  marginBottom: 18,
                }}
              >
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--hf-ink)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Tactical Exploration Intel
                </div>
                {selectedSector.fog_status === 'unexplored' ? (
                  <p style={{ fontSize: 13, color: '#991b1b', lineHeight: 1.5 }}>
                    This zone is obscured by real-world fog of war. Travel to this quadrant and complete an outdoor quest to uncover landmarks!
                  </p>
                ) : selectedSector.fog_status === 'mastered' ? (
                  <p style={{ fontSize: 13, color: 'var(--hf-green-dark)', lineHeight: 1.5 }}>
                    Fully mapped and authenticated. Multiple outdoor missions verified in this quadrant.
                  </p>
                ) : (
                  <p style={{ fontSize: 13, color: 'var(--hf-ink)', lineHeight: 1.5 }}>
                    Discovered! Initial waypoints mapped. Complete 1 more outdoor activity in this zone to achieve Mastered status.
                  </p>
                )}
              </div>

              {/* Progress */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: 4 }}>
                  <span>Mastery Level</span>
                  <span>{selectedSector.discovery_level} / 3</span>
                </div>
                <div className="brutal-progress-bg" style={{ height: 12 }}>
                  <div
                    className="brutal-progress-fill green"
                    style={{ width: `${(selectedSector.discovery_level / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--hf-ink-muted)', padding: 30, fontFamily: 'var(--font-mono)' }}>
              Select a sector from the grid to inspect intel.
            </div>
          )}

          <div
            style={{
              padding: '12px 14px',
              background: '#fef3c7',
              border: '2px solid var(--hf-ink)',
              fontSize: 12,
              color: '#78350f',
              fontFamily: 'var(--font-mono)',
            }}
          >
            💡 Quests completed with proof automatically unveil adjacent sectors on your fog map!
          </div>
        </div>
      </div>
    </div>
  );
};
