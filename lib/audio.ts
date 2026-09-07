/**
 * Audio Notification Utilities for PJTech Kasir UMKM
 * Uses Web Audio API (Oscillator) to generate smooth, zero-latency notification sounds
 * without external audio file assets or network overhead.
 */

let lastChimeTime = 0;

/**
 * Plays a pleasant two-tone chime (A5 -> D6 bell) when a new order/booking arrives.
 * Safe from autoplay rejections and throttled to prevent overlapping chimes.
 */
export function playNotificationChime() {
  if (typeof window === "undefined") return;

  // Throttle by 2 seconds so desktop sidebar + mobile bottom nav never duplicate chimes
  const now = Date.now();
  if (now - lastChimeTime < 2000) {
    return;
  }
  lastChimeTime = now;

  // Mobile haptic vibration feedback if supported
  if ("vibrate" in navigator) {
    try {
      navigator.vibrate([120, 80, 120]);
    } catch {
      // Ignore vibration errors
    }
  }

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => { });
    }

    const startTime = ctx.currentTime;

    // Tone 1: A5 (880 Hz) - Bright initial chime
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, startTime);
    gain1.gain.setValueAtTime(0, startTime);
    gain1.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(startTime);
    osc1.stop(startTime + 0.35);

    // Tone 2: D6 (1174.66 Hz) - Ascending harmonic confirmation
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1174.66, startTime + 0.12);
    gain2.gain.setValueAtTime(0, startTime);
    gain2.gain.setValueAtTime(0, startTime + 0.11);
    gain2.gain.linearRampToValueAtTime(0.22, startTime + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, startTime + 0.65);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(startTime + 0.12);
    osc2.stop(startTime + 0.65);

    // Clean up AudioContext resources
    setTimeout(() => {
      ctx.close().catch(() => { });
    }, 1000);
  } catch (err) {
    // Gracefully handle browsers blocking unprompted autoplay
    console.debug("Audio notification suppressed by browser autoplay policy:", err);
  }
}
