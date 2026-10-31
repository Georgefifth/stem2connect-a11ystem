export type NodeType =
  | 'source'
  | 'resistor'
  | 'capacitor'
  | 'inductor'
  | 'diode'
  | 'ic'
  | 'ground'
  | 'junction'
  | 'data-point'
  | 'inflection'
  | 'asymptote'
  | 'metabolite'
  | 'enzyme'
  | 'tree-node'
  | 'state';

export type DiagramTrack =
  | 'Physics & Circuits'
  | 'Calculus & Functions'
  | 'Biochemistry & Pathways'
  | 'Computer Science & Trees';

export interface DirectionalNeighbors {
  up?: string;
  down?: string;
  left?: string;
  right?: string;
  connected?: string[];
}

export interface DiagramNode {
  id: string;
  label: string;
  type: NodeType;
  x: number; // 0 to 100 (% of canvas width)
  y: number; // 0 to 100 (% of canvas height, where 0 is top, 100 is bottom)
  value?: string;
  unit?: string;
  formula?: string;
  description: string;
  subsystem?: string;
  zoomLevel: 1 | 2 | 3; // 1: Macro Blueprint, 2: Module/Subsystem, 3: Micro Component
  neighbors: DirectionalNeighbors;
  // Dynamic audio parameters (optional override)
  customFrequency?: number;
  waveform?: 'sine' | 'triangle' | 'square' | 'sawtooth';
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  directed?: boolean;
  type?: 'signal' | 'reaction' | 'branch' | 'tangent' | 'feedback';
}

export interface STEMDiagram {
  id: string;
  title: string;
  track: DiagramTrack;
  category: string;
  description: string;
  educationalGoal: string;
  rootNodeId: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  canvasWidth?: number;
  canvasHeight?: number;
}
