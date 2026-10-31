import { describe, it, expect } from 'vitest';
import { parseSvgToDiagram, computeDirectionalTopology, exportAccessibleSvg } from '../services/svgParser';
import { sampleDiagrams } from '../data/sampleDiagrams';
import { DiagramNode } from '../types/diagram';

describe('SVG Parser & Topological Graph Engine', () => {
  it('parses raw SVG markup into structured DiagramNodes', () => {
    const rawSvg = `
      <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <circle id="n1" cx="200" cy="500" r="10" data-label="Source Vin" />
        <rect id="n2" x="450" y="480" width="100" height="40" data-label="Resistor R1" />
        <circle id="n3" cx="800" cy="500" r="10" data-label="Ground GND" />
      </svg>
    `;

    const diagram = parseSvgToDiagram(rawSvg, 'Test Circuit');
    expect(diagram.title).toBe('Test Circuit');
    expect(diagram.nodes.length).toBe(3);

    const n1 = diagram.nodes.find((n) => n.id === 'n1');
    const n2 = diagram.nodes.find((n) => n.id === 'n2');
    const n3 = diagram.nodes.find((n) => n.id === 'n3');

    expect(n1).toBeDefined();
    expect(n2).toBeDefined();
    expect(n3).toBeDefined();

    // Verify coordinates
    expect(n1?.x).toBeCloseTo(20, 0);
    expect(n2?.x).toBeCloseTo(50, 0);
    expect(n3?.x).toBeCloseTo(80, 0);

    // Verify topological directional neighbors
    expect(n1?.neighbors.right).toBe('n2');
    expect(n2?.neighbors.left).toBe('n1');
    expect(n2?.neighbors.right).toBe('n3');
    expect(n3?.neighbors.left).toBe('n2');
  });

  it('handles invalid SVG gracefully by throwing descriptive error', () => {
    expect(() => parseSvgToDiagram('not an svg')).toThrow('Invalid SVG');
  });

  it('exports accessible SVG with WAI-ARIA roles and titles', () => {
    const testDiagram = sampleDiagrams[0];
    const accessibleSvg = exportAccessibleSvg(testDiagram);

    expect(accessibleSvg).toContain('role="graphics-document"');
    expect(accessibleSvg).toContain('role="treeitem"');
    expect(accessibleSvg).toContain('aria-label');
    expect(accessibleSvg).toContain('<desc>');
  });

  it('verifies integrity of all preloaded sample diagrams', () => {
    sampleDiagrams.forEach((diagram) => {
      expect(diagram.nodes.length).toBeGreaterThan(0);
      expect(diagram.edges.length).toBeGreaterThan(0);
      const root = diagram.nodes.find((n) => n.id === diagram.rootNodeId);
      expect(root).toBeDefined();

      // Check neighbor references point to existing nodes
      diagram.nodes.forEach((node) => {
        if (node.neighbors.up) {
          expect(diagram.nodes.some((n) => n.id === node.neighbors.up)).toBe(true);
        }
        if (node.neighbors.down) {
          expect(diagram.nodes.some((n) => n.id === node.neighbors.down)).toBe(true);
        }
        if (node.neighbors.left) {
          expect(diagram.nodes.some((n) => n.id === node.neighbors.left)).toBe(true);
        }
        if (node.neighbors.right) {
          expect(diagram.nodes.some((n) => n.id === node.neighbors.right)).toBe(true);
        }
      });
    });
  });
});
