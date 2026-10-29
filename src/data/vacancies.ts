import { VacancyCase } from '../types/game';

export const MENTOR_INFO = {
  name: 'Dra. Clara Mendoza',
  role: 'Directora de Gestión Humana • Javeriana Cali',
  portraitUrl: '/assets/candidates/mentor_clara.jpg',
  welcomeMessage:
    '¡Hola, qué más! Bienvenido a tu oficina frente al Samán. Aquí en la Javeriana no contratamos ni por «rosca», ni por títulos rimbombantes, ni por el que eche más carreta: usa tu Lupa, llama a referencias por el citófono, haz preguntas Método STAR y ponle el sello al talento que de verdad viva el Magis y la Cura Personalis.'
};

export const VACANCY_CASES: VacancyCase[] = [
  // ============================================================================
  // CASO 1: COORDINACIÓN ACADÉMICA DE PREGRADO
  // ============================================================================
  {
    id: 'case_1_academico',
    number: 1,
    title: 'Coordinación Académica de Pregrado',
    facultyOrUnit: 'Facultad de Ciencias Económicas y Administrativas • Edificio Las Palmas',
    difficulty: 'Nivel 1 • Fundamentos',
    urgencyContext:
      'Se nos viene encima la visita de pares para renovar la Acreditación de Alta Calidad y tenemos que bajar la deserción de los primíparos acompañándolos de verdad.',
    deanRequestMemo:
      '«Jefe, necesitamos a alguien que le meta la ficha al currículo y coordine a 35 profes de planta y hora cátedra. Pilas: no queremos ni al típico doctor arrogante que mira por encima del hombro a los pelados, ni al que todo lo vuelve recocha sin rigor académico. Buscamos liderazgo pedagógico, manejo de datos y pura Cura Personalis.»',
    coreJaverianaValues: [
      'Cura Personalis (Cuidado genuino del estudiante y profe)',
      'Magis (Excelencia académica con sentido humano)',
      'Trabajo Colaborativo sin egos'
    ],
    requiredCorrectCount: 4,
    profileOptions: [
      {
        id: 'p1_opt1',
        label: 'Gestión Curricular y Acreditación de Alta Calidad (CNA)',
        category: 'competencia_tecnica',
        description: 'Dominio real de resultados de aprendizaje (RAE), autoevaluación y planeación.',
        isCorrect: true,
        pedagogicalNote: '¡De una! Es una competencia técnica medible y clave para la visita de pares.'
      },
      {
        id: 'p1_opt2',
        label: 'Liderazgo Empático y Escucha Activa (Cura Personalis)',
        category: 'competencia_humana',
        description: 'Capacidad para acompañar a los primíparos en riesgo y mediar con profes sin pelear.',
        isCorrect: true,
        pedagogicalNote: '¡Bien ahí! Alinea el cargo con el sello humano de la Javeriana.'
      },
      {
        id: 'p1_opt3',
        label: 'Maestría afín y experiencia coordinando equipos docentes',
        category: 'requisito_formal',
        description: 'Formación posgradual y cancha real liderando comités curriculares.',
        isCorrect: true,
        pedagogicalNote: 'Acierto: Requisito formal justo y proporcional al reto del cargo.'
      },
      {
        id: 'p1_opt4',
        label: 'Seguimiento con Indicadores y Alertas Tempranas',
        category: 'competencia_tecnica',
        description: 'Tomar decisiones con datos reales de desempeño y no a punta de pálpitos.',
        isCorrect: true,
        pedagogicalNote: '¡Exacto! Así evitamos improvisar cuando un estudiante se nos está quedando.'
      },
      {
        id: 'p1_opt5',
        label: 'Máximo 35 años para «hablar el mismo idioma de los pelados»',
        category: 'requisito_formal',
        description: 'Descartar hojas de vida de mayores de 35 años en la convocatoria.',
        isCorrect: false,
        isBiasTrap: true,
        biasType: 'Sesgo de Edadismo (Discriminación por Edad)',
        pedagogicalNote:
          '¡Pilas con ese sesgo! La empatía con los estudiantes viene de la actitud y pedagogía, jamás de la cédula.'
      },
      {
        id: 'p1_opt6',
        label: 'Soltero(a) y sin hijos para que pueda quedarse hasta la noche',
        category: 'requisito_formal',
        description: 'Filtrar candidatos con familia para exigir disponibilidad fuera de horario.',
        isCorrect: false,
        isBiasTrap: true,
        biasType: 'Discriminación Familiar / Ilegal',
        pedagogicalNote:
          '¡Falta grave! En Colombia es ilegal preguntar o filtrar por estado civil o hijos, y va contra nuestra cultura institucional.'
      }
    ],
    candidates: [
      {
        id: 'cand_1a_andres',
        name: 'Dr. Andrés Villamizar',
        roleTitle: 'Ph.D. en Economía • Investigador Senior Q1',
        age: 48,
        yearsExperience: 16,
        portraitUrl: '/assets/candidates/cand_1a_andres.jpg',
        shortBio:
          'Académico de altísimo perfil investigativo y mil títulos, pero con fama de ser implacable, soberbio y cero empático con los estudiantes.',
        voicePitch: 165,
        greeting:
          'Buenas. Imagino que ya vio mi CvLAC y mis 18 artículos en Scopus. Yo vengo acá a poner mano dura: el estudiante que no rinda en el primer corte, que vaya buscando otra carrera.',
        education: [
          'Ph.D. en Ciencias Económicas (Cum Laude)',
          'Magíster en Teoría Económica Avanzada'
        ],
        experienceSummary: [
          'Director de Grupo de Investigación (8 años): Subió los papers Q1 un 140%.',
          'Coordinador de Posgrado (2 años): Se le renunciaron 6 profes por choques de trato.'
        ],
        cvHighlights: [
          {
            id: 'cv_1a_1',
            section: 'logros',
            title: '18 Artículos en Revistas Internacionales Q1',
            detail: 'Investigador Senior en MinCiencias con gran prestigio teórico.',
            classification: 'green_flag',
            explanation: 'Tiene músculo académico, pero ojo: el cargo es de coordinación formativa de pregrado, no solo de encerrarse a escribir papers.'
          },
          {
            id: 'cv_1a_2',
            section: 'experiencia',
            title: 'Salida masiva de 6 docentes bajo su coordinación anterior',
            detail: 'Quejas reiteradas en Gestión Humana por trato déspota en reuniones.',
            classification: 'yellow_flag',
            explanation: '¡Bandera amarilla clarísima! Toca apretarlo en la entrevista sobre cómo lidera equipos.'
          },
          {
            id: 'cv_1a_3',
            section: 'datos_personales',
            title: 'Doctorado en el exterior y miembro del Club Campestre',
            detail: 'Destaca sus contactos sociales en el encabezado del CV.',
            classification: 'bias_trap',
            explanation: 'No te dejes encandilar por el «Efecto Halo» de los diplomas extranjeros ni el estatus social.'
          }
        ],
        phoneReference: {
          contactName: 'Dr. Hernán Domínguez',
          contactRole: 'Decano anterior en Bogotá',
          transcript:
            '«Vea, le hablo a calzón quitao: Andrés es un cerebro para publicar papers, pero como coordinador nos armó un incendio tenaz. Humillaba a los primíparos en público y ningún profesor quería trabajar con él.»',
          verdict: 'warning'
        },
        lupaClues: {
          bodyLanguage: 'Lupa: Mira el reloj con impaciencia y frunce el ceño cada vez que mencionas el bienestar estudiantil.',
          secretCvNote: 'Nota oculta en CV: Sus evaluaciones docentes en pregrado tienen 2.1/5.0 en trato respetuoso.'
        },
        trueSuitability: 'TECH_TRAP',
        trueTechnicalScore: 4,
        trueCulturalScore: 1,
        hiringVerdictTitle: 'Contratación Riesgosa (Caíste en el Efecto Halo)',
        hiringVerdictExplanation:
          'Te dejaste deslumbrar por el doctorado y los artículos Q1 del Dr. Villamizar, pero ignoraste sus alertas rojas en trato humano. Su estilo autoritario dispararía la deserción estudiantil y rompería el equipo docente.',
        keyTrapExplanation: 'Efecto Halo por títulos prestigiosos ignorando la falta total de Cura Personalis.'
      },
      {
        id: 'cand_1b_valeria',
        name: 'Mg. Valeria Ocampo',
        roleTitle: 'Magíster en Gestión de la Educación Superior',
        age: 36,
        yearsExperience: 9,
        portraitUrl: '/assets/candidates/cand_1b_valeria.jpg',
        shortBio:
          'Líder caleña con cancha comprobada en acreditación ante el CNA, analítica académica y acompañamiento cercano a estudiantes y profes.',
        voicePitch: 235,
        greeting:
          '¡Hola, qué alegría estar acá frente al Samán! Para mí la excelencia académica no pelea con la calidez: cuando uno acompaña bien al estudiante y escucha al profesor, los indicadores suben solos.',
        education: [
          'Magíster en Gestión y Evaluación de la Educación Superior',
          'Economista • Especialista en Analítica de Datos Educativos'
        ],
        experienceSummary: [
          'Líder de Aseguramiento de Calidad (4 años): Renovación de acreditación por 8 años.',
          'Coordinadora de Éxito Estudiantil (5 años): Bajó la deserción de primíparos del 18% al 9.2%.'
        ],
        cvHighlights: [
          {
            id: 'cv_1b_1',
            section: 'logros',
            title: 'Bajó la deserción del 18% al 9.2% con sistema de alertas tempranas',
            detail: 'Cruzó datos de notas de corte 1 con tutorías pares y apoyo psicosocial.',
            classification: 'green_flag',
            explanation: '¡Evidencia de oro! Une rigor técnico en datos con pura Cura Personalis.'
          },
          {
            id: 'cv_1b_2',
            section: 'experiencia',
            title: 'Sacó adelante reforma curricular con 30 profes sin un solo voto en contra',
            detail: 'Metodología de co-diseño escuchando a catedráticos e investigadores.',
            classification: 'green_flag',
            explanation: 'Demuestra liderazgo colaborativo real para articular la facultad.'
          },
          {
            id: 'cv_1b_3',
            section: 'datos_personales',
            title: 'Mamá de dos mellizos de 4 años • Vive en Jamundí',
            detail: 'Información familiar registrada en anexos.',
            classification: 'bias_trap',
            explanation: '¡Ignorar por completo! Asumir que por ser mamá o vivir en Jamundí no rendirá es un sesgo discriminatorio.'
          }
        ],
        phoneReference: {
          contactName: 'Dra. Marcela Sinisterra',
          contactRole: 'Vicerrectora Académica (Referencia en Cali)',
          transcript:
            '«¡Uy, si contratan a Valeria se ganan la lotería! Esa mujer es súper organizada con las matrices del Ministerio y tiene un don de gentes impresionante; los profes la respetan muchísimo.»',
          verdict: 'positive'
        },
        lupaClues: {
          bodyLanguage: 'Lupa: Mantiene contacto visual cálido, toma apuntes estructurados en su libreta y escucha sin interrumpir.',
          secretCvNote: 'Verificación Lupa: Premio nacional a la mejor experiencia de acompañamiento estudiantil 2025.'
        },
        trueSuitability: 'IDEAL',
        trueTechnicalScore: 5,
        trueCulturalScore: 5,
        hiringVerdictTitle: '¡Contratación Impecable! Talento 100% Javeriano',
        hiringVerdictExplanation:
          '¡La sacaste del estadio! La Mg. Valeria Ocampo demostró con hechos verificables (Método STAR) tanto dominio técnico en acreditación y analítica como una vivencia genuina de la Cura Personalis y el trabajo colaborativo.',
        keyTrapExplanation: 'Candidata ideal: equilibrio perfecto entre excelencia técnica (Magis) y calidad humana.'
      },
      {
        id: 'cand_1c_santiago',
        name: 'Esp. Santiago Restrepo',
        roleTitle: 'Especialista en Mercadeo • Docente Catedrático',
        age: 29,
        yearsExperience: 4,
        portraitUrl: '/assets/candidates/cand_1c_santiago.jpg',
        shortBio:
          'Conocido por ser el alma de las fiestas y eventos de la facultad; cae súper bien de entrada, pero tiende a improvisar y dejar colgados los procesos técnicos.',
        voicePitch: 205,
        greeting:
          '¡Quiubo jefe, qué más! Qué oficinota con vista al Samán. Conmigo cuente para lo que sea, yo le pongo toda la actitud y verá cómo ponemos a todo el mundo contento.',
        education: [
          'Especialista en Gerencia de Mercadeo',
          'Administrador de Empresas'
        ],
        experienceSummary: [
          'Comité de Eventos y Mercadeo Universitario (2 años): Organizó ferias de colegios.',
          'Profesor Hora Cátedra (2 años): Muy querido, pero entregó tarde las notas y rúbricas.'
        ],
        cvHighlights: [
          {
            id: 'cv_1c_1',
            section: 'resumen',
            title: 'Vocero estudiantil y gran carisma en actividades de integración',
            detail: 'Facilidad para romper el hielo en bienvenidas de semestre.',
            classification: 'green_flag',
            explanation: 'Tiene buena energía comunicativa, pero toca ver si tiene estructura para gerenciar el programa.'
          },
          {
            id: 'cv_1c_2',
            section: 'experiencia',
            title: 'Cero experiencia en informes de Acreditación o Registro Calificado',
            detail: 'Nunca ha liderado autoevaluaciones ni comités curriculares.',
            classification: 'yellow_flag',
            explanation: '¡Alerta! El cargo necesita sacar adelante la acreditación ya mismo, no solo hacer eventos.'
          },
          {
            id: 'cv_1c_3',
            section: 'datos_personales',
            title: 'Hincha de tu mismo equipo, monta bici en Pance y conoce a tus amigos',
            detail: 'Conversación inicial llena de gustos en común.',
            classification: 'bias_trap',
            explanation: '¡Ojo con el Sesgo de Afinidad! Que te caiga bacanísimo para tomar café no significa que sepa coordinar la carrera.'
          }
        ],
        phoneReference: {
          contactName: 'Prof. Camilo Palau',
          contactRole: 'Coordinador de Área',
          transcript:
            '«Santi es un bacán, todo el mundo lo quiere, pero siendo sinceros es muy desordenado. Cuando nos tocó entregar el informe al Ministerio nos dejó tirados con los anexos porque se embolató.»',
          verdict: 'warning'
        },
        lupaClues: {
          bodyLanguage: 'Lupa: Sonríe bastante y hace chistes cuando le preguntas por indicadores técnicos para cambiar de tema.',
          secretCvNote: 'Nota oculta en CV: Tres llamados de atención por no subir actas de comité a tiempo.'
        },
        trueSuitability: 'CHARISMA_TRAP',
        trueTechnicalScore: 2,
        trueCulturalScore: 3,
        hiringVerdictTitle: 'Contratación Fallida (Caíste en el Sesgo de Simpatía)',
        hiringVerdictExplanation:
          'Te dejaste llevar por el carisma y la labia de Santiago, pero al momento de responder con el Método STAR quedó claro que improvisa y no tiene el rigor técnico para liderar la acreditación del pregrado.',
        keyTrapExplanation: 'Sesgo de Simpatía/Afinidad: confundir caer bien y echar carreta con tener la competencia real.'
      }
    ],
    questions: [
      {
        id: 'q1_star_1',
        categoryLabel: 'Acompañamiento y Retención (Método STAR)',
        questionText:
          'Cuénteme un caso real donde un grupo de estudiantes estaba a punto de desertar. ¿Qué hizo usted exactamente y qué resultado medible logró?',
        quality: 'STAR_OPTIMAL',
        competencyTarget: 'Cura Personalis y Gestión con Indicadores',
        pedagogicalExplanation:
          '¡Pregunta STAR clave! Exige Situación, Tarea, Acción y Resultado verificable, dejando en evidencia quién actúa con método y quién improvisa.',
        responses: {
          cand_1a_andres: {
            answerText:
              'Mire, yo no estoy para rogarle a nadie. Cuando el 35% iba perdiendo mi materia, les mandé un correo diciendo que el que no pudiera con el nivel se pasara a otra universidad más suave. Así filtramos y nos quedamos solo con los mejores.',
            mood: 'confident',
            signalType: 'alerta_riesgo',
            signalSummary: '¡Bandera Roja! Cero Cura Personalis; confunde exigencia académica con desinterés por el estudiante.',
            technicalDelta: 0,
            culturalDelta: -2,
            javeValueHighlighted: 'Atenta contra Cura Personalis',
            followUpPrompt: 'Presionar: ¿Y eso no disparó la deserción del programa ese semestre?',
            followUpAnswer:
              'Pues sí, se retiraron como 22 muchachos, pero ese no es problema mío sino de los colegios de donde vienen.',
            followUpSignal: 'Confirmado: Se lava las manos ante el indicador de retención.'
          },
          cand_1b_valeria: {
            answerText:
              'Hace dos años vimos en la semana 4 que 60 primíparos iban colgados en cálculo y lectura crítica. Armé con el Centro de Bienestar una ruta de alerta temprana con monitores pares y consejería; cerramos el año reteniendo al 91% y subieron el promedio de 2.8 a 3.5.',
            mood: 'enthusiastic',
            signalType: 'acierto_fuerte',
            signalSummary: '¡Respuesta STAR de 10! Datos claros, acción articulada y cuidado genuino por el estudiante.',
            technicalDelta: 2,
            culturalDelta: 2,
            javeValueHighlighted: 'Cura Personalis + Magis',
            followUpPrompt: 'Profundizar: ¿Cómo logró que los estudiantes asistieran sin sentirse estigmatizados?',
            followUpAnswer:
              'Llamamos al programa «Parceros Académicos» e involucramos a estudiantes de últimos semestres; la asistencia fue voluntaria del 94%.',
            followUpSignal: '¡Brillante! Estrategia empática y efectiva.'
          },
          cand_1c_santiago: {
            answerText:
              '¡Uy, yo soy súper cercano a los pelados! Una vez los vi estresados antes de finales y les llevé empanadas y gaseosa al salón para que se relajaran. La pasamos buenísimo, aunque la verdad no miré cuántos se matricularon el siguiente semestre.',
            mood: 'enthusiastic',
            signalType: 'respuesta_ambigua',
            signalSummary: 'Mucha buena onda, pero pura improvisación sin seguimiento ni indicadores.',
            technicalDelta: -1,
            culturalDelta: 1,
            javeValueHighlighted: 'Simpatía sin rigor técnico',
            followUpPrompt: 'Presionar: ¿Pero diseñó algún plan académico o seguimiento formal?',
            followUpAnswer:
              'Eh... no, formalmente no llevé planilla porque a mí tanta burocracia de Excel me da pereza, yo soy más de fluir.',
            followUpSignal: '¡Se destapó! Confiesa que no hace seguimiento técnico.'
          }
        }
      },
      {
        id: 'q1_star_2',
        categoryLabel: 'Liderazgo con Profesores (Método STAR)',
        questionText:
          'Hábleme de una vez en que le tocó liderar un cambio curricular con profesores que se resistían. ¿Cómo manejó el roce y en qué terminó?',
        quality: 'STAR_OPTIMAL',
        competencyTarget: 'Liderazgo Colaborativo y Negociación',
        pedagogicalExplanation:
          'Permite evaluar cómo gestiona el poder y los consensos en una comunidad universitaria.',
        responses: {
          cand_1a_andres: {
            answerText:
              'Los profesores de cátedra siempre ponen peros. Yo redacté la reforma encerrado en mi oficina el fin de semana y el lunes les notifiqué que el que no se acogiera no tenía contrato el otro semestre. Santo remedio.',
            mood: 'confident',
            signalType: 'alerta_riesgo',
            signalSummary: '¡Alerta Roja! Liderazgo autoritario a punta de amenazas que destruye el clima organizacional.',
            technicalDelta: 1,
            culturalDelta: -2,
            javeValueHighlighted: 'Antítesis del Trabajo Colaborativo',
            followUpPrompt: 'Presionar: ¿Y qué pasó con los 6 docentes que renunciaron ese año?',
            followUpAnswer:
              'Se fueron porque eran demasiado susceptibles; yo prefiero que me tengan miedo a que me cuestionen.',
            followUpSignal: '¡Gravísimo! Confirma las quejas de maltrato laboral.'
          },
          cand_1b_valeria: {
            answerText:
              'Cuando implementamos Resultados de Aprendizaje, 8 profes antiguos sentían que les íbamos a imponer una camisa de fuerza. Hice talleres por área donde ellos mismos lideraron las rúbricas desde su experiencia; aprobamos el 100% del currículo por consenso en Consejo.',
            mood: 'thoughtful',
            signalType: 'acierto_fuerte',
            signalSummary: '¡Acierto STAR! Escucha activa, respeto por el saber docente y logro concreto.',
            technicalDelta: 2,
            culturalDelta: 2,
            javeValueHighlighted: 'Comunidad y Colaboración',
            followUpPrompt: 'Profundizar: ¿Qué hizo con el profesor más reacio del grupo?',
            followUpAnswer:
              'Me tomé un café con él, entendí que su temor era el manejo de la plataforma digital y le asigné un monitor de apoyo; terminó siendo nuestro mayor aliado.',
            followUpSignal: 'Cura Personalis aplicada también al equipo docente.'
          },
          cand_1c_santiago: {
            answerText:
              'Nooo, yo con los profes bravos no me meto para no ganarme enemigos. Si un profesor no quiere actualizar su programa, yo le digo «fresco profe, déjelo como el de hace diez años» y todos felices.',
            mood: 'nervous',
            signalType: 'alerta_riesgo',
            signalSummary: 'Evade su responsabilidad por miedo al conflicto, poniendo en riesgo la calidad académica.',
            technicalDelta: -2,
            culturalDelta: 0,
            javeValueHighlighted: 'Falta de carácter directivo',
            followUpPrompt: 'Presionar: ¿Y cuando lleguen los pares del CNA a revisar esos sílabos desactualizados?',
            followUpAnswer:
              'Uy, ahí sí tocaría ver cómo les echamos un buen cuento ese día para que no se den cuenta...',
            followUpSignal: '¡Peligro! Propone improvisar frente a los pares académicos.'
          }
        }
      },
      {
        id: 'q1_star_3',
        categoryLabel: 'Rigor en Acreditación (Método STAR)',
        questionText:
          'Cuénteme de un proceso de autoevaluación o acreditación que haya coordinado con el tiempo en contra. ¿Cómo organizó los entregables?',
        quality: 'STAR_OPTIMAL',
        competencyTarget: 'Planeación y Excelencia (Magis)',
        pedagogicalExplanation:
          'Valida el conocimiento técnico real sobre procesos de calidad en educación superior.',
        responses: {
          cand_1a_andres: {
            answerText:
              'Yo escribí el factor de investigación en dos noches porque me lo sé de memoria, pero los factores de bienestar, egresados y docencia los dejé sin revisar porque esa carpintería administrativa no es digna de un Ph.D.',
            mood: 'thoughtful',
            signalType: 'respuesta_ambigua',
            signalSummary: 'Solo le importa su nicho de investigación y desprecia la gestión integral del programa.',
            technicalDelta: 1,
            culturalDelta: -1,
            javeValueHighlighted: 'Ego académico sobre el equipo'
          },
          cand_1b_valeria: {
            answerText:
              'A cuatro meses de la entrega al CNA monté un cronograma semanal por factores con indicadores semáforo, auditoría cruzada de anexos y simulacros con estudiantes, profes y empleadores. Nos dieron acreditación por 8 años con felicitación.',
            mood: 'confident',
            signalType: 'acierto_fuerte',
            signalSummary: '¡Dominio Técnico Total! Metodología probada y resultado sobresaliente.',
            technicalDelta: 2,
            culturalDelta: 1,
            javeValueHighlighted: 'Magis (Excelencia Integral)'
          },
          cand_1c_santiago: {
            answerText:
              'Pues yo nunca he leído los lineamientos técnicos del CNA, pero en la última visita me encargué de contratar el catering de pandebonos y champús para los pares y quedaron encantados.',
            mood: 'nervous',
            signalType: 'alerta_riesgo',
            signalSummary: 'Desconoce por completo la gestión técnica de acreditación.',
            technicalDelta: -2,
            culturalDelta: 0,
            javeValueHighlighted: 'Cero experiencia técnica en el rol'
          }
        }
      },
      {
        id: 'q1_superficial',
        categoryLabel: 'Pregunta Cliché de Cajón',
        questionText: 'Dígame, ¿cuál considera que es su mayor defecto y cómo se ve en 5 años?',
        quality: 'SUPERFICIAL',
        competencyTarget: 'Ninguna (Pregunta predecible de libreto)',
        pedagogicalExplanation:
          'Ojo: Estas preguntas clichés no evalúan competencias porque todo el mundo trae una respuesta de libreto aprendida de memoria.',
        responses: {
          cand_1a_andres: {
            answerText: 'Mi único defecto es exigir demasiada perfección en un entorno mediocre.',
            mood: 'confident',
            signalType: 'respuesta_ambigua',
            signalSummary: 'Respuesta de libreto que no aporta evidencia conductual.',
            technicalDelta: 0,
            culturalDelta: -1,
            javeValueHighlighted: 'Pregunta débil'
          },
          cand_1b_valeria: {
            answerText: 'Procuro cuidar siempre el balance entre el nivel de detalle y los tiempos del equipo.',
            mood: 'neutral',
            signalType: 'respuesta_ambigua',
            signalSummary: 'Respuesta correcta, pero perdiste la oportunidad de indagar un caso STAR real.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Sin evidencia STAR'
          },
          cand_1c_santiago: {
            answerText: '¡Uy jefe, mi defecto es que soy demasiado comprometido y perfeccionista!',
            mood: 'enthusiastic',
            signalType: 'respuesta_ambigua',
            signalSummary: 'El clásico cuento de entrevista que esconde su falta de orden.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Pura carreta de libreto'
          }
        }
      },
      {
        id: 'q1_biased',
        categoryLabel: 'Pregunta Invasiva / Con Sesgo',
        questionText:
          'Viendo que tiene hijos chiquitos o planes familiares, ¿eso no le va a impedir ponerse la camiseta cuando toque quedarse hasta tarde?',
        quality: 'BIASED_ILLEGAL',
        competencyTarget: 'Inválida (Sesgo Familiar y de Género)',
        biasWarningTitle: '¡Embarrada del Entrevistador! Pregunta con Sesgo Familiar',
        pedagogicalExplanation:
          '¡Pilas! Indagar por hijos, embarazo o vida familiar en una entrevista es discriminatorio e ilegal. Evalúa siempre por resultados y competencias, nunca por la vida privada.',
        responses: {
          cand_1a_andres: {
            answerText: 'Qué pregunta tan poco profesional, pero yo vivo solo para la academia.',
            mood: 'nervous',
            signalType: 'alerta_riesgo',
            signalSummary: 'Cometiste un error de reclutamiento al meterte en la vida privada.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Sesgo del Reclutador'
          },
          cand_1b_valeria: {
            answerText:
              'Mi rol como mamá jamás ha reñido con mi excelencia profesional; mis resultados de los últimos nueve años hablan por sí solos, y espero que la evaluación sea por competencias.',
            mood: 'nervous',
            signalType: 'alerta_riesgo',
            signalSummary: '¡Penalización! Incomodaste a la mejor candidata con un sesgo de maternidad.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Sesgo del Reclutador'
          },
          cand_1c_santiago: {
            answerText: '¡Fresco que yo soy soltero y sin compromiso, me quedo hasta que apaguen las luces!',
            mood: 'enthusiastic',
            signalType: 'alerta_riesgo',
            signalSummary: 'Mal criterio: medir compromiso por horas silla o soltería es una pésima práctica.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Sesgo del Reclutador'
          }
        }
      }
    ]
  },

  // ============================================================================
  // CASO 2: LIDERAZGO DE INNOVACIÓN Y TRANSFORMACIÓN DIGITAL
  // ============================================================================
  {
    id: 'case_2_innovacion',
    number: 2,
    title: 'Liderazgo de Innovación y Transformación Digital',
    facultyOrUnit: 'Dirección de Tecnologías de Información (DTI) • Campus Javeriana',
    difficulty: 'Nivel 2 • Intermedio',
    urgencyContext:
      'Estamos modernizando el ecosistema digital del campus e integrando IA ética para docencia e investigación, trabajando de la mano con todas las facultades.',
    deanRequestMemo:
      '«Necesitamos un líder duro en arquitectura cloud y ciberseguridad, pero que entienda que en la Universidad la tecnología está para servir a la gente. Ya tuvimos malas experiencias con ingenieros brillantes que tratan a las patadas a los profes, o gente muy querida que le tiene pavor a innovar.»',
    coreJaverianaValues: [
      'Vocación de Servicio y Trabajo Interdisciplinario',
      'Magis e Innovación con Ética Digital',
      'Trato Digno y Empático (Cura Personalis)'
    ],
    requiredCorrectCount: 4,
    profileOptions: [
      {
        id: 'p2_opt1',
        label: 'Arquitectura Cloud, Ciberseguridad e Interoperabilidad',
        category: 'competencia_tecnica',
        description: 'Experiencia real liderando plataformas digitales críticas y seguras.',
        isCorrect: true,
        pedagogicalNote: 'Acierto: Competencia técnica indispensable para sostener los servicios del campus.'
      },
      {
        id: 'p2_opt2',
        label: 'Vocación de Servicio y Pedagogía con Usuarios No Técnicos',
        category: 'competencia_humana',
        description: 'Paciencia y empatía para co-diseñar soluciones con docentes y estudiantes.',
        isCorrect: true,
        pedagogicalNote: '¡Clave! Sin empatía humana, ningún proyecto tecnológico despega en la universidad.'
      },
      {
        id: 'p2_opt3',
        label: 'Gobernanza Ética de Datos e Inteligencia Artificial',
        category: 'competencia_tecnica',
        description: 'Criterio técnico y ético para proteger datos estudiantiles y evitar sesgos algorítmicos.',
        isCorrect: true,
        pedagogicalNote: '¡Excelente! Conecta la ingeniería con el humanismo javeriano.'
      },
      {
        id: 'p2_opt4',
        label: 'Liderazgo Ágil de Equipos de Desarrollo y Soporte',
        category: 'competencia_humana',
        description: 'Capacidad para formar talento joven y articular mesas interdisciplinarias.',
        isCorrect: true,
        pedagogicalNote: 'Acierto: El rol lidera personas, no solo servidores.'
      },
      {
        id: 'p2_opt5',
        label: 'Preferir candidatos hombres por ser jefatura de infraestructura TI',
        category: 'requisito_formal',
        description: 'Priorizar ingenieros hombres asumiendo mayor autoridad técnica.',
        isCorrect: false,
        isBiasTrap: true,
        biasType: 'Sesgo de Género en STEM',
        pedagogicalNote:
          '¡Alerta de Sesgo! Creer que el liderazgo en sistemas tiene género es un prejuicio obsoleto y discriminatorio.'
      },
      {
        id: 'p2_opt6',
        label: 'Solo menores de 25 años porque «los mayores no entienden de IA»',
        category: 'requisito_formal',
        description: 'Exigir edad juvenil asumiendo que la innovación depende de la edad.',
        isCorrect: false,
        isBiasTrap: true,
        biasType: 'Edadismo Tecnológico',
        pedagogicalNote:
          '¡Falso! El dominio de IA y arquitectura depende del estudio y la práctica, no de la fecha de nacimiento.'
      }
    ],
    candidates: [
      {
        id: 'cand_2a_camila',
        name: 'Ing. Camila Quintero',
        roleTitle: 'Ing. de Sistemas • Magíster en Transformación Digital',
        age: 33,
        yearsExperience: 9,
        portraitUrl: '/assets/candidates/cand_2a_camila.jpg',
        shortBio:
          'Arquitecta cloud graduada con honores, experta en EdTech y ética de datos, reconocida por su liderazgo cercano y colaborativo.',
        voicePitch: 240,
        greeting:
          '¡Buenas! Qué gusto saludarte. Estoy convencida de que la mejor tecnología universitaria es la que le quita cargas al profesor y acerca al estudiante.',
        education: [
          'Magíster en Transformación Digital y Arquitectura de Software',
          'Ingeniera de Sistemas y Computación'
        ],
        experienceSummary: [
          'Líder de Innovación EdTech (5 años): Migró campus virtual de 18,000 usuarios con 99.9% de uptime y 94% de satisfacción.',
          'Arquitecta de Datos (4 años): Diseñó marco de IA ética y privacidad universitaria.'
        ],
        cvHighlights: [
          {
            id: 'cv_2a_1',
            section: 'logros',
            title: '94% de adopción docente en nueva plataforma gracias a clínicas de co-diseño',
            detail: 'Unió arquitectura cloud moderna con acompañamiento humano en cada facultad.',
            classification: 'green_flag',
            explanation: '¡Evidencia contundente! Demuestra excelencia técnica y verdadero espíritu de servicio.'
          },
          {
            id: 'cv_2a_2',
            section: 'educacion',
            title: 'Certificación en Seguridad Cloud y Auditoría Ética de Algoritmos',
            detail: 'Experiencia real previniendo fugas de datos y sesgos en modelos de IA.',
            classification: 'green_flag',
            explanation: 'Calza como anillo al dedo para la transformación digital de la Universidad.'
          },
          {
            id: 'cv_2a_3',
            section: 'datos_personales',
            title: 'Egresada de universidad pública de provincia con beca',
            detail: 'No estudió en las mismas universidades privadas tradicionales de otros candidatos.',
            classification: 'bias_trap',
            explanation: 'Evita el sesgo elitista de origen universitario: sus logros técnicos y humanos son sobresalientes.'
          }
        ],
        phoneReference: {
          contactName: 'Ing. Roberto Caicedo',
          contactRole: 'Director Nacional de Tecnología Educativa',
          transcript:
            '«Camila es una dura. Cuando tuvimos el reto de migrar toda la plataforma en pandemia, no solo armó una arquitectura en AWS a prueba de balas, sino que tuvo la paciencia de entrenar a 400 profesores con un cariño admirable.»',
          verdict: 'positive'
        },
        lupaClues: {
          bodyLanguage: 'Lupa: Postura abierta y serena; explica conceptos complejos de nube en lenguaje claro y sin tecnicismos arrogantes.',
          secretCvNote: 'Verificación Lupa: Repositorios y arquitecturas documentadas con calificación 5/5 en auditoría ISO 27001.'
        },
        trueSuitability: 'IDEAL',
        trueTechnicalScore: 5,
        trueCulturalScore: 5,
        hiringVerdictTitle: '¡Contratación Brillante! Innovación con Sello Humano',
        hiringVerdictExplanation:
          'La Ing. Camila Quintero demostró con evidencias STAR un dominio técnico impecable en nube, seguridad e IA ética, unido a una vocación genuina de servicio y trabajo colaborativo con las facultades.',
        keyTrapExplanation: 'Candidata ideal: solvencia técnica superior y total afinidad con los valores javerianos.'
      },
      {
        id: 'cand_2b_mauricio',
        name: 'Ing. Mauricio Franco',
        roleTitle: 'Arquitecto Senior Cloud & DevSecOps',
        age: 35,
        yearsExperience: 11,
        portraitUrl: '/assets/candidates/cand_2b_mauricio.jpg',
        shortBio:
          'Un «monstruo» técnico programando e instalando servidores, pero soberbio, individualista y descuidado con la ética de privacidad.',
        voicePitch: 160,
        greeting:
          'Qué más. Ya miré por encima los sistemas que tienen acá y están quedadísimos. Si me dejan encerrarme a programar sin que los profesores me molesten con preguntas bobas, les armo todo de cero.',
        education: [
          'Magíster en Ciberseguridad e Infraestructura',
          'Ingeniero de Sistemas'
        ],
        experienceSummary: [
          'Arquitecto Principal Cloud (6 años): Bajó costos de servidores un 40%.',
          'Líder Técnico Fintech (5 años): Lo relevaron del manejo de personal por quejas de acoso laboral.'
        ],
        cvHighlights: [
          {
            id: 'cv_2b_1',
            section: 'logros',
            title: 'Reducción del 55% en latencia de servidores y automatización DevSecOps',
            detail: 'Altísima destreza técnica en infraestructura dura.',
            classification: 'green_flag',
            explanation: 'Sabe mucho de fierros y código, pero ojo: el cargo es para liderar personas y servir al campus.'
          },
          {
            id: 'cv_2b_2',
            section: 'experiencia',
            title: 'Removido de liderazgo de equipo por «choques reiterados de comunicación»',
            detail: 'Antecedente de maltrato hacia ingenieros junior y usuarios.',
            classification: 'yellow_flag',
            explanation: '¡Bandera amarilla crítica! Hay que indagar en entrevista cómo trata a su equipo y a los usuarios.'
          },
          {
            id: 'cv_2b_3',
            section: 'datos_personales',
            title: 'Pinta de «hacker genio de película» en buzo cuello tortuga negro',
            detail: 'Estereotipo visual de programador estrella.',
            classification: 'bias_trap',
            explanation: 'No caigas en el mito de que para ser buen ingeniero toca ser arrogante o solitario.'
          }
        ],
        phoneReference: {
          contactName: 'Dra. Juliana Vélez',
          contactRole: 'Gerente de Talento Humano en Fintech',
          transcript:
            '«Mauricio sabe muchísimo de código, no se lo niego, pero nos tocó quitarle la gente a cargo porque hacía llorar a los practicantes y trataba de brutos a los usuarios. Además, se saltó protocolos de datos personales por hacer las cosas a su manera.»',
          verdict: 'warning'
        },
        lupaClues: {
          bodyLanguage: 'Lupa: Cruza los brazos y revolea los ojos cada vez que hablas de trabajo en equipo o ética de datos.',
          secretCvNote: 'Nota oculta en CV: Sanción interna previa por subir bases de datos de clientes sin anonimizar a un servidor externo.'
        },
        trueSuitability: 'TECH_TRAP',
        trueTechnicalScore: 5,
        trueCulturalScore: 1,
        hiringVerdictTitle: 'Contratación Tóxica (Trampa del «Genio Solitario»)',
        hiringVerdictExplanation:
          'Aunque Mauricio es muy hábil técnicamente, su desprecio por los usuarios, su maltrato al equipo y su imprudencia ética con los datos privados pondrían en grave riesgo a la Universidad.',
        keyTrapExplanation: 'Deslumbrarse solo por la habilidad técnica dura ignorando alertas éticas y de liderazgo.'
      },
      {
        id: 'cand_2c_felipe',
        name: 'Ing. Felipe Delgado',
        roleTitle: 'Coordinador de Mesa de Ayuda Tradicional',
        age: 39,
        yearsExperience: 13,
        portraitUrl: '/assets/candidates/cand_2c_felipe.jpg',
        shortBio:
          'Súper formal, querido y recomendado por un amigo, pero lleva diez años haciendo solo soporte básico de impresoras y le tiene miedo a la nube y a la IA.',
        voicePitch: 190,
        greeting:
          '¡Hola, cómo me le va! Mire, yo soy de la vieja guardia: a mí deme procedimientos en papel con tres firmas y verá que no nos metemos en líos con esas modas de la nube ni la inteligencia artificial.',
        education: [
          'Especialista en Administración Tradicional',
          'Ingeniero Informático'
        ],
        experienceSummary: [
          'Jefe de Mesa de Ayuda (8 años): Muy amable, pero cero proyectos de modernización.',
          'Soporte Técnico (5 años): Mantenimiento de computadores e impresoras.'
        ],
        cvHighlights: [
          {
            id: 'cv_2c_1',
            section: 'logros',
            title: 'Felicitaciones por su trato decente y paciente en atención telefónica',
            detail: 'Buena actitud interpersonal.',
            classification: 'green_flag',
            explanation: 'Tiene cordialidad, pero hay que evaluar si tiene el nivel técnico para transformar digitalmente el campus.'
          },
          {
            id: 'cv_2c_2',
            section: 'experiencia',
            title: 'Sin experiencia en arquitectura cloud, desarrollo ágil ni IA',
            detail: 'Su trayectoria ha sido 100% operativa en soporte correctivo.',
            classification: 'yellow_flag',
            explanation: 'Brecha técnica enorme para un cargo estratégico de Innovación.'
          },
          {
            id: 'cv_2c_3',
            section: 'datos_personales',
            title: 'Tarjetazo de recomendación: «Es sobrino de un amigo muy querido»',
            detail: 'Nota pegada con clip pidiendo «ayudarle en el proceso».',
            classification: 'bias_trap',
            explanation: '¡Cero rosca o nepotismo! En la Javeriana se elige por mérito y competencias, nunca por palanca.'
          }
        ],
        phoneReference: {
          contactName: 'Dr. Fernando Otoya',
          contactRole: 'Gerente Administrativo',
          transcript:
            '«Felipito es un pan de Dios, súper educado, pero tecnológicamente se quedó en el año 2008. Cada vez que proponíamos subir algo a la nube nos frenaba todo por miedo.»',
          verdict: 'warning'
        },
        lupaClues: {
          bodyLanguage: 'Lupa: Suda frío y se acomoda las gafas nervioso cuando mencionas arquitectura en la nube o inteligencia artificial.',
          secretCvNote: 'Verificación Lupa: No registra ninguna actualización técnica en los últimos 9 años.'
        },
        trueSuitability: 'CHARISMA_TRAP',
        trueTechnicalScore: 2,
        trueCulturalScore: 3,
        hiringVerdictTitle: 'Contratación Estancada (Sesgo de Recomendación / Conformismo)',
        hiringVerdictExplanation:
          'Felipe es muy buena persona, pero carece por completo de las competencias técnicas en arquitectura cloud e innovación, y su resistencia al cambio frenaría el avance de la Universidad.',
        keyTrapExplanation: 'Ceder ante una recomendación personal o confundir amabilidad con capacidad de innovación (Magis).'
      }
    ],
    questions: [
      {
        id: 'q2_star_1',
        categoryLabel: 'Adopción Tecnológica y Servicio (Método STAR)',
        questionText:
          'Cuénteme de un proyecto donde los usuarios no querían usar una nueva plataforma. ¿Cómo los acompañó y qué resultado de adopción tuvo?',
        quality: 'STAR_OPTIMAL',
        competencyTarget: 'Espíritu de Servicio y Gestión del Cambio',
        pedagogicalExplanation:
          'Indaga hechos reales de empatía con el usuario y efectividad en transformación digital.',
        responses: {
          cand_2a_camila: {
            answerText:
              'Cuando lanzamos el nuevo sistema académico, varios profes mayores sentían que era enredado. En vez de imponerlo por decreto, monté «talleres manos a la obra» en cada facultad con cafecito, escuchamos sus sugerencias y simplificamos 12 pantallas. En dos meses llegamos al 94% de uso feliz.',
            mood: 'enthusiastic',
            signalType: 'acierto_fuerte',
            signalSummary: '¡Acierto STAR Total! Co-diseño empático, respeto al docente y métrica contundente.',
            technicalDelta: 2,
            culturalDelta: 2,
            javeValueHighlighted: 'Servicio + Cura Personalis',
            followUpPrompt: 'Profundizar: ¿Y cómo midieron que los profesores sí quedaron tranquilos?',
            followUpAnswer:
              'Los tickets de soporte cayeron un 68% y el NPS docente subió a 4.8 sobre 5.',
            followUpSignal: '¡Evidencia cuantitativa impecable!'
          },
          cand_2b_mauricio: {
            answerText:
              'Es que a los usuarios no hay que preguntarles nada porque no saben qué quieren. Yo les apagué el sistema viejo un viernes a medianoche y el lunes les tocó aprender a las malas; al que se quejaba le cerraba el ticket sin contestarle.',
            mood: 'confident',
            signalType: 'alerta_riesgo',
            signalSummary: '¡Bandera Roja! Soberbia técnica y maltrato al usuario.',
            technicalDelta: 0,
            culturalDelta: -2,
            javeValueHighlighted: 'Cero Espíritu de Servicio',
            followUpPrompt: 'Presionar: ¿Y qué pasó con la operación ese lunes?',
            followUpAnswer:
              'Colapsó la línea de atención tres días, pero eso les pasa por no leerse el manual técnico que les mandé en inglés.',
            followUpSignal: 'Culpabiliza al usuario de su propia falta de gestión del cambio.'
          },
          cand_2c_felipe: {
            answerText:
              'Nooo, si yo veo que los profesores se estresan con un programa nuevo, yo prefiero dejar quieto eso y que sigan pasando las notas en hojitas de papel firmadas como toda la vida.',
            mood: 'neutral',
            signalType: 'alerta_riesgo',
            signalSummary: 'Renuncia a innovar y mantiene procesos obsoletos.',
            technicalDelta: -2,
            culturalDelta: 0,
            javeValueHighlighted: 'Falta total de Magis',
            followUpPrompt: 'Presionar: ¿Pero el cargo es justamente para liderar la transformación digital?',
            followUpAnswer:
              'Pues sí, pero es que a mí esas cosas modernas en la nube me dan mucha desconfianza...',
            followUpSignal: 'Temor paralizante ante la tecnología actual.'
          }
        }
      },
      {
        id: 'q2_star_2',
        categoryLabel: 'Ética de Datos e IA (Método STAR)',
        questionText:
          'Hábleme de una situación real donde tuvo que proteger la privacidad de datos o corregir un sesgo en un sistema o modelo de IA.',
        quality: 'STAR_OPTIMAL',
        competencyTarget: 'Ética Digital y Ciberseguridad',
        pedagogicalExplanation:
          'Evalúa la responsabilidad ética y legal en el manejo de datos sensibles de la comunidad.',
        responses: {
          cand_2a_camila: {
            answerText:
              'En un piloto de IA para predecir deserción, descubrí en las pruebas que el modelo estaba calificando mal a estudiantes por su barrio de residencia. Paré el lanzamiento de inmediato, reentrenamos el algoritmo sin variables socioeconómicas y montamos un comité ético con Bienestar.',
            mood: 'thoughtful',
            signalType: 'acierto_fuerte',
            signalSummary: '¡Sobresaliente! Rigor técnico en auditoría algorítmica y sentido ético javeriano.',
            technicalDelta: 2,
            culturalDelta: 2,
            javeValueHighlighted: 'Ética y Dignidad Humana'
          },
          cand_2b_mauricio: {
            answerText:
              'Esa carreta de la ley de habeas data solo sirve para atrasar entregas. Hace seis meses subí toda la base de datos real con cédulas y teléfonos a un servidor público gratuito para entrenar un bot rápido; nadie se dio cuenta y ahorré plata.',
            mood: 'confident',
            signalType: 'alerta_riesgo',
            signalSummary: '¡Peligro Legal y Ético Gravísimo! Violación flagrante de privacidad de datos.',
            technicalDelta: -1,
            culturalDelta: -2,
            javeValueHighlighted: 'Riesgo Institucional Crítico'
          },
          cand_2c_felipe: {
            answerText:
              'Para no tener líos con algoritmos, en mi oficina yo prohibí hasta el Wi-Fi; todo lo guardamos en carpetas AZ con candado en el archivador metálico.',
            mood: 'nervous',
            signalType: 'alerta_riesgo',
            signalSummary: 'Obsolescencia técnica total para dirigir el área de TI.',
            technicalDelta: -2,
            culturalDelta: 0,
            javeValueHighlighted: 'Brecha Técnica Crítica'
          }
        }
      },
      {
        id: 'q2_star_3',
        categoryLabel: 'Liderazgo en Crisis Técnica (Método STAR)',
        questionText:
          'Cuénteme de la caída de servicio o incidente de seguridad más bravo que le haya tocado enfrentar. ¿Cómo manejó a su equipo bajo presión?',
        quality: 'STAR_OPTIMAL',
        competencyTarget: 'Liderazgo Resiliente y Arquitectura Cloud',
        pedagogicalExplanation:
          'Mide tanto la capacidad arquitectónica como el manejo emocional del equipo en momentos críticos.',
        responses: {
          cand_2a_camila: {
            answerText:
              'En pleno cierre de matrículas sufrimos un ataque de denegación de servicio. Activé con mi equipo el protocolo de mitigación cloud en 12 minutos, mantuve informada a Rectoría y luego hicimos una sesión de aprendizaje sin buscar culpables para blindar el firewall.',
            mood: 'confident',
            signalType: 'acierto_fuerte',
            signalSummary: '¡Liderazgo Ejemplar! Solvencia en ciberseguridad y cultura de equipo sana.',
            technicalDelta: 2,
            culturalDelta: 1,
            javeValueHighlighted: 'Magis y Trabajo Colaborativo'
          },
          cand_2b_mauricio: {
            answerText:
              'Cuando se nos cayó la base de datos saqué a gritos a los ingenieros junior de la sala porque me estresaban, arreglé el código yo solo y al otro día hice despedir al practicante que cometió el error.',
            mood: 'confident',
            signalType: 'alerta_riesgo',
            signalSummary: 'Liderazgo tóxico y punitivo que destruye a los equipos.',
            technicalDelta: 1,
            culturalDelta: -2,
            javeValueHighlighted: 'Maltrato Laboral'
          },
          cand_2c_felipe: {
            answerText:
              'Uy, cuando algo falla en el servidor yo apago el taco de la luz, me pongo a rezar y llamo a un técnico externo para que venga la otra semana porque a mí me da susto tocar eso.',
            mood: 'nervous',
            signalType: 'alerta_riesgo',
            signalSummary: 'No cuenta con las competencias técnicas mínimas del cargo.',
            technicalDelta: -2,
            culturalDelta: 0,
            javeValueHighlighted: 'Incompetencia Técnica'
          }
        }
      },
      {
        id: 'q2_superficial',
        categoryLabel: 'Pregunta Acertijo Sin Sentido',
        questionText: 'Si usted fuera una pieza de computador o un animal de la selva, ¿cuál sería?',
        quality: 'SUPERFICIAL',
        competencyTarget: 'Ninguna (Pregunta sin validez predictiva)',
        pedagogicalExplanation:
          'Las preguntas de «si fueras un árbol o un animal» no tienen ninguna base científica en selección por competencias.',
        responses: {
          cand_2a_camila: {
            answerText: 'Diría que un procesador multinúcleo por el trabajo coordinado, aunque prefiero contarte de nuestros proyectos reales.',
            mood: 'neutral',
            signalType: 'respuesta_ambigua',
            signalSummary: 'Pregunta trivial que desaprovecha el tiempo de entrevista.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Pregunta sin rigor'
          },
          cand_2b_mauricio: {
            answerText: 'Un lobo solitario, obviamente.',
            mood: 'confident',
            signalType: 'respuesta_ambigua',
            signalSummary: 'No aporta evidencia técnica ni conductual.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Pregunta sin rigor'
          },
          cand_2c_felipe: {
            answerText: '¡Una tortuguita! Despacio pero seguro, jefe.',
            mood: 'enthusiastic',
            signalType: 'respuesta_ambigua',
            signalSummary: 'Curioso, pero irrelevante como método de evaluación.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Pregunta sin rigor'
          }
        }
      },
      {
        id: 'q2_biased',
        categoryLabel: 'Pregunta con Estereotipo de Género',
        questionText:
          'Como este gremio de sistemas e infraestructura es tan pesado y de hombres, ¿no siente que le va a quedar grande mandar a los ingenieros?',
        quality: 'BIASED_ILLEGAL',
        competencyTarget: 'Inválida (Estereotipo Machista / Sesgo de Género)',
        biasWarningTitle: '¡Alerta de Sesgo de Género del Entrevistador!',
        pedagogicalExplanation:
          'Asumir que la autoridad o el conocimiento técnico dependen del género es un sesgo discriminatorio inaceptable.',
        responses: {
          cand_2a_camila: {
            answerText:
              'Llevo nueve años liderando equipos de ingeniería de alto rendimiento; el respeto de un equipo técnico se gana con criterio, conocimiento y buen trato, nunca por el género.',
            mood: 'nervous',
            signalType: 'alerta_riesgo',
            signalSummary: '¡Penalización al reclutador! Hiciste una pregunta con sesgo de género.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Error del Entrevistador'
          },
          cand_2b_mauricio: {
            answerText: 'Totalmente de acuerdo, en sistemas toca hablar golpeado para que respeten.',
            mood: 'confident',
            signalType: 'alerta_riesgo',
            signalSummary: 'Tu pregunta sesgada alimentó estereotipos machistas.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Error del Entrevistador'
          },
          cand_2c_felipe: {
            answerText: 'Pues nosotros en la oficina hablamos de fútbol todo el día.',
            mood: 'neutral',
            signalType: 'alerta_riesgo',
            signalSummary: 'Pregunta sesgada que desvía el proceso de selección.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Error del Entrevistador'
          }
        }
      }
    ]
  },

  // ============================================================================
  // CASO 3: DIRECCIÓN DEL CENTRO DE BIENESTAR UNIVERSITARIO
  // ============================================================================
  {
    id: 'case_3_bienestar',
    number: 3,
    title: 'Dirección del Centro de Bienestar Universitario',
    facultyOrUnit: 'Vicerrectoría del Medio Universitario • Comunidad del Samán',
    difficulty: 'Nivel 3 • Avanzado',
    urgencyContext:
      'Necesitamos fortalecer la red de salud mental, inclusión de becarios y formación integral en el campus, gerenciando a 40 profesionales con sensibilidad humana e indicadores claros.',
    deanRequestMemo:
      '«El Medio Universitario es el corazón de nuestra Javeriana. Buscamos a alguien que sepa gerenciar presupuesto y activar rutas clínicas de salud mental sin titubear, pero que al mismo tiempo haga sentir a cada estudiante como en casa bajo el Samán. Cuidado con los perfiles puramente policivos o con quienes tienen buenas intenciones pero cero cancha directiva.»',
    coreJaverianaValues: [
      'Formación Integral y Cura Personalis',
      'Inclusión, Diversidad y Justicia Social',
      'Gerencia Rigurosa al Servicio de la Comunidad'
    ],
    requiredCorrectCount: 4,
    profileOptions: [
      {
        id: 'p3_opt1',
        label: 'Liderazgo de Protocolos de Salud Mental y Atención en Crisis',
        category: 'competencia_tecnica',
        description: 'Dominio clínico y ético de rutas de emergencia psicosocial y prevención.',
        isCorrect: true,
        pedagogicalNote: '¡Fundamental! En salud mental universitaria no se puede improvisar.'
      },
      {
        id: 'p3_opt2',
        label: 'Enfoque de Inclusión, Diversidad Cultural y Escucha Empática',
        category: 'competencia_humana',
        description: 'Capacidad para acoger a becarios, foráneos y grupos diversos sin prejuicios.',
        isCorrect: true,
        pedagogicalNote: '¡Tal cual! Ese es el sello del Medio Universitario Javeriano.'
      },
      {
        id: 'p3_opt3',
        label: 'Gerencia de Equipos Interdisciplinarios, Presupuesto e Indicadores',
        category: 'competencia_tecnica',
        description: 'Experiencia administrando recursos y midiendo el impacto del bienestar en la retención.',
        isCorrect: true,
        pedagogicalNote: 'Acierto: Dirigir a 40 profesionales exige cabeza gerencial además de corazón.'
      },
      {
        id: 'p3_opt4',
        label: 'Posgrado en Psicología, Desarrollo Humano o Gerencia Social',
        category: 'requisito_formal',
        description: 'Formación sólida y trayectoria liderando programas comunitarios o universitarios.',
        isCorrect: true,
        pedagogicalNote: 'Requisito formal pertinente y objetivo.'
      },
      {
        id: 'p3_opt5',
        label: 'Que vote por el mismo partido político o tenga las mismas creencias del jefe',
        category: 'requisito_formal',
        description: 'Descartar candidatos por sus posturas políticas o religiosas personales.',
        isCorrect: false,
        isBiasTrap: true,
        biasType: 'Sesgo Ideológico / Discriminación Constitucional',
        pedagogicalNote:
          '¡Alerta Grave! La universidad es plural e inclusiva; filtrar por ideología privada viola la Constitución.'
      },
      {
        id: 'p3_opt6',
        label: 'Exigir foto de cuerpo entero y apariencia «deportiva y juvenil»',
        category: 'requisito_formal',
        description: 'Elegir por atractivo físico o imagen en la hoja de vida.',
        isCorrect: false,
        isBiasTrap: true,
        biasType: 'Sesgo de Apariencia (Efecto Belleza)',
        pedagogicalNote:
          '¡Pésima práctica! La apariencia física no tiene ninguna relación con la competencia para dirigir Bienestar.'
      }
    ],
    candidates: [
      {
        id: 'cand_3a_natalia',
        name: 'Psic. Natalia Echeverri',
        roleTitle: 'Magíster en Psicología Comunitaria y Gerencia Social',
        age: 38,
        yearsExperience: 12,
        portraitUrl: '/assets/candidates/cand_3a_natalia.jpg',
        shortBio:
          'Psicóloga clínica y comunitaria con 12 años liderando redes de salud mental universitaria, inclusión de becarios y equipos interdisciplinarios.',
        voicePitch: 230,
        greeting:
          '¡Buenas tardes! Para mí el Medio Universitario es donde la Cura Personalis se vuelve realidad: acompañar cada historia estudiantil con calidez humana, ética y método riguroso.',
        education: [
          'Magíster en Intervención Psicosocial y Salud Mental Comunitaria',
          'Psicóloga • Especialista en Gerencia Social'
        ],
        experienceSummary: [
          'Subdirectora de Salud y Bienestar (6 años): Creó red de escucha temprana para 3,200 estudiantes/año.',
          'Líder de Inclusión Universitaria (6 años): Dirigió equipo de 28 profesionales con 99% de ejecución presupuestal.'
        ],
        cvHighlights: [
          {
            id: 'cv_3a_1',
            section: 'logros',
            title: 'Protocolo de triaje en salud mental que bajó la espera de 18 a 2 días',
            detail: 'Articuló psicólogos, decanaturas y red clínica externa con cero incidentes críticos.',
            classification: 'green_flag',
            explanation: '¡Evidencia de altísimo impacto! Combina rigor clínico con capacidad gerencial.'
          },
          {
            id: 'cv_3a_2',
            section: 'experiencia',
            title: 'Programa de acogida intercultural para becarios del Pacífico y Cauca',
            detail: 'Subió la permanencia estudiantil de poblaciones vulnerables en un 24%.',
            classification: 'green_flag',
            explanation: 'Totalmente conectada con la realidad regional y los valores javerianos.'
          },
          {
            id: 'cv_3a_3',
            section: 'datos_personales',
            title: 'Viene de provincia con acento marcado y viste de forma clásica',
            detail: 'Primera impresión sobria sin pretensiones.',
            classification: 'bias_trap',
            explanation: 'No te dejes llevar por sesgos regionalistas o superficiales: evalúa su extraordinaria trayectoria.'
          }
        ],
        phoneReference: {
          contactName: 'Padre Mauricio Giraldo',
          contactRole: 'Exvicerrector del Medio Universitario',
          transcript:
            '«Natalia es una bendición de profesional. Tiene una serenidad impresionante para manejar crisis graves a las once de la noche y al otro día defender el presupuesto ante el Consejo con cifras exactas.»',
          verdict: 'positive'
        },
        lupaClues: {
          bodyLanguage: 'Lupa: Transmite paz inmediata, escucha con atención plena y respalda cada afirmación con indicadores claros.',
          secretCvNote: 'Verificación Lupa: Autora de la Guía Regional de Primeros Auxilios Psicológicos Universitarios.'
        },
        trueSuitability: 'IDEAL',
        trueTechnicalScore: 5,
        trueCulturalScore: 5,
        hiringVerdictTitle: '¡Contratación Ejemplar! Corazón Javeriano y Cabeza Gerencial',
        hiringVerdictExplanation:
          '¡Elección perfecta! La Psic. Natalia Echeverri une dominio clínico en protocolos de salud mental y gerencia de equipos grandes con una vivencia genuina de la Cura Personalis y la inclusión.',
        keyTrapExplanation: 'Candidata ideal en todas las dimensiones técnicas y culturales.'
      },
      {
        id: 'cand_3b_ricardo',
        name: 'Lic. Ricardo Mejía',
        roleTitle: 'Administrador Público • Exjefe Disciplinario',
        age: 52,
        yearsExperience: 20,
        portraitUrl: '/assets/candidates/cand_3b_ricardo.jpg',
        shortBio:
          'Directivo chapado a la antigua que maneja presupuestos al centavo, pero cree que la salud mental es «falta de rejo» y ve a los estudiantes como sospechosos.',
        voicePitch: 155,
        greeting:
          'Buenas tardes. Conmigo las cuentas le van a cuadrar al peso. Eso sí, le digo de frente: hoy en día los jóvenes son una generación de cristal y tanta psicología los malcría.',
        education: [
          'Especialista en Derecho Administrativo y Sancionatorio',
          'Licenciado en Educación Física y Administración'
        ],
        experienceSummary: [
          'Director Administrativo Deportivo (10 años): Licitaciones de canchas y uniformes.',
          'Jefe Disciplinario (10 años): Endurecimiento de reglamentos y expulsiones.'
        ],
        cvHighlights: [
          {
            id: 'cv_3b_1',
            section: 'experiencia',
            title: '20 años ejecutando presupuestos públicos sin un solo hallazgo fiscal',
            detail: 'Orden estricto en compras y contratos.',
            classification: 'green_flag',
            explanation: 'Sabe de administración financiera, pero ojo: va a dirigir Bienestar Universitario, no una interventoría fiscal.'
          },
          {
            id: 'cv_3b_2',
            section: 'resumen',
            title: 'Visión puramente punitiva y deportiva; cero experiencia en salud mental',
            detail: 'Nunca ha liderado equipos psicosociales ni programas de inclusión.',
            classification: 'yellow_flag',
            explanation: '¡Bandera amarilla grave! Toca preguntarle cómo actuaría ante una crisis emocional o de diversidad.'
          },
          {
            id: 'cv_3b_3',
            section: 'datos_personales',
            title: '52 años de edad • Estilo formal de corbata tradicional',
            detail: 'Es el candidato de mayor edad del grupo.',
            classification: 'bias_trap',
            explanation: 'Pilas: no lo descartes por tener 52 años (eso sería edadismo); descártalo por sus prejuicios frente a la salud mental.'
          }
        ],
        phoneReference: {
          contactName: 'Dra. Claudia Rengifo',
          contactRole: 'Defensora Estudiantil',
          transcript:
            '«Ricardo es muy honesto con la plata, pero en bienestar fue un desastre: cerró el consultorio psicológico para comprar trofeos y cuando un estudiante iba en crisis le abría proceso disciplinario.»',
          verdict: 'warning'
        },
        lupaClues: {
          bodyLanguage: 'Lupa: Golpea la mesa con el dedo y hace gesto despectivo cuando hablas de ansiedad o diversidad estudiantil.',
          secretCvNote: 'Nota oculta en CV: Recortó el 70% del presupuesto de salud mental en su institución anterior.'
        },
        trueSuitability: 'TECH_TRAP',
        trueTechnicalScore: 3,
        trueCulturalScore: 1,
        hiringVerdictTitle: 'Contratación Peligrosa (Riesgo Grave en Salud Mental)',
        hiringVerdictExplanation:
          'Aunque Ricardo sabe manejar presupuestos, su estigmatización de la salud mental y su trato autoritario alejarían a los estudiantes en riesgo y contradicen frontalmente la Cura Personalis.',
        keyTrapExplanation: 'Fijarse solo en el orden administrativo ignorando prejuicios graves contra el bienestar estudiantil.'
      },
      {
        id: 'cand_3c_laura',
        name: 'Trab. Soc. Laura Patiño',
        roleTitle: 'Trabajadora Social • Animadora Juvenil',
        age: 27,
        yearsExperience: 3,
        portraitUrl: '/assets/candidates/cand_3c_laura.jpg',
        shortBio:
          'Joven súper carismática, empática y querida en campamentos, pero sin ninguna experiencia manejando equipos de 40 personas, presupuestos ni crisis clínicas.',
        voicePitch: 255,
        greeting:
          '¡Holaaa, qué emoción! Me encanta la energía del Samán. Yo sueño con que armemos conciertos, picnics y murales todas las semanas para que todo el mundo vibre alto.',
        education: [
          'Trabajadora Social',
          'Diplomado en Recreación y Expresión Juvenil'
        ],
        experienceSummary: [
          'Facilitadora de Campamentos (2 años): Dinámicas de integración para primíparos.',
          'Voluntaria Cultural (1 año): Apoyo en festivales universitarios.'
        ],
        cvHighlights: [
          {
            id: 'cv_3c_1',
            section: 'resumen',
            title: 'Gran calidez humana y conexión con colectivos artísticos estudiantiles',
            detail: 'Muy querida en talleres de inducción.',
            classification: 'green_flag',
            explanation: 'Tiene valores humanos bonitos, pero debemos evaluar si tiene el calibre directivo para gerenciar el Centro.'
          },
          {
            id: 'cv_3c_2',
            section: 'experiencia',
            title: 'Nunca ha tenido personal a cargo, ni manejado presupuesto ni crisis clínicas',
            detail: 'El cargo dirige a 40 especialistas y un presupuesto de $1.800 millones.',
            classification: 'yellow_flag',
            explanation: '¡Brecha crítica! Es una dirección estratégica compleja, no una coordinación de recreación.'
          },
          {
            id: 'cv_3c_3',
            section: 'datos_personales',
            title: 'Energía juvenil contagiosa y trato súper dulce en la entrevista',
            detail: 'Dan ganas de ayudarla por su entusiasmo.',
            classification: 'bias_trap',
            explanation: 'Cuidado con confundir ternura y entusiasmo con la madurez técnica para dirigir 40 profesionales.'
          }
        ],
        phoneReference: {
          contactName: 'Psic. Andrés Otálora',
          contactRole: 'Coordinador de Campamentos',
          transcript:
            '«Laurita es un sol de persona para animar un taller, pero todavía está muy biche para un cargo directivo. Cuando hubo una urgencia médica en un campamento se bloqueó de los nervios y no supo activar la ruta.»',
          verdict: 'warning'
        },
        lupaClues: {
          bodyLanguage: 'Lupa: Se muerde las uñas nerviosa cuando le preguntas por ejecución presupuestal o protocolos psiquiátricos.',
          secretCvNote: 'Verificación Lupa: Su experiencia máxima ha sido coordinar a 3 monitores voluntarios por un fin de semana.'
        },
        trueSuitability: 'CHARISMA_TRAP',
        trueTechnicalScore: 2,
        trueCulturalScore: 4,
        hiringVerdictTitle: 'Contratación Prematura (Falta de Competencia Directiva y Clínica)',
        hiringVerdictExplanation:
          'Laura tiene un gran corazón y afinidad con los jóvenes, pero carece de la experiencia gerencial y del dominio de protocolos clínicos de crisis que exige dirigir a 40 especialistas en Bienestar.',
        keyTrapExplanation: 'Elegir solo por entusiasmo y simpatía ignorando la brecha técnica y gerencial del cargo.'
      }
    ],
    questions: [
      {
        id: 'q3_star_1',
        categoryLabel: 'Protocolo de Crisis en Salud Mental (Método STAR)',
        questionText:
          'Cuénteme de una emergencia real de salud mental estudiantil que le haya tocado liderar. ¿Qué ruta clínica activó y qué resultado obtuvo?',
        quality: 'STAR_OPTIMAL',
        competencyTarget: 'Manejo Clínico de Crisis y Cura Personalis',
        pedagogicalExplanation:
          'Pregunta STAR vital: Distingue a quien domina protocolos reales de salud mental de quien improvisa o estigmatiza.',
        responses: {
          cand_3a_natalia: {
            answerText:
              'En época de finales detectamos un aumento de crisis de ansiedad aguda. Diseñé la ruta «Samán Te Escucha»: triaje psicológico en menos de 2 horas, remisión articulada con psiquiatría y entrenamiento a 120 profes y vigilantes en primeros auxilios psicológicos. Cero eventos fatales y 96% de adherencia.',
            mood: 'thoughtful',
            signalType: 'acierto_fuerte',
            signalSummary: '¡Respuesta STAR Magistral! Rigor clínico, prevención comunitaria y profundo cuidado humano.',
            technicalDelta: 2,
            culturalDelta: 2,
            javeValueHighlighted: 'Cura Personalis + Rigor Clínico',
            followUpPrompt: 'Profundizar: ¿Cómo manejó la confidencialidad frente a las facultades?',
            followUpAnswer:
              'Separamos la historia clínica reservada de las recomendaciones de ajuste académico, protegiendo siempre la intimidad del estudiante.',
            followUpSignal: '¡Ética profesional intachable!'
          },
          cand_3b_ricardo: {
            answerText:
              'Es que hoy cualquier tristeza por perder un parcial la llaman depresión. Cuando un estudiante llegaba llorando a mi oficina, yo le decía que se amarrara los pantalones y lo ponía a trotar en la cancha, o le abría proceso si faltaba a clase.',
            mood: 'confident',
            signalType: 'alerta_riesgo',
            signalSummary: '¡Alerta Roja Gravísima! Negligencia peligrosa frente a la salud mental estudiantil.',
            technicalDelta: -2,
            culturalDelta: -2,
            javeValueHighlighted: 'Riesgo Humano e Institucional',
            followUpPrompt: 'Presionar: ¿No activaba la ruta de psicología clínica?',
            followUpAnswer:
              'No señor, para mí los psicólogos solo alcahuetean la pereza de los muchachos.',
            followUpSignal: '¡Descalificado! Desprecia a su propio equipo de psicólogos.'
          },
          cand_3c_laura: {
            answerText:
              '¡Ay, a mí esas crisis clínicas me dan un susto horrible! Una vez una niña entró en pánico en un taller y yo me puse a llorar con ella abrazándola, pero la verdad me bloqueé y no sabía a qué línea de urgencias tocaba llamar.',
            mood: 'nervous',
            signalType: 'alerta_riesgo',
            signalSummary: 'Mucha empatía, pero se paraliza en crisis y desconoce las rutas clínicas.',
            technicalDelta: -2,
            culturalDelta: 1,
            javeValueHighlighted: 'Sin competencia técnica en crisis'
          }
        }
      },
      {
        id: 'q3_star_2',
        categoryLabel: 'Gerencia de Equipo y Presupuesto (Método STAR)',
        questionText:
          'Describa cómo ha gerenciado un equipo grande interdisciplinario y un presupuesto alto demostrando impacto en la retención estudiantil.',
        quality: 'STAR_OPTIMAL',
        competencyTarget: 'Gerencia Social Basada en Evidencia',
        pedagogicalExplanation:
          'Evalúa si el candidato tiene músculo directivo para administrar recursos y liderar a 40 profesionales.',
        responses: {
          cand_3a_natalia: {
            answerText:
              'Gerencié un presupuesto de $1.800 millones y 28 profesionales uniendo deporte, cultura y psicología en un solo tablero de impacto. Demostramos con datos ante el Consejo que los estudiantes vinculados a grupos del Medio Universitario tenían 32% menos deserción.',
            mood: 'confident',
            signalType: 'acierto_fuerte',
            signalSummary: '¡Acierto STAR! Cabeza gerencial estratégica al servicio de la formación integral.',
            technicalDelta: 2,
            culturalDelta: 2,
            javeValueHighlighted: 'Magis en Gestión Universitaria'
          },
          cand_3b_ricardo: {
            answerText:
              'Yo ejecuto el presupuesto al centavo comprando implementación deportiva por licitación. Eso sí, les quité la plata a los talleres de arte y de inclusión porque eso no da trofeos.',
            mood: 'confident',
            signalType: 'alerta_riesgo',
            signalSummary: 'Recorta arbitrariamente programas esenciales para la formación integral.',
            technicalDelta: 1,
            culturalDelta: -2,
            javeValueHighlighted: 'Visión mutilada del Bienestar'
          },
          cand_3c_laura: {
            answerText:
              'La verdad nunca me ha tocado manejar presupuestos ni dirigir jefes de área... yo con el Excel me enredo un poquito, pero si me ponen un contador al lado yo aprendo.',
            mood: 'nervous',
            signalType: 'alerta_riesgo',
            signalSummary: 'Admite no tener ninguna experiencia gerencial para un cargo directivo.',
            technicalDelta: -2,
            culturalDelta: 0,
            javeValueHighlighted: 'Brecha Gerencial Crítica'
          }
        }
      },
      {
        id: 'q3_star_3',
        categoryLabel: 'Inclusión y Diversidad en el Campus (Método STAR)',
        questionText:
          'Relate un proyecto real que haya liderado para integrar a estudiantes becarios, foráneos o de comunidades diversas a la vida universitaria.',
        quality: 'STAR_OPTIMAL',
        competencyTarget: 'Inclusión, Diálogo y Comunidad',
        pedagogicalExplanation:
          'Evalúa competencias reales de construcción de comunidad plural e inclusiva.',
        responses: {
          cand_3a_natalia: {
            answerText:
              'Lideré el programa «Raíces en el Samán» con estudiantes becarios del litoral Pacífico y zonas rurales: creamos redes de familias anfitrionas, mentoría intercultural y apoyo de transporte y alimentación sin estigmas. La permanencia del grupo subió al 95%.',
            mood: 'enthusiastic',
            signalType: 'acierto_fuerte',
            signalSummary: '¡Acierto STAR! Inclusión real con dignidad humana e indicadores medibles.',
            technicalDelta: 1,
            culturalDelta: 2,
            javeValueHighlighted: 'Inclusión y Justicia Social'
          },
          cand_3b_ricardo: {
            answerText:
              'A mí esos cuentos de enfoques diferenciales no me gustan. El que entra a la universidad tiene que vestirse y hablar igualito a los demás sin pedir trato especial.',
            mood: 'confident',
            signalType: 'alerta_riesgo',
            signalSummary: 'Postura excluyente e intolerante ante la diversidad regional y cultural.',
            technicalDelta: -1,
            culturalDelta: -2,
            javeValueHighlighted: 'Contrario a la Inclusión Javeriana'
          },
          cand_3c_laura: {
            answerText:
              'Una vez pintamos un cartel gigante de colores en las canchas y repartimos abrazos gratis toda la mañana, ¡fue súper lindo!',
            mood: 'enthusiastic',
            signalType: 'respuesta_ambigua',
            signalSummary: 'Actividad puntual simpática, pero sin estructura de programa sostenible.',
            technicalDelta: -1,
            culturalDelta: 1,
            javeValueHighlighted: 'Activismo sin estrategia'
          }
        }
      },
      {
        id: 'q3_superficial',
        categoryLabel: 'Pregunta Cerrada / Obvia',
        questionText: '¿Usted se considera una buena persona y le gusta ayudar a los demás?',
        quality: 'SUPERFICIAL',
        competencyTarget: 'Ninguna (Pregunta obvia con respuesta de cajón)',
        pedagogicalExplanation:
          'Nadie en una entrevista va a responder «no, soy mala persona». Las preguntas obvias no sirven para discriminar competencias.',
        responses: {
          cand_3a_natalia: {
            answerText: 'Por supuesto, el servicio ha sido el eje de mis doce años de carrera.',
            mood: 'neutral',
            signalType: 'respuesta_ambigua',
            signalSummary: 'Pregunta cerrada que no explora evidencias STAR.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Pregunta demasiado obvia'
          },
          cand_3b_ricardo: {
            answerText: 'Claro, yo ayudo enseñando disciplina y orden.',
            mood: 'neutral',
            signalType: 'respuesta_ambigua',
            signalSummary: 'Pregunta cerrada que oculta su enfoque punitivo.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Pregunta obvia'
          },
          cand_3c_laura: {
            answerText: '¡Siii, obvio! ¡Yo amo ayudar a todo el mundo!',
            mood: 'enthusiastic',
            signalType: 'respuesta_ambigua',
            signalSummary: 'Pregunta obvia sin valor predictivo.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Pregunta obvia'
          }
        }
      },
      {
        id: 'q3_biased',
        categoryLabel: 'Pregunta Intrusiva / Ideológica',
        questionText:
          'Para saber si encaja acá, ¿por quién votó en las últimas elecciones y a qué iglesia va los domingos?',
        quality: 'BIASED_ILLEGAL',
        competencyTarget: 'Inválida (Discriminación Política y Religiosa)',
        biasWarningTitle: '¡Pregunta Ilegal sobre Creencias Privadas!',
        pedagogicalExplanation:
          'La libertad de conciencia y el pluralismo están protegidos por la Constitución y los estatutos javerianos. Jamás indagues por voto o práctica religiosa privada.',
        responses: {
          cand_3a_natalia: {
            answerText:
              'Me identifico plenamente con el humanismo y el servicio javeriano en mi trabajo; mis convicciones políticas o religiosas hacen parte de mi reserva constitucional.',
            mood: 'nervous',
            signalType: 'alerta_riesgo',
            signalSummary: '¡Penalización al reclutador! Pregunta intrusiva e inconstitucional.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Error del Entrevistador'
          },
          cand_3b_ricardo: {
            answerText: 'Yo voto por el que diga el jefe, faltaba más.',
            mood: 'confident',
            signalType: 'alerta_riesgo',
            signalSummary: 'Tu pregunta sesgada premió la adulación en vez del mérito.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Error del Entrevistador'
          },
          cand_3c_laura: {
            answerText: 'Uy, qué susto esa pregunta... ¿toca responder eso para que me contraten?',
            mood: 'nervous',
            signalType: 'alerta_riesgo',
            signalSummary: 'Intimidaste a la candidata con una pregunta discriminatoria.',
            technicalDelta: 0,
            culturalDelta: 0,
            javeValueHighlighted: 'Error del Entrevistador'
          }
        }
      }
    ]
  }
];
