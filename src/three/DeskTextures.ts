import * as THREE from 'three';
import { Candidate, VacancyCase } from '../types/game';

/**
 * Generates a procedural warm mahogany/walnut wood grain texture
 */
export function createWoodTexture(baseHex = '#3D2214', streakHex = '#28150B'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = streakHex;
  ctx.globalAlpha = 0.25;
  for (let i = 0; i < 90; i++) {
    ctx.lineWidth = 1 + Math.random() * 4;
    ctx.beginPath();
    const y = Math.random() * 512;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      170,
      y + (Math.random() - 0.5) * 18,
      340,
      y + (Math.random() - 0.5) * 18,
      512,
      y
    );
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Generates the texture for the 3D Clipboard (Perfil del Cargo) on the desk
 */
export function createClipboardTexture(
  vacancy: VacancyCase,
  selectedProfileIds: string[]
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 680;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FBF7F0';
  ctx.fillRect(0, 0, 512, 680);

  ctx.fillStyle = '#0B2545';
  ctx.fillRect(24, 36, 464, 66);
  ctx.fillStyle = '#E5C178';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('TABLERO DE PERFIL DEL CARGO', 42, 62);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px serif';
  ctx.fillText(vacancy.title.slice(0, 34), 42, 88);

  const validCount = vacancy.profileOptions.filter(
    (o) => o.isCorrect && selectedProfileIds.includes(o.id)
  ).length;

  ctx.fillStyle = '#4A3F35';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText(
    `Criterios Objetivos Fijados: ${validCount} / ${vacancy.requiredCorrectCount}`,
    36,
    136
  );

  let y = 166;
  vacancy.profileOptions.forEach((opt) => {
    const isChecked = selectedProfileIds.includes(opt.id);
    ctx.fillStyle = isChecked ? '#E4F2E2' : '#F2E9D8';
    ctx.fillRect(32, y, 448, 66);
    ctx.strokeStyle = isChecked ? '#2B5B29' : '#C9BAA3';
    ctx.lineWidth = 2;
    ctx.strokeRect(32, y, 448, 66);

    ctx.fillStyle = isChecked ? '#2B5B29' : '#FFFFFF';
    ctx.fillRect(46, y + 18, 28, 28);
    ctx.strokeRect(46, y + 18, 28, 28);
    if (isChecked) {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('✓', 51, y + 40);
    }

    ctx.fillStyle = '#1F1B18';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(opt.label.slice(0, 42), 88, y + 30);
    ctx.fillStyle = '#574E46';
    ctx.font = '13px sans-serif';
    ctx.fillText(opt.description.slice(0, 54) + '...', 88, y + 50);

    y += 76;
  });

  if (validCount >= vacancy.requiredCorrectCount) {
    ctx.save();
    ctx.translate(256, 635);
    ctx.rotate(-0.06);
    ctx.strokeStyle = '#2B5B29';
    ctx.lineWidth = 5;
    ctx.strokeRect(-140, -24, 280, 44);
    ctx.fillStyle = '#2B5B29';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✓ PERFIL VALIDADO', 0, 6);
    ctx.restore();
  } else {
    ctx.fillStyle = '#9E2A2B';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('Haz clic para tomar este tablero y configurar el perfil', 48, 650);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates the texture for the Open CV Folder lying on the center of the 3D desk
 */
export function createOpenCVSheetTexture(
  candidate: Candidate,
  annotations: Record<string, 'green_flag' | 'yellow_flag' | 'bias_trap'>,
  stampStatus?: 'HIRED' | 'REJECTED' | null
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 540;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#E8D8BE';
  ctx.fillRect(0, 0, 768, 540);
  ctx.strokeStyle = '#B8A282';
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 760, 532);

  ctx.fillStyle = '#FBF7F0';
  ctx.fillRect(22, 22, 350, 496);
  ctx.fillRect(396, 22, 350, 496);

  ctx.fillStyle = 'rgba(60, 35, 15, 0.18)';
  ctx.fillRect(372, 16, 24, 508);

  ctx.fillStyle = '#0B2545';
  ctx.fillRect(38, 38, 318, 52);
  ctx.fillStyle = '#E5C178';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('EXPEDIENTE DE CANDIDATO • JAVERIANA', 50, 58);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px serif';
  ctx.fillText(candidate.name, 50, 80);

  ctx.fillStyle = '#8C4A15';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(candidate.roleTitle.slice(0, 40), 40, 114);

  ctx.fillStyle = '#2B2623';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('FORMACIÓN ACADÉMICA:', 40, 148);
  ctx.font = '13px sans-serif';
  candidate.education.forEach((edu, i) => {
    ctx.fillText(`• ${edu.slice(0, 42)}`, 44, 170 + i * 22);
  });

  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`TRAYECTORIA (${candidate.yearsExperience} AÑOS):`, 40, 232);
  ctx.font = '12px sans-serif';
  candidate.experienceSummary.forEach((exp, i) => {
    ctx.fillText(`• ${exp.slice(0, 45)}`, 44, 254 + i * 24);
  });

  ctx.fillStyle = '#F2E9D8';
  ctx.fillRect(40, 330, 314, 164);
  ctx.strokeStyle = '#C8963E';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 330, 314, 164);
  ctx.fillStyle = '#0B2545';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('HERRAMIENTAS DEL CAZATALENTOS:', 54, 355);
  ctx.fillStyle = '#4A3F35';
  ctx.font = '13px sans-serif';
  ctx.fillText('• Usa la Lupa [L] sobre esta hoja', 54, 380);
  ctx.fillText('  para destapar notas ocultas.', 54, 398);
  ctx.fillText('• Usa el Citófono [T] para llamar', 54, 422);
  ctx.fillText('  a su jefe anterior en Cali.', 54, 440);
  ctx.fillText('• Toma un Sello y estámpalo aquí.', 54, 466);

  ctx.fillStyle = '#0B2545';
  ctx.font = 'bold 16px serif';
  ctx.fillText('HALLAZGOS DE LA HOJA DE VIDA', 414, 56);

  let hy = 78;
  candidate.cvHighlights.forEach((hl) => {
    const mark = annotations[hl.id];
    ctx.fillStyle =
      mark === 'green_flag'
        ? '#E4F2E2'
        : mark === 'yellow_flag'
        ? '#FDF3E3'
        : mark === 'bias_trap'
        ? '#E6EEF8'
        : '#F4EFE6';
    ctx.fillRect(412, hy, 318, 92);
    ctx.strokeStyle = mark ? '#0B2545' : '#D0C3AE';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(412, hy, 318, 92);

    ctx.fillStyle = '#1F1B18';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(hl.title.slice(0, 38), 422, hy + 24);
    ctx.fillStyle = '#574E46';
    ctx.font = '12px sans-serif';
    ctx.fillText(hl.detail.slice(0, 44), 422, hy + 46);

    if (mark) {
      ctx.fillStyle =
        mark === 'green_flag' ? '#2B5B29' : mark === 'yellow_flag' ? '#9A5B13' : '#0B2545';
      ctx.font = 'bold 12px monospace';
      const label =
        mark === 'green_flag'
          ? '✓ EVIDENCIA RELEVANTE'
          : mark === 'yellow_flag'
          ? '? INDAGAR EN ENTREVISTA'
          : '[IGNORADO - SESGO EVITADO]';
      ctx.fillText(label, 422, hy + 74);
    } else {
      ctx.fillStyle = '#9E2A2B';
      ctx.font = 'italic 12px sans-serif';
      ctx.fillText('[Clic para acercar y clasificar]', 422, hy + 74);
    }

    hy += 106;
  });

  if (stampStatus === 'HIRED' || stampStatus === 'REJECTED') {
    ctx.save();
    ctx.translate(565, 445);
    ctx.rotate(-0.14);
    const color = stampStatus === 'HIRED' ? '#1F6E27' : '#A62626';
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.strokeRect(-135, -36, 270, 72);
    ctx.lineWidth = 2;
    ctx.strokeRect(-127, -28, 254, 56);
    ctx.fillStyle = color;
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(stampStatus === 'HIRED' ? 'CONTRATADO' : 'DESCARTADO', 0, 6);
    ctx.font = 'bold 11px monospace';
    ctx.fillText('SELLO OFICIAL • EL SAMÁN', 0, 22);
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates the texture for the 3D Desk Monitor ("Sistema JaveTalento OS")
 */
export function createDeskMeterTexture(
  candidateName: string,
  techScore: number,
  cultureScore: number,
  questionsCount: number,
  evidencesCount = 0
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 310;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0D1E33';
  ctx.fillRect(0, 0, 512, 310);
  ctx.strokeStyle = '#C8963E';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 302);

  // Top OS Bar
  ctx.fillStyle = '#163254';
  ctx.fillRect(10, 10, 492, 34);
  ctx.fillStyle = '#E5C178';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('● JAVETALENTO OS v2.6 — RADAR EN TIEMPO REAL', 22, 32);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px serif';
  ctx.fillText(candidateName, 24, 74);
  ctx.fillStyle = '#A9C2DF';
  ctx.font = '14px sans-serif';
  ctx.fillText(
    `Preguntas STAR: ${questionsCount} / 5   •   Hallazgos registrados: ${evidencesCount}`,
    24,
    98
  );

  // Tech Bar
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`Competencia Técnica (Evidencia): ${techScore}%`, 24, 142);
  ctx.fillStyle = '#1E3450';
  ctx.fillRect(24, 152, 464, 28);
  ctx.fillStyle = techScore >= 65 ? '#48B862' : techScore <= 35 ? '#E05353' : '#3B82F6';
  ctx.fillRect(24, 152, (464 * techScore) / 100, 28);

  // Culture Bar
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`Afinidad Javeriana (Cura Personalis / Magis): ${cultureScore}%`, 24, 218);
  ctx.fillStyle = '#1E3450';
  ctx.fillRect(24, 228, 464, 28);
  ctx.fillStyle = cultureScore >= 65 ? '#E5C178' : cultureScore <= 35 ? '#E05353' : '#58A65C';
  ctx.fillRect(24, 228, (464 * cultureScore) / 100, 28);

  ctx.fillStyle = '#8AB4E1';
  ctx.font = '12px monospace';
  ctx.fillText('[ACTUALIZACIÓN EN VIVO • CLIC PARA INTERROGAR]', 24, 286);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates the texture for the 3D Brass Nameplate sitting on the front edge of the desk
 */
