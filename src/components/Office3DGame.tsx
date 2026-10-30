import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  VacancyCase,
  Candidate,
  CandidateMood,
  InterviewQuestion,
  ProfileCriterionOption,
  CVHighlightItem,
  GameSettings
} from '../types/game';
import {
  createWoodTexture,
  createClipboardTexture,
  createOpenCVSheetTexture,
  createDeskMeterTexture,
  createBrassNameplateTexture,
  createCorkboardTexture
} from '../three/DeskTextures';
import {
  buildBankersLamp,
  buildBotanicalPlant,
  buildTuftedArmchair,
  buildExecutivePhone,
  buildPorcelainCoffeeSet,
  buildRoomArchitecture,
  buildAcademicBookcase,
  buildOpenDeskBook,
  buildClipboardProp,
  buildManilaFolderProp,
  buildSpiralNotebookProp
} from '../three/ProceduralModels';
import {
  buildCandidate3DAvatar,
  animateCandidate3DAvatar,
  Candidate3DRig
} from '../three/Candidate3DModel';
import { soundEngine } from '../audio/SoundEngine';
import {
  IconClipboard,
  IconDossier,
  IconLupa,
  IconPhone,
  IconStamp,
  IconStampReject,
  IconBell,
  IconStarBadge,
  IconWarningShield,
  IconCheckSeal,
  IconDialogue,
  IconNotebook,
  IconBolt
} from './GameIcons';
import {
  Hand,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  X,
  ThumbsUp,
  Flag,
  HelpCircle,
  Radio,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export type HeldTool =
  | 'NONE'
  | 'CLIPBOARD'
  | 'OPEN_CV'
  | 'DIALOGUE_WHEEL'
  | 'LUPA'
  | 'PHONE_CALL'
  | 'STAMP_HIRE'
  | 'STAMP_REJECT';

interface AskedRecord {
  questionId: string;
  playerFlag?: 'acierto' | 'alerta';
  pressedFollowUp?: boolean;
}

interface Office3DGameProps {
  vacancy: VacancyCase;
  resetVersion?: number;
  settings: GameSettings;
  isMenuOpen: boolean;
  isMobileHud?: boolean;
  isForcedLandscape?: boolean;
  onOpenManual: () => void;
  onPause: () => void;
  onCompleteCase: (
    selectedCandidateId: string,
    profileScore: number,
    cvScore: number,
    interviewScore: number,
    starAskedCount: number,
    biasesTriggered: number,
    biasesAvoided: number,
    referencesChecked: number,
    lupaUsed: boolean
  ) => void;
}

export const Office3DGame: React.FC<Office3DGameProps> = ({
  vacancy,
  resetVersion = 0,
  settings,
  isMenuOpen,
  isMobileHud = false,
  isForcedLandscape = false,
  onOpenManual: onOpenManualProp,
  onPause,
  onCompleteCase
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Keep parent callbacks in refs so the 3D scene effect never rebuilds when they change identity
  const onOpenManualRef = useRef(onOpenManualProp);
  const onPauseRef = useRef(onPause);
  onOpenManualRef.current = onOpenManualProp;
  onPauseRef.current = onPause;
  const onOpenManual = useCallback(() => onOpenManualRef.current(), []);

  const [activeCandIdx, setActiveCandIdx] = useState<number>(0);
  const activeCandidate: Candidate = vacancy.candidates[activeCandIdx] || vacancy.candidates[0];

  const [heldTool, setHeldTool] = useState<HeldTool>('NONE');
  const [hoveredInteractable, setHoveredInteractable] = useState<{
    id: string;
    label: string;
    hint: string;
  } | null>(null);

  // Profile Clipboard State
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);
  const [revealedProfileIds, setRevealedProfileIds] = useState<string[]>([]);
  const [profileBiasMistakes, setProfileBiasMistakes] = useState<number>(0);

  // CV Annotations State
  const [cvAnnotations, setCvAnnotations] = useState<
    Record<string, 'green_flag' | 'yellow_flag' | 'bias_trap'>
  >({});
  const [cvMistakes, setCvMistakes] = useState<number>(0);

  // Lupa & Phone Reference Tracking
  const [discoveredLupaClues, setDiscoveredLupaClues] = useState<Record<string, string[]>>({});
  const [calledReferences, setCalledReferences] = useState<Record<string, boolean>>({});
  const [lupaUsedEver, setLupaUsedEver] = useState<boolean>(false);

  // Stamped status per candidateId
  const [stampedByCand, setStampedByCand] = useState<
    Record<string, 'HIRED' | 'REJECTED' | null>
  >({});

  // Interview History per candidateId
  const [historyByCand, setHistoryByCand] = useState<Record<string, AskedRecord[]>>({
    [vacancy.candidates[0].id]: [],
    [vacancy.candidates[1].id]: [],
    [vacancy.candidates[2].id]: []
  });

  // Live Speech & Tactical Interrogation State
  const [speechText, setSpeechText] = useState<string>(vacancy.candidates[0].greeting);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [candidateMood, setCandidateMood] = useState<CandidateMood>('neutral');
  const [lastAskedQuestionId, setLastAskedQuestionId] = useState<string | null>(null);
  const [activeFollowUp, setActiveFollowUp] = useState<{
    prompt: string;
    answer: string;
    signal: string;
    pressed: boolean;
  } | null>(null);
  const [liveSignalToast, setLiveSignalToast] = useState<{
    type: 'acierto_fuerte' | 'alerta_riesgo' | 'respuesta_ambigua';
    summary: string;
    valueHighlighted: string;
    pedagogicalNote?: string;
  } | null>(null);

  const [gameToast, setGameToast] = useState<string>(
    '¡Quiubo! Mueve la cámara arrastrando, toma la Lupa [L], abre el Libro en mesa [M], llama al Citófono [T] o interroga al candidato.'
  );
  const [isObjectivesOpen, setIsObjectivesOpen] = useState<boolean>(false);
  const [isDialogueMinimized, setIsDialogueMinimized] = useState<boolean>(false);
  const [showMobileToast, setShowMobileToast] = useState<boolean>(false);
  const initialToastRef = useRef<string>(gameToast);

  // Auto-expand dialogue when candidate says something new
  useEffect(() => {
    setIsDialogueMinimized(false);
  }, [speechText, activeCandIdx]);

  // Show floating toast on mobile whenever gameToast changes after initial greeting
  useEffect(() => {
    if (gameToast === initialToastRef.current) return;
    setShowMobileToast(true);
    const timer = window.setTimeout(() => setShowMobileToast(false), 4500);
    return () => window.clearTimeout(timer);
  }, [gameToast]);

  // Reset state when vacancy changes or a reset is requested
  useEffect(() => {
    setActiveCandIdx(0);
    setHeldTool('NONE');
    setSelectedProfileIds([]);
    setRevealedProfileIds([]);
    setProfileBiasMistakes(0);
    setCvAnnotations({});
    setCvMistakes(0);
    setDiscoveredLupaClues({});
    setCalledReferences({});
    setLupaUsedEver(false);
    setStampedByCand({});
    setHistoryByCand({
      [vacancy.candidates[0].id]: [],
      [vacancy.candidates[1].id]: [],
      [vacancy.candidates[2].id]: []
    });
    lastTypedSpeechRef.current = null;
    setSpeechText(vacancy.candidates[0].greeting);
    setCandidateMood('neutral');
    setLastAskedQuestionId(null);
    setActiveFollowUp(null);
    setLiveSignalToast(null);
    setGameToast(
      '¡Quiubo! Mueve la cámara arrastrando, toma la Lupa [L], abre el Libro en mesa [M], llama al Citófono [T] o interroga al candidato.'
    );
    threeRefs.current.targetYaw = 0;
    threeRefs.current.targetPitch = -0.16;
    threeRefs.current.targetFov = 50;
    threeRefs.current.candWalkProgress = 0;
    threeRefs.current.doorAngle = 1.2;
  }, [vacancy, resetVersion]);

  // Typewriter effect honoring settings.textSpeed. The visible text is written straight
  // into the dialogue <span> so typing does not re-render the whole game every tick.
  // Each line is typed only once, so closing a menu does not replay it.
  const lastTypedSpeechRef = useRef<string | null>(null);
  const displayedSpeechRef = useRef<string>('');
  const speechSpanRef = useRef<HTMLSpanElement | null>(null);
  const typingTimerRef = useRef<number | null>(null);

  const writeSpeech = useCallback((text: string) => {
    displayedSpeechRef.current = text;
    if (speechSpanRef.current) speechSpanRef.current.textContent = text;
  }, []);

  const attachSpeechSpan = useCallback((el: HTMLSpanElement | null) => {
    speechSpanRef.current = el;
    if (el) el.textContent = displayedSpeechRef.current;
  }, []);

  const stopTyping = useCallback(() => {
    if (typingTimerRef.current !== null) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  }, []);

  const skipTyping = useCallback(() => {
    stopTyping();
    writeSpeech(speechText);
    setIsSpeaking(false);
  }, [speechText, stopTyping, writeSpeech]);

  useEffect(() => {
    if (isMenuOpen || lastTypedSpeechRef.current === speechText) {
      writeSpeech(speechText);
      setIsSpeaking(false);
      return;
    }
    lastTypedSpeechRef.current = speechText;

    if (settings.textSpeed === 'instantaneo') {
      writeSpeech(speechText);
      setIsSpeaking(false);
      return;
    }

    writeSpeech('');
    setIsSpeaking(true);
    let idx = 0;
    const total = speechText.length;
    const pitch = activeCandidate.voicePitch || 210;
    const stepDelay = settings.textSpeed === 'rapido' ? 10 : 20;
    const charsPerTick = settings.textSpeed === 'rapido' ? 4 : 2;

    typingTimerRef.current = window.setInterval(() => {
      idx += charsPerTick;
      if (idx >= total) {
        writeSpeech(speechText);
        setIsSpeaking(false);
        stopTyping();
      } else {
        writeSpeech(speechText.slice(0, idx));
        if (idx % 6 === 0) {
          soundEngine.playVoiceBlip(pitch);
        }
      }
    }, stepDelay);

    return stopTyping;
  }, [speechText, activeCandidate.voicePitch, settings.textSpeed, isMenuOpen, writeSpeech, stopTyping]);

  const getCandidateMetrics = useCallback(
    (candId: string) => {
      const cand = vacancy.candidates.find((c) => c.id === candId) || vacancy.candidates[0];
      const records = historyByCand[candId] || [];
      let tech = 50;
      let culture = 50;
      let aciertos = 0;
      let alertas = 0;
      let evidencesCount = 0;

      // 1. Interview questions, follow-up presses & manual flags
      for (const rec of records) {
        const q = vacancy.questions.find((item) => item.id === rec.questionId);
        if (!q) continue;
        const resp = q.responses[candId];
        if (!resp) continue;

        tech += resp.technicalDelta * 14;
        culture += resp.culturalDelta * 14;
        evidencesCount++;
        if (resp.signalType === 'acierto_fuerte') aciertos++;
        if (resp.signalType === 'alerta_riesgo') alertas++;

        if (rec.pressedFollowUp) {
          evidencesCount++;
          if (cand.trueSuitability === 'IDEAL') {
            tech += 6;
            culture += 6;
            aciertos++;
          } else if (cand.trueSuitability === 'TECH_TRAP') {
            culture -= 8;
            alertas++;
          } else {
            tech -= 8;
            alertas++;
          }
        }

        if (rec.playerFlag === 'acierto') {
          tech += 3;
          culture += 3;
        } else if (rec.playerFlag === 'alerta') {
          tech -= 3;
          culture -= 3;
        }
      }

      // 2. CV Highlights annotations for this candidate
      for (const hl of cand.cvHighlights) {
        const mark = cvAnnotations[hl.id];
        if (!mark) continue;
        evidencesCount++;
        if (mark === 'green_flag') {
          if (hl.classification === 'green_flag') {
            if (cand.trueSuitability === 'IDEAL') {
              tech += 7;
              culture += 7;
            } else if (cand.trueSuitability === 'TECH_TRAP') {
              tech += 8;
            } else {
              culture += 6;
            }
            aciertos++;
          } else {
            tech -= 4;
            culture -= 4;
            alertas++;
          }
        } else if (mark === 'yellow_flag') {
          if (hl.classification === 'yellow_flag') {
            if (cand.trueSuitability === 'TECH_TRAP') {
              culture -= 10;
            } else if (cand.trueSuitability === 'CHARISMA_TRAP') {
              tech -= 10;
            }
            alertas++;
          } else {
            tech -= 4;
          }
        } else if (mark === 'bias_trap') {
          if (hl.classification === 'bias_trap') {
            culture += 4;
            aciertos++;
          }
        }
      }

      // 3. Lupa clues discovered for this candidate
      const clues = discoveredLupaClues[candId] || [];
      for (const clue of clues) {
        evidencesCount++;
        const isBodyClue = clue === cand.lupaClues.bodyLanguage;
        if (cand.trueSuitability === 'IDEAL') {
          if (isBodyClue) culture += 7;
          else tech += 7;
          aciertos++;
        } else if (cand.trueSuitability === 'TECH_TRAP') {
          culture -= 9;
          alertas++;
        } else {
          tech -= 9;
          alertas++;
        }
      }

      // 4. Phone reference call for this candidate
      if (calledReferences[candId]) {
        evidencesCount++;
        if (cand.phoneReference.verdict === 'positive') {
          tech += 9;
          culture += 9;
          aciertos++;
        } else if (cand.trueSuitability === 'TECH_TRAP') {
          culture -= 12;
          alertas++;
        } else {
          tech -= 12;
          alertas++;
        }
      }

      tech = Math.round(Math.max(8, Math.min(100, tech)));
      culture = Math.round(Math.max(8, Math.min(100, culture)));

      return {
        tech,
        culture,
        aciertos,
        alertas,
        questionsCount: records.length,
        evidencesCount
      };
    },
    [
      vacancy.candidates,
      vacancy.questions,
      historyByCand,
      cvAnnotations,
      discoveredLupaClues,
      calledReferences
    ]
  );

  const getCandidateMetricsRef = useRef(getCandidateMetrics);
  getCandidateMetricsRef.current = getCandidateMetrics;

  // Sync React state with Three.js loop
  const stateRef = useRef({
    heldTool,
    activeCandIdx,
    activeCandidate,
    selectedProfileIds,
    cvAnnotations,
    stampedByCand,
    isSpeaking,
    candidateMood,
    calledReferences,
    lupaUsedEver,
    isMenuOpen,
    isForcedLandscape,
    cameraSensitivity: settings.cameraSensitivity
  });
  useEffect(() => {
    stateRef.current = {
      heldTool,
      activeCandIdx,
      activeCandidate,
      selectedProfileIds,
      cvAnnotations,
      stampedByCand,
      isSpeaking,
      candidateMood,
      calledReferences,
      lupaUsedEver,
      isMenuOpen,
      isForcedLandscape,
      cameraSensitivity: settings.cameraSensitivity
    };
  }, [
    heldTool,
    activeCandIdx,
    activeCandidate,
    selectedProfileIds,
    cvAnnotations,
    stampedByCand,
    isSpeaking,
    candidateMood,
    calledReferences,
    lupaUsedEver,
    isMenuOpen,
    isForcedLandscape,
    settings.cameraSensitivity
  ]);

  const threeRefs = useRef<{
    cameraYaw: number;
    cameraPitch: number;
    targetYaw: number;
    targetPitch: number;
    targetFov: number;
    cameraShake: number;
    doorAngle: number;
    candWalkProgress: number;
    bellPress: number;
    stampSlamAnim: number;
    phoneHandsetLift: number;
    lampOn: boolean;
    lastHoveredId: string | null;
    lampLight?: THREE.SpotLight;
    clipboardMesh?: THREE.Mesh;
    openCvMesh?: THREE.Mesh;
    deskMeterMesh?: THREE.Mesh;
    nameplateMesh?: THREE.Mesh;
    candidateSlotGroup?: THREE.Group;
    candidateRig?: Candidate3DRig;
    interactablesList?: THREE.Object3D[];
    doorPivot?: THREE.Group;
    stampHireGroup?: THREE.Group;
    stampRejectGroup?: THREE.Group;
    lupaGroup?: THREE.Group;
    phoneHandset?: THREE.Group;
    bellPlunger?: THREE.Mesh;
    mouseWorldOnDesk: THREE.Vector3;
  }>({
    cameraYaw: 0,
    cameraPitch: -0.16,
    targetYaw: 0,
    targetPitch: -0.16,
    targetFov: 50,
    cameraShake: 0,
    doorAngle: 0,
    candWalkProgress: 1,
    bellPress: 0,
    stampSlamAnim: 0,
    phoneHandsetLift: 0,
    lampOn: true,
    lastHoveredId: null,
    mouseWorldOnDesk: new THREE.Vector3(0, 0.84, 0.35)
  });

  /**
   * Mounts or swaps the articulated 3D Character Rig when activeCandidate changes
   */
  const mountCandidate3DRig = useCallback((cand: Candidate) => {
    const slot = threeRefs.current.candidateSlotGroup;
    const interactables = threeRefs.current.interactablesList;
    if (!slot || !interactables) return;

    // Remove previous candidate interactive meshes from raycaster list
    if (threeRefs.current.candidateRig) {
      const oldMeshes = new Set(threeRefs.current.candidateRig.interactiveMeshes);
      for (let i = interactables.length - 1; i >= 0; i--) {
        if (oldMeshes.has(interactables[i])) {
          interactables.splice(i, 1);
        }
      }
      slot.clear();
    }

    const newRig = buildCandidate3DAvatar(cand.id);
    newRig.interactiveMeshes.forEach((m) => {
      m.userData = {
        interactableId: 'CANDIDATE_AVATAR',
        label: cand.name,
        hint: 'Interrogar (Método STAR) o inspeccionar lenguaje corporal con la Lupa [L]'
      };
      interactables.push(m);
    });

    slot.add(newRig.root);
    threeRefs.current.candidateRig = newRig;
  }, []);

  // Adjust FOV zoom based on held inspection mode
  useEffect(() => {
    if (heldTool === 'CLIPBOARD' || heldTool === 'OPEN_CV') {
      threeRefs.current.targetFov = 39;
    } else if (heldTool === 'DIALOGUE_WHEEL' || heldTool === 'PHONE_CALL') {
      threeRefs.current.targetFov = 44;
    } else {
      threeRefs.current.targetFov = 50;
    }
    threeRefs.current.phoneHandsetLift = heldTool === 'PHONE_CALL' ? 1 : 0;
  }, [heldTool]);

  // Update 3D Clipboard Texture
  useEffect(() => {
    const mesh = threeRefs.current.clipboardMesh;
    if (!mesh) return;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    const oldTex = mat.map;
    mat.map = createClipboardTexture(vacancy, selectedProfileIds);
    mat.needsUpdate = true;
    oldTex?.dispose();
  }, [vacancy, selectedProfileIds]);

  // Update 3D Open CV Sheet Texture
  useEffect(() => {
    const mesh = threeRefs.current.openCvMesh;
    if (!mesh) return;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    const oldTex = mat.map;
    mat.map = createOpenCVSheetTexture(
      activeCandidate,
      cvAnnotations,
      stampedByCand[activeCandidate.id] || null
    );
    mat.needsUpdate = true;
    oldTex?.dispose();
  }, [activeCandidate, cvAnnotations, stampedByCand]);

  // Update 3D Desk Monitor & Brass Nameplate Textures
  useEffect(() => {
    const meterMesh = threeRefs.current.deskMeterMesh;
    if (meterMesh) {
      const m = getCandidateMetrics(activeCandidate.id);
      const mat = meterMesh.material as THREE.MeshStandardMaterial;
      const oldTex = mat.map;
      mat.map = createDeskMeterTexture(
        activeCandidate.name,
        m.tech,
        m.culture,
        m.questionsCount,
        m.evidencesCount
      );
      mat.needsUpdate = true;
      oldTex?.dispose();
    }

    const plateMesh = threeRefs.current.nameplateMesh;
    if (plateMesh) {
      const mat = plateMesh.material as THREE.MeshStandardMaterial;
      const oldTex = mat.map;
      mat.map = createBrassNameplateTexture(activeCandidate.name, activeCandidate.roleTitle);
      mat.needsUpdate = true;
      oldTex?.dispose();
    }
  }, [
    activeCandidate,
    historyByCand,
    cvAnnotations,
    discoveredLupaClues,
    calledReferences,
    getCandidateMetrics
  ]);

  // Swap 3D Character Rig whenever activeCandidate changes
  useEffect(() => {
    mountCandidate3DRig(activeCandidate);
  }, [activeCandidate, mountCandidate3DRig]);

  const focusCamera = (yaw: number, pitch: number) => {
    soundEngine.playButtonClick();
    threeRefs.current.targetYaw = yaw;
    threeRefs.current.targetPitch = pitch;
  };

  const callCandidateIntoOffice = useCallback(
    (nextIndex: number) => {
      soundEngine.playBellDing();
      setTimeout(() => soundEngine.playDoorOpen(), 200);

      threeRefs.current.bellPress = 1.0;
      threeRefs.current.doorAngle = 1.2;
      threeRefs.current.candWalkProgress = 0.0;

      const nextCand = vacancy.candidates[nextIndex];
      setActiveCandIdx(nextIndex);
      setSpeechText(nextCand.greeting);
      setCandidateMood('neutral');
      setLastAskedQuestionId(null);
      setActiveFollowUp(null);
      setLiveSignalToast(null);
      setGameToast(`¡Adelante! ${nextCand.name} entra por la puerta y toma asiento frente a ti.`);
      threeRefs.current.targetYaw = 0;
      threeRefs.current.targetPitch = -0.16;
    },
    [vacancy.candidates]
  );

  const triggerLupaDiscovery = useCallback((targetType: 'CANDIDATE' | 'CV') => {
    soundEngine.playLupaScan();
    setLupaUsedEver(true);
    const cand = stateRef.current.activeCandidate;
    const clue =
      targetType === 'CANDIDATE' ? cand.lupaClues.bodyLanguage : cand.lupaClues.secretCvNote;

    setDiscoveredLupaClues((prev) => {
      const existing = prev[cand.id] || [];
      if (existing.includes(clue)) return prev;
      return { ...prev, [cand.id]: [...existing, clue] };
    });

    setGameToast(clue);
    setHeldTool('NONE');
  }, []);

  const triggerPhoneReferenceCall = useCallback(() => {
    soundEngine.playPhoneDialAndRing();
    const cand = stateRef.current.activeCandidate;
    setCalledReferences((prev) => ({ ...prev, [cand.id]: true }));
    threeRefs.current.targetYaw = -0.22;
    threeRefs.current.targetPitch = -0.32;
    setHeldTool('PHONE_CALL');
    setGameToast(
      `Llamando a ${cand.phoneReference.contactName} (${cand.phoneReference.contactRole})...`
    );
  }, []);

  const executeStampOnDeskFolder = useCallback(
    (stampType: 'HIRED' | 'REJECTED') => {
      const cand = stateRef.current.activeCandidate;
      soundEngine.playStampThud();
      threeRefs.current.cameraShake = 0.055;
      threeRefs.current.stampSlamAnim = 1.0;

      setStampedByCand((prev) => ({
        ...prev,
        [cand.id]: stampType
      }));
      setHeldTool('NONE');

      if (stampType === 'REJECTED') {
        setCandidateMood('nervous');
        setSpeechText(
          'Listo jefe, entiendo la decisión. Muchas gracias por la oportunidad acá en la Javeriana.'
        );
        setGameToast(
          `Estampaste DESCARTADO en la carpeta de ${cand.name}. Toca la campana para hacer pasar al siguiente.`
        );
        return;
      }

      setCandidateMood('enthusiastic');
      setSpeechText(
        '¡Uy, qué alegría tan grande! Le prometo que voy a meterle toda el alma y dejar en alto el nombre de la Javeriana.'
      );
      setGameToast(`¡Estampaste CONTRATADO a ${cand.name}! Cerrando proceso de selección...`);

      setTimeout(() => {
        const validProfileCount = vacancy.profileOptions.filter(
          (o) => o.isCorrect && stateRef.current.selectedProfileIds.includes(o.id)
        ).length;
        const pScore = Math.max(
          55,
          Math.round((validProfileCount / vacancy.requiredCorrectCount) * 100) -
            profileBiasMistakes * 15
        );

        const classifiedCount = Object.keys(stateRef.current.cvAnnotations).length;
        const cScore = Math.max(55, Math.min(100, 62 + classifiedCount * 6 - cvMistakes * 10));

        let starCount = 0;
        let biasedCount = 0;
        Object.values(historyByCand).forEach((list) => {
          list.forEach((r) => {
            const q = vacancy.questions.find((item) => item.id === r.questionId);
            if (q?.quality === 'STAR_OPTIMAL') starCount++;
            if (q?.quality === 'BIASED_ILLEGAL') biasedCount++;
          });
        });

        const iScore = Math.min(100, Math.max(45, 70 + starCount * 9 - biasedCount * 20));
        const biasesAvoided = vacancy.candidates.reduce((acc, c) => {
          const trap = c.cvHighlights.find((h) => h.classification === 'bias_trap');
          if (trap && stateRef.current.cvAnnotations[trap.id] === 'bias_trap') return acc + 1;
          return acc;
        }, 0);

        const refsCount = Object.keys(stateRef.current.calledReferences).length;

        onCompleteCase(
          cand.id,
          pScore,
          cScore,
          iScore,
          starCount,
          profileBiasMistakes + biasedCount,
          biasesAvoided,
          refsCount,
          stateRef.current.lupaUsedEver
        );
      }, 1200);
    },
    [vacancy, profileBiasMistakes, cvMistakes, historyByCand, onCompleteCase]
  );

  const executeStampOnDeskFolderRef = useRef(executeStampOnDeskFolder);
  executeStampOnDeskFolderRef.current = executeStampOnDeskFolder;

  // ============================================================================
  // THREE.JS FULLSCREEN 3D ARCHITECTURAL OFFICE SCENE
  // ============================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1A100A');
    scene.fog = new THREE.FogExp2('#1F130B', 0.036);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      30
    );
    camera.position.set(0, 1.56, 1.4);

    const isHighQuality = settings.graphicsQuality !== 'media';
    const maxPixelRatio =
      settings.graphicsQuality === 'ultra'
        ? Math.min(window.devicePixelRatio, 2.25)
        : settings.graphicsQuality === 'alta'
        ? Math.min(window.devicePixelRatio, 1.5)
        : 1.0;

    const renderer = new THREE.WebGLRenderer({
      antialias: isHighQuality,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(maxPixelRatio);
    renderer.shadowMap.enabled = isHighQuality;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const interactables: THREE.Object3D[] = [];
    threeRefs.current.interactablesList = interactables;

    const registerInteractable = (
      obj: THREE.Object3D,
      id: string,
      label: string,
      hint: string
    ) => {
      obj.userData = { interactableId: id, label, hint };
      interactables.push(obj);
    };

    // --- LIGHTING ---
    scene.add(new THREE.AmbientLight('#FFF1D6', 0.92));

    const sunLight = new THREE.DirectionalLight('#FFE4B0', 1.65);
    sunLight.position.set(0.5, 3.8, -2.6);
    sunLight.castShadow = isHighQuality;
    const shadowRes = settings.graphicsQuality === 'ultra' ? 2048 : 1024;
    sunLight.shadow.mapSize.width = shadowRes;
    sunLight.shadow.mapSize.height = shadowRes;
    scene.add(sunLight);

    // Key light illuminating the 3D Candidate's face and blazer
    const candidateKeyLight = new THREE.PointLight('#FFF2D6', 1.15, 4.5);
    candidateKeyLight.position.set(0.25, 1.65, 0.25);
    scene.add(candidateKeyLight);

    const deskFillLight = new THREE.PointLight('#FFD79A', 0.95, 6);
    deskFillLight.position.set(0, 2.3, 0.45);
    scene.add(deskFillLight);

    const lampSpot = new THREE.SpotLight('#FFCF75', 2.6, 3.8, Math.PI / 3, 0.55, 1.2);
    lampSpot.position.set(-0.82, 1.34, 0.12);
    lampSpot.target.position.set(0, 0.8, 0.38);
    lampSpot.castShadow = isHighQuality;
    scene.add(lampSpot);
    scene.add(lampSpot.target);
    threeRefs.current.lampLight = lampSpot;

    // --- MATERIALS & TEXTURES ---
    const mahoganyTex = createWoodTexture('#3E2213', '#221007');
    const walnutTex = createWoodTexture('#5C3720', '#381E0E');
    const texLoader = new THREE.TextureLoader();

    const frameMat = new THREE.MeshStandardMaterial({ map: mahoganyTex, roughness: 0.4 });
    const walnutMat = new THREE.MeshStandardMaterial({ map: walnutTex, roughness: 0.5 });
    const wallMat = new THREE.MeshStandardMaterial({ color: '#E8DAC2', roughness: 0.82 });
    const brassMat = new THREE.MeshStandardMaterial({
      color: '#D8A648',
      metalness: 0.82,
      roughness: 0.2
    });

    // --- PARQUET FLOOR & WOVEN ARTISAN RUG ---
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), walnutMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const rugBorder = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 2.25),
      new THREE.MeshStandardMaterial({ color: '#4E1814', roughness: 0.9 })
    );
    rugBorder.rotation.x = -Math.PI / 2;
    rugBorder.position.set(0, 0.004, -0.5);
    scene.add(rugBorder);

    const rugGeo = new THREE.PlaneGeometry(2.76, 2.02);
    const rugMat = new THREE.MeshStandardMaterial({ color: '#6E261E', roughness: 0.88 });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.006, -0.5);
    scene.add(rug);

    // --- EXTERIOR SAMÁN COURTYARD PANORAMA & VOLUMETRIC GOD RAYS ---
    const samanSkyMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });
    texLoader.load('/assets/bg_campus_saman.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      samanSkyMat.map = tex;
      samanSkyMat.needsUpdate = true;
    });
    const samanSkyPlane = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 4.0), samanSkyMat);
    samanSkyPlane.position.set(0, 1.9, -3.15);
    scene.add(samanSkyPlane);

    // Volumetric Sunbeam Cone slanting from the window
    const sunRayGeo = new THREE.ConeGeometry(1.65, 3.6, 16, 1, true);
    const sunRayMat = new THREE.MeshBasicMaterial({
      color: '#FFF0C2',
      transparent: true,
      opacity: 0.062,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const sunRayMesh = new THREE.Mesh(sunRayGeo, sunRayMat);
    sunRayMesh.position.set(0, 1.95, -0.85);
    sunRayMesh.rotation.x = Math.PI / 3.4;
    scene.add(sunRayMesh);

    // --- ROOM WALLS, WAINSCOTING & ARCHED WINDOW ---
    const leftWallPillar = new THREE.Mesh(new THREE.BoxGeometry(1.7, 4, 0.2), wallMat);
    leftWallPillar.position.set(-2.35, 2, -2.1);
    scene.add(leftWallPillar);

    const rightWallPillar = new THREE.Mesh(new THREE.BoxGeometry(1.7, 4, 0.2), wallMat);
    rightWallPillar.position.set(2.35, 2, -2.1);
    scene.add(rightWallPillar);

    const windowSillLow = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.92, 0.24), frameMat);
    windowSillLow.position.set(0, 0.46, -2.1);
    scene.add(windowSillLow);

    const windowHeaderTop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.7, 0.24), frameMat);
    windowHeaderTop.position.set(0, 3.65, -2.1);
    scene.add(windowHeaderTop);

    const mullionV1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.5, 0.12), frameMat);
    mullionV1.position.set(-0.75, 2.1, -2.05);
    scene.add(mullionV1);
    const mullionV2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.5, 0.12), frameMat);
    mullionV2.position.set(0.75, 2.1, -2.05);
    scene.add(mullionV2);
    const mullionH = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.08, 0.12), frameMat);
    mullionH.position.set(0, 2.55, -2.05);
    scene.add(mullionH);

    const sideWallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 6), wallMat);
    sideWallLeft.position.set(-3.1, 2, 0.5);
    scene.add(sideWallLeft);

    const sideWallRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 6), wallMat);
    sideWallRight.position.set(3.1, 2, 0.5);
    scene.add(sideWallRight);

    // Architectural Boiserie, Moldings & Framed Diplomas
    buildRoomArchitecture(scene, frameMat, walnutMat, brassMat);

    // --- HIGH-CRAFT POTTED TROPICAL PLANTS (MONSTERA / SAMÁN SAPLINGS) ---
    scene.add(buildBotanicalPlant(-1.56, -1.62));
    scene.add(buildBotanicalPlant(1.56, -1.62));

    // --- LEFT WALL: HIGH-CRAFT 3D ACADEMIC BOOKCASE & 3D DETECTIVE CORKBOARD ---
    const bookcaseGroup = buildAcademicBookcase(frameMat, walnutMat, brassMat);
    scene.add(bookcaseGroup);

    // 3D Corkboard on Left Wall near Player
    const corkMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.15, 0.85),
      new THREE.MeshStandardMaterial({
        map: createCorkboardTexture(vacancy.title),
        roughness: 0.8
      })
    );
    corkMesh.position.set(-2.95, 1.72, 0.32);
    corkMesh.rotation.y = Math.PI / 2;
    scene.add(corkMesh);
    registerInteractable(
      corkMesh,
      'CLIPBOARD',
      'Pizarra de Valores Javerianos y Perfil',
      'Abrir Tablero del Perfil del Cargo [P]'
    );

    // --- RIGHT WALL SWINGING 3D OFFICE DOOR ---
    const doorPivot = new THREE.Group();
    doorPivot.position.set(2.95, 0, -1.25);
    const doorSlab = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.35, 1.05), frameMat);
    doorSlab.position.set(0, 1.175, 0.525);
    doorPivot.add(doorSlab);

    const doorPanelUpper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.85, 0.76), walnutMat);
    doorPanelUpper.position.set(0, 1.62, 0.525);
    doorPivot.add(doorPanelUpper);

    const doorPanelLower = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.82, 0.76), walnutMat);
    doorPanelLower.position.set(0, 0.62, 0.525);
    doorPivot.add(doorPanelLower);

    const doorHandle = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 14), brassMat);
    doorHandle.position.set(-0.08, 1.05, 0.92);
    doorPivot.add(doorHandle);
    scene.add(doorPivot);
    threeRefs.current.doorPivot = doorPivot;
    registerInteractable(
      doorSlab,
      'OFFICE_DOOR',
      'Puerta de la Oficina',
      'Hacer pasar al siguiente candidato a entrevista'
    );

    // --- HIGH-CRAFT TUFTED EXECUTIVE GUEST ARMCHAIR & ARTICULATED 3D CANDIDATE AVATAR ---
    const chairGroup = buildTuftedArmchair(frameMat, brassMat);
    scene.add(chairGroup);

    const candidateSlotGroup = new THREE.Group();
    scene.add(candidateSlotGroup);
    threeRefs.current.candidateSlotGroup = candidateSlotGroup;

    // Immediately mount the articulated 3D character rig for the active candidate!
    mountCandidate3DRig(stateRef.current.activeCandidate);

    // --- DETAILED MAHOGANY EXECUTIVE DESK ---
    const deskMat = new THREE.MeshStandardMaterial({
      map: mahoganyTex,
      roughness: 0.3,
      metalness: 0.08
    });
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.64, 0.09, 1.24), deskMat);
    deskTop.position.set(0, 0.76, 0.36);
    deskTop.receiveShadow = true;
    deskTop.castShadow = true;
    scene.add(deskTop);

    const deskBrassTrim = new THREE.Mesh(new THREE.BoxGeometry(2.66, 0.022, 1.255), brassMat);
    deskBrassTrim.position.set(0, 0.76, 0.36);
    scene.add(deskBrassTrim);

    const deskPedestalL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.74, 1.1), deskMat);
    deskPedestalL.position.set(-0.95, 0.37, 0.36);
    scene.add(deskPedestalL);

    const deskPedestalR = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.74, 1.1), deskMat);
    deskPedestalR.position.set(0.95, 0.37, 0.36);
    scene.add(deskPedestalR);

    const deskModesty = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.68, 0.08), deskMat);
    deskModesty.position.set(0, 0.39, -0.16);
    scene.add(deskModesty);

    // Leather Desk Blotter Mat with Gold Trim
    const blotterBorder = new THREE.Mesh(
      new THREE.BoxGeometry(0.96, 0.01, 0.66),
      brassMat
    );
    blotterBorder.position.set(0, 0.808, 0.44);
    scene.add(blotterBorder);

    const blotter = new THREE.Mesh(
      new THREE.BoxGeometry(0.93, 0.013, 0.63),
      new THREE.MeshStandardMaterial({ color: '#172A1F', roughness: 0.72 })
    );
    blotter.position.set(0, 0.81, 0.44);
    blotter.receiveShadow = true;
    scene.add(blotter);

    // --- 3D BRASS NAMEPLATE AT FRONT OF DESK ---
    const nameplateGroup = new THREE.Group();
    nameplateGroup.position.set(0, 0.84, -0.04);
    nameplateGroup.rotation.x = -0.25;
    const plateBlock = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.11, 0.06), frameMat);
    nameplateGroup.add(plateBlock);
    const nameplateFace = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.1),
      new THREE.MeshStandardMaterial({
        map: createBrassNameplateTexture(
          stateRef.current.activeCandidate.name,
          stateRef.current.activeCandidate.roleTitle
        ),
        roughness: 0.3,
        metalness: 0.3
      })
    );
    nameplateFace.position.z = 0.032;
    nameplateGroup.add(nameplateFace);
    scene.add(nameplateGroup);
    threeRefs.current.nameplateMesh = nameplateFace;

    // --- OBJECT 1: 3D HARDBOARD CLIPBOARD (PERFIL DEL CARGO) ---
    const clipboardPaperMat = new THREE.MeshStandardMaterial({
      map: createClipboardTexture(vacancy, stateRef.current.selectedProfileIds),
      roughness: 0.78
    });
    const {
      group: clipboardGroup,
      paperMesh: clipboardPaper,
      interactiveMeshes: clipboardMeshes
    } = buildClipboardProp(clipboardPaperMat);
    clipboardGroup.position.set(-0.82, 0.812, 0.5);
    clipboardGroup.rotation.y = 0.24;
    scene.add(clipboardGroup);
    threeRefs.current.clipboardMesh = clipboardPaper;
    clipboardMeshes.forEach((m) =>
      registerInteractable(
        m,
        'CLIPBOARD',
        'Tablero del Perfil del Cargo [P]',
        'Tomar en tus manos para fijar los criterios del perfil'
      )
    );

    // --- OBJECT 2: 3 MANILA CANDIDATE FOLDERS IN WOODEN TRAY ---
    const trayBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.34), frameMat);
    trayBase.position.set(-0.86, 0.82, 0.02);
    trayBase.castShadow = true;
    scene.add(trayBase);

    const folderColors = ['#E9CF9F', '#DDBF8C', '#EEDAB2'];
    const folderLabels = ['#2F6FA8', '#C2453A', '#3C8D5A'];
    vacancy.candidates.forEach((cand, idx) => {
      const { group: folderGroup, interactiveMeshes: folderMeshes } = buildManilaFolderProp(
        folderColors[idx % 3],
        folderLabels[idx % 3]
      );
      folderGroup.position.set(-0.86 + idx * 0.012, 0.836 + idx * 0.016, 0.03 + idx * 0.012);
      folderGroup.rotation.y = 0.1 - idx * 0.07;
      scene.add(folderGroup);
      folderMeshes.forEach((m) =>
        registerInteractable(
          m,
          `CAND_FOLDER_${idx}`,
          `Expediente #${idx + 1}: ${cand.name}`,
          `Llamar a ${cand.name} y abrir su carpeta en mesa`
        )
      );
    });

    // --- OBJECT 2B: SPIRAL INTERVIEW NOTEBOOK ("LIBRETA DE PREGUNTAS") ---
    const { group: notebookGroup, interactiveMeshes: notebookMeshes } = buildSpiralNotebookProp();
    notebookGroup.position.set(0.46, 0.812, 0.6);
    notebookGroup.rotation.y = -0.12;
    scene.add(notebookGroup);
    notebookMeshes.forEach((m) =>
      registerInteractable(
        m,
        'QUESTION_NOTEBOOK',
        'Libreta de Preguntas STAR [E]',
        'Abrir la libreta para entrevistar al candidato'
      )
    );

    // --- OBJECT 3: OPEN CV FOLDER IN CENTER OF DESK ---
    const openCvMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.72, 0.50),
      new THREE.MeshStandardMaterial({
        map: createOpenCVSheetTexture(
          stateRef.current.activeCandidate,
          stateRef.current.cvAnnotations,
          stateRef.current.stampedByCand[stateRef.current.activeCandidate.id] || null
        ),
        roughness: 0.75
      })
    );
    openCvMesh.rotation.x = -Math.PI / 2;
    openCvMesh.position.set(-0.05, 0.819, 0.45);
    openCvMesh.receiveShadow = true;
    scene.add(openCvMesh);
    threeRefs.current.openCvMesh = openCvMesh;
    registerInteractable(
      openCvMesh,
      'OPEN_CV',
      'Hoja de Vida Abierta en Mesa [C]',
      'Tomar para clasificar hallazgos, usar la Lupa o estampar Sello'
    );

    // --- OBJECT 4: HIGH-CRAFT 3D OPEN HARDCOVER BOOK ("MANUAL DEL CAZATALENTOS") ---
    const { bookGroup: deskBookGroup, interactiveMeshes: deskBookMeshes } = buildOpenDeskBook(brassMat);
    deskBookGroup.position.set(0.6, 0.808, 0.32);
    deskBookGroup.rotation.y = -0.22;
    scene.add(deskBookGroup);
    deskBookMeshes.forEach((m) =>
      registerInteractable(
        m,
        'DESK_BOOK',
        'Libro Abierto: Manual del Cazatalentos [M]',
        'Abrir el Manual de Campo con claves del Método STAR y Valores Javerianos'
      )
    );

    // --- OBJECT 5: DETAILED 3D BRASS MAGNIFYING GLASS ("LUPA DEL CAZATALENTOS") ---
    const lupaGroup = new THREE.Group();
    lupaGroup.position.set(-0.48, 0.835, 0.54);
    lupaGroup.rotation.y = -0.45;

    const lupaRim = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.011, 16, 32), brassMat);
    lupaRim.rotation.x = Math.PI / 2;
    lupaRim.castShadow = true;
    lupaGroup.add(lupaRim);

    const lupaInnerBezel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.068, 0.016, 28, 1, true),
      brassMat
    );
    lupaGroup.add(lupaInnerBezel);

    const lupaLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.064, 0.064, 0.006, 28),
      new THREE.MeshStandardMaterial({
        color: '#C7EAFC',
        transparent: true,
        opacity: 0.46,
        roughness: 0.08,
        metalness: 0.25
      })
    );
    lupaGroup.add(lupaLens);

    const lupaCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.013, 0.032, 16),
      brassMat
    );
    lupaCollar.rotation.x = Math.PI / 2;
    lupaCollar.position.z = 0.082;
    lupaGroup.add(lupaCollar);

    const lupaHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.011, 0.016, 0.13, 16),
      frameMat
    );
    lupaHandle.rotation.x = Math.PI / 2;
    lupaHandle.position.z = 0.145;
    lupaHandle.castShadow = true;
    lupaGroup.add(lupaHandle);

    const lupaPommel = new THREE.Mesh(new THREE.SphereGeometry(0.017, 14, 14), brassMat);
    lupaPommel.position.z = 0.212;
    lupaGroup.add(lupaPommel);

    scene.add(lupaGroup);
    threeRefs.current.lupaGroup = lupaGroup;

    [lupaRim, lupaLens, lupaCollar, lupaHandle, lupaPommel].forEach((m) =>
      registerInteractable(
        m,
        'LUPA_TOOL',
        'Lupa del Cazatalentos [L]',
        'Tomar la Lupa para descubrir lenguaje corporal o notas ocultas en el CV'
      )
    );

    // --- OBJECT 6: DESK MONITOR ("JAVETALENTO OS") ---
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(-0.46, 0.96, 0.01);
    monitorGroup.rotation.y = 0.28;
    monitorGroup.rotation.x = -0.18;

    const monitorStand = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.07, 0.14, 16), brassMat);
    monitorStand.position.set(0, -0.15, -0.02);
    monitorGroup.add(monitorStand);

    const monitorBezel = new THREE.Mesh(new THREE.BoxGeometry(0.49, 0.30, 0.038), frameMat);
    monitorBezel.castShadow = true;
    monitorGroup.add(monitorBezel);

    const monitorGoldTrim = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.28, 0.04), brassMat);
    monitorGroup.add(monitorGoldTrim);

    const initialMetrics = getCandidateMetricsRef.current(stateRef.current.activeCandidate.id);
    const meterScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.45, 0.26),
      new THREE.MeshStandardMaterial({
        map: createDeskMeterTexture(
          stateRef.current.activeCandidate.name,
          initialMetrics.tech,
          initialMetrics.culture,
          initialMetrics.questionsCount,
          initialMetrics.evidencesCount
        ),
        roughness: 0.28,
        emissive: '#081526',
        emissiveIntensity: 0.42
      })
    );
    meterScreen.position.z = 0.022;
    monitorGroup.add(meterScreen);
    scene.add(monitorGroup);
    threeRefs.current.deskMeterMesh = meterScreen;
    registerInteractable(
      meterScreen,
      'CANDIDATE_AVATAR',
      'Radar JaveTalento OS [E]',
      'Abrir rueda de preguntas STAR para evaluar al candidato'
    );

    // --- OBJECT 7: HIGH-CRAFT 3D EXECUTIVE INTERCOM ("CITÓFONO DE REFERENCIAS") ---
    const { phoneGroup, handsetGroup, interactiveMeshes: phoneMeshes } = buildExecutivePhone(brassMat);
    phoneGroup.position.set(0.62, 0.806, 0.06);
    phoneGroup.rotation.y = -0.26;
    scene.add(phoneGroup);
    threeRefs.current.phoneHandset = handsetGroup;

    phoneMeshes.forEach((m) =>
      registerInteractable(
        m,
        'DESK_PHONE',
        'Citófono de Referencias Laborales [T]',
        'Llamar al jefe anterior del candidato en Cali para verificar si dice la verdad'
      )
    );

    // --- OBJECT 8: BRASS DESK BELL ("LLAMAR CANDIDATO") ---
    const bellGroup = new THREE.Group();
    bellGroup.position.set(0.34, 0.81, 0.04);
    const bellBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.088, 0.022, 24),
      new THREE.MeshStandardMaterial({ color: '#1F1B18', roughness: 0.45 })
    );
    bellGroup.add(bellBase);

    const bellDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.068, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.55),
      brassMat
    );
    bellDome.position.y = 0.01;
    bellDome.castShadow = true;
    bellGroup.add(bellDome);

    const bellPlunger = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.014, 0.032, 14),
      brassMat
    );
    bellPlunger.position.y = 0.082;
    bellGroup.add(bellPlunger);
    scene.add(bellGroup);
    threeRefs.current.bellPlunger = bellPlunger;
    registerInteractable(
      bellDome,
      'DESK_BELL',
      'Campana de Bronce (Siguiente Candidato)',
      'Tocar timbre para que entre el siguiente candidato por la puerta'
    );

    // --- OBJECT 9: PHYSICAL RUBBER STAMPS (GREEN HIRE & RED REJECT) & INK PAD ---
    const inkPadTray = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.018, 0.34),
      new THREE.MeshStandardMaterial({ color: '#1F1A17', roughness: 0.5 })
    );
    inkPadTray.position.set(0.92, 0.808, 0.5);
    scene.add(inkPadTray);

    const greenInkFelt = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.022, 0.12),
      new THREE.MeshStandardMaterial({ color: '#1A5E23', roughness: 0.9 })
    );
    greenInkFelt.position.set(0.92, 0.812, 0.42);
    scene.add(greenInkFelt);

    const redInkFelt = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.022, 0.12),
      new THREE.MeshStandardMaterial({ color: '#7D1B1B', roughness: 0.9 })
    );
    redInkFelt.position.set(0.92, 0.812, 0.58);
    scene.add(redInkFelt);

    const createStampGroup = (colorHex: string, pos: THREE.Vector3) => {
      const g = new THREE.Group();
      g.position.copy(pos);
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 0.032, 0.068),
        new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.32 })
      );
      base.position.y = 0.016;
      base.castShadow = true;
      g.add(base);

      const brassCollar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.026, 0.03, 0.018, 18),
        brassMat
      );
      brassCollar.position.y = 0.038;
      g.add(brassCollar);

      const handleStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.026, 0.075, 18),
        frameMat
      );
      handleStem.position.y = 0.075;
      g.add(handleStem);

      const handleKnob = new THREE.Mesh(new THREE.SphereGeometry(0.038, 18, 18), frameMat);
      handleKnob.position.y = 0.12;
      handleKnob.castShadow = true;
      g.add(handleKnob);
      scene.add(g);
      return { group: g, meshes: [base, brassCollar, handleStem, handleKnob] };
    };

    const hireStamp = createStampGroup('#1F7A2B', new THREE.Vector3(0.92, 0.81, 0.42));
    threeRefs.current.stampHireGroup = hireStamp.group;
    hireStamp.meshes.forEach((m) =>
      registerInteractable(
        m,
        'STAMP_HIRE',
        'Sello Verde: CONTRATAR CANDIDATO',
        'Tomar sello en tu mano y estamparlo sobre la Hoja de Vida abierta'
      )
    );

    const rejectStamp = createStampGroup('#A62626', new THREE.Vector3(0.92, 0.81, 0.58));
    threeRefs.current.stampRejectGroup = rejectStamp.group;
    rejectStamp.meshes.forEach((m) =>
      registerInteractable(
        m,
        'STAMP_REJECT',
        'Sello Rojo: DESCARTAR CANDIDATO',
        'Tomar sello en tu mano y marcar expediente como descartado'
      )
    );

    // --- OBJECT 10: HIGH-CRAFT BANKER'S LAMP & PORCELAIN COFFEE SET ---
    const lampGroup = buildBankersLamp(brassMat);
    lampGroup.position.set(-0.94, 0.806, -0.06);
    scene.add(lampGroup);
    lampGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        registerInteractable(
          child,
          'DESK_LAMP',
          'Lámpara de Banquero en Bronce',
          'Encender / Apagar luz focal sobre el escritorio'
        );
      }
    });

    const { coffeeGroup, interactiveMeshes: coffeeMeshes } = buildPorcelainCoffeeSet(brassMat);
    coffeeGroup.position.set(0.95, 0.806, 0.14);
    scene.add(coffeeGroup);
    coffeeMeshes.forEach((m) =>
      registerInteractable(
        m,
        'COFFEE_MUG',
        'Tinto Colombiano del Samán',
        'Tomar un sorbo de café y recordar claves del proceso'
      )
    );

    // --- FLOATING SUNLIGHT MOTES ---
    const particlesCount = settings.graphicsQuality === 'media' ? 25 : 55;
    const pPositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 4.4;
      pPositions[i * 3 + 1] = 0.8 + Math.random() * 2.5;
      pPositions[i * 3 + 2] = -1.8 + Math.random() * 2.5;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const dustParticles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: '#FFEAB3',
        size: 0.026,
        transparent: true,
        opacity: 0.6
      })
    );
    scene.add(dustParticles);

    // --- RAYCASTER & CONTROLS ---
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const deskPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.85);

    let isDraggingLook = false;
    let dragDistance = 0;
    let prevX = 0;
    let prevY = 0;

    const toGameCoords = (clientX: number, clientY: number) => {
      if (stateRef.current.isForcedLandscape) {
        const physW = window.innerWidth || 1;
        const physH = window.innerHeight || 1;
        return {
          x: clientY,
          y: physW - clientX,
          width: physH,
          height: physW
        };
      }
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
        width: rect.width || container.clientWidth || 1,
        height: rect.height || container.clientHeight || 1
      };
    };

    const updatePointerAndRay = (clientX: number, clientY: number) => {
      if (stateRef.current.isMenuOpen) return;
      const pt = toGameCoords(clientX, clientY);
      pointer.x = (pt.x / pt.width) * 2 - 1;
      pointer.y = -(pt.y / pt.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(deskPlane, threeRefs.current.mouseWorldOnDesk);

      // While dragging the camera only the desk point matters; skip the object raycast
      const hits = isDraggingLook ? [] : raycaster.intersectObjects(interactables, false);
      if (hits.length > 0) {
        const hitObj = hits[0].object;
        const { interactableId, label, hint } = hitObj.userData;
        if (threeRefs.current.lastHoveredId !== interactableId) {
          threeRefs.current.lastHoveredId = interactableId;
          soundEngine.playHoverTick();
          setHoveredInteractable({ id: interactableId, label, hint });
        }
        renderer.domElement.style.cursor = 'pointer';
      } else {
        if (threeRefs.current.lastHoveredId !== null) {
          threeRefs.current.lastHoveredId = null;
          setHoveredInteractable(null);
        }
        renderer.domElement.style.cursor = isDraggingLook ? 'grabbing' : 'grab';
      }
    };

    // Pointer moves are coalesced and raycast once per animation frame
    let pendingPointer: { x: number; y: number } | null = null;

    const onPointerDown = (e: PointerEvent) => {
      if (stateRef.current.isMenuOpen) return;
      isDraggingLook = true;
      dragDistance = 0;
      const pt = toGameCoords(e.clientX, e.clientY);
      prevX = pt.x;
      prevY = pt.y;
      updatePointerAndRay(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (stateRef.current.isMenuOpen) return;
      if (isDraggingLook) {
        const pt = toGameCoords(e.clientX, e.clientY);
        const dx = pt.x - prevX;
        const dy = pt.y - prevY;
        dragDistance += Math.abs(dx) + Math.abs(dy);
        prevX = pt.x;
        prevY = pt.y;

        const touchBoost = e.pointerType === 'touch' ? 1.35 : 1.0;
        const sens = 0.0038 * (stateRef.current.cameraSensitivity || 1.0) * touchBoost;
        threeRefs.current.targetYaw = Math.max(
          -0.72,
          Math.min(0.72, threeRefs.current.targetYaw - dx * sens)
        );
        threeRefs.current.targetPitch = Math.max(
          -0.55,
          Math.min(0.28, threeRefs.current.targetPitch - dy * sens)
        );
      }
      pendingPointer = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDraggingLook) return;
      if (stateRef.current.isMenuOpen) {
        isDraggingLook = false;
        return;
      }
      const tapThreshold = e.pointerType === 'touch' ? 16 : 10;
      const wasClick = dragDistance < tapThreshold;
      isDraggingLook = false;
      updatePointerAndRay(e.clientX, e.clientY);

      if (!wasClick) return;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactables, false);
      const currentHeld = stateRef.current.heldTool;

      // 1. If holding the 3D Magnifying Glass (LUPA) in hand:
      if (currentHeld === 'LUPA') {
        if (hits.length > 0) {
          const hitId = hits[0].object.userData.interactableId;
          if (hitId === 'CANDIDATE_AVATAR') {
            triggerLupaDiscovery('CANDIDATE');
            return;
          } else if (hitId === 'OPEN_CV' || hitId?.startsWith('CAND_FOLDER_')) {
            triggerLupaDiscovery('CV');
            return;
          }
        }
        soundEngine.playGrabObject();
        setHeldTool('NONE');
        setGameToast('Dejaste la Lupa de nuevo sobre el escritorio.');
        return;
      }

      // 2. If holding a physical Rubber Stamp in hand:
      if (currentHeld === 'STAMP_HIRE' || currentHeld === 'STAMP_REJECT') {
        if (hits.length > 0 && hits[0].object.userData.interactableId === 'OPEN_CV') {
          executeStampOnDeskFolderRef.current(currentHeld === 'STAMP_HIRE' ? 'HIRED' : 'REJECTED');
        } else {
          soundEngine.playGrabObject();
          setHeldTool('NONE');
          setGameToast('Dejaste el sello de caucho en su soporte.');
        }
        return;
      }

      if (hits.length === 0) return;
      const hitId: string = hits[0].object.userData.interactableId;

      if (hitId === 'CLIPBOARD') {
        soundEngine.playGrabObject();
        threeRefs.current.targetYaw = 0.28;
        threeRefs.current.targetPitch = -0.34;
        setHeldTool('CLIPBOARD');
      } else if (hitId === 'OPEN_CV') {
        soundEngine.playPaperFlip();
        threeRefs.current.targetYaw = 0;
        threeRefs.current.targetPitch = -0.4;
        setHeldTool('OPEN_CV');
      } else if (hitId === 'DESK_BOOK') {
        soundEngine.playPaperFlip();
        onOpenManual();
      } else if (hitId.startsWith('CAND_FOLDER_')) {
        const idx = parseInt(hitId.replace('CAND_FOLDER_', ''), 10);
        callCandidateIntoOffice(idx);
      } else if (hitId === 'DESK_BELL' || hitId === 'OFFICE_DOOR') {
        const nextIdx = (stateRef.current.activeCandIdx + 1) % vacancy.candidates.length;
        callCandidateIntoOffice(nextIdx);
      } else if (hitId === 'CANDIDATE_AVATAR' || hitId === 'QUESTION_NOTEBOOK') {
        soundEngine.playMenuOpen();
        threeRefs.current.targetYaw = 0;
        threeRefs.current.targetPitch = -0.05;
        setHeldTool('DIALOGUE_WHEEL');
      } else if (hitId === 'LUPA_TOOL') {
        soundEngine.playGrabObject();
        setHeldTool('LUPA');
        setGameToast(
          'Tienes la Lupa en la mano. Haz clic sobre el candidato o sobre su hoja de vida abierta para descubrir pistas ocultas.'
        );
      } else if (hitId === 'DESK_PHONE') {
        triggerPhoneReferenceCall();
      } else if (hitId === 'STAMP_HIRE') {
        soundEngine.playGrabObject();
        threeRefs.current.targetYaw = 0;
        threeRefs.current.targetPitch = -0.36;
        setHeldTool('STAMP_HIRE');
        setGameToast(
          'Tienes el Sello CONTRATADO en la mano. Haz clic sobre la Hoja de Vida abierta en el centro para estamparlo.'
        );
      } else if (hitId === 'STAMP_REJECT') {
        soundEngine.playGrabObject();
        threeRefs.current.targetYaw = 0;
        threeRefs.current.targetPitch = -0.36;
        setHeldTool('STAMP_REJECT');
        setGameToast(
          'Tienes el Sello DESCARTADO en la mano. Haz clic sobre la Hoja de Vida abierta para marcarlo.'
        );
      } else if (hitId === 'DESK_LAMP') {
        soundEngine.playLampClick();
        threeRefs.current.lampOn = !threeRefs.current.lampOn;
        if (threeRefs.current.lampLight) {
          threeRefs.current.lampLight.intensity = threeRefs.current.lampOn ? 2.6 : 0;
        }
        setGameToast(
          threeRefs.current.lampOn ? 'Lámpara de banquero encendida.' : 'Lámpara de banquero apagada.'
        );
      } else if (hitId === 'COFFEE_MUG') {
        soundEngine.playCoffeeSip();
        setGameToast(
          '¡Qué buen tinto! Recuerda: usa la Lupa [L], revisa el Libro [M] y llama al Citófono [T] antes de usar el sello.'
        );
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.isMenuOpen) return;
      const step = 0.08 * (stateRef.current.cameraSensitivity || 1.0);
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        threeRefs.current.targetYaw = Math.min(0.72, threeRefs.current.targetYaw + step);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        threeRefs.current.targetYaw = Math.max(-0.72, threeRefs.current.targetYaw - step);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        threeRefs.current.targetPitch = Math.min(0.28, threeRefs.current.targetPitch + step);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        threeRefs.current.targetPitch = Math.max(-0.55, threeRefs.current.targetPitch - step);
      } else if (e.key === 'Escape') {
        if (stateRef.current.heldTool === 'NONE') {
          onPauseRef.current();
        } else {
          soundEngine.playMenuClose();
          setHeldTool('NONE');
        }
      } else if (e.key === 'l' || e.key === 'L') {
        soundEngine.playGrabObject();
        setHeldTool((prev) => (prev === 'LUPA' ? 'NONE' : 'LUPA'));
      } else if (e.key === 't' || e.key === 'T') {
        triggerPhoneReferenceCall();
      } else if (e.key === 'm' || e.key === 'M') {
        soundEngine.playPaperFlip();
        onOpenManual();
      } else if (e.key === 'p' || e.key === 'P') {
        soundEngine.playGrabObject();
        setHeldTool((prev) => (prev === 'CLIPBOARD' ? 'NONE' : 'CLIPBOARD'));
      } else if (e.key === 'c' || e.key === 'C') {
        soundEngine.playPaperFlip();
        setHeldTool((prev) => (prev === 'OPEN_CV' ? 'NONE' : 'OPEN_CV'));
      } else if (e.key === 'e' || e.key === 'E') {
        soundEngine.playMenuOpen();
        setHeldTool((prev) => (prev === 'DIALOGUE_WHEEL' ? 'NONE' : 'DIALOGUE_WHEEL'));
      } else if (e.key === '1') {
        focusCamera(0, -0.05);
      } else if (e.key === '2') {
        focusCamera(0, -0.38);
      } else if (e.key === '3') {
        focusCamera(0.32, -0.32);
      } else if (e.key === '4') {
        focusCamera(-0.32, -0.32);
      }
    };

    const onPointerCancel = () => {
      isDraggingLook = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
    window.addEventListener('keydown', onKeyDown);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(container);
    }

    // --- STATIC SCENERY: compute matrices once instead of every frame ---
    const dynamicRoots = new Set<THREE.Object3D>([
      candidateSlotGroup,
      doorPivot,
      handsetGroup,
      bellPlunger,
      lupaGroup,
      hireStamp.group,
      rejectStamp.group,
      dustParticles
    ]);
    const freezeStatic = (obj: THREE.Object3D) => {
      if (dynamicRoots.has(obj)) return;
      obj.updateMatrix();
      obj.matrixAutoUpdate = false;
      obj.children.forEach(freezeStatic);
    };
    scene.children.forEach(freezeStatic);

    // --- 60FPS ANIMATION LOOP ---
    let animId = 0;
    const clock = new THREE.Clock();
    const tmpTarget = new THREE.Vector3();
    const lupaRest = new THREE.Vector3(-0.48, 0.835, 0.54);
    const hireRest = new THREE.Vector3(0.92, 0.81, 0.42);
    const rejectRest = new THREE.Vector3(0.92, 0.81, 0.58);

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const tRef = threeRefs.current;

      if (pendingPointer) {
        updatePointerAndRay(pendingPointer.x, pendingPointer.y);
        pendingPointer = null;
      }

      // When Main Menu is open, gently orbit the 3D camera so the office feels alive!
      if (stateRef.current.isMenuOpen) {
        tRef.targetYaw = Math.sin(elapsed * 0.35) * 0.24 - 0.08;
        tRef.targetPitch = -0.14 + Math.cos(elapsed * 0.25) * 0.04;
      }

      tRef.cameraYaw += (tRef.targetYaw - tRef.cameraYaw) * 0.1;
      tRef.cameraPitch += (tRef.targetPitch - tRef.cameraPitch) * 0.1;

      if (Math.abs(camera.fov - tRef.targetFov) > 0.05) {
        camera.fov += (tRef.targetFov - camera.fov) * 0.12;
        camera.updateProjectionMatrix();
      }

      let shakeX = 0;
      let shakeY = 0;
      if (tRef.cameraShake > 0.001) {
        shakeX = (Math.random() - 0.5) * tRef.cameraShake;
        shakeY = (Math.random() - 0.5) * tRef.cameraShake;
        tRef.cameraShake *= 0.84;
      }

      camera.rotation.order = 'YXZ';
      camera.rotation.y = tRef.cameraYaw + shakeX;
      camera.rotation.x = tRef.cameraPitch + shakeY;

      if (tRef.doorPivot) {
        tRef.doorPivot.rotation.y += (tRef.doorAngle - tRef.doorPivot.rotation.y) * 0.08;
        if (tRef.doorAngle > 0.02 && tRef.candWalkProgress > 0.85) {
          tRef.doorAngle *= 0.92;
        }
      }

      if (tRef.bellPlunger && tRef.bellPress > 0.01) {
        tRef.bellPlunger.position.y = 0.082 - tRef.bellPress * 0.018;
        tRef.bellPress *= 0.85;
      }

      if (tRef.phoneHandset) {
        const targetY = tRef.phoneHandsetLift > 0.5 ? 0.16 : 0.068;
        const targetRotZ = tRef.phoneHandsetLift > 0.5 ? 0.35 : 0;
        tRef.phoneHandset.position.y += (targetY - tRef.phoneHandset.position.y) * 0.15;
        tRef.phoneHandset.rotation.z += (targetRotZ - tRef.phoneHandset.rotation.z) * 0.15;
      }

      // Animate Articulated 3D Candidate Avatar!
      if (tRef.candWalkProgress < 1) {
        tRef.candWalkProgress = Math.min(1, tRef.candWalkProgress + 0.028);
      }
      if (tRef.candidateRig) {
        animateCandidate3DAvatar(
          tRef.candidateRig,
          elapsed,
          stateRef.current.isSpeaking,
          stateRef.current.candidateMood,
          tRef.cameraYaw,
          tRef.candWalkProgress
        );
      }

      const currentHeld = stateRef.current.heldTool;
      const slamOffset = tRef.stampSlamAnim > 0.01 ? -tRef.stampSlamAnim * 0.11 : 0;
      if (tRef.stampSlamAnim > 0.01) tRef.stampSlamAnim *= 0.8;

      if (tRef.lupaGroup) {
        if (currentHeld === 'LUPA') {
          const target = tRef.mouseWorldOnDesk;
          tRef.lupaGroup.position.lerp(
            tmpTarget.set(
              Math.max(-0.6, Math.min(0.6, target.x)),
              1.02,
              Math.max(-0.2, Math.min(0.75, target.z))
            ),
            0.25
          );
          tRef.lupaGroup.rotation.x = 0.45;
        } else {
          tRef.lupaGroup.position.lerp(lupaRest, 0.18);
          tRef.lupaGroup.rotation.x = 0;
        }
      }

      if (tRef.stampHireGroup) {
        if (currentHeld === 'STAMP_HIRE') {
          const target = tRef.mouseWorldOnDesk;
          tRef.stampHireGroup.position.lerp(
            tmpTarget.set(
              Math.max(-0.5, Math.min(0.6, target.x)),
              0.94 + slamOffset,
              Math.max(0.15, Math.min(0.75, target.z))
            ),
            0.25
          );
        } else {
          tRef.stampHireGroup.position.lerp(hireRest, 0.18);
        }
      }

      if (tRef.stampRejectGroup) {
        if (currentHeld === 'STAMP_REJECT') {
          const target = tRef.mouseWorldOnDesk;
          tRef.stampRejectGroup.position.lerp(
            tmpTarget.set(
              Math.max(-0.5, Math.min(0.6, target.x)),
              0.94 + slamOffset,
              Math.max(0.15, Math.min(0.75, target.z))
            ),
            0.25
          );
        } else {
          tRef.stampRejectGroup.position.lerp(rejectRest, 0.18);
        }
      }

      dustParticles.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      resizeObserver?.disconnect();
      renderer.dispose();
    };
  }, [
    vacancy,
    settings.graphicsQuality,
    mountCandidate3DRig,
    callCandidateIntoOffice,
    triggerLupaDiscovery,
    triggerPhoneReferenceCall,
    onOpenManual
  ]);

  // ============================================================================
  // INTERACTION HANDLERS
  // ============================================================================
  const handleToggleProfileCriterion = (opt: ProfileCriterionOption) => {
    if (!revealedProfileIds.includes(opt.id)) {
      setRevealedProfileIds((prev) => [...prev, opt.id]);
    }
    if (opt.isBiasTrap) {
      soundEngine.playBiasAlert();
      threeRefs.current.cameraShake = 0.035;
      if (!revealedProfileIds.includes(opt.id)) {
        setProfileBiasMistakes((c) => c + 1);
      }
      setGameToast(`Alerta de Sesgo (${opt.biasType}): ${opt.pedagogicalNote}`);
      return;
    }

    if (selectedProfileIds.includes(opt.id)) {
      soundEngine.playPaperFlip();
      setSelectedProfileIds((prev) => prev.filter((id) => id !== opt.id));
    } else {
      soundEngine.playPenCheck();
      setSelectedProfileIds((prev) => [...prev, opt.id]);
    }
  };

  const handleMarkCVHighlight = (
    item: CVHighlightItem,
    choice: 'green_flag' | 'yellow_flag' | 'bias_trap'
  ) => {
    const isCorrect = item.classification === choice;
    setCvAnnotations((prev) => ({ ...prev, [item.id]: choice }));
    if (isCorrect) {
      soundEngine.playPositiveSignal();
    } else {
      soundEngine.playBiasAlert();
      setCvMistakes((m) => m + 1);
    }
  };

  const handleAskQuestion = (q: InterviewQuestion) => {
    const resp = q.responses[activeCandidate.id];
    if (!resp) return;

    if (q.quality === 'BIASED_ILLEGAL') {
      soundEngine.playBiasAlert();
      threeRefs.current.cameraShake = 0.04;
    } else if (resp.signalType === 'acierto_fuerte') {
      soundEngine.playPositiveSignal();
    } else if (resp.signalType === 'alerta_riesgo') {
      soundEngine.playBiasAlert();
    } else {
      soundEngine.playPaperFlip();
    }

    setHistoryByCand((prev) => {
      const list = prev[activeCandidate.id] || [];
      if (list.some((r) => r.questionId === q.id)) return prev;
      return {
        ...prev,
        [activeCandidate.id]: [...list, { questionId: q.id }]
      };
    });

    setLastAskedQuestionId(q.id);
    setSpeechText(resp.answerText);
    setCandidateMood(resp.mood);
    if (resp.followUpPrompt && resp.followUpAnswer && resp.followUpSignal) {
      setActiveFollowUp({
        prompt: resp.followUpPrompt,
        answer: resp.followUpAnswer,
        signal: resp.followUpSignal,
        pressed: false
      });
    } else {
      setActiveFollowUp(null);
    }

    setLiveSignalToast({
      type: resp.signalType,
      summary: resp.signalSummary,
      valueHighlighted: resp.javeValueHighlighted,
      pedagogicalNote: q.pedagogicalExplanation
    });

    setHeldTool('NONE');
    threeRefs.current.targetYaw = 0;
    threeRefs.current.targetPitch = -0.16;
  };

  const handlePressFollowUp = () => {
    if (!activeFollowUp) return;
    soundEngine.playPressCandidate();
    threeRefs.current.cameraShake = 0.03;
    setSpeechText(activeFollowUp.answer);
    setActiveFollowUp({ ...activeFollowUp, pressed: true });
    if (lastAskedQuestionId) {
      setHistoryByCand((prev) => {
        const list = prev[activeCandidate.id] || [];
        return {
          ...prev,
          [activeCandidate.id]: list.map((item) =>
            item.questionId === lastAskedQuestionId ? { ...item, pressedFollowUp: true } : item
          )
        };
      });
    }
    setGameToast(`Contra-pregunta: ${activeFollowUp.signal}`);
  };

  const handleFlagLastAnswer = (flag: 'acierto' | 'alerta') => {
    if (!lastAskedQuestionId) return;
    soundEngine.playPenCheck();
    setHistoryByCand((prev) => {
      const list = prev[activeCandidate.id] || [];
      return {
        ...prev,
        [activeCandidate.id]: list.map((item) =>
          item.questionId === lastAskedQuestionId ? { ...item, playerFlag: flag } : item
        )
      };
    });
    setGameToast(
      flag === 'acierto'
        ? `Anotaste un Acierto STAR en el expediente de ${activeCandidate.name}.`
        : `Anotaste una Alerta de Riesgo en el expediente de ${activeCandidate.name}.`
    );
  };

  const validProfilePinned = vacancy.profileOptions.filter(
    (o) => o.isCorrect && selectedProfileIds.includes(o.id)
  ).length;
  const activeMetrics = getCandidateMetrics(activeCandidate.id);
  const currentHistory = historyByCand[activeCandidate.id] || [];
  const candClues = discoveredLupaClues[activeCandidate.id] || [];

  const closeHeld = () => {
    soundEngine.playMenuClose();
    setHeldTool('NONE');
  };
  const toggleClipboard = () => {
    soundEngine.playGrabObject();
    setHeldTool(heldTool === 'CLIPBOARD' ? 'NONE' : 'CLIPBOARD');
  };
  const toggleCvFolder = () => {
    soundEngine.playPaperFlip();
    setHeldTool(heldTool === 'OPEN_CV' ? 'NONE' : 'OPEN_CV');
  };
  const toggleNotebook = () => {
    soundEngine.playMenuOpen();
    threeRefs.current.targetYaw = 0;
    threeRefs.current.targetPitch = -0.04;
    setHeldTool(heldTool === 'DIALOGUE_WHEEL' ? 'NONE' : 'DIALOGUE_WHEEL');
  };
  const toggleLupa = () => {
    soundEngine.playGrabObject();
    setHeldTool(heldTool === 'LUPA' ? 'NONE' : 'LUPA');
  };
  const takeStamp = (stamp: 'STAMP_HIRE' | 'STAMP_REJECT') => {
    soundEngine.playGrabObject();
    threeRefs.current.targetYaw = 0;
    threeRefs.current.targetPitch = -0.38;
    setHeldTool(heldTool === stamp ? 'NONE' : stamp);
  };
  const callNextCandidate = () => {
    callCandidateIntoOffice((activeCandIdx + 1) % vacancy.candidates.length);
  };

  const cvNoteDiscovered = candClues.includes(activeCandidate.lupaClues.secretCvNote);
  const reviewedCount = Object.keys(cvAnnotations).length;
  const totalHighlights = vacancy.candidates.reduce((n, c) => n + c.cvHighlights.length, 0);
  const activeStamp = stampedByCand[activeCandidate.id];
  const doneObjectivesCount =
    (validProfilePinned >= vacancy.requiredCorrectCount ? 1 : 0) +
    (reviewedCount >= totalHighlights ? 1 : 0) +
    (currentHistory.length >= 3 ? 1 : 0) +
    (calledReferences[activeCandidate.id] ? 1 : 0);

  const moodLabel: Record<CandidateMood, string> = {
    enthusiastic: 'Entusiasta',
    thoughtful: 'Analítico',
    confident: 'Seguro',
    nervous: 'Nervioso',
    neutral: 'Atento'
  };

  return (
    <div className="game3d-viewport-wrapper">
      {/* FULLSCREEN 3D WEBGL CANVAS */}
      <div ref={mountRef} className="game3d-canvas-mount" />
      <div className="hud-vignette" aria-hidden="true" />

      {/* FLOATING TOAST ON MOBILE WHEN OBJECTIVES PANEL IS COLLAPSED */}
      {!isMenuOpen && isMobileHud && showMobileToast && !isObjectivesOpen && heldTool === 'NONE' && (
        <div
          className="hud-mobile-toast"
          role="status"
          onClick={() => setShowMobileToast(false)}
        >
          <IconLupa size={14} />
          <span>{gameToast}</span>
          <X size={13} />
        </div>
      )}

      {/* CONTEXT PROMPT WHEN HOVERING A 3D OBJECT */}
      {!isMenuOpen && !isMobileHud && hoveredInteractable && heldTool === 'NONE' && (
        <div className="hud-prompt">
          <span className="hud-prompt-icon">
            <Hand size={15} />
          </span>
          <strong>{hoveredInteractable.label}</strong>
          <span className="hud-prompt-hint">{hoveredInteractable.hint}</span>
        </div>
      )}

      {/* HELD LUPA */}
      {!isMenuOpen && heldTool === 'LUPA' && (
        <div className="hud-held-card held-lupa">
          <span className="held-icon">
            <IconLupa size={22} />
          </span>
          <div className="held-copy">
            <strong>Lupa en la mano</strong>
            <span>Haz clic en el candidato o en su hoja de vida.</span>
          </div>
          <div className="held-actions">
            <button
              type="button"
              onMouseEnter={() => soundEngine.playHoverTick()}
              onClick={() => triggerLupaDiscovery('CANDIDATE')}
              className="btn-ui primary"
            >
              Lenguaje corporal
            </button>
            <button
              type="button"
              onMouseEnter={() => soundEngine.playHoverTick()}
              onClick={() => triggerLupaDiscovery('CV')}
              className="btn-ui primary"
            >
              Nota oculta del CV
            </button>
            <button type="button" onClick={closeHeld} className="btn-ui ghost">
              Soltar <kbd>Esc</kbd>
            </button>
          </div>
        </div>
      )}

      {/* HELD RUBBER STAMP */}
      {!isMenuOpen && (heldTool === 'STAMP_HIRE' || heldTool === 'STAMP_REJECT') && (
        <div
          className={`hud-held-card ${heldTool === 'STAMP_HIRE' ? 'held-hire' : 'held-reject'}`}
        >
          <span className="held-icon">
            {heldTool === 'STAMP_HIRE' ? <IconStamp size={22} /> : <IconStampReject size={22} />}
          </span>
          <div className="held-copy">
            <strong>
              Sello {heldTool === 'STAMP_HIRE' ? 'CONTRATADO' : 'DESCARTADO'} en la mano
            </strong>
            <span>Haz clic sobre la hoja de vida abierta para estamparlo.</span>
          </div>
          <div className="held-actions">
            <button
              type="button"
              onMouseEnter={() => soundEngine.playHoverTick()}
              onClick={() =>
                executeStampOnDeskFolder(heldTool === 'STAMP_HIRE' ? 'HIRED' : 'REJECTED')
              }
              className="btn-ui primary"
            >
              Estampar a {activeCandidate.name.split(' ').slice(0, 2).join(' ')}
            </button>
            <button type="button" onClick={closeHeld} className="btn-ui ghost">
              Soltar <kbd>Esc</kbd>
            </button>
          </div>
        </div>
      )}

      {/* SPEAKERPHONE REFERENCE CALL */}
      {!isMenuOpen && heldTool === 'PHONE_CALL' && (
        <div className="hud-phone-card">
          <div className="phone-head">
            <span className="phone-live">
              <span className="phone-live-dot" /> En línea
            </span>
            <div className="phone-who">
              <strong>{activeCandidate.phoneReference.contactName}</strong>
              <span>{activeCandidate.phoneReference.contactRole}</span>
            </div>
            <div className="phone-wave" aria-hidden="true">
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.11}s` }} />
              ))}
            </div>
            <button type="button" onClick={closeHeld} className="btn-ui danger">
              Colgar <kbd>Esc</kbd>
            </button>
          </div>
          <p className="phone-transcript">{activeCandidate.phoneReference.transcript}</p>
          <div
            className={`phone-verdict ${
              activeCandidate.phoneReference.verdict === 'positive' ? 'is-ok' : 'is-warn'
            }`}
          >
            <Radio size={14} />
            <span>
              {activeCandidate.phoneReference.verdict === 'positive'
                ? 'La referencia respalda sus logros con hechos.'
                : 'La referencia contradice o advierte riesgos frente a su hoja de vida.'}
            </span>
          </div>
        </div>
      )}

      {/* CANDIDATE DIALOGUE BOX */}
      {!isMenuOpen && heldTool === 'NONE' && (
        <section
          className={`hud-dialogue ${isDialogueMinimized ? 'is-minimized' : ''}`}
          aria-live="polite"
        >
          <div className="dialogue-nameplate">
            <img src={activeCandidate.portraitUrl} alt="" className="dialogue-portrait" />
            <div className="dialogue-who">
              <strong>{activeCandidate.name}</strong>
              <span>{activeCandidate.roleTitle}</span>
            </div>
            <span className={`dialogue-mood mood-${candidateMood}`}>
              {candidateMood === 'nervous' ? (
                <IconWarningShield size={12} />
              ) : candidateMood === 'neutral' ? (
                <IconDialogue size={12} />
              ) : candidateMood === 'enthusiastic' ? (
                <IconCheckSeal size={12} />
              ) : (
                <IconStarBadge size={12} />
              )}
              {moodLabel[candidateMood]}
            </span>
            <button
              type="button"
              onClick={() => setIsDialogueMinimized((m) => !m)}
              className="btn-dialogue-toggle"
              title={isDialogueMinimized ? 'Mostrar diálogo' : 'Minimizar diálogo'}
            >
              {isDialogueMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              <span>{isDialogueMinimized ? 'Ver texto' : 'Ocultar'}</span>
            </button>
          </div>

          {!isDialogueMinimized && (
            <>
              <p
                className="dialogue-text"
                onClick={() => {
                  if (isSpeaking) skipTyping();
                }}
              >
                <span ref={attachSpeechSpan} />
                {isSpeaking ? (
                  <span className="dialogue-cursor" />
                ) : (
                  <span className="dialogue-done" aria-hidden="true">
                    ◆
                  </span>
                )}
              </p>

              {liveSignalToast && (
                <div className={`dialogue-signal sig-${liveSignalToast.type}`}>
                  <span className="sig-icon">
                    {liveSignalToast.type === 'acierto_fuerte' && <Sparkles size={14} />}
                    {liveSignalToast.type === 'alerta_riesgo' && <AlertTriangle size={14} />}
                    {liveSignalToast.type === 'respuesta_ambigua' && <HelpCircle size={14} />}
                  </span>
                  <span className="sig-text">
                    <strong>{liveSignalToast.summary}</strong>
                    <em>{liveSignalToast.valueHighlighted}</em>
                  </span>
                  {lastAskedQuestionId && (
                    <span className="sig-flags">
                      <button
                        type="button"
                        onMouseEnter={() => soundEngine.playHoverTick()}
                        onClick={() => handleFlagLastAnswer('acierto')}
                        className="btn-chip good"
                        title="Anotar como acierto"
                      >
                        <ThumbsUp size={12} /> Acierto
                      </button>
                      <button
                        type="button"
                        onMouseEnter={() => soundEngine.playHoverTick()}
                        onClick={() => handleFlagLastAnswer('alerta')}
                        className="btn-chip bad"
                        title="Anotar como alerta"
                      >
                        <Flag size={12} /> Alerta
                      </button>
                    </span>
                  )}
                </div>
              )}
            </>
          )}

          <div className="dialogue-actions">
            <button
              type="button"
              onMouseEnter={() => soundEngine.playHoverTick()}
              onClick={toggleNotebook}
              className="btn-ui primary"
            >
              <IconDialogue size={15} /> Preguntar <kbd>E</kbd>
              <span className="btn-count">{currentHistory.length}/5</span>
            </button>
            {activeFollowUp && !activeFollowUp.pressed && (
              <button
                type="button"
                onMouseEnter={() => soundEngine.playHoverTick()}
                onClick={handlePressFollowUp}
                className="btn-ui accent"
                title={activeFollowUp.prompt}
              >
                <IconBolt size={14} /> <span className="btn-ellipsis">{activeFollowUp.prompt}</span>
              </button>
            )}
            <button
              type="button"
              onMouseEnter={() => soundEngine.playHoverTick()}
              onClick={callNextCandidate}
              className="btn-ui ghost ml-auto"
              title="Hacer pasar al siguiente candidato"
            >
              <IconBell size={14} /> Siguiente
            </button>
          </div>
        </section>
      )}

      {/* OBJECTIVES TRACKER */}
      {!isMenuOpen && (
        <aside className={`hud-objectives ${isObjectivesOpen ? 'is-open' : ''}`}>
          {!isMobileHud && (
            <header className="obj-head">
              <span className="hud-eyebrow">Caso {vacancy.number} · Oficina del Samán</span>
              <h2>{vacancy.title}</h2>
            </header>
          )}

          <div className="obj-candidates" role="group" aria-label="Candidatos">
            {vacancy.candidates.map((cand, idx) => {
              const stamp = stampedByCand[cand.id];
              return (
                <button
                  key={cand.id}
                  type="button"
                  onMouseEnter={() => soundEngine.playHoverTick()}
                  onClick={() => callCandidateIntoOffice(idx)}
                  className={`obj-cand ${idx === activeCandIdx ? 'is-active' : ''}`}
                  title={cand.name}
                >
                  <img src={cand.portraitUrl} alt={cand.name} />
                  {stamp && (
                    <span className={`obj-cand-stamp ${stamp === 'HIRED' ? 'hired' : 'rejected'}`}>
                      {stamp === 'HIRED' ? '✓' : '✕'}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="obj-cand-name">
              <span>Candidato {activeCandIdx + 1} de {vacancy.candidates.length}</span>
              <strong>{activeCandidate.name}</strong>
            </div>
            {isMobileHud && (
              <button
                type="button"
                onClick={() => setIsObjectivesOpen((o) => !o)}
                className="obj-mobile-toggle"
                aria-expanded={isObjectivesOpen}
                title="Ver objetivos y progreso"
              >
                <span>{doneObjectivesCount}/4</span>
                {isObjectivesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

          {(!isMobileHud || isObjectivesOpen) && (
            <div className="obj-collapsible-body">
              {isMobileHud && (
                <header className="obj-head">
                  <span className="hud-eyebrow">Caso {vacancy.number}</span>
                  <h2>{vacancy.title}</h2>
                </header>
              )}

              <div className="obj-meters">
                <div className="obj-meter">
                  <span>Competencia técnica</span>
                  <strong>{activeMetrics.tech}%</strong>
                  <div className="meter-track">
                    <div className="meter-fill tech" style={{ width: `${activeMetrics.tech}%` }} />
                  </div>
                </div>
                <div className="obj-meter">
                  <span>Afinidad javeriana</span>
                  <strong>{activeMetrics.culture}%</strong>
                  <div className="meter-track">
                    <div className="meter-fill cult" style={{ width: `${activeMetrics.culture}%` }} />
                  </div>
                </div>
              </div>

              <ul className="obj-list">
                <li>
                  <button
                    type="button"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    onClick={() => {
                      setIsObjectivesOpen(false);
                      toggleClipboard();
                    }}
                    className={`obj-item ${
                      validProfilePinned >= vacancy.requiredCorrectCount ? 'is-done' : ''
                    }`}
                  >
                    <span className="obj-check" />
                    <span className="obj-label">Definir perfil del cargo</span>
                    <span className="obj-count">
                      {validProfilePinned}/{vacancy.requiredCorrectCount}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    onClick={() => {
                      setIsObjectivesOpen(false);
                      toggleCvFolder();
                    }}
                    className={`obj-item ${reviewedCount >= totalHighlights ? 'is-done' : ''}`}
                  >
                    <span className="obj-check" />
                    <span className="obj-label">Revisar hojas de vida</span>
                    <span className="obj-count">
                      {reviewedCount}/{totalHighlights}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    onClick={() => {
                      setIsObjectivesOpen(false);
                      toggleNotebook();
                    }}
                    className={`obj-item ${currentHistory.length >= 3 ? 'is-done' : ''}`}
                  >
                    <span className="obj-check" />
                    <span className="obj-label">Entrevistar (STAR)</span>
                    <span className="obj-count">{currentHistory.length}/5</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    onClick={() => {
                      setIsObjectivesOpen(false);
                      triggerPhoneReferenceCall();
                    }}
                    className={`obj-item ${calledReferences[activeCandidate.id] ? 'is-done' : ''}`}
                  >
                    <span className="obj-check" />
                    <span className="obj-label">Verificar referencia</span>
                    <span className="obj-count">
                      {calledReferences[activeCandidate.id] ? 'Hecho' : 'Llamar'}
                    </span>
                  </button>
                </li>
              </ul>

              {candClues.length > 0 && (
                <div className="obj-clues">
                  <span className="hud-eyebrow">Pistas de la lupa</span>
                  {candClues.map((c, idx) => (
                    <p key={idx} className="clue-chip">
                      <IconLupa size={12} /> <span>{c}</span>
                    </p>
                  ))}
                </div>
              )}

              {!candClues.includes(gameToast) && (
                <p className="obj-hint" key={gameToast}>
                  {gameToast}
                </p>
              )}
            </div>
          )}
        </aside>
      )}

      {/* BOTTOM: CAMERA VIEWS + TOOL HOTBAR */}
      {!isMenuOpen && (
        <>
          <nav className="hud-hotbar" aria-label="Herramientas">
            <HotbarSlot hotkey="P" label="Perfil" active={heldTool === 'CLIPBOARD'} onClick={toggleClipboard}>
              <IconClipboard size={22} />
            </HotbarSlot>
            <HotbarSlot hotkey="C" label="Hoja de vida" active={heldTool === 'OPEN_CV'} onClick={toggleCvFolder}>
              <IconDossier size={22} />
            </HotbarSlot>
            <HotbarSlot hotkey="E" label="Libreta" active={heldTool === 'DIALOGUE_WHEEL'} onClick={toggleNotebook}>
              <IconNotebook size={22} />
            </HotbarSlot>
            <HotbarSlot hotkey="L" label="Lupa" active={heldTool === 'LUPA'} onClick={toggleLupa}>
              <IconLupa size={22} />
            </HotbarSlot>
            <HotbarSlot
              hotkey="T"
              label="Citófono"
              active={heldTool === 'PHONE_CALL'}
              onClick={triggerPhoneReferenceCall}
            >
              <IconPhone size={22} />
            </HotbarSlot>
            <HotbarSlot
              hotkey="M"
              label="Manual"
              onClick={() => {
                soundEngine.playPaperFlip();
                onOpenManual();
              }}
            >
              <BookOpen size={21} />
            </HotbarSlot>
            <span className="hotbar-divider" aria-hidden="true" />
            <HotbarSlot
              label="Contratar"
              tone="green"
              active={heldTool === 'STAMP_HIRE'}
              onClick={() => takeStamp('STAMP_HIRE')}
            >
              <IconStamp size={22} />
            </HotbarSlot>
            <HotbarSlot
              label="Descartar"
              tone="red"
              active={heldTool === 'STAMP_REJECT'}
              onClick={() => takeStamp('STAMP_REJECT')}
            >
              <IconStampReject size={22} />
            </HotbarSlot>
          </nav>
        </>
      )}

      {/* ============================================================================
          IN-HAND PROP 1: HARDBOARD CLIPBOARD (PERFIL DEL CARGO)
          ============================================================================ */}
      {heldTool === 'CLIPBOARD' && (
        <div className="inhand-backdrop" onClick={closeHeld}>
          <div className="prop prop-clipboard" onClick={(e) => e.stopPropagation()}>
            <div className="clipboard-clip" aria-hidden="true">
              <span className="clip-lever" />
              <span className="clip-rivet" />
              <span className="clip-rivet" />
            </div>
            <div className="paper clipboard-sheet">
              <header className="paper-head">
                <div>
                  <span className="paper-eyebrow">{vacancy.facultyOrUnit}</span>
                  <h2 className="paper-title">Perfil del cargo</h2>
                  <p className="paper-subtitle">{vacancy.title}</p>
                </div>
                <button type="button" onClick={closeHeld} className="prop-close">
                  <X size={15} /> Dejar <kbd>Esc</kbd>
                </button>
              </header>

              <blockquote className="memo-slip">
                <span className="tape" aria-hidden="true" />
                <span className="memo-from">Memo de la decanatura</span>
                {vacancy.deanRequestMemo}
              </blockquote>

              <div className="paper-instruction">
                <p>
                  Marca los <strong>{vacancy.requiredCorrectCount} criterios objetivos</strong> del
                  cargo. Ojo: algunos son trampas de sesgo.
                </p>
                <span className="hand-counter">
                  {validProfilePinned}/{vacancy.requiredCorrectCount}
                </span>
              </div>

              <ul className="checklist">
                {vacancy.profileOptions.map((opt) => {
                  const isSelected = selectedProfileIds.includes(opt.id);
                  const isRevealed = revealedProfileIds.includes(opt.id);
                  const isTrap = isRevealed && !!opt.isBiasTrap;
                  return (
                    <li key={opt.id}>
                      <button
                        type="button"
                        onMouseEnter={() => soundEngine.playHoverTick()}
                        onClick={() => handleToggleProfileCriterion(opt)}
                        className={`check-row ${isSelected ? 'is-checked' : ''} ${
                          isTrap ? 'is-trap' : ''
                        }`}
                      >
                        <span className="check-box" aria-hidden="true">
                          {isSelected && (
                            <svg viewBox="0 0 24 24" className="hand-mark">
                              <path d="M4 13 L10 19 L21 4" />
                            </svg>
                          )}
                          {isTrap && (
                            <svg viewBox="0 0 24 24" className="hand-mark bad">
                              <path d="M5 5 L19 19 M19 5 L5 19" />
                            </svg>
                          )}
                        </span>
                        <span className="check-text">
                          <strong>{opt.label}</strong>
                          <small>{opt.description}</small>
                          {isRevealed && (
                            <em className={`margin-note ${opt.isBiasTrap ? 'bad' : 'good'}`}>
                              {opt.pedagogicalNote}
                            </em>
                          )}
                        </span>
                        {isSelected && <span className="push-pin" aria-hidden="true" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          IN-HAND PROP 2: MANILA FOLDER WITH THE CV (HOJA DE VIDA)
          ============================================================================ */}
      {heldTool === 'OPEN_CV' && (
        <div className="inhand-backdrop" onClick={closeHeld}>
          <div className="prop prop-folder" onClick={(e) => e.stopPropagation()}>
            <div className="folder-tabs">
              {vacancy.candidates.map((cand, idx) => {
                const stamp = stampedByCand[cand.id];
                return (
                  <button
                    key={cand.id}
                    type="button"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    onClick={() => callCandidateIntoOffice(idx)}
                    className={`folder-tab tab-${idx} ${idx === activeCandIdx ? 'is-active' : ''}`}
                  >
                    <span className="folder-tab-label">
                      {idx + 1}. {cand.name}
                    </span>
                    {stamp && (
                      <span className={`folder-tab-mark ${stamp === 'HIRED' ? 'hired' : 'rejected'}`}>
                        {stamp === 'HIRED' ? '✓' : '✕'}
                      </span>
                    )}
                  </button>
                );
              })}
              <button type="button" onClick={closeHeld} className="prop-close folder-close">
                <X size={15} /> Cerrar <kbd>Esc</kbd>
              </button>
            </div>

            <div className="folder-inside">
              <article className="paper cv-sheet">
                <span className="paperclip" aria-hidden="true" />
                <div className="cv-top">
                  <figure className="polaroid">
                    <img src={activeCandidate.portraitUrl} alt={activeCandidate.name} />
                    <figcaption>{activeCandidate.name.split(' ').slice(-2).join(' ')}</figcaption>
                  </figure>
                  <div className="cv-identity">
                    <span className="paper-eyebrow">Hoja de vida · Expediente {activeCandIdx + 1}</span>
                    <h2 className="paper-title">{activeCandidate.name}</h2>
                    <p className="paper-subtitle">{activeCandidate.roleTitle}</p>
                    <div className="cv-facts">
                      <span>{activeCandidate.age} años</span>
                      <span>{activeCandidate.yearsExperience} años de experiencia</span>
                    </div>
                  </div>
                </div>

                <p className="cv-bio">{activeCandidate.shortBio}</p>

                <section className="cv-section">
                  <h4>Formación académica</h4>
                  <ul>
                    {activeCandidate.education.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </section>

                <section className="cv-section">
                  <h4>Experiencia reportada</h4>
                  <ul>
                    {activeCandidate.experienceSummary.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </section>

                <div className={`sticky-note ${cvNoteDiscovered ? 'is-revealed' : ''}`}>
                  <strong>
                    <IconLupa size={13} /> Nota al margen
                  </strong>
                  {cvNoteDiscovered ? (
                    <p>{activeCandidate.lupaClues.secretCvNote}</p>
                  ) : (
                    <>
                      <p className="sticky-hidden">{activeCandidate.lupaClues.secretCvNote}</p>
                      <button
                        type="button"
                        onMouseEnter={() => soundEngine.playHoverTick()}
                        onClick={() => {
                          triggerLupaDiscovery('CV');
                          setHeldTool('OPEN_CV');
                        }}
                        className="sticky-reveal"
                      >
                        Pasar la lupa
                      </button>
                    </>
                  )}
                </div>

                {activeStamp && (
                  <span className={`rubber-stamp ${activeStamp === 'HIRED' ? 'hired' : 'rejected'}`}>
                    {activeStamp === 'HIRED' ? 'Contratado' : 'Descartado'}
                  </span>
                )}
              </article>

              <article className="paper eval-sheet">
                <header className="eval-head">
                  <h3>Hallazgos del expediente</h3>
                  <p>Resalta cada dato con el marcador correcto: ¿evidencia, duda o sesgo?</p>
                </header>

                <div className="findings">
                  {activeCandidate.cvHighlights.map((hl) => {
                    const mark = cvAnnotations[hl.id];
                    const isCorrect = mark === hl.classification;
                    return (
                      <div key={hl.id} className={`finding ${mark ? `mark-${mark}` : ''}`}>
                        <strong className="finding-title">{hl.title}</strong>
                        <p className="finding-detail">{hl.detail}</p>
                        <div className="marker-row">
                          <button
                            type="button"
                            onMouseEnter={() => soundEngine.playHoverTick()}
                            onClick={() => handleMarkCVHighlight(hl, 'green_flag')}
                            className={`marker green ${mark === 'green_flag' ? 'is-on' : ''}`}
                          >
                            <CheckCircle2 size={13} /> Evidencia real
                          </button>
                          <button
                            type="button"
                            onMouseEnter={() => soundEngine.playHoverTick()}
                            onClick={() => handleMarkCVHighlight(hl, 'yellow_flag')}
                            className={`marker yellow ${mark === 'yellow_flag' ? 'is-on' : ''}`}
                          >
                            <AlertTriangle size={13} /> Indagar
                          </button>
                          <button
                            type="button"
                            onMouseEnter={() => soundEngine.playHoverTick()}
                            onClick={() => handleMarkCVHighlight(hl, 'bias_trap')}
                            className={`marker blue ${mark === 'bias_trap' ? 'is-on' : ''}`}
                          >
                            <ShieldAlert size={13} /> Sesgo: ignorar
                          </button>
                        </div>
                        {mark && (
                          <p className={`margin-note ${isCorrect ? 'good' : 'bad'}`}>
                            {isCorrect ? '✓ ' : '✗ '}
                            {hl.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <footer className="eval-actions">
                  <button
                    type="button"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    onClick={toggleNotebook}
                    className="btn-ui primary"
                  >
                    <IconDialogue size={14} /> Preguntar
                  </button>
                  <button
                    type="button"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    onClick={triggerPhoneReferenceCall}
                    className="btn-ui ghost-dark"
                  >
                    <IconPhone size={14} /> Llamar referencia
                  </button>
                  <button
                    type="button"
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    onClick={() => takeStamp('STAMP_HIRE')}
                    className="btn-ui green ml-auto"
                  >
                    <IconStamp size={14} /> Sello
                  </button>
                </footer>
              </article>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          IN-HAND PROP 3: SPIRAL INTERVIEW NOTEBOOK (LIBRETA DE PREGUNTAS)
          ============================================================================ */}
      {heldTool === 'DIALOGUE_WHEEL' && (
        <div className="inhand-backdrop is-low" onClick={closeHeld}>
          <div className="prop prop-notebook" onClick={(e) => e.stopPropagation()}>
            <div className="notebook-coil" aria-hidden="true" />
            <div className="notebook-page">
              <header className="notebook-head">
                <div>
                  <span className="notebook-date">Entrevista con {activeCandidate.name}</span>
                  <h3>¿Qué le pregunto?</h3>
                </div>
                <span className="hand-counter">{currentHistory.length}/5</span>
                <button type="button" onClick={closeHeld} className="prop-close">
                  <X size={15} /> Cerrar <kbd>Esc</kbd>
                </button>
              </header>

              <ol className="notebook-questions">
                {vacancy.questions.map((q, i) => {
                  const alreadyAsked = currentHistory.some((r) => r.questionId === q.id);
                  return (
                    <li key={q.id}>
                      <button
                        type="button"
                        onMouseEnter={() => soundEngine.playHoverTick()}
                        onClick={() => handleAskQuestion(q)}
                        className={`notebook-q ${alreadyAsked ? 'is-asked' : ''}`}
                      >
                        <span className="notebook-num">{i + 1}</span>
                        <span className="notebook-q-body">
                          <small>{q.categoryLabel}</small>
                          <span className="notebook-q-text">{q.questionText}</span>
                        </span>
                        {alreadyAsked && (
                          <span className={`notebook-stamp qual-${q.quality.toLowerCase()}`}>
                            {q.quality === 'STAR_OPTIMAL' && 'STAR ✓'}
                            {q.quality === 'SUPERFICIAL' && 'De cajón'}
                            {q.quality === 'BIASED_ILLEGAL' && 'Sesgo ✗'}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>

              <p className="notebook-tip">
                Recuerda: una buena pregunta pide <b>S</b>ituación, <b>T</b>area, <b>A</b>cción y{' '}
                <b>R</b>esultado.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HotbarSlot: React.FC<{
  hotkey?: string;
  label: string;
  active?: boolean;
  tone?: 'green' | 'red';
  onClick: () => void;
  children: React.ReactNode;
}> = ({ hotkey, label, active, tone, onClick, children }) => (
  <button
    type="button"
    onMouseEnter={() => soundEngine.playHoverTick()}
    onClick={onClick}
    className={`hotbar-slot ${active ? 'is-active' : ''} ${tone ? `tone-${tone}` : ''}`}
    aria-label={label}
    aria-pressed={active}
  >
    <span className="hotbar-icon">{children}</span>
    <span className="hotbar-label">{label}</span>
    {hotkey && <kbd className="hotbar-key">{hotkey}</kbd>}
  </button>
);
