import React from 'react';
import { Volume2, VolumeX, Mic, MicOff, HelpCircle, Upload, Eye, Activity } from 'lucide-react';
import { STEMDiagram } from '../types/diagram';
import { VerbosityLevel } from '../services/speechEngine';

interface HeaderProps {
  diagrams: STEMDiagram[];
  currentDiagram: STEMDiagram;
  onSelectDiagram: (id: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  isSpeechEnabled: boolean;
  onToggleSpeech: () => void;
  speechVerbosity: VerbosityLevel;
  onChangeVerbosity: (v: VerbosityLevel) => void;
  onOpenImport: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  diagrams,
  currentDiagram,
  onSelectDiagram,
  isMuted,
  onToggleMute,
  volume,
  onChangeVolume,
  isSpeechEnabled,
  onToggleSpeech,
  speechVerbosity,
  onChangeVerbosity,
  onOpenImport,
  onOpenHelp,
}) => {
  return (
    <header className="border-b border-[#1E293B] bg-[#0A0F1D]/90 backdrop-blur px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Mission Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#F59E0B]/50 flex items-center justify-center text-[#F59E0B] shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
                A11y<span className="text-[#F59E0B]">STEM</span>
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 font-medium">
                Community Impact
              </span>
              <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                WCAG AAA Audio
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Interactive Spatial Audio &amp; 2D Semantic STEM Diagram Navigator
            </p>
          </div>
        </div>

        {/* Diagram Switcher & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Curated Diagram Select */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="diagram-select" className="text-xs text-[#94A3B8] font-mono hidden lg:inline">
              Diagram:
            </label>
            <select
              id="diagram-select"
              value={currentDiagram.id}
              onChange={(e) => onSelectDiagram(e.target.value)}
              className="bg-[#0F172A] border border-[#334155] hover:border-[#F59E0B] focus:border-[#F59E0B] text-xs text-[#F8FAFC] rounded-md px-2.5 py-1.5 font-medium transition cursor-pointer max-w-[220px] sm:max-w-[260px] truncate"
              aria-label="Select STEM Diagram"
            >
              {diagrams.map((d) => (
                <option key={d.id} value={d.id}>
                  [{d.track.split(' ')[0]}] {d.title}
                </option>
              ))}
            </select>
          </div>

          {/* Import Custom SVG */}
          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 text-xs bg-[#0F172A] hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155] rounded-md px-2.5 py-1.5 font-medium transition cursor-pointer"
            title="Import custom SVG diagram"
            aria-label="Import custom SVG diagram"
          >
            <Upload className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">Import SVG</span>
          </button>

          {/* Speech Voice Toggle & Verbosity */}
          <div className="flex items-center bg-[#0F172A] border border-[#334155] rounded-md p-0.5">
            <button
              onClick={onToggleSpeech}
              className={`p-1.5 rounded transition cursor-pointer ${
                isSpeechEnabled ? 'text-[#10B981] bg-[#10B981]/10' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              title={isSpeechEnabled ? 'Voice narration active (Press V)' : 'Voice narration muted'}
              aria-label={isSpeechEnabled ? 'Disable Voice Narration' : 'Enable Voice Narration'}
            >
              {isSpeechEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            </button>
            <select
              value={speechVerbosity}
              onChange={(e) => onChangeVerbosity(e.target.value as VerbosityLevel)}
              disabled={!isSpeechEnabled}
              className="bg-transparent text-[11px] text-[#94A3B8] font-mono pr-1.5 pl-1 py-1 disabled:opacity-40 cursor-pointer"
              aria-label="Voice Verbosity Level"
            >
              <option value="concise">Concise</option>
              <option value="verbose">Verbose</option>
              <option value="silent">Audio Only</option>
            </select>
          </div>

          {/* Audio Volume & Mute */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] border border-[#334155] rounded-md px-2 py-1">
            <button
              onClick={onToggleMute}
              className="text-[#94A3B8] hover:text-[#F59E0B] transition cursor-pointer"
              title={isMuted ? 'Unmute Audio (Press M)' : 'Mute Audio (Press M)'}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#F43F5E]" /> : <Volume2 className="w-3.5 h-3.5 text-[#F59E0B]" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
              className="w-14 sm:w-16 h-1 accent-[#F59E0B] cursor-pointer"
              aria-label="Master Sonification Volume"
            />
          </div>

          {/* Help & Cheatsheet */}
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1 text-xs bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 rounded-md px-2.5 py-1.5 font-medium transition cursor-pointer"
            title="Keyboard shortcuts & Audio guide (Press ?)"
            aria-label="Keyboard shortcuts & Audio guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guide</span>
            <kbd className="hidden md:inline px-1 py-0.2 bg-[#080C14] text-[10px] rounded border border-[#F59E0B]/30 font-mono">
              ?
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
