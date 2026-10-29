import React from 'react';
import { VacancyCase, CaseResultSummary } from '../types/game';
import {
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Search,
  PhoneCall
} from 'lucide-react';

interface CaseDebriefModalProps {
  vacancy: VacancyCase;
  result: CaseResultSummary;
  hasNextCase: boolean;
  onNextCase: () => void;
  onRetryCase: () => void;
  onFinishCampaign: () => void;
}

export const CaseDebriefModal: React.FC<CaseDebriefModalProps> = ({
  vacancy,
  result,
  hasNextCase,
  onNextCase,
  onRetryCase,
  onFinishCampaign
}) => {
  const chosenCandidate =
    vacancy.candidates.find((c) => c.id === result.selectedCandidateId) || vacancy.candidates[0];
  const idealCandidate =
    vacancy.candidates.find((c) => c.trueSuitability === 'IDEAL') || vacancy.candidates[0];

  return (
    <div className="inhand-overlay-backdrop">
      <div className="inhand-clipboard-board debrief-board">
        <div className="clipboard-metal-clip">
          ACTA OFICIAL DE CIERRE • MISIÓN #{vacancy.number}
        </div>

        <div className="clipboard-paper-sheet debrief-paper">
          <div
            className={`official-rubber-stamp ${
              result.isIdealHire ? 'stamp-approved' : 'stamp-warning'
            }`}
          >
            {result.isIdealHire ? '¡CONTRATACIÓN EXITOSA!' : '¡CAÍSTE EN UN SESGO!'}
          </div>

          <div className="debrief-top-header">
            <span className="doc-kicker">
              DIRECCIÓN DE GESTIÓN HUMANA • {vacancy.title.toUpperCase()}
            </span>
            <h2>{chosenCandidate.hiringVerdictTitle}</h2>
          </div>

          {/* Chosen Candidate Summary Card */}
          <div
            className={`debrief-verdict-box ${
              result.isIdealHire ? 'verdict-ideal' : 'verdict-trap'
            }`}
          >
            <img
              src={chosenCandidate.portraitUrl}
              alt={chosenCandidate.name}
              className="debrief-cand-avatar"
            />
            <div className="debrief-verdict-text">
              <div className="verdict-title-row">
                {result.isIdealHire ? (
                  <CheckCircle2 size={20} className="icon-good" />
                ) : (
                  <AlertTriangle size={20} className="icon-bad" />
                )}
                <strong>Nombramiento Sellado: {chosenCandidate.name}</strong>
              </div>
              <p>{chosenCandidate.hiringVerdictExplanation}</p>
              {!result.isIdealHire && (
                <div className="ideal-comparison-callout">
                  <Sparkles size={15} />
                  <span>
                    <strong>Ojo al dato de Gestión Humana:</strong> El talento idóneo era{' '}
                    <strong>{idealCandidate.name}</strong>, quien demostró tanto cancha técnica como
                    verdadera <em>Cura Personalis</em> y <em>Magis</em> con evidencias STAR.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 4 Competency Metrics Breakdown */}
          <div className="debrief-metrics-grid">
            <div className="metric-card">
              <span className="metric-label">1. Tablero Perfil</span>
              <strong className="metric-val">{result.profileScore}%</strong>
              <span className="metric-sub">Criterios sin sesgos</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">2. Filtro Carpeta CV</span>
              <strong className="metric-val">{result.cvScreeningScore}%</strong>
              <span className="metric-sub">Evidencias vs. Trampas</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">3. Interrogatorio STAR</span>
              <strong className="metric-val">{result.interviewQuestionScore}%</strong>
              <span className="metric-sub">{result.starQuestionsAsked} preguntas STAR</span>
            </div>
            <div className="metric-card metric-total">
              <span className="metric-label">Puntaje de Misión</span>
              <strong className="metric-val">{result.totalScore}/100</strong>
              <span className="metric-sub">
                {result.totalScore >= 85
                  ? 'Rango Maestro del Samán'
                  : result.totalScore >= 65
                  ? '● Reclutador Competente'
                  : '▲ Por Fortalecer'}
              </span>
            </div>
          </div>

          {/* Detective Tools Used Badge Bar */}
          <div className="debrief-tools-badges">
            <span className={`tool-used-pill ${result.lupaUsed ? 'used-ok' : ''}`}>
              <Search size={14} /> Lupa del Cazatalentos:{' '}
              <strong>{result.lupaUsed ? 'Utilizada (+Bono)' : 'No usada'}</strong>
            </span>
            <span className={`tool-used-pill ${result.referencesChecked > 0 ? 'used-ok' : ''}`}>
              <PhoneCall size={14} /> Citófono de Referencias en Cali:{' '}
              <strong>{result.referencesChecked} llamadas realizadas</strong>
            </span>
          </div>

          {/* All 3 Candidates Reveal Table */}
          <div className="debrief-all-candidates">
            <h4>
              <BookOpen size={16} /> Destape Completo de los 3 Candidatos
            </h4>
            <div className="trio-reveal-list">
              {vacancy.candidates.map((c) => (
                <div
                  key={c.id}
                  className={`trio-reveal-item ${
                    c.trueSuitability === 'IDEAL' ? 'reveal-ideal' : 'reveal-other'
                  }`}
                >
                  <div className="reveal-name-col">
                    <strong>{c.name}</strong>
                    <span className="reveal-tag">
                      {c.trueSuitability === 'IDEAL'
                        ? 'Talento ideal javeriano'
                        : c.trueSuitability === 'TECH_TRAP'
                        ? 'Trampa: efecto halo / técnico'
                        : 'Trampa: carisma / rosca'}
                    </span>
                  </div>
                  <p className="reveal-lesson">{c.keyTrapExplanation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="debrief-actions-footer">
            <button type="button" onClick={onRetryCase} className="btn-secondary-outline">
              <RotateCcw size={16} />
              <span>Repetir esta Misión</span>
            </button>

            {hasNextCase ? (
              <button type="button" onClick={onNextCase} className="btn-enter-3d-office">
                <span>Siguiente Misión en el Samán</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button type="button" onClick={onFinishCampaign} className="btn-enter-3d-office">
                <Award size={18} />
                <span>Recibir Diploma Oficial de Cazatalentos</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
