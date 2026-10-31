import { describe, it, expect } from 'vitest';
import { audioEngine } from '../services/audioEngine';

describe('AudioEngine Mathematical Principles', () => {
  it('correctly maps X-percentage to stereo pan (-1.0 to 1.0)', () => {
    expect(audioEngine.calculatePan(0)).toBeCloseTo(-1.0, 5);
    expect(audioEngine.calculatePan(50)).toBeCloseTo(0.0, 5);
    expect(audioEngine.calculatePan(100)).toBeCloseTo(1.0, 5);
    expect(audioEngine.calculatePan(25)).toBeCloseTo(-0.5, 5);
    expect(audioEngine.calculatePan(75)).toBeCloseTo(0.5, 5);
  });

  it('correctly clamps pan values out of bounds', () => {
    expect(audioEngine.calculatePan(-10)).toBeCloseTo(-1.0, 5);
    expect(audioEngine.calculatePan(150)).toBeCloseTo(1.0, 5);
  });

  it('correctly maps Y-percentage to frequency range (C3 to C6)', () => {
    // Y=0 is canvas top -> highest pitch C6 (~1046.5 Hz)
    const topFreq = audioEngine.calculateFrequency(0);
    expect(topFreq).toBeCloseTo(1046.5, 0);

    // Y=100 is canvas bottom -> lowest pitch C3 (~130.81 Hz)
    const bottomFreq = audioEngine.calculateFrequency(100);
    expect(bottomFreq).toBeCloseTo(130.81, 0);

    // Y=50 is midpoint
    const midFreq = audioEngine.calculateFrequency(50);
    expect(midFreq).toBeGreaterThan(bottomFreq);
    expect(midFreq).toBeLessThan(topFreq);
  });

  it('respects custom frequency overrides', () => {
    expect(audioEngine.calculateFrequency(50, 440)).toBe(440);
    expect(audioEngine.calculateFrequency(0, 880)).toBe(880);
  });

  it('generates human-readable note names', () => {
    const a4 = audioEngine.getNoteName(440);
    expect(a4).toContain('A4');
    expect(a4).toContain('440 Hz');
  });
});
