import React, { useEffect, useState } from 'react';
import { CaseResultSummary, GameSettings } from './types/game';
import { VACANCY_CASES, MENTOR_INFO } from './data/vacancies';
import { soundEngine } from './audio/SoundEngine';
import { GameLogo } from './components/GameLogo';
import { TutorialOverlay } from './components/TutorialOverlay';
import { Office3DGame } from './components/Office3DGame';
import { CaseDebriefModal } from './components/CaseDebriefModal';
import { FinalDiplomaModal } from './components/FinalDiplomaModal';
import {
  IconClipboard,
  IconDossier,
  IconLupa,
  IconPhone,
  IconStamp,
  IconStarBadge,
  IconCheckSeal,
  IconStampReject,
  IconNotebook,
  IconWarningShield
} from './components/GameIcons';
import {
  Volume2,
  VolumeX,
  FolderKanban,
  Award,
  BookOpen,
  Play,
  RotateCcw,
  Settings,
  Maximize2,
  Trash2,
  X,
  Eye,
  Pause,
  Home,
  HelpCircle
} from 'lucide-react';

type OverlayState =
  | 'START_MENU'
  | 'PLAYING'
  | 'CASE_SELECT'
  | 'SETTINGS'
  | 'DEBRIEF'
  | 'DIPLOMA'
  | 'GUIDE'
  | 'PAUSE';

const SAVE_STORAGE_KEY = 'cazatalentos_saman_save_v2';
const SETTINGS_STORAGE_KEY = 'cazatalentos_saman_settings_v2';
const TUTORIAL_STORAGE_KEY = 'javetalento_tutorial_done_v1';

const DEFAULT_SETTINGS: GameSettings = {
  graphicsQuality: 'alta',
  audioVolume: 80,
  isMuted: false,
  cameraSensitivity: 1.0,
  textSpeed: 'normal'
};

const MANUAL_TOOLS: { icon: React.ReactNode; hotkey: string | null; name: string; text: string }[] = [
  {
    icon: <IconClipboard size={18} />,
    hotkey: 'P',
    name: 'Perfil del cargo',
    text: 'Marca los criterios objetivos del cargo y descarta los requisitos discriminatorios.'
  },
  {
    icon: <IconDossier size={18} />,
    hotkey: 'C',
    name: 'Hoja de vida',
    text: 'Resalta cada dato como evidencia real, punto a indagar o trampa de sesgo.'
  },
  {
    icon: <IconNotebook size={18} />,
    hotkey: 'E',
    name: 'Libreta de preguntas',
    text: 'Entrevista con preguntas STAR y presiona con contra-preguntas.'
  },
  {
    icon: <IconLupa size={18} />,
    hotkey: 'L',
    name: 'Lupa',
    text: 'Lee el lenguaje corporal del candidato y destapa notas ocultas del CV.'
  },
  {
    icon: <IconPhone size={18} />,
    hotkey: 'T',
    name: 'Citófono',
    text: 'Llama a la referencia laboral para contrastar lo que dice el candidato.'
  },
  {
    icon: <IconStamp size={18} />,
    hotkey: null,
    name: 'Sellos',
    text: 'Estampa CONTRATADO o DESCARTADO sobre la hoja de vida abierta.'
  }
];

const STAR_STEPS: [string, string, string][] = [
  ['S', 'Situación', 'Un caso real y concreto que vivió.'],
  ['T', 'Tarea', 'Cuál era su responsabilidad o reto.'],
  ['A', 'Acción', 'Qué hizo esa persona, no el equipo.'],
  ['R', 'Resultado', 'Qué logró, idealmente con datos.']
];

