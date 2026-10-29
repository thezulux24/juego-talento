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
    text: 'Aquí lees lo que dice. Haz clic sobre el texto para verlo completo. Con «Siguiente» haces pasar al próximo candidato.'
  },
  {
    target: '.hud-hotbar',
    title: 'Tus herramientas',
    text: 'Cada objeto del escritorio está en esta barra. También puedes hacer clic directamente sobre el objeto en la oficina o usar su tecla.'
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
    title: 'Tu progreso',
    text: 'Aquí ves los objetivos, cómo va cada candidato y las pistas que encuentres. Toca una foto para llamar a ese candidato.'
  },
  {
    target: '.hotbar-slot[aria-label="Contratar"]',
    title: '5. Toma la decisión',
    text: 'Cuando estés seguro, toma el sello Contratar y estámpalo sobre la hoja de vida de la persona elegida.'
  },
  {
    target: '.btn-hud-pause',
    title: 'Pausa y ayuda',
    text: 'Con Esc pausas el juego. Desde ahí abres el manual o repites este tutorial cuando quieras. ¡Éxitos!'
  }
];

const CARD_WIDTH = 360;
const GAP = 16;

interface TutorialOverlayProps {
  onFinish: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onFinish }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const measure = useCallback(() => {
    if (!step.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(step.target);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [step.target]);

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

  // Place the card next to the spotlight, inside the viewport
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cardWidth = Math.min(CARD_WIDTH, vw - 24);
  let cardStyle: React.CSSProperties;
  if (rect) {
    const left = Math.min(
      Math.max(12, rect.left + rect.width / 2 - cardWidth / 2),
      vw - cardWidth - 12
    );
    const placeBelow = rect.top + rect.height / 2 < vh / 2;
    cardStyle = placeBelow
      ? { left, top: Math.min(rect.bottom + GAP, vh - 220), width: cardWidth }
      : { left, bottom: Math.max(12, vh - rect.top + GAP), width: cardWidth };
  } else {
    cardStyle = { left: '50%', top: '50%', width: cardWidth, transform: 'translate(-50%, -50%)' };
  }

  const pad = 8;

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
              Saltar tutorial
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