export function createBrassNameplateTexture(name: string, role: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 128);
  grad.addColorStop(0, '#3D2312');
  grad.addColorStop(0.5, '#59341C');
  grad.addColorStop(1, '#2E190C');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 128);

  ctx.fillStyle = '#D8A84E';
  ctx.fillRect(14, 14, 484, 100);
  ctx.fillStyle = '#1E140B';
  ctx.fillRect(20, 20, 472, 88);

  ctx.strokeStyle = '#E5C178';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, 464, 80);

  ctx.fillStyle = '#F5D487';
  ctx.font = 'bold 26px serif';
  ctx.textAlign = 'center';
  ctx.fillText(name.toUpperCase(), 256, 62);

  ctx.fillStyle = '#D7C4A3';
  ctx.font = 'bold 14px monospace';
  ctx.fillText(role.slice(0, 46).toUpperCase(), 256, 90);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates a detective-style Corkboard texture with pinned Javeriana notes
 */
export function createCorkboardTexture(vacancyTitle: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#B38352';
  ctx.fillRect(0, 0, 512, 384);
  for (let i = 0; i < 600; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#96683B' : '#C99B6B';
    ctx.fillRect(Math.random() * 512, Math.random() * 384, 3, 3);
  }

  ctx.strokeStyle = '#3E2213';
  ctx.lineWidth = 18;
  ctx.strokeRect(0, 0, 512, 384);

  const drawPostIt = (
    x: number,
    y: number,
    rot: number,
    color: string,
    title: string,
    line1: string,
    line2: string
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(-92, -62, 188, 128);
    ctx.fillStyle = color;
    ctx.fillRect(-95, -65, 188, 128);

    ctx.fillStyle = '#B82525';
    ctx.beginPath();
    ctx.arc(0, -50, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1F1B18';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(title, -80, -22);
    ctx.font = '13px sans-serif';
    ctx.fillText(line1, -80, 4);
    ctx.fillText(line2, -80, 26);
    ctx.restore();
  };

  drawPostIt(130, 110, -0.06, '#FFF59D', 'MÉTODO STAR', 'Pregunta por hechos', 'reales, no cuentos.');
  drawPostIt(365, 115, 0.05, '#E6F0E4', 'CURA PERSONALIS', 'Excelencia humana y', 'trato digno siempre.');
  drawPostIt(250, 275, -0.03, '#FBE9E9', 'CERO ROSCA / SESGOS', vacancyTitle.slice(0, 24), 'Evalúa con la Lupa.');

  ctx.strokeStyle = '#A62626';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(130, 60);
  ctx.lineTo(365, 65);
  ctx.lineTo(250, 225);
  ctx.closePath();
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
