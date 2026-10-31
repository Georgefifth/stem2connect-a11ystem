import React from 'react';
import { X, Keyboard, Headphones, Music, Sparkles } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface KeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardHelpModal: React.FC<KeyboardHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTestPitches = () => {
    audioEngine.init();
    const pitches = [130.81, 196.0, 261.63, 392.0, 523.25, 783.99, 1046.5]; // Pentatonic ladder
    pitches.forEach((freq, idx) => {
      setTimeout(() => {
        audioEngine.playNodeTone(
          {
            id: `test-${idx}`,
            label: `Pitch Step ${idx + 1}`,
            type: 'data-point',
            x: (idx / (pitches.length - 1)) * 100,
            y: 100 - (idx / (pitches.length - 1)) * 100,
            description: 'Test pitch tone',
            zoomLevel: 1,
            neighbors: {},
            customFrequency: freq,
          },
          180
        );
      }, idx * 160);
    });
  };

  const handleTestStereoPan = () => {
    audioEngine.init();
    [-1, -0.5, 0, 0.5, 1].forEach((panVal, idx) => {
      setTimeout(() => {
        audioEngine.playNodeTone(
          {
            id: `pan-${idx}`,
            label: `Pan Step ${idx + 1}`,
            type: 'source',
            x: ((panVal + 1) / 2) * 100,
            y: 50,
            description: 'Test stereo pan',
            zoomLevel: 1,
            neighbors: {},
            customFrequency: 440,
          },
          220
        );
      }, idx * 250);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
    >
      <div className="bg-[#0A0F1D] border border-[#334155] rounded-xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative text-[#F8FAFC] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition cursor-pointer"
          aria-label="Close Guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 id="help-title" className="text-lg font-bold text-[#F8FAFC]">
              Keyboard Shortcuts &amp; Spatial Sonification Guide
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Designed from the ground up for high-speed blind and low-vision accessibility.
            </p>
          </div>
        </div>

        {/* Spatial Sonification Mental Model */}
        <div className="bg-[#080C14] border border-[#1E293B] rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#38BDF8] mb-2 uppercase tracking-wider font-mono">
            <Headphones className="w-4 h-4" />
            <span>How Spatial Sound Represents 2D Visual Space:</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-[#CBD5E1]">
            <div className="bg-[#0F172A] p-2.5 rounded-lg border border-[#1E293B]">
              <div className="font-bold text-[#F59E0B] mb-1 font-mono">X-Axis (Horizontal) → Stereo Pan</div>
              <p className="text-[#94A3B8] leading-relaxed">
                Sound moves from your <strong>left ear</strong> (X = 0%) across center to your <strong>right ear</strong> (X = 100%).
              </p>
            </div>
            <div className="bg-[#0F172A] p-2.5 rounded-lg border border-[#1E293B]">
              <div className="font-bold text-[#10B981] mb-1 font-mono">Y-Axis (Vertical) → Audio Pitch</div>
              <p className="text-[#94A3B8] leading-relaxed">
                Bottom elements resonate as <strong>deep bass</strong> (~130 Hz C3). Top elements sing as <strong>high chimes</strong> (~1046 Hz C6).
              </p>
            </div>
          </div>

          {/* Interactive Sound Demos */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#1E293B]">
            <button
              onClick={handleTestStereoPan}
              className="text-xs px-3 py-1.5 rounded bg-[#1E293B] hover:bg-[#334155] text-[#38BDF8] border border-[#38BDF8]/30 font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <Music className="w-3.5 h-3.5" />
              Test Left-to-Right Pan
            </button>
            <button
              onClick={handleTestPitches}
              className="text-xs px-3 py-1.5 rounded bg-[#1E293B] hover:bg-[#334155] text-[#F59E0B] border border-[#F59E0B]/30 font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Test Pitch Scale (C3 to C6)
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Reference */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-2 font-bold">
            Navigation Hotkeys Reference
          </h4>
          <div className="divide-y divide-[#1E293B] text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-[#CBD5E1]">Move to 2D nearest neighbor</span>
              <div className="flex gap-1 font-mono">
                <kbd className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] text-[#F59E0B]">↑</kbd>
                <kbd className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] text-[#F59E0B]">↓</kbd>
                <kbd className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] text-[#F59E0B]">←</kbd>
                <kbd className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] text-[#F59E0B]">→</kbd>
              </div>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-[#CBD5E1]">Play full diagram audio sweep left-to-right</span>
              <kbd className="px-2.5 py-0.5 rounded bg-[#0F172A] border border-[#334155] font-mono text-[#F59E0B]">
                Spacebar
              </kbd>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-[#CBD5E1]">Cycle zoom levels (1: Macro, 2: Modules, 3: Details)</span>
              <div className="flex gap-1 font-mono">
                <kbd className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] text-[#38BDF8]">1</kbd>
                <kbd className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] text-[#38BDF8]">2</kbd>
                <kbd className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] text-[#38BDF8]">3</kbd>
              </div>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-[#CBD5E1]">Cycle sequentially through diagram nodes</span>
              <kbd className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] font-mono text-[#CBD5E1]">
                Tab / Shift+Tab
              </kbd>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-[#CBD5E1]">Jump back to root / starting component</span>
              <kbd className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] font-mono text-[#CBD5E1]">
                Home
              </kbd>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-[#CBD5E1]">Toggle audio mute</span>
              <kbd className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] font-mono text-[#CBD5E1]">
                M
              </kbd>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-[#CBD5E1]">Toggle speech voice narration</span>
              <kbd className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] font-mono text-[#CBD5E1]">
                V
              </kbd>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-[#CBD5E1]">Open this keyboard &amp; audio guide</span>
              <kbd className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] font-mono text-[#CBD5E1]">
                ? / H
              </kbd>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-[#CBD5E1]">Close modals / reset focus</span>
              <kbd className="px-2 py-0.5 rounded bg-[#0F172A] border border-[#334155] font-mono text-[#CBD5E1]">
                Esc
              </kbd>
            </div>
          </div>
        </div>

        {/* Close Action */}
        <div className="mt-6 pt-4 border-t border-[#1E293B] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#080C14] font-bold text-xs transition cursor-pointer"
          >
            Got it, Let's Explore
          </button>
        </div>
      </div>
    </div>
  );
};
