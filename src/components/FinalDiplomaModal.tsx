import React, { useState } from 'react';
import { CaseResultSummary } from '../types/game';
import { VACANCY_CASES, MENTOR_INFO } from '../data/vacancies';
import { GameLogo } from './GameLogo';
import { Award, Printer, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

interface FinalDiplomaModalProps {
  results: Record<string, CaseResultSummary>;
  onBackToMenu: () => void;
  onResetAll: () => void;
}

export const FinalDiplomaModal: React.FC<FinalDiplomaModalProps> = ({
  results,
  onBackToMenu,
  onResetAll
}) => {
  const [playerName, setPlayerName] = useState<string>('Líder JaveTalento');

  const completedList = Object.values(results);
  const avgScore =
    completedList.length > 0
      ? Math.round(
          completedList.reduce((acc, r) => acc + r.totalScore, 0) / completedList.length
        )
      : 0;

  const idealHiresCount = completedList.filter((r) => r.isIdealHire).length;
  const totalStarQuestions = completedList.reduce((acc, r) => acc + r.starQuestionsAsked, 0);

  const rankTitle =
    avgScore >= 88 && idealHiresCount === completedList.length
      ? 'Maestro(a) Cazatalentos del Samán • Excelencia Magis'
      : avgScore >= 72
      ? 'Reclutador(a) Certificado(a) en Selección por Competencias'
      : 'Evaluador(a) en Entrenamiento • Mitigación de Sesgos';

  return (
    <div className="inhand-overlay-backdrop">
      <div className="inhand-clipboard-board diploma-frame-board">
        <div className="clipboard-metal-clip no-print">
          DIPLOMA OFICIAL ENMARCADO • PONTIFICIA UNIVERSIDAD JAVERIANA CALI
        </div>

        <div className="clipboard-paper-sheet diploma-sheet">
          <div className="diploma-gold-border">
            <div className="diploma-header">
              <GameLogo size="md" tone="dark" />
              <span className="diploma-institution">
                PONTIFICIA UNIVERSIDAD JAVERIANA CALI • GESTIÓN DEL TALENTO HUMANO
              </span>
              <h1 className="diploma-title">Diploma de Maestro Cazatalentos</h1>
              <p className="diploma-subtitle">
                JaveTalento · Reclutamiento y selección por competencias
              </p>
            </div>

            <div className="diploma-recipient-section">
              <label htmlFor="recipient-input" className="recipient-label">
                Otorgado con orgullo a (escribe tu nombre o el de tu grupo):
              </label>
              <input
                id="recipient-input"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="diploma-name-input"
                placeholder="Escribe tu nombre aquí..."
              />
              <div className="diploma-rank-pill">
                <Sparkles size={15} />
                <span>{rankTitle}</span>
              </div>
            </div>

            <p className="diploma-body-text">
              Por haber superado las pruebas prácticas en la oficina frente al Samán: configurando{' '}
              <strong>Perfiles de Cargo sin sesgos</strong>, auditando{' '}
              <strong>Hojas de Vida con la Lupa del Cazatalentos</strong>, verificando referencias
              reales y aplicando entrevistas conductuales <strong>Método STAR</strong> alineadas con
              la <em>Cura Personalis</em> y el <em>Magis</em> javeriano.
            </p>

            {/* Summary Stats */}
            <div className="diploma-stats-grid">
              <div className="dip-stat-box">
                <span>Puntaje Promedio</span>
                <strong>{avgScore} / 100</strong>
              </div>
              <div className="dip-stat-box">
                <span>Aciertos de Contratación</span>
                <strong>
                  {idealHiresCount} / {VACANCY_CASES.length}
                </strong>
              </div>
              <div className="dip-stat-box">
                <span>Preguntas STAR Aplicadas</span>
                <strong>{totalStarQuestions}</strong>
              </div>
            </div>

            {/* Case by Case Breakdown */}
            <div className="diploma-cases-summary">
              {VACANCY_CASES.map((vc) => {
                const res = results[vc.id];
                const hired = vc.candidates.find((c) => c.id === res?.selectedCandidateId);
                return (
                  <div key={vc.id} className="dip-case-row">
                    <div>
                      <strong>
                        Misión #{vc.number}: {vc.title}
                      </strong>
                      <span className="dip-case-sub">
                        {res
                          ? `Contratado(a): ${hired?.name || ''} • Puntaje: ${res.totalScore}/100`
                          : 'Misión pendiente por jugar'}
                      </span>
                    </div>
                    {res && (
                      <span
                        className={`dip-badge ${res.isIdealHire ? 'badge-ok' : 'badge-warn'}`}
                      >
                        {res.isIdealHire ? (
                          <>
                            <CheckCircle2 size={14} /> ¡Contratación Ideal!
                          </>
                        ) : (
                          'Con Alerta de Sesgo'
                        )}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Signature Footer */}
            <div className="diploma-signatures">
              <div className="sig-block">
                <img
                  src={MENTOR_INFO.portraitUrl}
                  alt={MENTOR_INFO.name}
                  className="sig-avatar"
                />
                <div>
                  <div className="sig-handwritten">Clara Mendoza</div>
                  <strong>{MENTOR_INFO.name}</strong>
                  <span>{MENTOR_INFO.role}</span>
                </div>
              </div>

              <div className="sig-seal-gold">
                <Award size={20} />
                <strong>EL SAMÁN</strong>
                <span>SELLO JAVERIANO</span>
              </div>
            </div>

            <div className="diploma-actions no-print">
              <button type="button" onClick={onBackToMenu} className="btn-secondary-outline">
                Volver a la oficina
              </button>
              <button type="button" onClick={onResetAll} className="btn-secondary-outline">
                <RotateCcw size={15} /> Reiniciar Campaña
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-enter-3d-office"
              >
                <Printer size={17} /> Imprimir / Guardar Diploma PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
