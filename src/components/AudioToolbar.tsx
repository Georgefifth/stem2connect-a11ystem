import React from 'react';
import { Play, Square, Layers, Download, RefreshCw, Volume2, Sparkles } from 'lucide-react';
import { STEMDiagram } from '../types/diagram';
import { exportAccessibleSvg } from '../services/svgParser';

interface AudioToolbarProps {
  diagram: STEMDiagram;
  isSweeping: boolean;
  onStartSweep: () => void;
  onStopSweep: () => void;
  zoomLevel: 1 | 2 | 3;
  onChangeZoom: (level: 1 | 2 | 3) => void;
  onResetFocus: () => void;
  statusMessage: string;
}

export const AudioToolbar: React.FC<AudioToolbarProps> = ({
  diagram,
  isSweeping,
  onStartSweep,
  onStopSweep,
  zoomLevel,
  onChangeZoom,
  onResetFocus,
  statusMessage,
}) => {
  const handleExportSvg = () => {
    const svgCode = exportAccessibleSvg(diagram);
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagram.id}-accessible.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-[#F8FAFC]">
      {/* Primary Sweep Trigger */}
      <div className="flex items-center gap-2">
        <button
          onClick={isSweeping ? onStopSweep : onStartSweep}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs tracking-wide transition cursor-pointer shadow-lg ${
            isSweeping
              ? 'bg-[#F43F5E] hover:bg-[#E11D48] text-white shadow-[#F43F5E]/20'
              : 'bg-[#F59E0B] hover:bg-[#D97706] text-[#080C14] shadow-[#F59E0B]/20'
          }`}
          title="Play full diagram sonification left-to-right (Spacebar)"
          aria-label={isSweeping ? 'Stop Audio Sweep' : 'Play Audio Sweep (Spacebar)'}
        >
          {isSweeping ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isSweeping ? 'Stop Sweep' : 'Play Audio Sweep'}</span>
          <kbd className="hidden sm:inline px-1 py-0.5 bg-black/20 text-[10px] rounded font-mono">
            Space
          </kbd>
        </button>

        {/* Re-center Root */}
        <button
          onClick={onResetFocus}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155] text-xs font-medium transition cursor-pointer"
          title="Reset focus to root component (Home key)"
          aria-label="Reset focus to root component"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="hidden sm:inline">Root</span>
        </button>
      </div>

      {/* Semantic Zoom Level Selector */}
      <div className="flex items-center gap-1.5 bg-[#080C14] border border-[#1E293B] rounded-lg p-1">
        <span className="text-[11px] text-[#64748B] font-mono px-1.5 hidden md:inline flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#F59E0B]" />
          Zoom:
        </span>
        <button
          onClick={() => onChangeZoom(1)}
          className={`px-2.5 py-1 text-xs font-mono rounded transition cursor-pointer ${
            zoomLevel === 1
              ? 'bg-[#F59E0B] text-[#080C14] font-bold'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
          title="Level 1: Macro Blueprint (Press 1)"
          aria-label="Zoom Level 1: Macro Blueprint"
        >
          1: Overview
        </button>
        <button
          onClick={() => onChangeZoom(2)}
          className={`px-2.5 py-1 text-xs font-mono rounded transition cursor-pointer ${
            zoomLevel === 2
              ? 'bg-[#F59E0B] text-[#080C14] font-bold'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
          title="Level 2: Subsystem Modules (Press 2)"
          aria-label="Zoom Level 2: Subsystem Modules"
        >
          2: Modules
        </button>
        <button
          onClick={() => onChangeZoom(3)}
          className={`px-2.5 py-1 text-xs font-mono rounded transition cursor-pointer ${
            zoomLevel === 3
              ? 'bg-[#F59E0B] text-[#080C14] font-bold'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
          title="Level 3: Component Detail (Press 3)"
          aria-label="Zoom Level 3: Component Detail"
        >
          3: Detail
        </button>
      </div>

      {/* Status & Export Actions */}
      <div className="flex items-center gap-2">
        {/* Live Status Badge */}
        <div
          className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#0F172A] border border-[#334155] text-[#38BDF8] flex items-center gap-1.5 max-w-[200px] truncate"
          role="status"
          aria-live="polite"
        >
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span className="truncate">{statusMessage || 'Ready for navigation'}</span>
        </div>

        {/* Export Accessible SVG */}
        <button
          onClick={handleExportSvg}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155] text-xs font-medium transition cursor-pointer"
          title="Download accessible SVG with embedded WAI-ARIA and descriptions"
          aria-label="Download accessible SVG"
        >
          <Download className="w-3.5 h-3.5 text-[#10B981]" />
          <span className="hidden sm:inline">Export A11y SVG</span>
        </button>
      </div>
    </div>
  );
};
