import React, { useState } from 'react';
import { X, Upload, Code, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { STEMDiagram } from '../types/diagram';
import { parseSvgToDiagram } from '../services/svgParser';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (diagram: STEMDiagram) => void;
}

const SAMPLE_RAW_SVG = `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
  <circle id="node-sensor" cx="150" cy="250" r="20" data-label="Optical Sensor" />
  <rect id="node-adc" x="350" y="230" width="80" height="40" data-label="ADC Converter (12-bit)" />
  <rect id="node-mcu" x="550" y="210" width="100" height="80" data-label="ARM Cortex-M4 MCU" />
  <circle id="node-ble" cx="720" cy="250" r="20" data-label="Bluetooth Antenna" />
</svg>`;

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [diagramTitle, setDiagramTitle] = useState<string>('Custom Sensor Pipeline');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSvgContent(content);
      setError(null);
    };
    reader.onerror = () => setError('Failed to read the selected file.');
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setSvgContent(SAMPLE_RAW_SVG);
    setDiagramTitle('IoT Optical Sensor Pipeline');
    setError(null);
  };

  const handleSynthesize = () => {
    setError(null);
    if (!svgContent.trim()) {
      setError('Please paste SVG code or upload a file.');
      return;
    }
    try {
      const diagram = parseSvgToDiagram(svgContent, diagramTitle || 'Imported Diagram');
      onImportSuccess(diagram);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to parse SVG markup.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-title"
    >
      <div className="bg-[#0A0F1D] border border-[#334155] rounded-xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative text-[#F8FAFC]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition cursor-pointer"
          aria-label="Close Import Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 id="import-title" className="text-lg font-bold text-[#F8FAFC]">
              Import SVG Diagram
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Paste SVG markup to automatically synthesize 2D spatial coordinates, audio pitches, and ARIA tree semantics.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#94A3B8] mb-1">
              Diagram Title:
            </label>
            <input
              type="text"
              value={diagramTitle}
              onChange={(e) => setDiagramTitle(e.target.value)}
              placeholder="e.g. Inverting Op-Amp Stage"
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] focus:border-[#F59E0B] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono text-[#94A3B8]">
                SVG Code:
              </label>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Code className="w-3.5 h-3.5" />
                Load Sample SVG
              </button>
            </div>
            <textarea
              value={svgContent}
              onChange={(e) => {
                setSvgContent(e.target.value);
                setError(null);
              }}
              placeholder='<svg viewBox="0 0 800 600"> ... </svg>'
              rows={7}
              className="w-full bg-[#080C14] border border-[#334155] rounded-lg p-3 font-mono text-xs text-[#38BDF8] focus:border-[#F59E0B] focus:outline-none resize-none"
            />
          </div>

          {/* File Upload Option */}
          <div className="flex items-center justify-between text-xs text-[#94A3B8] bg-[#0F172A] border border-[#1E293B] rounded-lg p-3">
            <span>Or upload an SVG file from your computer:</span>
            <label className="px-3 py-1.5 rounded bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC] cursor-pointer transition font-mono">
              Browse...
              <input
                type="file"
                accept=".svg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[#F43F5E]/10 border border-[#F43F5E]/30 rounded-lg p-3 text-xs text-[#F43F5E] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#1E293B]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSynthesize}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#080C14] font-bold text-xs shadow-lg shadow-[#F59E0B]/20 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            Synthesize Accessible Graph
          </button>
        </div>
      </div>
    </div>
  );
};
