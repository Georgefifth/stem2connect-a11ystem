import { DiagramNode } from '../types/diagram';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private sweepTimeout: NodeJS.Timeout | null = null;
  private isSweeping: boolean = false;

  public init(): boolean {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return !!this.ctx;
  }

  public getContextState(): string {
    return this.ctx ? this.ctx.state : 'uninitialized';
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public calculateFrequency(yPercent: number, customFreq?: number): number {
    if (customFreq) return customFreq;
    // yPercent: 0 is top (high pitch), 100 is bottom (low pitch)
    const normalizedY = Math.max(0, Math.min(100, 100 - yPercent)) / 100;
    // Logarithmic pitch mapping from C3 (130.81 Hz) to C6 (1046.5 Hz)
    const minFreq = 130.81;
    const maxFreq = 1046.5;
    return minFreq * Math.pow(maxFreq / minFreq, normalizedY);
  }

  public calculatePan(xPercent: number): number {
    // xPercent: 0 is full left (-1.0), 100 is full right (+1.0)
    const normalizedX = Math.max(0, Math.min(100, xPercent));
    return (normalizedX - 50) / 50;
  }

  public getNoteName(freq: number): string {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const c0 = 440 * Math.pow(2, -4.75); // ~16.35 Hz
    const halfSteps = Math.round(12 * Math.log2(freq / c0));
    const octave = Math.floor(halfSteps / 12);
    const note = noteNames[halfSteps % 12];
    return `${note}${octave} (${Math.round(freq)} Hz)`;
  }

  public playNodeTone(node: DiagramNode, durationMs: number = 300) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freq = this.calculateFrequency(node.y, node.customFrequency);
      const pan = this.calculatePan(node.x);

      // Stereo Panner
      let panner: StereoPannerNode | null = null;
      if (this.ctx.createStereoPanner) {
        panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(pan, now);
      }

      // Master gain envelope
      const gainNode = this.ctx.createGain();
      const peakGain = Math.max(0.01, this.volume * 0.4);
      gainNode.gain.setValueAtTime(0.0001, now);
      // Gentle attack to prevent speaker click
      gainNode.gain.exponentialRampToValueAtTime(peakGain, now + 0.02);
      // Decay and release
      const releaseTime = now + (durationMs / 1000);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, releaseTime);

      // Primary Oscillator
      const osc = this.ctx.createOscillator();
      const oscType: OscillatorType = node.waveform || this.getWaveformForType(node.type);
      osc.type = oscType;
      osc.frequency.setValueAtTime(freq, now);

      // Special timbre nuances
      if (node.type === 'ground') {
        // Deep sub-bass resonance
        osc.frequency.setValueAtTime(65.4, now); // C2
      } else if (node.type === 'capacitor') {
        // Subtle capacitive ramp
        osc.frequency.linearRampToValueAtTime(freq * 1.15, now + 0.1);
        osc.frequency.linearRampToValueAtTime(freq, releaseTime);
      }

      // Wiring audio graph
      osc.connect(gainNode);
      if (panner) {
        gainNode.connect(panner);
        panner.connect(this.ctx.destination);
      } else {
        gainNode.connect(this.ctx.destination);
      }

      osc.start(now);
      osc.stop(releaseTime + 0.05);

      // Optional harmonic chime for data points or ICs
      if (node.type === 'ic' || node.type === 'enzyme' || node.type === 'data-point') {
        const overtoneOsc = this.ctx.createOscillator();
        const overtoneGain = this.ctx.createGain();
        overtoneOsc.type = 'sine';
        overtoneOsc.frequency.setValueAtTime(freq * 2, now);
        overtoneGain.gain.setValueAtTime(0.0001, now);
        overtoneGain.gain.exponentialRampToValueAtTime(peakGain * 0.35, now + 0.03);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, releaseTime * 0.8);
        overtoneOsc.connect(overtoneGain);
        if (panner) overtoneGain.connect(panner);
        else overtoneGain.connect(this.ctx.destination);
        overtoneOsc.start(now);
        overtoneOsc.stop(releaseTime);
      }
    } catch (err) {
      console.warn('Audio playback caught exception:', err);
    }
  }

  public playDirectionalChirp(direction: 'up' | 'down' | 'left' | 'right') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(this.volume * 0.2, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      let panner: StereoPannerNode | null = null;
      if (this.ctx.createStereoPanner) {
        panner = this.ctx.createStereoPanner();
      }

      if (direction === 'up') {
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.1);
      } else if (direction === 'down') {
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.1);
      } else if (direction === 'left') {
        osc.frequency.setValueAtTime(440, now);
        if (panner) panner.pan.setValueAtTime(-0.8, now);
      } else {
        osc.frequency.setValueAtTime(440, now);
        if (panner) panner.pan.setValueAtTime(0.8, now);
      }

      osc.connect(gain);
      if (panner) {
        gain.connect(panner);
        panner.connect(this.ctx.destination);
      } else {
        gain.connect(this.ctx.destination);
      }
      osc.start(now);
      osc.stop(now + 0.13);
    } catch (err) {
      console.warn('Directional chirp error:', err);
    }
  }

  public playAudioSweep(
    nodes: DiagramNode[],
    durationMs: number = 3000,
    onProgress?: (progressPercent: number, activeNode: DiagramNode | null) => void,
    onComplete?: () => void
  ) {
    this.stopAudioSweep();
    if (nodes.length === 0) return;

    this.isSweeping = true;
    const sortedNodes = [...nodes].sort((a, b) => a.x - b.x);
    const startTime = performance.now();

    const frame = () => {
      if (!this.isSweeping) return;
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const currentX = progress * 100;

      // Find node under the current scanline (within 3% tolerance)
      const hitNode = sortedNodes.find(
        (n) => Math.abs(n.x - currentX) < 2.5
      );

      if (onProgress) {
        onProgress(progress * 100, hitNode || null);
      }

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        this.isSweeping = false;
        if (onProgress) onProgress(100, null);
        if (onComplete) onComplete();
      }
    };

    // Schedule individual node tones timed to their X coordinate
    sortedNodes.forEach((node) => {
      const delay = (node.x / 100) * durationMs;
      setTimeout(() => {
        if (this.isSweeping) {
          this.playNodeTone(node, 220);
        }
      }, delay);
    });

    requestAnimationFrame(frame);
  }

  public stopAudioSweep() {
    this.isSweeping = false;
    if (this.sweepTimeout) {
      clearTimeout(this.sweepTimeout);
      this.sweepTimeout = null;
    }
  }

  public isCurrentlySweeping(): boolean {
    return this.isSweeping;
  }

  private getWaveformForType(type: DiagramNode['type']): OscillatorType {
    switch (type) {
      case 'source':
      case 'tree-node':
        return 'triangle';
      case 'capacitor':
      case 'inductor':
      case 'data-point':
        return 'sine';
      case 'ic':
      case 'enzyme':
      case 'state':
        return 'sawtooth';
      case 'ground':
        return 'sine';
      case 'resistor':
      default:
        return 'sine';
    }
  }
}

export const audioEngine = new AudioEngine();
