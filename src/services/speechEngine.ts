import { DiagramNode } from '../types/diagram';

export type VerbosityLevel = 'verbose' | 'concise' | 'silent';

class SpeechEngine {
  private isEnabled: boolean = true;
  private verbosity: VerbosityLevel = 'concise';
  private rate: number = 1.1; // Slightly brisk for efficient listening
  private pitch: number = 1.0;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => this.initVoices();
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prefer clear English voice
    this.voice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Enhanced'))) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0] ||
      null;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) this.cancel();
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public setVerbosity(v: VerbosityLevel) {
    this.verbosity = v;
  }

  public getVerbosity(): VerbosityLevel {
    return this.verbosity;
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  public cancel() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public speak(text: string, force: boolean = false) {
    if (!this.isEnabled || this.verbosity === 'silent') {
      if (!force) return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) utterance.voice = this.voice;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    window.speechSynthesis.speak(utterance);
  }

  public announceNode(node: DiagramNode, contextMessage?: string) {
    if (!this.isEnabled || this.verbosity === 'silent') return;

    const xPos = node.x < 33 ? 'left' : node.x > 66 ? 'right' : 'center';
    const yPos = node.y < 33 ? 'top' : node.y > 66 ? 'bottom' : 'middle';
    const positionStr = `${yPos} ${xPos}`;

    const neighborCount = [
      node.neighbors.up ? 'Up' : null,
      node.neighbors.down ? 'Down' : null,
      node.neighbors.left ? 'Left' : null,
      node.neighbors.right ? 'Right' : null,
    ].filter(Boolean).join(', ');

    if (this.verbosity === 'concise') {
      const valuePart = node.value ? `, ${node.value}` : '';
      const navPart = neighborCount ? `. Branches: ${neighborCount}` : '';
      this.speak(`${node.label}${valuePart}${navPart}`);
    } else if (this.verbosity === 'verbose') {
      const valuePart = node.value ? `, value ${node.value}` : '';
      const descPart = `. ${node.description}`;
      const navPart = neighborCount
        ? `. Available moves: ${neighborCount}.`
        : '. No further adjacent branches.';
      const extra = contextMessage ? ` ${contextMessage}` : '';
      this.speak(`${node.label}${valuePart}. Located at ${positionStr}${descPart}${navPart}${extra}`);
    }
  }
}

export const speechEngine = new SpeechEngine();
