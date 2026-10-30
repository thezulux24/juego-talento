import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { soundEngine } from '../audio/SoundEngine';

interface TutorialStep {
  /** CSS selector of the HUD element to spotlight; omit for a centered card */
  target?: string;
  title: string;
  text: string;
}

const STEPS: TutorialStep[] = [
  {
    title: 'Bienvenido a JaveTalento',
    text: 'Eres líder de un área de la Javeriana Cali y debes contratar a la persona ideal para una vacante. Tres candidatos pasarán por tu oficina y solo uno es el indicado. Te mostramos cómo jugar en un minuto.'
  },
  {
    target: '.hud-dialogue',
    title: 'El candidato te habla',
    text: 'Aquí lees lo que dice. Toca el texto para verlo completo o usa el botón de minimizar para despejar la vista. Con «Siguiente» haces pasar al próximo candidato.'
  },
  {
    target: '.hud-hotbar',
    title: 'Tus herramientas',
    text: 'Cada objeto del escritorio está en esta barra inferior. También puedes tocar directamente el objeto en la oficina 3D.'
  },
  {
    target: '.hotbar-slot[aria-label="Perfil"]',
    title: '1. Define el perfil del cargo',
    text: 'Marca los criterios objetivos de la vacante. Cuidado: algunos son trampas de sesgo, como la edad o el estado civil.'
  },
  {
    target: '.hotbar-slot[aria-label="Hoja de vida"]',
    title: '2. Revisa las hojas de vida',
    text: 'Resalta cada dato: ¿es evidencia real, algo para indagar en la entrevista o un sesgo que debes ignorar?'
  },
  {
    target: '.hotbar-slot[aria-label="Libreta"]',
    title: '3. Entrevista con tu libreta',
    text: 'Elige preguntas STAR: Situación, Tarea, Acción y Resultado. Evita las preguntas invasivas y presiona cuando una respuesta suene vaga.'
  },
  {
    target: '.hotbar-slot[aria-label="Lupa"]',
    title: '4. Investiga',
    text: 'Con la lupa lees el lenguaje corporal y descubres notas ocultas en la hoja de vida. Con el citófono, a su lado, llamas a las referencias laborales.'
  },
  {
    target: '.hud-objectives',
    title: 'Tu progreso y candidatos',
    text: 'Aquí cambias de candidato tocando su foto y consultas tus objetivos y las pistas descubiertas.'
  },
  {
    target: '.hotbar-slot[aria-label="Contratar"]',
    title: '5. Toma la decisión',
    text: 'Cuando estés seguro, toma el sello Contratar y estámpalo sobre la hoja de vida de la persona elegida.'
  },
  {
    target: '.btn-hud-pause',
    title: 'Pausa y pantalla completa',
    text: 'Arriba a la izquierda pausas el juego o activas la pantalla completa cuando quieras. ¡Éxitos!'
  }
];

const CARD_WIDTH = 360;
const MOBILE_CARD_WIDTH = 300;
const GAP = 12;

interface LogicalRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface TutorialOverlayProps {
  onFinish: () => void;
  isForcedLandscape?: boolean;
  isMobileHud?: boolean;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  onFinish,
  isForcedLandscape = false,
  isMobileHud = false
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<LogicalRect | null>(null);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const measure = useCallback(() => {
    if (!step.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(step.target);
    if (!el) {
      setRect(null);
      return;
    }
    const raw = el.getBoundingClientRect();
    if (raw.width === 0 && raw.height === 0) {
      setRect(null);
      return;
    }
    if (isForcedLandscape) {
      const physW = window.innerWidth;
      setRect({
        left: raw.top,
        top: physW - raw.right,
        right: raw.bottom,
        bottom: physW - raw.left,
        width: raw.height,
        height: raw.width
      });
    } else {
      setRect({
        left: raw.left,
        top: raw.top,
        right: raw.right,
        bottom: raw.bottom,
        width: raw.width,
        height: raw.height
      });
    }
  }, [step.target, isForcedLandscape]);

  // Measure now and again once HUD entrance animations have settled
  useLayoutEffect(() => {
    measure();
    const t = window.setTimeout(measure, 320);
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const next = useCallback(() => {
    soundEngine.playPaperFlip();
    if (isLast) {
      onFinish();
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [isLast, onFinish]);

  const back = useCallback(() => {
    soundEngine.playHoverTick();
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const skip = useCallback(() => {
    soundEngine.playMenuClose();
    onFinish();
  }, [onFinish]);

  // Capture-phase keys so the game underneath does not react while the tutorial is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      e.stopImmediatePropagation();
      if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        back();
      } else if (e.key === 'Escape') {
        skip();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [next, back, skip]);

  // Place the card next to the spotlight, inside the logical game viewport
  const vw = isForcedLandscape ? window.innerHeight : window.innerWidth;
  const vh = isForcedLandscape ? window.innerWidth : window.innerHeight;
  const maxCardW = isMobileHud ? MOBILE_CARD_WIDTH : CARD_WIDTH;
  const cardWidth = Math.min(maxCardW, vw - 20);
  const estCardHeight = isMobileHud ? 168 : 210;

  let cardStyle: React.CSSProperties;
  if (rect) {
    const left = Math.min(
      Math.max(10, rect.left + rect.width / 2 - cardWidth / 2),
      vw - cardWidth - 10
    );
    const placeBelow = rect.top + rect.height / 2 < vh / 2;
    if (placeBelow) {
      const top = Math.max(8, Math.min(rect.bottom + GAP, vh - estCardHeight - 8));
      cardStyle = { left, top, width: cardWidth };
    } else {
      const bottom = Math.max(8, Math.min(vh - rect.top + GAP, vh - estCardHeight - 8));
      cardStyle = { left, bottom, width: cardWidth };
    }
  } else {
    cardStyle = { left: '50%', top: '50%', width: cardWidth, transform: 'translate(-50%, -50%)' };
  }

  const pad = isMobileHud ? 5 : 8;

  return (
    <div className="tutorial-root" role="dialog" aria-modal="true" aria-label="Tutorial">
      {rect ? (
        <div
          className="tutorial-spotlight"
          style={{
            left: rect.left - pad,
            top: rect.top - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2
          }}
        />
      ) : (
        <div className="tutorial-dim" />
      )}

      <div className="tutorial-card" style={cardStyle} key={stepIndex}>
        <div className="tutorial-progress">
          {STEPS.map((_, i) => (
            <span key={i} className={i <= stepIndex ? 'is-on' : ''} />
          ))}
        </div>
        <span className="tutorial-count">
          Paso {stepIndex + 1} de {STEPS.length}
        </span>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
        <div className="tutorial-actions">
          {!isLast && (
            <button type="button" onClick={skip} className="tutorial-skip">
              Saltar
            </button>
          )}
          {stepIndex > 0 && (
            <button type="button" onClick={back} className="btn-ui ghost">
              Atrás
            </button>
          )}
          <button type="button" onClick={next} className="btn-ui primary">
            {isLast ? '¡A jugar!' : stepIndex === 0 ? 'Empezar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};
