import React, { useState } from 'react';
import type { UserProfile } from '../api/client';
import { Compass, Shield, Map, Trophy, ShoppingBag, User, Flame, Menu, X } from 'lucide-react';

interface NavbarProps {
  user: UserProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasActiveQuest: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  hasActiveQuest,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const xpPercent = user ? Math.min(100, Math.round((user.xp / user.xp_to_next_level) * 100)) : 0;

  const navLinks = [
    { id: 'home', label: 'Quests', icon: Compass },
    { id: 'challenges', label: 'Activities', icon: Shield },
    { id: 'map', label: 'Fog Map', icon: Map },
    { id: 'leaderboard', label: 'Ranks', icon: Trophy },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
  ];

  return (
    <>
      {/* Hacktoberfest Sticky Teal Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--hf-teal-header)',
          borderBottom: '2px solid var(--hf-ink)',
          color: '#f7f7f2',
          padding: '12px 16px',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Logo & Brand Wordmark */}
          <div
            onClick={() => setActiveTab('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {/* Hacktoberfest styled logo badge */}
            <div
              style={{
                width: 38,
                height: 38,
                background: '#ffffff',
                border: '2px solid var(--hf-ink)',
                boxShadow: '3px 3px 0 var(--hf-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}
            >
              🌱
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    fontWeight: 900,
                    letterSpacing: 1.2,
                    color: '#ffffff',
                    lineHeight: 1,
                  }}
                >
                  OUT BOUND
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    fontWeight: 800,
                    background: 'var(--hf-coral)',
                    color: '#ffffff',
                    padding: '2px 6px',
                    border: '1.5px solid var(--hf-ink)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  2026
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: '#d1e0dc',
                  letterSpacing: '0.04em',
                  marginTop: 2,
                }}
              >
                Touch grass. Earn GRASS.
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 20,
            }}
            className="desktop-nav-bar"
          >
            {navLinks.map((item) => {
              const isCurrent = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: isCurrent ? '2px solid var(--hf-salmon)' : '2px solid transparent',
                    color: isCurrent ? 'var(--hf-salmon)' : '#f7f7f2',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    fontWeight: isCurrent ? 700 : 500,
                    padding: '6px 2px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    position: 'relative',
                  }}
                >
                  <span>{item.label}</span>
                  {item.id === 'home' && hasActiveQuest && (
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        background: 'var(--hf-coral)',
                        border: '1px solid #ffffff',
                        display: 'inline-block',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Player Quick HUD & "My OUT BOUND" CTA Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user && (
              <div
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: 10,
                  background: '#243a35',
                  border: '2px solid var(--hf-ink)',
                  padding: '4px 10px',
                  boxShadow: '2px 2px 0 var(--hf-ink)',
                }}
                className="desktop-hud"
              >
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 800,
                      color: 'var(--hf-yellow)',
                    }}
                  >
                    LVL {user.level} {user.level_title.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#9bb3ad' }}>
                    {user.xp}/{user.xp_to_next_level} XP
                  </div>
                </div>

                <div
                  style={{
                    background: '#162824',
                    border: '1.5px solid var(--hf-ink)',
                    padding: '2px 6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#86efac',
                  }}
                >
                  🌱 {user.grass_balance}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 800,
                    color: 'var(--hf-coral)',
                  }}
                >
                  <Flame size={13} />
                  <span>{user.current_streak}d</span>
                </div>
              </div>
            )}

            {/* My Hacktoberfest style CTA Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className="btn-salmon"
              style={{
                padding: '8px 14px',
                fontSize: 12,
                boxShadow: '3px 3px 0 var(--hf-salmon-shadow)',
              }}
            >
              <User size={14} />
              <span>My Out Bound</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'inline-flex',
                background: 'none',
                border: 'none',
                color: '#f7f7f2',
                cursor: 'pointer',
              }}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '16px',
              borderTop: '2px solid var(--hf-ink)',
              marginTop: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: 'var(--hf-teal-dark)',
            }}
          >
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  color: activeTab === item.id ? 'var(--hf-salmon)' : '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '6px 0',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Responsive Media Queries */}
      <style>{`
        @media (min-width: 820px) {
          .desktop-nav-bar { display: flex !important; }
          .desktop-hud { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
};
