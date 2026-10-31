import React, { useState, useEffect, useCallback, useRef } from 'react';
import { sampleDiagrams } from './data/sampleDiagrams';
import { STEMDiagram, DiagramNode } from './types/diagram';
import { audioEngine } from './services/audioEngine';
import { speechEngine, VerbosityLevel } from './services/speechEngine';
import { Header } from './components/Header';
import { Canvas } from './components/Canvas';
import { InspectorPanel } from './components/InspectorPanel';
import { AudioToolbar } from './components/AudioToolbar';
import { ImportModal } from './components/ImportModal';
import { KeyboardHelpModal } from './components/KeyboardHelpModal';

export const App: React.FC = () => {
  const [diagrams, setDiagrams] = useState<STEMDiagram[]>(sampleDiagrams);
  const [currentDiagramId, setCurrentDiagramId] = useState<string>(sampleDiagrams[0].id);
  const currentDiagram = diagrams.find((d) => d.id === currentDiagramId) || diagrams[0];

  const [activeNodeId, setActiveNodeId] = useState<string>(currentDiagram.rootNodeId);
  const activeNode = currentDiagram.nodes.find((n) => n.id === activeNodeId) || currentDiagram.nodes[0];

  const [isSweeping, setIsSweeping] = useState<boolean>(false);
  const [sweepProgress, setSweepProgress] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 3>(3);

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.6);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(true);
  const [speechVerbosity, setSpeechVerbosity] = useState<VerbosityLevel>('concise');

  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Ready for navigation');

  const activeNodeRef = useRef<DiagramNode>(activeNode);
  activeNodeRef.current = activeNode;

  // Select node with sound and speech
  const selectNode = useCallback((node: DiagramNode, triggerAudio: boolean = true) => {
    setActiveNodeId(node.id);
    if (triggerAudio) {
      audioEngine.playNodeTone(node, 280);
      speechEngine.announceNode(node);
      setStatusMessage(`Focused: ${node.label}`);
    }
  }, []);

  // When diagram changes, reset active node to root
  const handleSelectDiagram = useCallback((id: string) => {
    const nextDiagram = diagrams.find((d) => d.id === id);
    if (!nextDiagram) return;
    setCurrentDiagramId(id);
    const root = nextDiagram.nodes.find((n) => n.id === nextDiagram.rootNodeId) || nextDiagram.nodes[0];
    setActiveNodeId(root.id);
    audioEngine.stopAudioSweep();
    setIsSweeping(false);
    audioEngine.playNodeTone(root, 300);
    speechEngine.speak(`Loaded ${nextDiagram.title}. Initial focal node: ${root.label}`);
    setStatusMessage(`Loaded: ${nextDiagram.title}`);
  }, [diagrams]);

  // Directional navigation
  const handleNavigate = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      const current = activeNodeRef.current;
      const targetId = current.neighbors[direction];
      if (!targetId) {
        // Edge bump audio feedback
        audioEngine.playDirectionalChirp(direction);
        setStatusMessage(`Boundary reached: No node to the ${direction}`);
        return;
      }
      const targetNode = currentDiagram.nodes.find((n) => n.id === targetId);
      if (targetNode) {
        audioEngine.playDirectionalChirp(direction);
        selectNode(targetNode, true);
      }
    },
    [currentDiagram, selectNode]
  );

  // Play audio sweep
  const handleStartSweep = useCallback(() => {
    audioEngine.init();
    setIsSweeping(true);
    setStatusMessage('Playing left-to-right audio scan sweep...');
    audioEngine.playAudioSweep(
      currentDiagram.nodes,
      2800,
      (progress, hitNode) => {
        setSweepProgress(progress);
        if (hitNode) {
          setActiveNodeId(hitNode.id);
        }
      },
      () => {
        setIsSweeping(false);
        setSweepProgress(0);
        setStatusMessage('Audio sweep completed');
      }
    );
  }, [currentDiagram]);

  const handleStopSweep = useCallback(() => {
    audioEngine.stopAudioSweep();
    setIsSweeping(false);
    setSweepProgress(0);
    setStatusMessage('Audio sweep stopped');
  }, []);

  // Global Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in input or textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleNavigate('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleNavigate('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleNavigate('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNavigate('right');
          break;
        case ' ':
          e.preventDefault();
          if (isSweeping) handleStopSweep();
          else handleStartSweep();
          break;
        case '1':
          setZoomLevel(1);
          speechEngine.speak('Zoom Level 1: Macro Blueprint');
          setStatusMessage('Zoom: Macro Blueprint');
          break;
        case '2':
          setZoomLevel(2);
          speechEngine.speak('Zoom Level 2: Subsystem Modules');
          setStatusMessage('Zoom: Subsystem Modules');
          break;
        case '3':
          setZoomLevel(3);
          speechEngine.speak('Zoom Level 3: Full Component Details');
          setStatusMessage('Zoom: Full Details');
          break;
        case 'm':
        case 'M':
          setIsMuted((prev) => {
            const next = !prev;
            audioEngine.setMuted(next);
            return next;
          });
          break;
        case 'v':
        case 'V':
          setIsSpeechEnabled((prev) => {
            const next = !prev;
            speechEngine.setEnabled(next);
            return next;
          });
          break;
        case 'Home':
          e.preventDefault();
          const root = currentDiagram.nodes.find((n) => n.id === currentDiagram.rootNodeId) || currentDiagram.nodes[0];
          selectNode(root, true);
          break;
        case '?':
        case 'h':
        case 'H':
          setIsHelpOpen((prev) => !prev);
          break;
        case 'Escape':
          setIsImportOpen(false);
          setIsHelpOpen(false);
          if (isSweeping) handleStopSweep();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigate, isSweeping, handleStartSweep, handleStopSweep, currentDiagram, selectNode]);

  // Volume & Speech updates
  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      audioEngine.setMuted(next);
      return next;
    });
  };

  const handleChangeVolume = (vol: number) => {
    setVolume(vol);
    audioEngine.setVolume(vol);
    if (isMuted && vol > 0) {
      setIsMuted(false);
      audioEngine.setMuted(false);
    }
  };

  const handleToggleSpeech = () => {
    setIsSpeechEnabled((prev) => {
      const next = !prev;
      speechEngine.setEnabled(next);
      return next;
    });
  };

  const handleChangeVerbosity = (v: VerbosityLevel) => {
    setSpeechVerbosity(v);
    speechEngine.setVerbosity(v);
  };

  const handleImportSuccess = (newDiagram: STEMDiagram) => {
    setDiagrams((prev) => [newDiagram, ...prev]);
    setCurrentDiagramId(newDiagram.id);
    setActiveNodeId(newDiagram.rootNodeId || newDiagram.nodes[0].id);
    audioEngine.playNodeTone(newDiagram.nodes[0], 350);
    speechEngine.speak(`Imported and synthesized: ${newDiagram.title}. Ready for spatial audio navigation.`);
    setStatusMessage(`Imported: ${newDiagram.title}`);
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#F59E0B]/30">
      {/* App Header */}
      <Header
        diagrams={diagrams}
        currentDiagram={currentDiagram}
        onSelectDiagram={handleSelectDiagram}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        volume={volume}
        onChangeVolume={handleChangeVolume}
        isSpeechEnabled={isSpeechEnabled}
        onToggleSpeech={handleToggleSpeech}
        speechVerbosity={speechVerbosity}
        onChangeVerbosity={handleChangeVerbosity}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Top Control & Audio Sweep Toolbar */}
        <AudioToolbar
          diagram={currentDiagram}
          isSweeping={isSweeping}
          onStartSweep={handleStartSweep}
          onStopSweep={handleStopSweep}
          zoomLevel={zoomLevel}
          onChangeZoom={(lvl) => setZoomLevel(lvl)}
          onResetFocus={() => {
            const root = currentDiagram.nodes.find((n) => n.id === currentDiagram.rootNodeId) || currentDiagram.nodes[0];
            selectNode(root, true);
          }}
          statusMessage={statusMessage}
        />

        {/* Core Exploration Canvas & Telemetry Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Canvas (12 cols mobile, 8 cols desktop) */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <Canvas
              diagram={currentDiagram}
              activeNode={activeNode}
              onSelectNode={(node) => selectNode(node, true)}
              isSweeping={isSweeping}
              sweepProgress={sweepProgress}
              zoomLevel={zoomLevel}
            />

            {/* Quick Educational Goal & Track Banner */}
            <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                <span className="font-bold text-[#F8FAFC]">{currentDiagram.track}:</span>
                <span className="text-[#94A3B8]">{currentDiagram.educationalGoal}</span>
              </div>
              <div className="text-[11px] font-mono text-[#64748B] shrink-0">
                {currentDiagram.nodes.length} Components | {currentDiagram.edges.length} Interconnections
              </div>
            </div>
          </div>

          {/* Right Inspector & Compass Telemetry (4 cols desktop) */}
          <div className="lg:col-span-4">
            <InspectorPanel
              diagram={currentDiagram}
              activeNode={activeNode}
              onNavigate={handleNavigate}
              onSelectNodeById={(id) => {
                const node = currentDiagram.nodes.find((n) => n.id === id);
                if (node) selectNode(node, true);
              }}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] bg-[#070B12] py-3 px-4 text-center text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            A11ySTEM &copy; 2026 STEM2Connect AI Hackathon — Built for universal STEM diagram equity &amp; inclusion.
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Press <kbd className="text-[#F59E0B]">?</kbd> for Keybinds</span>
            <span>•</span>
            <span className="text-[#10B981]">WCAG 2.1 AAA Compliant</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
      <KeyboardHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};
