import React, { useRef, useEffect } from 'react';
import { STEMDiagram, DiagramNode } from '../types/diagram';

interface CanvasProps {
  diagram: STEMDiagram;
  activeNode: DiagramNode | null;
  onSelectNode: (node: DiagramNode) => void;
  isSweeping: boolean;
  sweepProgress: number; // 0 to 100
  zoomLevel: 1 | 2 | 3;
}

export const Canvas: React.FC<CanvasProps> = ({
  diagram,
  activeNode,
  onSelectNode,
  isSweeping,
  sweepProgress,
  zoomLevel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter nodes according to zoomLevel:
  // zoomLevel 1: nodes with zoomLevel <= 1
  // zoomLevel 2: nodes with zoomLevel <= 2
  // zoomLevel 3: all nodes
  const visibleNodes = diagram.nodes.filter((n) => n.zoomLevel <= zoomLevel);

  // Node type styles
  const getNodeColor = (type: DiagramNode['type'], isActive: boolean) => {
    if (isActive) return '#F59E0B'; // Amber Focus
    switch (type) {
      case 'source':
        return '#10B981'; // Emerald
      case 'ground':
        return '#F43F5E'; // Rose
      case 'ic':
      case 'enzyme':
        return '#A855F7'; // Purple
      case 'capacitor':
      case 'inductor':
        return '#06B6D4'; // Cyan
      case 'data-point':
      case 'inflection':
        return '#38BDF8'; // Sky
      case 'tree-node':
        return '#3B82F6'; // Blue
      case 'resistor':
      default:
        return '#FBBF24'; // Warm yellow
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] bg-[#070B12] rounded-xl border border-[#1E293B] shadow-2xl overflow-hidden focus:outline-none focus:border-[#F59E0B]"
      tabIndex={0}
      aria-label={`Interactive tactile canvas: ${diagram.title}. Use arrow keys to navigate nodes.`}
    >
      {/* Background Tactile Coordinate Grid */}
      <svg
        className="w-full h-full select-none"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="tactile-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#162032" strokeWidth="1" strokeDasharray="2,4" />
          </pattern>
          {/* Active sonar ring pulse animation */}
          <radialGradient id="sonar-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
          {/* Arrow marker for directed edges */}
          <marker
            id="edge-arrow"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8" />
          </marker>
        </defs>

        {/* Grid Layer */}
        <rect width="800" height="500" fill="url(#tactile-grid)" />

        {/* Tactile Coordinates Benchmark Lines */}
        <line x1="0" y1="250" x2="800" y2="250" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="4,4" />
        <line x1="400" y1="0" x2="400" y2="500" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="4,4" />
        <text x="10" y="244" fill="#475569" fontSize="10" fontFamily="monospace">
          Y: Mid (50%)
        </text>
        <text x="406" y="20" fill="#475569" fontSize="10" fontFamily="monospace">
          X: Center (0.0 pan)
        </text>

        {/* Edges / Interconnections */}
        <g id="edges-group">
          {diagram.edges.map((edge) => {
            const src = visibleNodes.find((n) => n.id === edge.source);
            const tgt = visibleNodes.find((n) => n.id === edge.target);
            if (!src || !tgt) return null;

            const x1 = (src.x / 100) * 800;
            const y1 = (src.y / 100) * 500;
            const x2 = (tgt.x / 100) * 800;
            const y2 = (tgt.y / 100) * 500;

            const isConnectedToActive =
              activeNode && (activeNode.id === src.id || activeNode.id === tgt.id);

            // Calculate midpoint for edge label
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            return (
              <g key={edge.id} className="transition-all duration-200">
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isConnectedToActive ? '#38BDF8' : '#1E293B'}
                  strokeWidth={isConnectedToActive ? 2.5 : 1.5}
                  strokeDasharray={isConnectedToActive ? '6,3' : undefined}
                  markerEnd="url(#edge-arrow)"
                />
                {edge.label && (
                  <text
                    x={midX}
                    y={midY - 6}
                    fill={isConnectedToActive ? '#38BDF8' : '#64748B'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none bg-[#080C14] px-1"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes Layer */}
        <g id="nodes-group">
          {visibleNodes.map((node) => {
            const cx = (node.x / 100) * 800;
            const cy = (node.y / 100) * 500;
            const isActive = activeNode?.id === node.id;
            const color = getNodeColor(node.type, isActive);

            return (
              <g
                key={node.id}
                transform={`translate(${cx}, ${cy})`}
                onClick={() => onSelectNode(node)}
                className="cursor-pointer group"
                role="button"
                tabIndex={0}
                aria-label={`${node.label}: ${node.value || ''}. ${node.description}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectNode(node);
                  }
                }}
              >
                {/* Active Sonar Ripple Ring */}
                {isActive && (
                  <>
                    <circle r="44" fill="url(#sonar-glow)" className="animate-ping opacity-40" />
                    <circle r="32" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
                    {/* Focal Reticle Crosshairs */}
                    <line x1="-36" y1="0" x2="-24" y2="0" stroke="#F59E0B" strokeWidth="2" />
                    <line x1="24" y1="0" x2="36" y2="0" stroke="#F59E0B" strokeWidth="2" />
                    <line x1="0" y1="-36" x2="0" y2="-24" stroke="#F59E0B" strokeWidth="2" />
                    <line x1="0" y1="24" x2="0" y2="36" stroke="#F59E0B" strokeWidth="2" />
                  </>
                )}

                {/* Node Base Disc */}
                <circle
                  r={isActive ? 22 : 18}
                  fill="#0F172A"
                  stroke={color}
                  strokeWidth={isActive ? 3 : 2}
                  className="transition-all duration-200 group-hover:scale-110 shadow-lg"
                />

                {/* Component Type Glyph / Icon */}
                {node.type === 'ground' ? (
                  <path d="M-8 4 L8 4 M-5 8 L5 8 M-2 12 L2 12" stroke={color} strokeWidth="2" />
                ) : node.type === 'resistor' ? (
                  <path d="M-10 0 L-6 -4 L-2 4 L2 -4 L6 4 L10 0" fill="none" stroke={color} strokeWidth="2" />
                ) : node.type === 'capacitor' ? (
                  <path d="M-4 -8 L-4 8 M4 -8 L4 8 M-10 0 L-4 0 M4 0 L10 0" stroke={color} strokeWidth="2" />
                ) : node.type === 'source' ? (
                  <path d="M-6 0 C-4 -5 -2 -5 0 0 C2 5 4 5 6 0" fill="none" stroke={color} strokeWidth="2" />
                ) : (
                  <circle r="4" fill={color} />
                )}

                {/* Node Text Label Badge */}
                <text
                  x="0"
                  y={isActive ? 34 : 30}
                  fill={isActive ? '#F8FAFC' : '#94A3B8'}
                  fontSize={isActive ? '11' : '10'}
                  fontWeight={isActive ? 'bold' : 'normal'}
                  textAnchor="middle"
                  fontFamily="system-ui, sans-serif"
                  className="select-none pointer-events-none drop-shadow"
                >
                  {node.label}
                </text>

                {/* Node Value pill */}
                {node.value && (
                  <text
                    x="0"
                    y={isActive ? 46 : 42}
                    fill={isActive ? '#F59E0B' : '#64748B'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {node.value.length > 20 ? node.value.substring(0, 18) + '…' : node.value}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Dynamic Audio Sweep Scanline */}
        {isSweeping && (
          <g transform={`translate(${(sweepProgress / 100) * 800}, 0)`}>
            <line x1="0" y1="0" x2="0" y2="500" stroke="#F59E0B" strokeWidth="2.5" opacity="0.9" />
            <polygon points="-8,0 8,0 0,14" fill="#F59E0B" />
            <polygon points="-8,500 8,500 0,486" fill="#F59E0B" />
            <rect x="-30" y="240" width="60" height="20" rx="4" fill="#F59E0B" />
            <text x="0" y="254" fill="#080C14" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              SCAN
            </text>
          </g>
        )}
      </svg>

      {/* Screen-reader ARIA live region for active focal announcement */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {activeNode
          ? `Current focal component: ${activeNode.label}, ${activeNode.value || ''}. ${activeNode.description}`
          : 'Tactile diagram canvas ready.'}
      </div>
    </div>
  );
};
