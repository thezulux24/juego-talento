class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.8;
  private isMuted: boolean = false;
  private ambientInterval: number | null = null;
  private isAmbientPlaying: boolean = false;
  private lastHoverTime: number = 0;

  public playHoverTick() {
    const nowMs = performance.now();
    if (nowMs - this.lastHoverTime < 45) return;
    this.lastHoverTime = nowMs;

    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(760, now);
    osc.frequency.exponentialRampToValueAtTime(1120, now + 0.022);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.026);

    osc.connect(gain);
    gain.connect(this.getDest()!);
    osc.start(now);
    osc.stop(now + 0.028);
  }

  public playButtonClick() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.045);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    osc.connect(gain);
    gain.connect(this.getDest()!);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playMenuOpen() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [330, 440, 554.37];
    notes.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.035);
      gain.gain.setValueAtTime(0.045, now + idx * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.16);
      osc.connect(gain);
      gain.connect(this.getDest()!);
      osc.start(now + idx * 0.035);
      osc.stop(now + idx * 0.035 + 0.18);
    });
  }

  public playMenuClose() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [554.37, 392];
    notes.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.04);
      gain.gain.setValueAtTime(0.04, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.14);
      osc.connect(gain);
      gain.connect(this.getDest()!);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.16);
    });
  }

  public playCoffeeSip() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Porcelain cup clink + warm chord
    const clink = ctx.createOscillator();
    const clinkGain = ctx.createGain();
    clink.type = 'sine';
    clink.frequency.setValueAtTime(2150, now);
    clink.frequency.exponentialRampToValueAtTime(2080, now + 0.12);
    clinkGain.gain.setValueAtTime(0.06, now);
    clinkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    clink.connect(clinkGain);
    clinkGain.connect(this.getDest()!);
    clink.start(now);
    clink.stop(now + 0.15);
  }

  private ensureContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getDest(): AudioNode | null {
    const ctx = this.ensureContext();
    if (!ctx) return null;
    return this.masterGain || ctx.destination;
  }

  public setVolume(volZeroToOne: number) {
    this.volume = Math.max(0, Math.min(1, volZeroToOne));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    if (!this.isMuted) {
      this.playPenCheck();
    }
    return this.isMuted;
  }

  /**
   * Starts subtle campus morning ambiance (gentle marimba notes + distant Samán birds)
   */
  public startAmbient() {
    if (this.isMuted || this.isAmbientPlaying) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.isAmbientPlaying = true;
    // Warm major 9th / pentatonic notes in Hz (Fmaj7 - Cmaj7 warm academic feel)
    const notes = [261.63, 329.63, 392.0, 440.0, 523.25, 659.25, 587.33];
    let step = 0;

    this.ambientInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;

      // Play a very soft warm wooden marimba/rhodes note
      const freq = notes[step % notes.length];
      step = (step + (Math.random() > 0.4 ? 1 : 2)) % notes.length;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.018, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);

      osc.connect(gain);
      gain.connect(this.getDest()!);
      osc.start(now);
      osc.stop(now + 2.2);

      // Occasional distant bird chirp in the Samán tree (25% chance)
      if (Math.random() < 0.25) {
        this.playDistantBird(now + 0.6);
      }
    }, 2800);
  }

  public stopAmbient() {
    this.isAmbientPlaying = false;
    if (this.ambientInterval !== null) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  private playDistantBird(startTime: number) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const baseFreq = 1650 + Math.random() * 450;
    osc.frequency.setValueAtTime(baseFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.28, startTime + 0.09);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, startTime + 0.18);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.012, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.2);

    osc.connect(gain);
    gain.connect(this.getDest()!);
    osc.start(startTime);
    osc.stop(startTime + 0.22);
  }

  public playPaperFlip() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const duration = 0.14;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.35;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.getDest()!);
    noise.start();
  }

  public playPenCheck() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.045);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    osc.connect(gain);
    gain.connect(this.getDest()!);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playVoiceBlip(basePitch: number = 210) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const jitter = (Math.random() - 0.5) * 28;
    osc.frequency.setValueAtTime(basePitch + jitter, now);
    osc.frequency.exponentialRampToValueAtTime(basePitch + jitter + 15, now + 0.035);

    gain.gain.setValueAtTime(0.028, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.getDest()!);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  public playPositiveSignal() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [440, 554.37, 659.25]; // A major triad warm chime
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.06);

      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(this.getDest()!);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.38);
    });
  }

  public playBiasAlert() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [233.08, 196.0]; // Low muted warning
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now + idx * 0.11);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480, now + idx * 0.11);

      gain.gain.setValueAtTime(0.07, now + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.getDest()!);
      osc.start(now + idx * 0.11);
      osc.stop(now + idx * 0.11 + 0.24);
    });
  }

  public playStampThud() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Low wooden desk thump
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(135, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.18);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.21);

    osc.connect(gain);
    gain.connect(this.getDest()!);
    osc.start(now);
    osc.stop(now + 0.22);

    // Crisp ink pad slap
    this.playPaperFlip();
  }

  public playBellDing() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Brass hotel/desk bell harmonics
    const partials = [1180, 2360, 3510];
    partials.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.14 / (idx + 1), now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 1.1 - idx * 0.25);

      osc.connect(gain);
      gain.connect(this.getDest()!);
      osc.start(now);
      osc.stop(now + 1.15);
    });
  }

  public playDoorOpen() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.45);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

    osc.connect(gain);
    gain.connect(this.getDest()!);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  public playLampClick() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.025);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.getDest()!);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  public playGrabObject() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(290, now + 0.065);

    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

    osc.connect(gain);
    gain.connect(this.getDest()!);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playPhoneDialAndRing() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 3 quick DTMF-style dial tones
    const dialFreqs = [697, 770, 852];
    dialFreqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.09);
      gain.gain.setValueAtTime(0.07, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.07);
      osc.connect(gain);
      gain.connect(this.getDest()!);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.075);
    });

    // Phone ringback brrrr
    const ringStart = now + 0.34;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const ringGain = ctx.createGain();
    osc1.frequency.setValueAtTime(440, ringStart);
    osc2.frequency.setValueAtTime(480, ringStart);
    ringGain.gain.setValueAtTime(0.05, ringStart);
    ringGain.gain.exponentialRampToValueAtTime(0.001, ringStart + 0.45);
    osc1.connect(ringGain);
    osc2.connect(ringGain);
    ringGain.connect(this.getDest()!);
    osc1.start(ringStart);
    osc2.start(ringStart);
    osc1.stop(ringStart + 0.46);
    osc2.stop(ringStart + 0.46);
  }

  public playLupaScan() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [587.33, 880, 1174.66];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.05);
      gain.gain.setValueAtTime(0.06, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.28);
      osc.connect(gain);
      gain.connect(this.getDest()!);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.3);
    });
  }

  public playPressCandidate() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Dramatic investigative chord hit
    const chord = [220, 277.18, 329.63, 440];
    chord.forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      osc.connect(gain);
      gain.connect(this.getDest()!);
      osc.start(now);
      osc.stop(now + 0.45);
    });
  }

  public playFanfare() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const chord = [261.63, 329.63, 392.0, 523.25];
    chord.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.09, now + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.08 + 0.9);

      osc.connect(gain);
      gain.connect(this.getDest()!);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.95);
    });
  }
}

export const soundEngine = new SoundEngine();
