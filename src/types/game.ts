export type GamePhase =
  | 'TITLE'
  | 'CASE_SELECT'
  | 'PHASE_1_PROFILE'
  | 'PHASE_2_CV'
  | 'PHASE_3_INTERVIEW'
  | 'CASE_DEBRIEF'
  | 'FINAL_DIPLOMA';

export type CandidateMood = 'neutral' | 'confident' | 'thoughtful' | 'nervous' | 'enthusiastic';

export interface ProfileCriterionOption {
  id: string;
  label: string;
  category: 'competencia_tecnica' | 'competencia_humana' | 'requisito_formal';
  description: string;
  isCorrect: boolean;
  isBiasTrap?: boolean;
  biasType?: string;
  pedagogicalNote: string;
}

export interface CVHighlightItem {
  id: string;
  section: 'resumen' | 'experiencia' | 'educacion' | 'logros' | 'datos_personales';
  title: string;
  detail: string;
  classification: 'green_flag' | 'yellow_flag' | 'bias_trap';
  explanation: string;
}

export type QuestionQuality = 'STAR_OPTIMAL' | 'SUPERFICIAL' | 'BIASED_ILLEGAL';

export interface InterviewQuestion {
  id: string;
  categoryLabel: string;
  questionText: string;
  quality: QuestionQuality;
  competencyTarget: string;
  biasWarningTitle?: string;
  pedagogicalExplanation: string;
  responses: Record<
    string,
    {
      answerText: string;
      mood: CandidateMood;
      signalType: 'acierto_fuerte' | 'alerta_riesgo' | 'respuesta_ambigua';
      signalSummary: string;
      technicalDelta: number;
      culturalDelta: number;
      javeValueHighlighted: string;
      followUpPrompt?: string;
      followUpAnswer?: string;
      followUpSignal?: string;
    }
  >;
}

export interface Candidate {
  id: string;
  name: string;
  roleTitle: string;
  age: number;
  yearsExperience: number;
  portraitUrl: string;
  shortBio: string;
  voicePitch: number;
  greeting: string;
  education: string[];
  experienceSummary: string[];
  cvHighlights: CVHighlightItem[];
  phoneReference: {
    contactName: string;
    contactRole: string;
    transcript: string;
    verdict: 'positive' | 'warning';
  };
  lupaClues: {
    bodyLanguage: string;
    secretCvNote: string;
  };
  trueSuitability: 'IDEAL' | 'TECH_TRAP' | 'CHARISMA_TRAP';
  trueTechnicalScore: number;
  trueCulturalScore: number;
  hiringVerdictTitle: string;
  hiringVerdictExplanation: string;
  keyTrapExplanation: string;
}

export interface VacancyCase {
  id: string;
  number: number;
  title: string;
  facultyOrUnit: string;
  difficulty: 'Nivel 1 • Fundamentos' | 'Nivel 2 • Intermedio' | 'Nivel 3 • Avanzado';
  urgencyContext: string;
  deanRequestMemo: string;
  coreJaverianaValues: string[];
  profileOptions: ProfileCriterionOption[];
  requiredCorrectCount: number;
  candidates: Candidate[];
  questions: InterviewQuestion[];
}

export interface CaseResultSummary {
  caseId: string;
  selectedCandidateId: string;
  isIdealHire: boolean;
  profileScore: number;
  cvScreeningScore: number;
  interviewQuestionScore: number;
  hiringDecisionScore: number;
  totalScore: number;
  biasesAvoided: number;
  biasesTriggered: number;
  starQuestionsAsked: number;
  referencesChecked: number;
  lupaUsed: boolean;
  feedbackBullets: string[];
}

export interface GameSettings {
  graphicsQuality: 'media' | 'alta' | 'ultra';
  audioVolume: number; // 0 to 100
  isMuted: boolean;
  cameraSensitivity: number; // 0.5 to 2.0
  textSpeed: 'normal' | 'rapido' | 'instantaneo';
}
