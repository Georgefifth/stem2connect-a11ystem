import React from 'react';
import {
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Headphones,
  Zap,
  Info,
  Radio,
  Share2,
} from 'lucide-react';
import { DiagramNode, STEMDiagram } from '../types/diagram';
import { audioEngine } from '../services/audioEngine';

interface InspectorPanelProps {
  diagram: STEMDiagram;
  activeNode: DiagramNode | null;
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onSelectNodeById: (id: string) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  diagram,
  activeNode,
  onNavigate,
  onSelectNodeById,
}) => {
  if (!activeNode) {
    return (
      <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-6 text-center text-[#94A3B8]">
        <Info className="w-8 h-8 mx-auto text-[#64748B] mb-2" />
        <p className="text-sm font-medium">No component selected.</p>
        <p className="text-xs text-[#64748B] mt-1">Press any arrow key to begin spatial exploration.</p>
      </div>
    );
  }

  // Calculate audio metrics
  const freq = audioEngine.calculateFrequency(activeNode.y, activeNode.customFrequency);
  const noteName = audioEngine.getNoteName(freq);
  const pan = audioEngine.calculatePan(activeNode.x); // -1.0 to 1.0
  const panPercent = Math.round(((pan + 1) / 2) * 100); // 0 to 100

  // Find neighbor objects
  const upNode = activeNode.neighbors.up ? diagram.nodes.find((n) => n.id === activeNode.neighbors.up) : null;
  const downNode = activeNode.neighbors.down ? diagram.nodes.find((n) => n.id === activeNode.neighbors.down) : null;
  const leftNode = activeNode.neighbors.left ? diagram.nodes.find((n) => n.id === activeNode.neighbors.left) : null;
  const rightNode = activeNode.neighbors.right ? diagram.nodes.find((n) => n.id === activeNode.neighbors.right) : null;

  // Connected edges
  const connectedEdges = diagram.edges.filter(
    (e) => e.source === activeNode.id || e.target === activeNode.id
  );

  return (
    <aside className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col gap-4 text-[#F8FAFC]">
      {/* Component Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 font-semibold">
            {activeNode.type}
          </span>
          {activeNode.subsystem && (
            <span className="text-[11px] font-mono text-[#94A3B8] px-2 py-0.5 rounded bg-[#0F172A] border border-[#1E293B]">
              {activeNode.subsystem}
            </span>
          )}
        </div>
        <h2 className="text-lg font-bold text-[#F8FAFC] tracking-tight">{activeNode.label}</h2>
      </div>

      {/* Value & Formula Callout */}
      {(activeNode.value || activeNode.formula) && (
        <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-3">
          <div className="text-xs text-[#94A3B8] font-mono mb-1">State / Value:</div>
          {activeNode.value && (
            <div className="text-base font-bold font-mono text-[#F59E0B] tracking-wide">
              {activeNode.value}
            </div>
          )}
          {activeNode.formula && (
            <div className="text-xs font-mono text-[#38BDF8] mt-1 pt-1 border-t border-[#1E293B]">
              {activeNode.formula}
            </div>
          )}
        </div>
      )}

      {/* Spatial Audio Sonification Telemetry */}
      <div className="bg-[#080C14] border border-[#1E293B] rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <Headphones className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Spatial Audio Telemetry</span>
          </div>
          <span className="text-[11px] font-mono text-[#F59E0B] font-bold">{noteName}</span>
        </div>

        {/* Stereo Panning Visualizer */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-[#64748B]">
            <span>100% Left Ear</span>
            <span className="text-[#38BDF8]">
              Pan: {pan > 0 ? `+${(pan * 100).toFixed(0)}% R` : `${(pan * 100).toFixed(0)}% L`}
            </span>
            <span>100% Right Ear</span>
          </div>
          <div className="relative w-full h-2 bg-[#162032] rounded-full overflow-hidden">
            {/* Center mark */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#334155] -translate-x-1/2" />
            {/* Active pan needle */}
            <div
              className="absolute top-0 bottom-0 w-3 bg-[#F59E0B] rounded-full shadow-[0_0_8px_#F59E0B] -translate-x-1/2 transition-all duration-150"
              style={{ left: `${panPercent}%` }}
            />
          </div>
        </div>

        {/* 2D Coordinates & Pitch */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#1E293B] text-[11px] font-mono text-[#94A3B8]">
          <div>
            Position: <span className="text-[#F8FAFC]">X:{activeNode.x}% Y:{activeNode.y}%</span>
          </div>
          <div className="text-right">
            Frequency: <span className="text-[#F59E0B]">{Math.round(freq)} Hz</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="text-xs text-[#CBD5E1] leading-relaxed">
        {activeNode.description}
      </div>

      {/* Directional 2D Navigator (Touch & Keyboard D-Pad) */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <Compass className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="font-medium">2D Directional Branches</span>
          </div>
          <span className="text-[10px] font-mono text-[#64748B]">Arrow Keys</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 max-w-[240px] mx-auto text-center">
          {/* Top Row: UP */}
          <div />
          <button
            onClick={() => onNavigate('up')}
            disabled={!upNode}
            className={`p-2 rounded border flex flex-col items-center justify-center transition cursor-pointer ${
              upNode
                ? 'bg-[#162032] hover:bg-[#1E293B] border-[#334155] text-[#F8FAFC]'
                : 'opacity-30 border-[#1E293B] cursor-not-allowed text-[#64748B]'
            }`}
            title={upNode ? `Navigate Up to ${upNode.label}` : 'No node above'}
            aria-label={upNode ? `Navigate Up to ${upNode.label}` : 'No node above'}
          >
            <ArrowUp className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-[9px] font-mono mt-0.5 truncate max-w-[65px]">
              {upNode ? upNode.label.substring(0, 8) : '—'}
            </span>
          </button>
          <div />

          {/* Middle Row: LEFT, ACTIVE, RIGHT */}
          <button
            onClick={() => onNavigate('left')}
            disabled={!leftNode}
            className={`p-2 rounded border flex flex-col items-center justify-center transition cursor-pointer ${
              leftNode
                ? 'bg-[#162032] hover:bg-[#1E293B] border-[#334155] text-[#F8FAFC]'
                : 'opacity-30 border-[#1E293B] cursor-not-allowed text-[#64748B]'
            }`}
            title={leftNode ? `Navigate Left to ${leftNode.label}` : 'No node to the left'}
            aria-label={leftNode ? `Navigate Left to ${leftNode.label}` : 'No node to the left'}
          >
            <ArrowLeft className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-[9px] font-mono mt-0.5 truncate max-w-[65px]">
              {leftNode ? leftNode.label.substring(0, 8) : '—'}
            </span>
          </button>

          {/* Active Center Indicator */}
          <div className="p-2 rounded bg-[#080C14] border border-[#F59E0B]/50 flex flex-col items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.2)]">
            <Radio className="w-4 h-4 text-[#F59E0B] animate-pulse" />
            <span className="text-[9px] font-mono text-[#F59E0B] font-bold">Focal</span>
          </div>

          <button
            onClick={() => onNavigate('right')}
            disabled={!rightNode}
            className={`p-2 rounded border flex flex-col items-center justify-center transition cursor-pointer ${
              rightNode
                ? 'bg-[#162032] hover:bg-[#1E293B] border-[#334155] text-[#F8FAFC]'
                : 'opacity-30 border-[#1E293B] cursor-not-allowed text-[#64748B]'
            }`}
            title={rightNode ? `Navigate Right to ${rightNode.label}` : 'No node to the right'}
            aria-label={rightNode ? `Navigate Right to ${rightNode.label}` : 'No node to the right'}
          >
            <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-[9px] font-mono mt-0.5 truncate max-w-[65px]">
              {rightNode ? rightNode.label.substring(0, 8) : '—'}
            </span>
          </button>

          {/* Bottom Row: DOWN */}
          <div />
          <button
            onClick={() => onNavigate('down')}
            disabled={!downNode}
            className={`p-2 rounded border flex flex-col items-center justify-center transition cursor-pointer ${
              downNode
                ? 'bg-[#162032] hover:bg-[#1E293B] border-[#334155] text-[#F8FAFC]'
                : 'opacity-30 border-[#1E293B] cursor-not-allowed text-[#64748B]'
            }`}
            title={downNode ? `Navigate Down to ${downNode.label}` : 'No node below'}
            aria-label={downNode ? `Navigate Down to ${downNode.label}` : 'No node below'}
          >
            <ArrowDown className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-[9px] font-mono mt-0.5 truncate max-w-[65px]">
              {downNode ? downNode.label.substring(0, 8) : '—'}
            </span>
          </button>
          <div />
        </div>
      </div>

      {/* Connected Nodes List */}
      {connectedEdges.length > 0 && (
        <div className="pt-2 border-t border-[#1E293B]">
          <div className="text-xs text-[#94A3B8] font-mono mb-2 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Connected Topological Nodes ({connectedEdges.length}):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {connectedEdges.map((edge) => {
              const otherId = edge.source === activeNode.id ? edge.target : edge.source;
              const other = diagram.nodes.find((n) => n.id === otherId);
              if (!other) return null;
              return (
                <button
                  key={edge.id}
                  onClick={() => onSelectNodeById(other.id)}
                  className="text-[11px] font-mono px-2 py-1 rounded bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] text-[#CBD5E1] hover:text-[#F59E0B] transition cursor-pointer"
                  title={`Jump to ${other.label}`}
                >
                  {other.label} {edge.label ? `(${edge.label})` : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