export const App: React.FC = () => {
  const [overlay, setOverlay] = useState<OverlayState>('START_MENU');
  const [previousOverlay, setPreviousOverlay] = useState<OverlayState>('START_MENU');
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [caseResults, setCaseResults] = useState<Record<string, CaseResultSummary>>({});
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);

  // Show the guided tutorial the first time a player enters the office
  const maybeStartTutorial = () => {
    let done = false;
    try {
      done = localStorage.getItem(TUTORIAL_STORAGE_KEY) === '1';
    } catch {
      // storage unavailable: show the tutorial
    }
    if (!done) setShowTutorial(true);
  };

  const finishTutorial = () => {
    setShowTutorial(false);
    try {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  };

  // Load transparent logo, saved campaign progress, and saved settings on startup
  useEffect(() => {

    try {
      const rawSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (rawSettings) {
        const parsed = JSON.parse(rawSettings) as Partial<GameSettings>;
        const merged: GameSettings = { ...DEFAULT_SETTINGS, ...parsed };
        setSettings(merged);
        soundEngine.setVolume(merged.audioVolume / 100);
        soundEngine.setMuted(merged.isMuted);
      }
    } catch {
      // ignore storage errors
    }

    try {
      const rawSave = localStorage.getItem(SAVE_STORAGE_KEY);
      if (rawSave) {
        const parsed = JSON.parse(rawSave) as {
          activeCaseIndex?: number;
          caseResults?: Record<string, CaseResultSummary>;
        };
        if (parsed && typeof parsed.activeCaseIndex === 'number') {
          setActiveCaseIndex(
            Math.max(0, Math.min(VACANCY_CASES.length - 1, parsed.activeCaseIndex))
          );
          if (parsed.caseResults) {
            setCaseResults(parsed.caseResults);
          }
          setHasSavedGame(true);
        }
      }
    } catch {
      // ignore storage errors
    }

    // Unlock Web Audio and start warm campus ambiance on first user gesture
    const unlockAudio = () => {
      soundEngine.startAmbient();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Persist settings whenever changed
  const updateSettings = (patch: Partial<GameSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      if (patch.audioVolume !== undefined) {
        soundEngine.setVolume(patch.audioVolume / 100);
      }
      if (patch.isMuted !== undefined) {
        soundEngine.setMuted(patch.isMuted);
      }
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Persist campaign progress
  const saveProgress = (nextIndex: number, nextResults: Record<string, CaseResultSummary>) => {
    setHasSavedGame(true);
    try {
      localStorage.setItem(
        SAVE_STORAGE_KEY,
        JSON.stringify({
          activeCaseIndex: nextIndex,
          caseResults: nextResults
        })
      );
    } catch {
      // ignore
    }
  };

  const currentVacancy = VACANCY_CASES[activeCaseIndex] || VACANCY_CASES[0];

  const handleToggleAudio = () => {
    const muted = soundEngine.toggleMute();
    updateSettings({ isMuted: muted });
  };

  const handleNewGame = () => {
    soundEngine.startAmbient();
    soundEngine.playFanfare();
    soundEngine.playDoorOpen();
    setCaseResults({});
    setActiveCaseIndex(0);
    saveProgress(0, {});
    setOverlay('PLAYING');
    maybeStartTutorial();
  };

  const handleContinueGame = () => {
    soundEngine.startAmbient();
    soundEngine.playButtonClick();
    soundEngine.playDoorOpen();
    setOverlay('PLAYING');
    maybeStartTutorial();
  };

  const handleStartCase = (index: number) => {
    soundEngine.startAmbient();
    soundEngine.playButtonClick();
    soundEngine.playDoorOpen();
    setActiveCaseIndex(index);
    saveProgress(index, caseResults);
    setOverlay('PLAYING');
    maybeStartTutorial();
  };

  const handleOpenModalFrom = (target: OverlayState) => {
    if (overlay !== target) {
      soundEngine.playMenuOpen();
      setPreviousOverlay(
        overlay === 'START_MENU' || overlay === 'PAUSE' ? overlay : 'PLAYING'
      );
      setOverlay(target);
    } else {
      soundEngine.playMenuClose();
      setOverlay(previousOverlay);
    }
  };

  const handleCloseModal = () => {
    soundEngine.playMenuClose();
    setOverlay(previousOverlay);
  };

  const handlePause = () => {
    soundEngine.playMenuOpen();
    setOverlay('PAUSE');
  };

  const handleResume = () => {
    soundEngine.playMenuClose();
    setOverlay('PLAYING');
  };

  // Esc: resume from pause, or close a menu opened from the pause screen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (overlay === 'PAUSE') {
        handleResume();
      } else if (
        (overlay === 'SETTINGS' || overlay === 'GUIDE' || overlay === 'CASE_SELECT') &&
        previousOverlay !== 'START_MENU'
      ) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const handleToggleFullscreen = () => {
    soundEngine.playButtonClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleResetSavedData = () => {
    soundEngine.playBiasAlert();
    localStorage.removeItem(SAVE_STORAGE_KEY);
    setCaseResults({});
    setActiveCaseIndex(0);
    setHasSavedGame(false);
  };

  const handleCompleteCase = (
    selectedCandidateId: string,
    profileScore: number,
    cvScore: number,
    interviewScore: number,
    starAskedCount: number,
    biasesTriggered: number,
    biasesAvoided: number,
    referencesChecked: number,
    lupaUsed: boolean
  ) => {
    const chosen =
      currentVacancy.candidates.find((c) => c.id === selectedCandidateId) ||
      currentVacancy.candidates[0];
    const isIdeal = chosen.trueSuitability === 'IDEAL';
    const hiringDecisionScore = isIdeal ? 100 : 45;
    const investigationBonus = (lupaUsed ? 4 : 0) + (referencesChecked > 0 ? 4 : 0);

    const totalScore = Math.min(
      100,
      Math.round(
        profileScore * 0.2 +
          cvScore * 0.2 +
          interviewScore * 0.25 +
          hiringDecisionScore * 0.35 +
          investigationBonus
      )
    );

    const summary: CaseResultSummary = {
      caseId: currentVacancy.id,
      selectedCandidateId,
      isIdealHire: isIdeal,
      profileScore,
      cvScreeningScore: cvScore,
      interviewQuestionScore: interviewScore,
      hiringDecisionScore,
      totalScore,
      biasesAvoided,
      biasesTriggered,
      starQuestionsAsked: starAskedCount,
      referencesChecked,
      lupaUsed,
      feedbackBullets: [chosen.hiringVerdictExplanation]
    };

    if (isIdeal) {
      soundEngine.playFanfare();
    } else {
      soundEngine.playBiasAlert();
    }

    const updatedResults = {
      ...caseResults,
      [currentVacancy.id]: summary
    };
    setCaseResults(updatedResults);
    saveProgress(activeCaseIndex, updatedResults);
    setOverlay('DEBRIEF');
  };

  const completedCasesCount = Object.keys(caseResults).length;

  return (
    <div className="fullscreen-game-root">
      {/* TOP-LEFT PAUSE BUTTON */}
      {overlay === 'PLAYING' && (
        <header className="game-floating-topbar no-print">
          <button
            type="button"
            onMouseEnter={() => soundEngine.playHoverTick()}
            onClick={handlePause}
            className="btn-hud-pause"
            title="Pausa (Esc)"
          >
            <Pause size={16} />
            <span>Pausa</span>
            <kbd>Esc</kbd>
          </button>
        </header>
      )}

      {/* FULLSCREEN 3D FIRST-PERSON OFFICE WORLD (ALWAYS LIVE IN BACKGROUND!) */}
      <Office3DGame
        vacancy={currentVacancy}
        settings={settings}
        isMenuOpen={overlay !== 'PLAYING'}
        onOpenManual={() => handleOpenModalFrom('GUIDE')}
        onPause={handlePause}
        onCompleteCase={handleCompleteCase}
      />

      {overlay === 'PLAYING' && showTutorial && <TutorialOverlay onFinish={finishTutorial} />}

      {/* ========================================================================
          PAUSE MENU
          ======================================================================== */}
      {overlay === 'PAUSE' && (
        <div className="pause-overlay" onClick={handleResume}>
          <div className="pause-panel" onClick={(e) => e.stopPropagation()}>
            <GameLogo size="sm" />
            <span className="pause-eyebrow">Juego en pausa</span>
            <h2 className="pause-title">
              Misión {currentVacancy.number}: {currentVacancy.title}
            </h2>
            <div className="pause-progress" aria-label="Misiones completadas">
              {VACANCY_CASES.map((vc, i) => (
                <span
                  key={vc.id}
                  className={`pause-dot ${caseResults[vc.id] ? 'is-done' : ''} ${
                    i === activeCaseIndex ? 'is-current' : ''
                  }`}
                />
              ))}
              <small>{completedCasesCount}/3 misiones completadas</small>
            </div>

            <nav className="pause-menu">
              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={handleResume}
                className="pause-btn primary"
              >
                <Play size={17} /> Continuar <kbd>Esc</kbd>
              </button>
              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={() => handleOpenModalFrom('CASE_SELECT')}
                className="pause-btn"
              >
                <FolderKanban size={17} /> Cambiar de misión
              </button>
              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={() => handleOpenModalFrom('GUIDE')}
                className="pause-btn"
              >
                <BookOpen size={17} /> Manual del cazatalentos
              </button>
              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={() => {
                  soundEngine.playMenuClose();
                  setOverlay('PLAYING');
                  setShowTutorial(true);
                }}
                className="pause-btn"
              >
                <HelpCircle size={17} /> Cómo jugar (tutorial)
              </button>
              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={() => handleOpenModalFrom('SETTINGS')}
                className="pause-btn"
              >
                <Settings size={17} /> Ajustes
              </button>
              {completedCasesCount > 0 && (
                <button
                  type="button"
                  onMouseEnter={() => soundEngine.playHoverTick()}
                  onClick={() => {
                    soundEngine.playFanfare();
                    setPreviousOverlay('PAUSE');
                    setOverlay('DIPLOMA');
                  }}
                  className="pause-btn"
                >
                  <Award size={17} /> Ver diploma ({completedCasesCount}/3)
                </button>
              )}
              <div className="pause-row">
                <button
                  type="button"
                  onMouseEnter={() => soundEngine.playHoverTick()}
                  onClick={handleToggleAudio}
                  className="pause-btn"
                >
                  {settings.isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                  {settings.isMuted ? 'Activar sonido' : 'Silenciar'}
                </button>
                <button
                  type="button"
                  onMouseEnter={() => soundEngine.playHoverTick()}
                  onClick={handleToggleFullscreen}
                  className="pause-btn"
                >
                  <Maximize2 size={17} /> Pantalla completa
                </button>
              </div>
              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={() => {
                  soundEngine.playMenuOpen();
                  setOverlay('START_MENU');
                }}
                className="pause-btn quiet"
              >
                <Home size={17} /> Salir al menú principal
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* ========================================================================
          CINEMATIC 3D VIDEO GAME TITLE SCREEN (LEFT MENU DOCK + LIVE 3D OFFICE)
          ======================================================================== */}
      {overlay === 'START_MENU' && (
        <div className="game-title-screen-overlay">
          {/* LEFT DOCK: GAME LOGO CREST & INTERACTIVE MENU COLUMN */}
          <aside className="title-screen-left-dock">
            <div className="start-logo-hero">
              <GameLogo size="lg" tagline="Selección por competencias" />
            </div>

            <div className="start-badge">Pontificia Universidad Javeriana Cali</div>

            <nav className="video-game-menu-nav" aria-label="Menú Principal">
              {hasSavedGame && (
                <button
                  type="button"
                  onMouseEnter={() => soundEngine.playHoverTick()}
                  onClick={handleContinueGame}
                  className="btn-vg-menu primary-continue"
                >
                  <Play size={20} />
                  <div className="vg-btn-text">
                    <strong>CONTINUAR PARTIDA</strong>
                    <span>
                      Misión #{currentVacancy.number}: {currentVacancy.title.slice(0, 30)} (
                      {completedCasesCount}/3 completadas)
                    </span>
                  </div>
                </button>
              )}

              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={handleNewGame}
                className={`btn-vg-menu ${!hasSavedGame ? 'primary-continue' : ''}`}
              >
                {hasSavedGame ? <RotateCcw size={19} /> : <Play size={20} />}
                <div className="vg-btn-text">
                  <strong>NUEVA PARTIDA</strong>
                  <span>Empieza la campaña desde la misión 1</span>
                </div>
              </button>

              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={() => handleOpenModalFrom('CASE_SELECT')}
                className="btn-vg-menu"
              >
                <FolderKanban size={19} />
                <div className="vg-btn-text">
                  <strong>SELECCIÓN DE MISIÓN (3 CASOS)</strong>
                  <span>Elige cualquiera de las 3 vacantes universitarias</span>
                </div>
              </button>

              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={() => handleOpenModalFrom('SETTINGS')}
                className="btn-vg-menu"
              >
                <Settings size={19} />
                <div className="vg-btn-text">
                  <strong>CONFIGURACIÓN</strong>
                  <span>Gráficos, sonido, cámara y velocidad del texto</span>
                </div>
              </button>

              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={() => handleOpenModalFrom('GUIDE')}
                className="btn-vg-menu"
              >
                <BookOpen size={19} />
                <div className="vg-btn-text">
                  <strong>LIBRO MANUAL DEL CAZATALENTOS</strong>
                  <span>Guía del Método STAR, Lupa, Citófono y Valores Javerianos</span>
                </div>
              </button>
            </nav>

            <div className="title-dock-footer">
              <span>JaveTalento · v1.0</span>
              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={handleToggleAudio}
                className="btn-hud-icon"
                title={settings.isMuted ? 'Activar sonido' : 'Silenciar sonido'}
              >
                {settings.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </aside>

          {/* BOTTOM-RIGHT BRIEFING & MENTOR CARD OVER LIVE 3D SCENE */}
          <div className="title-screen-right-card">
            <div className="start-mentor-strip">
              <img src={MENTOR_INFO.portraitUrl} alt={MENTOR_INFO.name} />
              <div>
                <span className="doc-kicker">BIENVENIDA A TU OFICINA FRENTE AL SAMÁN</span>
                <strong>
                  {MENTOR_INFO.name} — {MENTOR_INFO.role}
                </strong>
                <p>«{MENTOR_INFO.welcomeMessage}»</p>
              </div>
            </div>

            <div className="controls-showcase-grid">
              <div className="ctrl-item">
                <Eye size={20} />
                <div>
                  <strong>Mira tu oficina</strong>
                  <span>Arrastra con el mouse o el dedo, o usa WASD y las teclas 1–4</span>
                </div>
              </div>
              <div className="ctrl-item">
                <IconLupa size={20} />
                <div>
                  <strong>Lupa [L] y Citófono [T]</strong>
                  <span>Observa al candidato, revisa su hoja de vida y llama a sus referencias</span>
                </div>
              </div>
              <div className="ctrl-item">
                <IconStamp size={20} />
                <div>
                  <strong>Libro [M], STAR y Sellos</strong>
                  <span>Consulta el libro abierto en mesa y estampa el sello oficial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          VIDEO GAME SETTINGS MODAL (CONFIGURACIÓN)
          ======================================================================== */}
      {overlay === 'SETTINGS' && (
        <div className="inhand-overlay-backdrop" onClick={handleCloseModal}>
          <div className="case-selector-modal settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wheel-header">
              <div>
                <span className="wheel-kicker">Ajustes</span>
                <h3>Configuración del Videojuego</h3>
              </div>
              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={handleCloseModal}
                className="btn-putdown-object"
              >
                <X size={16} /> Guardar y Volver [Esc]
              </button>
            </div>

            <div className="settings-options-list">
              {/* 1. Graphics Quality */}
              <div className="setting-row">
                <div className="setting-info">
                  <strong>Calidad gráfica</strong>
                  <span>Ajusta la resolución de sombras, antialiasing y partículas de luz.</span>
                </div>
                <div className="setting-segmented-group">
                  {(['media', 'alta', 'ultra'] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onMouseEnter={() => soundEngine.playHoverTick()}
                      onClick={() => {
                        soundEngine.playButtonClick();
                        updateSettings({ graphicsQuality: q });
                      }}
                      className={`btn-seg-option ${
                        settings.graphicsQuality === q ? 'active' : ''
                      }`}
                    >
                      {q === 'media' && 'Media (Fluido)'}
                      {q === 'alta' && 'Alta (Recomendado)'}
                      {q === 'ultra' && 'Ultra (Máxima)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Master Audio Volume */}
              <div className="setting-row">
                <div className="setting-info">
                  <strong>Volumen de Efectos y Ambiente del Samán</strong>
                  <span>
                    Controla el volumen general del sintetizador de audio ({settings.audioVolume}%).
                  </span>
                </div>
                <div className="setting-slider-wrap">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={settings.isMuted ? 0 : settings.audioVolume}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateSettings({ audioVolume: val, isMuted: val === 0 });
                      soundEngine.playHoverTick();
                    }}
                    className="game-range-slider"
                  />
                  <button
                    type="button"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    onClick={handleToggleAudio}
                    className={`btn-seg-option ${settings.isMuted ? 'active' : ''}`}
                  >
                    {settings.isMuted ? 'Silenciado' : 'Sonido Activo'}
                  </button>
                </div>
              </div>

              {/* 3. Camera Sensitivity */}
              <div className="setting-row">
                <div className="setting-info">
                  <strong>Sensibilidad de cámara</strong>
                  <span>
                    Velocidad de giro al mirar por la oficina (
                    {settings.cameraSensitivity.toFixed(1)}x).
                  </span>
                </div>
                <div className="setting-slider-wrap">
                  <input
                    type="range"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={settings.cameraSensitivity}
                    onChange={(e) => {
                      updateSettings({ cameraSensitivity: parseFloat(e.target.value) });
                      soundEngine.playHoverTick();
                    }}
                    className="game-range-slider"
                  />
                </div>
              </div>

              {/* 4. Dialogue Text Speed */}
              <div className="setting-row">
                <div className="setting-info">
                  <strong>Velocidad de Texto en Entrevista</strong>
                  <span>Ritmo con el que aparecen las respuestas del candidato.</span>
                </div>
                <div className="setting-segmented-group">
                  {(['normal', 'rapido', 'instantaneo'] as const).map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onMouseEnter={() => soundEngine.playHoverTick()}
                      onClick={() => {
                        soundEngine.playButtonClick();
                        updateSettings({ textSpeed: spd });
                      }}
                      className={`btn-seg-option ${settings.textSpeed === spd ? 'active' : ''}`}
                    >
                      {spd === 'normal' && 'Normal'}
                      {spd === 'rapido' && 'Rápido'}
                      {spd === 'instantaneo' && 'Instantáneo'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Fullscreen & Save Management */}
              <div className="setting-row">
                <div className="setting-info">
                  <strong>Pantalla Completa y Partida Guardada</strong>
                  <span>
                    Juega a pantalla completa o reinicia el progreso guardado en el navegador.
                  </span>
                </div>
                <div className="setting-segmented-group">
                  <button
                    type="button"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    onClick={handleToggleFullscreen}
                    className="btn-seg-option"
                  >
                    <Maximize2 size={14} /> Pantalla Completa
                  </button>
                  <button
                    type="button"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    onClick={handleResetSavedData}
                    className="btn-seg-option danger"
                  >
                    <Trash2 size={14} /> Borrar Progreso Guardado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          MISSION SELECTOR OVERLAY
          ======================================================================== */}
      {overlay === 'CASE_SELECT' && (
        <div className="inhand-overlay-backdrop" onClick={handleCloseModal}>
          <div className="case-selector-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wheel-header">
              <div>
                <span className="wheel-kicker">ARCHIVO DE CONVOCATORIAS • EL SAMÁN</span>
                <h3>Selecciona la Misión de Reclutamiento</h3>
              </div>
              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={handleCloseModal}
                className="btn-putdown-object"
              >
                <X size={16} /> Cerrar Selector [Esc]
              </button>
            </div>

            <div className="cases-modal-grid">
              {VACANCY_CASES.map((vc, idx) => {
                const res = caseResults[vc.id];
                return (
                  <div key={vc.id} className="case-modal-card">
                    <span className="doc-kicker">
                      MISIÓN #{vc.number} • {vc.difficulty}
                    </span>
                    <h4>{vc.title}</h4>
                    <p>{vc.urgencyContext}</p>
                    <div className="case-mini-avatars">
                      {vc.candidates.map((c) => (
                        <img key={c.id} src={c.portraitUrl} alt={c.name} title={c.name} />
                      ))}
                    </div>
                    {res && (
                      <div className="case-score-tag">
                        <IconCheckSeal size={15} /> Puntaje obtenido:{' '}
                        <strong>{res.totalScore}/100 pts</strong>
                      </div>
                    )}
                    <button
                      type="button"
                      onMouseEnter={() => soundEngine.playHoverTick()}
                      onClick={() => handleStartCase(idx)}
                      className="btn-enter-3d-office btn-sm-full"
                    >
                      <Play size={15} /> Iniciar Misión #{vc.number}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          CASE DEBRIEF MODAL
          ======================================================================== */}
      {overlay === 'DEBRIEF' && caseResults[currentVacancy.id] && (
        <CaseDebriefModal
          vacancy={currentVacancy}
          result={caseResults[currentVacancy.id]}
          hasNextCase={activeCaseIndex < VACANCY_CASES.length - 1}
          onNextCase={() => handleStartCase(activeCaseIndex + 1)}
          onRetryCase={() => handleStartCase(activeCaseIndex)}
          onFinishCampaign={() => {
            soundEngine.playFanfare();
            setOverlay('DIPLOMA');
          }}
        />
      )}

      {/* ========================================================================
          FINAL DIPLOMA MODAL
          ======================================================================== */}
      {overlay === 'DIPLOMA' && (
        <FinalDiplomaModal
          results={caseResults}
          onBackToMenu={() => {
            soundEngine.playMenuClose();
            setOverlay('PLAYING');
          }}
          onResetAll={() => {
            handleResetSavedData();
            setOverlay('START_MENU');
          }}
        />
      )}

      {/* ========================================================================
          MANUAL DEL CAZATALENTOS: OPEN LEATHER-BOUND FIELD BOOK
          ======================================================================== */}
      {overlay === 'GUIDE' && (
        <div className="inhand-overlay-backdrop" onClick={handleCloseModal}>
          <div className="manual-book" onClick={(e) => e.stopPropagation()}>
            <span className="manual-ribbon" aria-hidden="true" />
            <button
              type="button"
              onMouseEnter={() => soundEngine.playHoverTick()}
              onClick={handleCloseModal}
              className="manual-close"
            >
              <X size={15} /> Cerrar <kbd>Esc</kbd>
            </button>

            <div className="manual-spread">
              {/* LEFT PAGE: TOOLS */}
              <section className="manual-page left">
                <span className="manual-eyebrow">Manual de campo del cazatalentos</span>
                <h2 className="manual-title">Tu escritorio</h2>
                <p className="manual-lead">
                  Cada objeto sobre la mesa es una herramienta de selección. Úsalas todas antes de
                  poner el sello.
                </p>

                <ul className="manual-tools">
                  {MANUAL_TOOLS.map((t) => (
                    <li key={t.name}>
                      <span className="manual-tool-icon">{t.icon}</span>
                      <div>
                        <strong>
                          {t.name} {t.hotkey && <kbd>{t.hotkey}</kbd>}
                        </strong>
                        <p>{t.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="manual-keys">
                  Mira alrededor arrastrando o con <kbd>W</kbd>
                  <kbd>A</kbd>
                  <kbd>S</kbd>
                  <kbd>D</kbd> · vistas rápidas <kbd>1</kbd>–<kbd>4</kbd> · pausa <kbd>Esc</kbd>
                </p>
                <span className="manual-folio">1</span>
              </section>

              {/* RIGHT PAGE: STAR + BIASES + VALUES */}
              <section className="manual-page right">
                <span className="manual-eyebrow">Cómo evaluar</span>
                <h2 className="manual-title">Método S.T.A.R.</h2>

                <ol className="manual-star">
                  {STAR_STEPS.map(([letter, name, desc]) => (
                    <li key={letter}>
                      <span className="star-letter">{letter}</span>
                      <div>
                        <strong>{name}</strong>
                        <p>{desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <h3 className="manual-subtitle">
                  <IconWarningShield size={16} /> Sesgos que debes evitar
                </h3>
                <ul className="manual-bias">
                  <li>
                    <strong>Efecto halo:</strong> dejarse deslumbrar por títulos o publicaciones e
                    ignorar el trato humano.
                  </li>
                  <li>
                    <strong>Sesgo de simpatía:</strong> confundir carisma o «caer bien» con
                    competencia real.
                  </li>
                  <li>
                    <strong>Preguntas invasivas:</strong> edad, estado civil, hijos o planes
                    familiares no se preguntan.
                  </li>
                </ul>

                <div className="manual-values">
                  <IconCheckSeal size={18} />
                  <p>
                    <strong>Cura Personalis y Magis.</strong> El talento ideal une excelencia técnica
                    con calidez humana y trabajo en equipo.
                  </p>
                </div>

                <div className="manual-stamps">
                  <span>
                    <IconStamp size={14} /> Contratar
                  </span>
                  <span className="reject">
                    <IconStampReject size={14} /> Descartar
                  </span>
                </div>
                <span className="manual-folio">2</span>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
