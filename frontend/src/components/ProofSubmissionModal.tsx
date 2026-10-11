import React, { useState } from 'react';
import type { Quest, VerificationResult } from '../api/client';
import { submitQuestProof } from '../api/client';
import { Camera, Clock, MapPin, UploadCloud, Shield, ArrowRight } from 'lucide-react';

interface ProofSubmissionModalProps {
  quest: Quest;
  initialMinutes: number;
  onClose: () => void;
  onVerified: (result: VerificationResult) => void;
}

export const ProofSubmissionModal: React.FC<ProofSubmissionModalProps> = ({
  quest,
  initialMinutes,
  onClose,
  onVerified,
}) => {
  const [durationMinutes, setDurationMinutes] = useState(
    initialMinutes > 0 ? initialMinutes : quest.duration_minutes
  );
  const [distanceKm, setDistanceKm] = useState(1.6);
  const [photoDesc, setPhotoDesc] = useState(
    quest.proof_type.includes('photo') ? 'Spotted architectural ironwork and wild ferns along brick pathway.' : ''
  );
  const [notes, setNotes] = useState('Clear weather, walked continuously without phone distractions.');
  const [honorChecked, setHonorChecked] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!honorChecked) {
      alert('Please check the honor oath to certify your physical outdoor action.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await submitQuestProof(quest.id, {
        duration_minutes: durationMinutes,
        distance_km: distanceKm,
        photo_description: photoDesc,
        notes: notes,
        user_declared_honest: honorChecked,
      });
      onVerified(result);
    } catch (err) {
      console.error(err);
      alert('Proof submission failed. Check backend connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
        setPhotoDesc(`Captured proof: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-brutal">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="pixel-steps">
              <span className="sq-orange" />
              <span className="sq-sky" />
              <span className="sq-ochre" />
              <span className="sq-pink" />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                fontWeight: 900,
                color: 'var(--hf-ink)',
                textTransform: 'uppercase',
              }}
            >
              Submit Proof of Action
            </h2>
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

        <p style={{ fontSize: 13.5, color: 'var(--hf-ink-muted)', marginBottom: 20 }}>
          Verify your physical activity for <strong>{quest.title}</strong> to earn XP and GRASS.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Time & Distance */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--hf-ink)',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                <Clock size={12} color="var(--hf-coral)" />
                Recorded Time (mins)
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseFloat(e.target.value) || 1)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#f7f5f0',
                  border: '2px solid var(--hf-ink)',
                  borderRadius: 0,
                  color: 'var(--hf-ink)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--hf-ink)',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                <MapPin size={12} color="var(--hf-coral)" />
                Est. Distance (km)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#f7f5f0',
                  border: '2px solid var(--hf-ink)',
                  borderRadius: 0,
                  color: 'var(--hf-ink)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              />
            </div>
          </div>

          {/* Photo upload */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--hf-ink)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              <Camera size={12} color="var(--hf-coral)" />
              Outdoor Photo Proof
            </label>

            <div
              style={{
                border: '2px dashed var(--hf-ink)',
                padding: '14px',
                background: '#fcfbf8',
                textAlign: 'center',
              }}
            >
              {photoPreview ? (
                <div>
                  <img
                    src={photoPreview}
                    alt="Outdoor Evidence"
                    style={{
                      width: '100%',
                      maxHeight: 180,
                      objectFit: 'cover',
                      border: '2px solid var(--hf-ink)',
                      marginBottom: 8,
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--hf-green-dark)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      ✓ Visual Proof Ready
                    </span>
                    <label
                      style={{
                        fontSize: 11,
                        color: 'var(--hf-ink)',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}
                    >
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    padding: '16px',
                  }}
                >
                  <UploadCloud size={24} color="var(--hf-ink-muted)" />
                  <span style={{ fontSize: 13, color: 'var(--hf-ink-muted)' }}>
                    Upload Photo of your outdoor discovery
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Field Notes */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--hf-ink)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              Discovery Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#f7f5f0',
                border: '2px solid var(--hf-ink)',
                borderRadius: 0,
                color: 'var(--hf-ink)',
                fontFamily: 'inherit',
                fontSize: 13,
                resize: 'none',
              }}
            />
          </div>

          {/* Honor Oath */}
          <div
            style={{
              padding: '12px',
              background: '#fef3c7',
              border: '2px solid var(--hf-ink)',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                cursor: 'pointer',
                fontSize: 12,
                color: '#78350f',
                lineHeight: 1.4,
              }}
            >
              <input
                type="checkbox"
                checked={honorChecked}
                onChange={(e) => setHonorChecked(e.target.checked)}
                style={{ marginTop: 2, accentColor: 'var(--hf-coral)' }}
              />
              <span>
                <strong>Honor Code:</strong> I certify that I physically spent this time outdoors, put my phone away, and explored the real world.
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-white"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-salmon"
              style={{ flex: 1.8 }}
            >
              <Shield size={15} />
              <span>{isSubmitting ? 'Verifying...' : 'Verify & Claim'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
