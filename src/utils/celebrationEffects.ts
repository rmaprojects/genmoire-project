import confetti from 'canvas-confetti';

/**
 * Web Audio API procedural sound synthesizer for memorable celebration moments
 * Zero external audio file download required, instant responsive playback.
 */
class CelebrationSoundSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Warm harp/celeste ascending arpeggio chord for Book Completion
   */
  playBookCompletionChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6 (Major 9th Ascent)
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + i * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 1.8);
    });
  }

  /**
   * Royal fanfare chord for Tier Up rank promotion
   */
  playTierUpFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fanfareChords = [
      { time: 0.0, freqs: [392.00, 523.25, 659.25] },     // G4, C5, E5
      { time: 0.18, freqs: [392.00, 523.25, 659.25] },    // G4, C5, E5
      { time: 0.36, freqs: [392.00, 523.25, 659.25] },    // G4, C5, E5
      { time: 0.54, freqs: [523.25, 659.25, 783.99, 1046.50] }, // C5, E5, G5, C6 (Majestic climax)
    ];

    fanfareChords.forEach(({ time, freqs }) => {
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.14, now + time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + (time > 0.5 ? 2.2 : 0.4));

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + (time > 0.5 ? 2.4 : 0.5));
      });
    });
  }

  /**
   * Sparkle chime for Achievement / Trait Unlocked
   */
  playAchievementSparkle() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [587.33, 880.00, 1174.66, 1760.00]; // D5, A5, D6, A6

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 1.0);
    });
  }
}

export const celebrationAudio = new CelebrationSoundSynthesizer();

/**
 * Multi-stage cinematic confetti barrage
 */
export const triggerGrandConfetti = (type: 'book_completed' | 'tier_up' | 'achievement' = 'book_completed') => {
  try {
    if (type === 'book_completed') {
      // Golden library celebration: fireworks from sides
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 70, zIndex: 9999 };

      const interval: ReturnType<typeof setInterval> = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 45 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: 0.15 + Math.random() * 0.2, y: Math.random() - 0.2 },
          colors: ['#BA9248', '#ecc165', '#4a6729', '#FAF6EE', '#e6e2da'],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: 0.65 + Math.random() * 0.2, y: Math.random() - 0.2 },
          colors: ['#BA9248', '#8b6914', '#cbeea1', '#ffffff', '#ffd700'],
        });
      }, 250);
    } else if (type === 'tier_up') {
      // Majestic cannon blast from bottom corners
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 75,
        origin: { x: 0, y: 0.8 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#BA9248', '#ffffff'],
        zIndex: 9999,
      });
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 75,
        origin: { x: 1, y: 0.8 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#BA9248', '#ffffff'],
        zIndex: 9999,
      });
    } else {
      // Achievement single burst
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { x: 0.85, y: 0.85 },
        colors: ['#BA9248', '#4a6729', '#ecc165'],
        zIndex: 9999,
      });
    }
  } catch (e) {
    // fallback
  }
};
