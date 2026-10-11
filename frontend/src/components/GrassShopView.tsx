import React, { useState, useEffect } from 'react';
import type { ShopItem, UserProfile } from '../api/client';
import { fetchShopItems, purchaseShopItem } from '../api/client';
import { ShoppingBag, ShieldCheck, Check } from 'lucide-react';

interface GrassShopViewProps {
  user: UserProfile | null;
  onBalanceUpdated: () => void;
}

export const GrassShopView: React.FC<GrassShopViewProps> = ({
  user,
  onBalanceUpdated,
}) => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchShopItems()
      .then(setItems)
      .catch(console.error);
  }, []);

  const handleBuy = async (item: ShopItem) => {
    if (!user) return;
    if (user.grass_balance < item.price_grass) {
      alert(`Insufficient GRASS balance! You need ${item.price_grass} 🌱, but have ${user.grass_balance} 🌱. Go complete outdoor quests!`);
      return;
    }

    try {
      setPurchasingId(item.id);
      const res = await purchaseShopItem(item.id);
      setMessage(`Acquired ${item.name}! New Balance: ${res.new_grass_balance} 🌱`);
      onBalanceUpdated();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Purchase error');
    } finally {
      setPurchasingId(null);
    }
  };

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
            <span className="eyebrow-mono coral">Swag & Upgrades</span>
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
            The GRASS Shop, <span style={{ color: 'var(--hf-coral)' }}>spend your outdoor currency.</span>
          </h1>
        </div>

        {/* Current GRASS balance */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 18px',
            background: '#ffffff',
            border: '2px solid var(--hf-ink)',
            boxShadow: '3px 3px 0 var(--hf-ink)',
          }}
        >
          <span style={{ fontSize: 22 }}>🌱</span>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--hf-ink-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
              Your Balance
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 900, color: 'var(--hf-green-dark)' }}>
              {user?.grass_balance ?? 0} GRASS
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {message && (
        <div
          style={{
            padding: '12px 18px',
            background: 'var(--hf-green)',
            color: '#ffffff',
            border: '2px solid var(--hf-ink)',
            boxShadow: '4px 4px 0 var(--hf-ink)',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          <Check size={18} />
          {message}
        </div>
      )}

      {/* Items Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
          marginBottom: 32,
        }}
      >
        {items.map((item) => {
          const canAfford = (user?.grass_balance ?? 0) >= item.price_grass;
          const isPurchasing = purchasingId === item.id;

          return (
            <div
              key={item.id}
              className="brutal-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      background: '#f2f2eb',
                      border: '2px solid var(--hf-ink)',
                      boxShadow: '2px 2px 0 var(--hf-ink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: 'var(--hf-coral)',
                    }}
                  >
                    {item.item_type}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    fontWeight: 900,
                    color: 'var(--hf-ink)',
                    marginBottom: 6,
                  }}
                >
                  {item.name}
                </h3>

                <p
                  style={{
                    fontSize: 13.5,
                    color: 'var(--hf-ink-muted)',
                    lineHeight: 1.5,
                    marginBottom: 16,
                  }}
                >
                  {item.description}
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                    padding: '8px 12px',
                    background: '#f7f5f0',
                    border: '1.5px solid var(--hf-ink)',
                  }}
                >
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--hf-ink-muted)', fontWeight: 700 }}>
                    Price:
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 14 }}>🌱</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        fontSize: 14,
                        color: 'var(--hf-green-dark)',
                      }}
                    >
                      {item.price_grass} GRASS
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleBuy(item)}
                  disabled={!canAfford || isPurchasing}
                  className={canAfford ? 'btn-salmon' : 'btn-white'}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: 12,
                    opacity: canAfford ? 1 : 0.6,
                  }}
                >
                  {isPurchasing
                    ? 'Processing...'
                    : canAfford
                    ? `Purchase for ${item.price_grass} 🌱`
                    : 'Insufficient GRASS'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance Callout */}
      <div
        style={{
          padding: '16px 20px',
          background: '#ffffff',
          border: '2px solid var(--hf-ink)',
          boxShadow: '4px 4px 0 var(--hf-ink)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontSize: 13,
          color: 'var(--hf-ink-muted)',
        }}
      >
        <ShieldCheck size={24} color="var(--hf-teal-dark)" />
        <div>
          <strong style={{ color: 'var(--hf-ink)' }}>In-Game Participation Economy: </strong>
          GRASS is strictly an internal gameplay reward currency earned through physical real-world verification. No cryptocurrency, no real money.
        </div>
      </div>
    </div>
  );
};
