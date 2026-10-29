import * as THREE from 'three';
import { CandidateMood } from '../types/game';

interface RigAnimState {
  initialized: boolean;
  walkStart: number | null;
  lastWalk: number;
  nextBlink: number;
  blinkStart: number;
  nextSaccade: number;
  gazeTX: number;
  gazeTY: number;
  gazeX: number;
  gazeY: number;
  speak: number;
  lean: number;
  browTilt: number;
  browLiftL: number;
  browLiftR: number;
  smileCurve: number;
  smileWidth: number;
  smileRot: number;
  lidMood: number;
  headTilt: number;
  headPitch: number;
}

export interface Candidate3DRig {
  root: THREE.Group;
  body: THREE.Group;
  torsoGroup: THREE.Group;
  headPivot: THREE.Group;
  hipL: THREE.Group;
  hipR: THREE.Group;
  kneeL: THREE.Group;
  kneeR: THREE.Group;
  shoulderL: THREE.Group;
  shoulderR: THREE.Group;
  elbowL: THREE.Group;
  elbowR: THREE.Group;
  browL: THREE.Group;
  browR: THREE.Group;
  lidL: THREE.Group;
  lidR: THREE.Group;
  irisL: THREE.Group;
  irisR: THREE.Group;
  smile: THREE.Group;
  mouthOpen: THREE.Group;
  interactiveMeshes: THREE.Object3D[];
  persona: { browBias: number; smileMul: number; smileAdd: number; lidAdd: number };
  anim: RigAnimState;
}

interface CandidateAppearance {
  skinHex: string;
  hairHex: string;
  suitHex: string; // outer layer: blazer / cardigan / denim jacket / shirt
  shirtHex: string; // inner layer visible in the V
  accentHex: string; // tie, scarf, necklace or blouse color
  eyeHex: string;
  hairStyle:
    | 'parted_silver'
    | 'curly_bun'
    | 'quiff'
    | 'sleek_bob'
    | 'short_swept'
    | 'wavy_shoulder'
    | 'flat_grey'
    | 'curly_pony';
  outfit: 'blazer' | 'cardigan' | 'denim' | 'shirt';
  accessory: 'tie' | 'blouse' | 'turtleneck' | 'scarf' | 'open_collar' | 'tee';
  facialHair: 'none' | 'stubble';
  hasGlasses: boolean;
  glassesHex: string;
  glassesShape?: 'round' | 'rect';
  earrings?: boolean;
  feminine?: boolean;
  stern?: boolean; // heavier, lower brows and a reserved mouth
  bigSmile?: boolean;
}

// Each look is matched to the candidate's portrait in /public/assets/candidates
const APPEARANCE_BY_ID: Record<string, CandidateAppearance> = {
  cand_1a_andres: {
    skinHex: '#B98462',
    hairHex: '#5E5E62',
    suitHex: '#6B4F37',
    shirtHex: '#F3EBD8',
    accentHex: '#6E1B2B',
    eyeHex: '#4A3324',
    hairStyle: 'parted_silver',
    outfit: 'blazer',
    accessory: 'tie',
    facialHair: 'none',
    hasGlasses: false,
    glassesHex: '#C8963E',
    stern: true
  },
  cand_1b_valeria: {
    skinHex: '#7E4C31',
    hairHex: '#1E1511',
    suitHex: '#6E7D46',
    shirtHex: '#F4ECDC',
    accentHex: '#F4ECDC',
    eyeHex: '#3B2215',
    hairStyle: 'curly_bun',
    outfit: 'blazer',
    accessory: 'blouse',
    facialHair: 'none',
    hasGlasses: false,
    glassesHex: '#C8963E',
    earrings: true,
    feminine: true,
    bigSmile: true
  },
  cand_1c_santiago: {
    skinHex: '#D9A27C',
    hairHex: '#3A2416',
    suitHex: '#93B5DD',
    shirtHex: '#FFFFFF',
    accentHex: '#93B5DD',
    eyeHex: '#6B5A2E',
    hairStyle: 'quiff',
    outfit: 'shirt',
    accessory: 'tee',
    facialHair: 'stubble',
    hasGlasses: false,
    glassesHex: '#1F1B18',
    bigSmile: true
  },
  cand_2a_camila: {
    skinHex: '#C98E68',
    hairHex: '#15151C',
    suitHex: '#5B6B8A',
    shirtHex: '#8E9093',
    accentHex: '#8E9093',
    eyeHex: '#3A261A',
    hairStyle: 'sleek_bob',
    outfit: 'blazer',
    accessory: 'turtleneck',
    facialHair: 'none',
    hasGlasses: false,
    glassesHex: '#8C4A27',
    feminine: true
  },
  cand_2b_mauricio: {
    skinHex: '#C38D68',
    hairHex: '#141010',
    suitHex: '#4A4A4D',
    shirtHex: '#18181A',
    accentHex: '#18181A',
    eyeHex: '#3A2A20',
    hairStyle: 'short_swept',
    outfit: 'blazer',
    accessory: 'turtleneck',
    facialHair: 'stubble',
    hasGlasses: false,
    glassesHex: '#111111',
    stern: true
  },
  cand_2c_felipe: {
    skinHex: '#B97A55',
    hairHex: '#17110E',
    suitHex: '#C49A6C',
    shirtHex: '#CAD7EC',
    accentHex: '#CAD7EC',
    eyeHex: '#3E2817',
    hairStyle: 'short_swept',
    outfit: 'cardigan',
    accessory: 'open_collar',
    facialHair: 'none',
    hasGlasses: true,
    glassesHex: '#8E8B88',
    glassesShape: 'rect',
    bigSmile: true
  },
  cand_3a_natalia: {
    skinHex: '#D8A27E',
    hairHex: '#17151B',
    suitHex: '#B0532E',
    shirtHex: '#F6EEDF',
    accentHex: '#EADBC2',
    eyeHex: '#4A2F1C',
    hairStyle: 'wavy_shoulder',
    outfit: 'blazer',
    accessory: 'scarf',
    facialHair: 'none',
    hasGlasses: false,
    glassesHex: '#C8963E',
    feminine: true
  },
  cand_3b_ricardo: {
    skinHex: '#C48E6A',
    hairHex: '#68686D',
    suitHex: '#3A3A3E',
    shirtHex: '#F7F7F5',
    accentHex: '#6A1E2A',
    eyeHex: '#3F3328',
    hairStyle: 'flat_grey',
    outfit: 'blazer',
    accessory: 'tie',
    facialHair: 'none',
    hasGlasses: false,
    glassesHex: '#2B2B2E',
    stern: true
  },
  cand_3c_laura: {
    skinHex: '#D9A07A',
    hairHex: '#15141B',
    suitHex: '#4F79A8',
    shirtHex: '#E2A92F',
    accentHex: '#E2A92F',
    eyeHex: '#5A3A22',
    hairStyle: 'curly_pony',
    outfit: 'denim',
    accessory: 'blouse',
    facialHair: 'none',
    hasGlasses: false,
    glassesHex: '#C8963E',
    feminine: true,
    bigSmile: true
  }
};

// ---------------------------------------------------------------------------
// Proportions (stylized "cozy game" look: rounded shapes, big friendly head)
// ---------------------------------------------------------------------------
const HEAD_R = 0.16;
const HA = HEAD_R; // head ellipsoid semi-axes
const HB = HEAD_R * 1.06;
const HC = HEAD_R * 0.98;
const HEAD_PIVOT_Y = 0.56; // neck joint, relative to hips
const HEAD_CENTER_UP = 0.18;

const SEAT_Y = 0.69; // hips height when seated on the cushion
const SEAT_Z = -0.76;
const STAND_Y = 1.085; // hips height when standing
const STAND_Z = -0.4;
const WALK_START_X = 1.85;
const WALK_DURATION = 3.4; // seconds for walk-in + turn + sit

const Z_AXIS = new THREE.Vector3(0, 0, 1);
const Y_AXIS = new THREE.Vector3(0, 1, 0);

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

function ellipsoid(
  sx: number,
  sy: number,
  sz: number,
  mat: THREE.Material,
  wSeg = 24,
  hSeg = 18
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, wSeg, hSeg), mat);
  m.scale.set(sx, sy, sz);
  return m;
}

function capsule(r: number, len: number, mat: THREE.Material): THREE.Mesh {
  return new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 8, 20), mat);
}

function cylinderBetween(
  a: THREE.Vector3,
  b: THREE.Vector3,
  r: number,
  mat: THREE.Material
): THREE.Mesh {
  const dir = b.clone().sub(a);
  const len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 8), mat);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(Y_AXIS, dir.normalize());
  return m;
}

function extrudeShape(points: [number, number][], depth: number, mat: THREE.Material, bevel = 0.0015): THREE.Mesh {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1]);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 6
  });
  return new THREE.Mesh(geo, mat);
}

/** Point on the head ellipsoid surface (in head-center space) + its outward normal. */
function faceSurface(x: number, y: number, inset: number, forwardBias: number) {
  const k = 1 - (x / HA) ** 2 - (y / HB) ** 2;
  const z = HC * Math.sqrt(Math.max(0.0001, k));
  const n = new THREE.Vector3(x / (HA * HA), y / (HB * HB), z / (HC * HC)).normalize();
  const p = new THREE.Vector3(x, y, z).addScaledVector(n, -inset);
  const facing = n.clone().lerp(Z_AXIS, forwardBias).normalize();
  return { p, facing };
}

function placeOnFace(obj: THREE.Object3D, x: number, y: number, inset: number, forwardBias = 0) {
  const { p, facing } = faceSurface(x, y, inset, forwardBias);
  obj.position.copy(p);
  obj.quaternion.setFromUnitVectors(Z_AXIS, facing);
}

/**
 * Builds a stylized, articulated 3D candidate (seated in the visitor armchair by default).
 */
export function buildCandidate3DAvatar(candidateId: string): Candidate3DRig {
  const cfg = APPEARANCE_BY_ID[candidateId] || APPEARANCE_BY_ID.cand_1a_andres;
  const fem = !!cfg.feminine;
  const root = new THREE.Group();

  // ---------------------------------------------------------------- Materials
  const skinColor = new THREE.Color(cfg.skinHex);
  const skinMat = new THREE.MeshStandardMaterial({
    color: skinColor,
    roughness: 0.62,
    metalness: 0,
    emissive: skinColor.clone().multiplyScalar(0.55),
    emissiveIntensity: skinColor.getHSL({ h: 0, s: 0, l: 0 }).l < 0.4 ? 0.2 : 0.14
  });
  const darkSkin = skinColor.getHSL({ h: 0, s: 0, l: 0 }).l < 0.4;
  const skinShadeMat = new THREE.MeshStandardMaterial({
    color: skinColor.clone().multiplyScalar(0.86),
    roughness: 0.65
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: cfg.hairHex,
    roughness: 0.52,
    metalness: 0.04,
    side: THREE.DoubleSide
  });
  const silverMat = new THREE.MeshStandardMaterial({ color: '#C4C6CB', roughness: 0.45, side: THREE.DoubleSide });
  const suitColor = new THREE.Color(cfg.suitHex);
  const suitMat = new THREE.MeshStandardMaterial({
    color: suitColor,
    roughness: cfg.outfit === 'cardigan' ? 0.95 : cfg.outfit === 'denim' ? 0.88 : 0.74,
    metalness: 0.02
  });
  const lapelMat = new THREE.MeshStandardMaterial({
    color: suitColor.clone().offsetHSL(0, 0, cfg.outfit === 'cardigan' ? 0.03 : 0.05),
    roughness: cfg.outfit === 'cardigan' ? 0.95 : 0.6
  });
  const pantsMat = new THREE.MeshStandardMaterial({
    color:
      cfg.outfit === 'blazer'
        ? suitColor.clone().multiplyScalar(0.72)
        : new THREE.Color(cfg.outfit === 'cardigan' ? '#4E4034' : '#2E3445'),
    roughness: 0.78
  });
  const shirtMat = new THREE.MeshStandardMaterial({ color: cfg.shirtHex, roughness: 0.6 });
  const accentMat = new THREE.MeshStandardMaterial({ color: cfg.accentHex, roughness: 0.42, metalness: 0.12 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: '#2A1B12', roughness: 0.32, metalness: 0.1 });
  const soleMat = new THREE.MeshStandardMaterial({ color: '#15100C', roughness: 0.6 });
  const scleraMat = new THREE.MeshStandardMaterial({ color: '#FCFBF7', roughness: 0.25 });
  const irisColor = new THREE.Color(cfg.eyeHex);
  const irisMat = new THREE.MeshStandardMaterial({
    color: irisColor,
    roughness: 0.3,
    emissive: irisColor,
    emissiveIntensity: 0.25
  });
  const pupilMat = new THREE.MeshBasicMaterial({ color: '#0E0907' });
  const glintMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });
  const lashMat = new THREE.MeshStandardMaterial({ color: '#1A110C', roughness: 0.5 });
  const lipMat = new THREE.MeshStandardMaterial({
    color: darkSkin ? '#5E2622' : fem ? '#A84650' : '#8A3A33',
    roughness: 0.45
  });
  const mouthCavityMat = new THREE.MeshStandardMaterial({ color: '#4A1518', roughness: 0.7 });
  const teethMat = new THREE.MeshStandardMaterial({ color: '#FFFDF6', roughness: 0.3 });
  const tongueMat = new THREE.MeshStandardMaterial({ color: '#D9646A', roughness: 0.5 });
  const blushMat = new THREE.MeshStandardMaterial({
    color: '#F07C74',
    roughness: 0.8,
    transparent: true,
    opacity: darkSkin ? 0.18 : fem ? 0.4 : 0.26,
    depthWrite: false
  });
  const brassMat = new THREE.MeshStandardMaterial({ color: '#D8A648', metalness: 0.8, roughness: 0.25 });

  // ---------------------------------------------------------------- Body (hips)
  const body = new THREE.Group();
  body.position.set(0, SEAT_Y, SEAT_Z);
  root.add(body);

  const pelvis = ellipsoid(0.19, 0.12, 0.14, pantsMat);
  pelvis.position.set(0, 0.02, 0);
  body.add(pelvis);

  // ---------------------------------------------------------------- Legs
  const buildLeg = (side: -1 | 1) => {
    const hip = new THREE.Group();
    hip.position.set(side * 0.1, -0.02, 0);
    body.add(hip);

    const thigh = capsule(0.078, 0.3, pantsMat);
    thigh.position.y = -0.2;
    hip.add(thigh);

    const knee = new THREE.Group();
    knee.position.y = -0.4;
    hip.add(knee);

    const kneeCap = ellipsoid(0.074, 0.074, 0.074, pantsMat, 18, 14);
    knee.add(kneeCap);

    const shin = capsule(0.062, 0.46, pantsMat);
    shin.position.y = -0.29;
    knee.add(shin);

    const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.052, 0.04, 16), soleMat);
    sock.position.y = -0.585;
    knee.add(sock);

    const shoe = ellipsoid(0.058, 0.042, 0.12, shoeMat, 20, 14);
    shoe.position.set(0, -0.622, 0.045);
    knee.add(shoe);
    const sole = ellipsoid(0.06, 0.014, 0.124, soleMat, 20, 8);
    sole.position.set(0, -0.652, 0.045);
    knee.add(sole);

    return { hip, knee };
  };
  const legL = buildLeg(-1);
  const legR = buildLeg(1);

  // ---------------------------------------------------------------- Torso
  const torsoGroup = new THREE.Group();
  body.add(torsoGroup);

  const torsoPoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.175, 0.0),
    new THREE.Vector2(0.205, 0.06),
    new THREE.Vector2(0.224, 0.18),
    new THREE.Vector2(0.226, 0.3),
    new THREE.Vector2(0.226, 0.46),
    new THREE.Vector2(0.19, 0.5),
    new THREE.Vector2(0.12, 0.53),
    new THREE.Vector2(0.06, 0.545),
    new THREE.Vector2(0.0, 0.55)
  ];
  const torsoGeo = new THREE.LatheGeometry(torsoPoints, 40);
  const torso = new THREE.Mesh(torsoGeo, suitMat);
  torso.scale.set(fem ? 0.93 : 1.0, 1, 0.68);
  torsoGroup.add(torso);

  const shoulderX = fem ? 0.205 : 0.218;
  [-1, 1].forEach((side) => {
    const cap = ellipsoid(0.078, 0.068, 0.08, suitMat, 22, 16);
    cap.position.set(side * (shoulderX - 0.004), 0.44, 0);
    torsoGroup.add(cap);
  });

  // Helpers that conform flat pieces (shirt, lapels, tie...) to the curved blazer front
  const torsoSX = fem ? 0.93 : 1.0;
  const torsoRadiusAt = (y: number) => {
    for (let i = 1; i < torsoPoints.length; i++) {
      const a = torsoPoints[i - 1];
      const b = torsoPoints[i];
      if (y <= b.y) return lerp(a.x, b.x, clamp01((y - a.y) / Math.max(1e-6, b.y - a.y)));
    }
    return 0;
  };
  const torsoZ = (x: number, y: number) => {
    const r = torsoRadiusAt(y);
    return 0.68 * Math.sqrt(Math.max(0, r * r - (x / torsoSX) ** 2));
  };
  const conformGrid = (
    y0: number,
    y1: number,
    range: (y: number) => [number, number],
    lift: number,
    mat: THREE.Material,
    rows = 16,
    cols = 8
  ) => {
    const pos: number[] = [];
    const idx: number[] = [];
    for (let r = 0; r <= rows; r++) {
      const y = lerp(y0, y1, r / rows);
      const [ra, rb] = range(y);
      const xa = Math.min(ra, rb);
      const xb = Math.max(ra, rb);
      for (let c = 0; c <= cols; c++) {
        const x = lerp(xa, xb, c / cols);
        pos.push(x, y, torsoZ(x, y) + lift);
      }
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const a = r * (cols + 1) + c;
        const b = a + 1;
        const d = a + cols + 1;
        const e = d + 1;
        idx.push(a, b, e, a, e, d);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat);
    torsoGroup.add(m);
    return m;
  };
  const conformMesh = (mesh: THREE.Mesh, yOff: number, lift: number) => {
    const attr = mesh.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      const x = attr.getX(i);
      const y = attr.getY(i) + yOff;
      attr.setXYZ(i, x, y, torsoZ(x, y) + lift + attr.getZ(i));
    }
    attr.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
    torsoGroup.add(mesh);
    return mesh;
  };

  const vGrid = (y0: number, hwTop: number, lift: number, mat: THREE.Material, yTop = 0.545) =>
    conformGrid(
      y0,
      yTop,
      (y) => {
        const hw =
          y < 0.48 ? hwTop * ((y - y0) / (0.48 - y0)) : lerp(hwTop, Math.min(hwTop, 0.05), (y - 0.48) / 0.065);
        return [-hw, hw];
      },
      lift,
      mat,
      20,
      10
    );
  const collarWing = (d: number, mat: THREE.Material, spread: number, lift = 0.0075) => {
    conformGrid(
      0.445,
      0.515,
      (y) => {
        const t = (y - 0.445) / 0.07;
        return [d * lerp(0.046 * spread, 0.008, t), d * lerp(0.046 * spread, 0.066 * spread, t)];
      },
      lift,
      mat,
      8,
      4
    );
  };
  const smallButton = (x: number, y: number, mat: THREE.Material, r = 0.011) => {
    const btn = ellipsoid(r, r, r * 0.5, mat, 12, 8);
    btn.position.set(x, y, torsoZ(x, y) + 0.006);
    torsoGroup.add(btn);
  };

  // ------------------------------------------------ Inner layer (shirt / blouse / tee)
  const openOuter = cfg.outfit !== 'shirt';
  vGrid(openOuter ? 0.235 : 0.37, openOuter ? 0.09 : 0.055, 0.0025, shirtMat);

  // ------------------------------------------------ Outer layer
  if (cfg.outfit === 'blazer') {
    [-1, 1].forEach((d) => {
      const lapel = extrudeShape(
        [
          [0, -0.005],
          [d * 0.09, 0.245],
          [d * 0.132, 0.236],
          [d * 0.127, 0.172],
          [d * 0.098, 0.152],
          [d * 0.064, 0.05]
        ],
        0.005,
        lapelMat
      );
      conformMesh(lapel, 0.235, 0.006);
    });
    const btnMat = new THREE.MeshStandardMaterial({ color: suitColor.clone().multiplyScalar(0.55), roughness: 0.4 });
    smallButton(0, 0.205, btnMat, 0.012);
    smallButton(0, 0.135, btnMat, 0.012);
  } else if (cfg.outfit === 'cardigan') {
    // Shawl collar running around the neck and down the opening
    [-1, 1].forEach((d) => {
      const shawl = extrudeShape(
        [
          [0, -0.005],
          [d * 0.085, 0.25],
          [d * 0.06, 0.31],
          [d * 0.115, 0.3],
          [d * 0.145, 0.235],
          [d * 0.07, 0.04]
        ],
        0.008,
        lapelMat,
        0.003
      );
      conformMesh(shawl, 0.235, 0.006);
    });
    const btnMat = new THREE.MeshStandardMaterial({ color: '#5A3B22', roughness: 0.4 });
    smallButton(0.012, 0.2, btnMat, 0.013);
    smallButton(0.012, 0.12, btnMat, 0.013);
  } else if (cfg.outfit === 'denim') {
    const seamMat = new THREE.MeshStandardMaterial({
      color: suitColor.clone().offsetHSL(0, -0.05, -0.08),
      roughness: 0.9
    });
    // Opening bands along the V
    [-1, 1].forEach((d) => {
      conformGrid(
        0.18,
        0.48,
        (y) => {
          const x = 0.09 * Math.max(0, (y - 0.235) / 0.245);
          return [d * x, d * (x + 0.022)];
        },
        0.0045,
        seamMat,
        12,
        2
      );
      // Chest pocket flap + button
      conformGrid(0.33, 0.365, () => [d * 0.08, d * 0.165], 0.005, lapelMat, 4, 4);
      conformGrid(0.29, 0.33, () => [d * 0.085, d * 0.16], 0.003, seamMat, 4, 4);
      smallButton(d * 0.122, 0.34, brassMat, 0.008);
    });
    smallButton(0.03, 0.2, brassMat, 0.009);
    smallButton(0.03, 0.12, brassMat, 0.009);
    collarWing(-1, suitMat, 1.45, 0.009);
    collarWing(1, suitMat, 1.45, 0.009);
  } else {
    // Button-up shirt worn on its own: placket, buttons and a soft collar
    const placketMat = new THREE.MeshStandardMaterial({
      color: suitColor.clone().offsetHSL(0, 0, -0.04),
      roughness: 0.7
    });
    conformGrid(0.04, 0.37, () => [-0.012, 0.012], 0.003, placketMat, 10, 2);
    const btnMat = new THREE.MeshStandardMaterial({ color: '#F4F6F8', roughness: 0.3 });
    [0.33, 0.25, 0.17, 0.09].forEach((by) => smallButton(0, by, btnMat, 0.0075));
    collarWing(-1, suitMat, 1.3, 0.009);
    collarWing(1, suitMat, 1.3, 0.009);
  }

  // Visitor badge (character's right chest)
  const badge = new THREE.Group();
  badge.position.set(-0.13, 0.36, torsoZ(-0.13, 0.36) + 0.008);
  badge.rotation.y = -0.5;
  const badgeCard = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.064, 0.005),
    new THREE.MeshStandardMaterial({ color: '#FBF7EE', roughness: 0.4 })
  );
  badge.add(badgeCard);
  const badgeStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.016, 0.006),
    new THREE.MeshStandardMaterial({ color: '#1E3A6E', roughness: 0.4 })
  );
  badgeStripe.position.y = 0.024;
  badge.add(badgeStripe);
  const badgeClip = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.012, 0.008), brassMat);
  badgeClip.position.y = 0.036;
  badge.add(badgeClip);
  if (cfg.outfit !== 'denim') torsoGroup.add(badge);

  // ------------------------------------------------ Neckwear / accessory
  if (cfg.accessory === 'tie') {
    conformGrid(
      0.27,
      0.462,
      (y) => {
        const hw = y < 0.3 ? 0.024 * ((y - 0.27) / 0.03) : lerp(0.024, 0.011, (y - 0.3) / 0.162);
        return [-hw, hw];
      },
      0.0045,
      accentMat,
      14,
      4
    );
    const knot = ellipsoid(0.019, 0.017, 0.011, accentMat, 14, 10);
    knot.position.set(0, 0.468, torsoZ(0, 0.468) + 0.008);
    knot.rotation.x = -0.4;
    torsoGroup.add(knot);
    collarWing(-1, shirtMat, 1);
    collarWing(1, shirtMat, 1);
  } else if (cfg.accessory === 'blouse') {
    // Open V-neck blouse showing the neckline
    vGrid(cfg.outfit === 'blazer' ? 0.33 : 0.41, 0.052, 0.0035, skinMat);
  } else if (cfg.accessory === 'scarf') {
    const scarfMat = new THREE.MeshStandardMaterial({ color: cfg.accentHex, roughness: 0.55 });
    const patternMat = new THREE.MeshStandardMaterial({ color: '#C98F62', roughness: 0.55 });
    const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.072, 0.032, 14, 32), scarfMat);
    wrap.rotation.x = Math.PI / 2 - 0.2;
    wrap.scale.set(1.05, 1, 0.95);
    wrap.position.set(0, 0.525, 0.015);
    torsoGroup.add(wrap);
    const knotS = ellipsoid(0.04, 0.032, 0.022, scarfMat, 16, 12);
    knotS.position.set(0.015, 0.47, torsoZ(0.015, 0.47) + 0.012);
    torsoGroup.add(knotS);
    const tailA = ellipsoid(0.03, 0.085, 0.012, scarfMat, 16, 12);
    tailA.position.set(0.035, 0.39, torsoZ(0.035, 0.39) + 0.012);
    tailA.rotation.z = 0.2;
    torsoGroup.add(tailA);
    const tailB = ellipsoid(0.026, 0.07, 0.012, scarfMat, 16, 12);
    tailB.position.set(-0.01, 0.38, torsoZ(-0.01, 0.38) + 0.016);
    tailB.rotation.z = -0.15;
    torsoGroup.add(tailB);
    // Soft print on the silk
    const prints: [number, number, number][] = [
      [0.03, 0.42, 0.017],
      [0.045, 0.36, 0.017],
      [-0.012, 0.4, 0.021],
      [0.0, 0.48, 0.03],
      [0.035, 0.485, 0.028]
    ];
    prints.forEach(([x, y, dz]) => {
      const dot = ellipsoid(0.008, 0.012, 0.003, patternMat, 8, 6);
      dot.position.set(x, y, torsoZ(x, y) + dz);
      torsoGroup.add(dot);
    });
  } else if (cfg.accessory === 'turtleneck') {
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.078, 0.1, 28), shirtMat);
    roll.position.set(0, 0.565, 0.008);
    torsoGroup.add(roll);
    const rollLip = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.012, 10, 28), shirtMat);
    rollLip.rotation.x = Math.PI / 2;
    rollLip.position.set(0, 0.612, 0.008);
    torsoGroup.add(rollLip);
  } else if (cfg.accessory === 'open_collar') {
    vGrid(0.4, 0.05, 0.004, skinMat);
    collarWing(-1, shirtMat, 1.2);
    collarWing(1, shirtMat, 1.2);
  } else if (cfg.accessory === 'tee') {
    // Round tee neckline peeking out of the open shirt
    const teeNeck = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.006, 8, 24, Math.PI), shirtMat);
    teeNeck.rotation.set(-0.9, 0, Math.PI);
    teeNeck.position.set(0, 0.535, 0.05);
    torsoGroup.add(teeNeck);
  }

  // ---------------------------------------------------------------- Arms
  const buildArm = (side: -1 | 1) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * (shoulderX + 0.017), 0.42, 0);
    torsoGroup.add(shoulder);

    const upper = capsule(0.053, 0.17, suitMat);
    upper.position.y = -0.12;
    shoulder.add(upper);

    const elbow = new THREE.Group();
    elbow.position.y = -0.26;
    elbow.rotation.order = 'YXZ';
    shoulder.add(elbow);

    const elbowBall = ellipsoid(0.054, 0.054, 0.054, suitMat, 16, 12);
    elbow.add(elbowBall);

    const rolled = cfg.outfit === 'shirt';
    const fore = capsule(rolled ? 0.044 : 0.05, 0.2, rolled ? skinMat : suitMat);
    fore.position.y = -0.13;
    elbow.add(fore);

    if (rolled) {
      const roll = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.016, 10, 22), suitMat);
      roll.rotation.x = Math.PI / 2;
      roll.position.y = -0.04;
      elbow.add(roll);
    } else {
      const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.046, 0.026, 18), shirtMat);
      cuff.position.y = -0.262;
      elbow.add(cuff);
    }

    const hand = new THREE.Group();
    hand.position.y = -0.285;
    elbow.add(hand);

    const palm = ellipsoid(0.039, 0.046, 0.021, skinMat, 18, 14);
    palm.position.y = -0.03;
    hand.add(palm);
    const fingers = ellipsoid(0.037, 0.03, 0.018, skinMat, 18, 12);
    fingers.position.set(0, -0.072, -0.004);
    fingers.rotation.x = 0.35;
    hand.add(fingers);
    const thumb = capsule(0.0115, 0.028, skinMat);
    thumb.position.set(-side * 0.036, -0.032, 0.006);
    thumb.rotation.z = side * 0.65;
    hand.add(thumb);

    return { shoulder, elbow };
  };
  const armL = buildArm(-1);
  const armR = buildArm(1);

  // ---------------------------------------------------------------- Neck & head
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.056, 0.16, 20), skinMat);
  neck.position.set(0, 0.56, 0.0);
  torsoGroup.add(neck);

  const headPivot = new THREE.Group();
  headPivot.position.set(0, HEAD_PIVOT_Y, 0.005);
  torsoGroup.add(headPivot);

  const head = new THREE.Group();
  head.position.set(0, HEAD_CENTER_UP, 0.01);
  headPivot.add(head);

  const skull = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 36), skinMat);
  skull.scale.set(HA, HB, HC);
  head.add(skull);
  if (!fem) {
    const jaw = ellipsoid(0.146, 0.085, 0.118, skinMat, 32, 20);
    jaw.position.set(0, -0.075, 0.0);
    head.add(jaw);
  }

  // Ears
  [-1, 1].forEach((side) => {
    const ear = ellipsoid(0.02, 0.036, 0.027, skinMat, 16, 12);
    ear.position.set(side * 0.161, -0.012, -0.006);
    ear.rotation.y = side * 0.25;
    head.add(ear);
    const inner = ellipsoid(0.008, 0.022, 0.016, skinShadeMat, 12, 10);
    inner.position.set(side * 0.177, -0.012, 0.0);
    inner.rotation.y = side * 0.25;
    head.add(inner);
  });

  // Nose
  const nose = ellipsoid(0.021, 0.018, 0.017, skinMat, 18, 14);
  placeOnFace(nose, 0, -0.034, 0.006, 0.3);
  head.add(nose);

  // Cheek blush
  [-1, 1].forEach((side) => {
    const blush = ellipsoid(0.03, 0.018, 0.012, blushMat, 18, 12);
    placeOnFace(blush, side * 0.098, -0.046, 0.005);
    blush.renderOrder = 2;
    head.add(blush);
  });

  // Eyes (flush, cute oversized iris, two catch-lights, blinking lids)
  const buildEye = (side: -1 | 1) => {
    const eye = new THREE.Group();
    placeOnFace(eye, side * 0.06, -0.002, 0.007, 0.65);
    head.add(eye);

    const sclera = ellipsoid(0.026, 0.032, 0.014, scleraMat, 22, 16);
    eye.add(sclera);

    const iris = new THREE.Group();
    eye.add(iris);
    const irisDisc = ellipsoid(0.0205, 0.0215, 0.006, irisMat, 22, 12);
    irisDisc.position.z = 0.0095;
    iris.add(irisDisc);
    const pupil = ellipsoid(0.011, 0.012, 0.004, pupilMat, 16, 10);
    pupil.position.z = 0.0125;
    iris.add(pupil);
    const glintA = ellipsoid(0.0058, 0.0058, 0.002, glintMat, 10, 8);
    glintA.position.set(side * -0.006 + 0.002, 0.008, 0.0158);
    iris.add(glintA);
    const glintB = ellipsoid(0.0026, 0.0026, 0.0015, glintMat, 8, 6);
    glintB.position.set(0.006, -0.008, 0.0155);
    iris.add(glintB);

    // Upper lash line
    const lash = new THREE.Mesh(
      new THREE.TorusGeometry(0.0275, fem ? 0.0042 : 0.0032, 8, 20, 2.3),
      lashMat
    );
    lash.rotation.z = Math.PI / 2 - 1.15;
    lash.scale.set(1, 1.17, 1);
    lash.position.z = 0.006;
    eye.add(lash);
    if (fem) {
      const wing = capsule(0.0035, 0.01, lashMat);
      wing.position.set(side * 0.028, 0.012, 0.004);
      wing.rotation.z = side * -0.9;
      eye.add(wing);
    }

    // Eyelid: hangs from the top of the eye; scale.y 0 = open, 1 = closed
    const lid = new THREE.Group();
    lid.position.y = 0.034;
    eye.add(lid);
    const lidGeo = new THREE.SphereGeometry(1, 22, 16);
    lidGeo.scale(0.0292, 0.0345, 0.0212);
    lidGeo.translate(0, -0.0345, 0);
    const lidMesh = new THREE.Mesh(lidGeo, skinMat);
    lid.add(lidMesh);
    lid.scale.y = 0.001;
    lid.visible = false;

    return { iris, lid };
  };
  const eyeL = buildEye(-1);
  const eyeR = buildEye(1);

  // Eyebrows (arched tubes) — kept dark even on grey-haired candidates, like their portraits
  const hairColor = new THREE.Color(cfg.hairHex);
  const greyHair = hairColor.getHSL({ h: 0, s: 0, l: 0 }).l > 0.3 && hairColor.getHSL({ h: 0, s: 0, l: 0 }).s < 0.1;
  const browMat = greyHair
    ? new THREE.MeshStandardMaterial({ color: '#3A3836', roughness: 0.55 })
    : hairMat;
  const browThickness = cfg.stern ? 0.011 : fem ? 0.0058 : 0.0078;
  const buildBrow = (side: -1 | 1) => {
    const brow = new THREE.Group();
    placeOnFace(brow, side * 0.062, cfg.stern ? 0.052 : 0.057, -0.003, 0.55);
    head.add(brow);
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.045, browThickness, 8, 18, 0.85), browMat);
    arch.rotation.z = Math.PI / 2 - 0.425;
    arch.position.y = -0.045;
    arch.scale.z = 0.7;
    const browTilt = new THREE.Group();
    browTilt.add(arch);
    brow.add(browTilt);
    return browTilt;
  };
  const browL = buildBrow(-1);
  const browR = buildBrow(1);

  // Mouth: idle smile arc + animated open mouth
  const mouthAnchor = new THREE.Group();
  placeOnFace(mouthAnchor, 0, -0.086, 0.001, 0.2);
  head.add(mouthAnchor);

  const smile = new THREE.Group();
  mouthAnchor.add(smile);
  lipMat.side = THREE.DoubleSide;
  const smileArc = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.0052, 10, 28, 2.0), lipMat);
  smileArc.rotation.z = -Math.PI / 2 - 1.0;
  smileArc.position.y = 0.028;
  smile.add(smileArc);

  const mouthOpen = new THREE.Group();
  mouthOpen.position.y = 0.004;
  mouthAnchor.add(mouthOpen);
  const cavity = ellipsoid(0.025, 0.02, 0.009, mouthCavityMat, 20, 14);
  cavity.position.y = -0.018;
  mouthOpen.add(cavity);
  const teeth = ellipsoid(0.019, 0.0055, 0.004, teethMat, 14, 8);
  teeth.position.set(0, -0.004, 0.006);
  mouthOpen.add(teeth);
  const tongue = ellipsoid(0.015, 0.008, 0.004, tongueMat, 14, 8);
  tongue.position.set(0, -0.03, 0.0055);
  mouthOpen.add(tongue);
  mouthOpen.visible = false;

  // Stubble: a soft translucent shadow along the jaw and upper lip
  if (cfg.facialHair === 'stubble') {
    const stubbleMat = new THREE.MeshStandardMaterial({
      color: hairColor.clone().multiplyScalar(0.7),
      roughness: 0.9,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const jawShadow = new THREE.Mesh(
      new THREE.SphereGeometry(1, 40, 14, -0.15, Math.PI + 0.3, 0.66 * Math.PI, 0.31 * Math.PI),
      stubbleMat
    );
    jawShadow.scale.set(HA * 1.035, HB * 1.025, HC * 1.05);
    jawShadow.renderOrder = 2;
    head.add(jawShadow);
    const lipShadow = ellipsoid(0.034, 0.011, 0.01, stubbleMat, 18, 10);
    placeOnFace(lipShadow, 0, -0.065, 0.004, 0.3);
    lipShadow.renderOrder = 2;
    head.add(lipShadow);
    [-1, 1].forEach((side) => {
      const burn = ellipsoid(0.016, 0.05, 0.035, stubbleMat, 14, 12);
      burn.position.set(side * 0.15, -0.045, 0.015);
      burn.renderOrder = 2;
      head.add(burn);
    });
  }

  // Earrings
  if (cfg.earrings) {
    [-1, 1].forEach((side) => {
      const stud = ellipsoid(0.008, 0.008, 0.008, brassMat, 12, 10);
      stud.position.set(side * 0.166, -0.046, 0.004);
      head.add(stud);
    });
  }

  // Glasses
  if (cfg.hasGlasses) {
    const rect = cfg.glassesShape === 'rect';
    const frameMat = new THREE.MeshStandardMaterial({
      color: cfg.glassesHex,
      metalness: rect ? 0.1 : 0.55,
      roughness: 0.3,
      transparent: rect,
      opacity: rect ? 0.9 : 1
    });
    const lensMat = new THREE.MeshStandardMaterial({
      color: '#DDF1FF',
      transparent: true,
      opacity: 0.16,
      roughness: 0.05,
      depthWrite: false
    });
    [-1, 1].forEach((side) => {
      const rimGeo = new THREE.TorusGeometry(0.034, rect ? 0.0048 : 0.0036, 10, rect ? 4 : 32);
      if (rect) rimGeo.rotateZ(Math.PI / 4);
      const rim = new THREE.Mesh(rimGeo, frameMat);
      rim.position.set(side * 0.06, -0.002, 0.168);
      rim.rotation.y = side * 0.14;
      if (rect) rim.scale.set(1.08, 0.74, 1);
      head.add(rim);
      const lens = new THREE.Mesh(
        rect ? new THREE.PlaneGeometry(0.05, 0.034) : new THREE.CircleGeometry(0.032, 28),
        lensMat
      );
      lens.position.set(side * 0.06, -0.002, 0.167);
      lens.rotation.y = side * 0.14;
      head.add(lens);
      head.add(
        cylinderBetween(
          new THREE.Vector3(side * 0.095, 0.004, 0.162),
          new THREE.Vector3(side * 0.168, 0.012, -0.03),
          0.0032,
          frameMat
        )
      );
    });
    head.add(
      cylinderBetween(new THREE.Vector3(-0.025, 0.006, 0.17), new THREE.Vector3(0.025, 0.006, 0.17), 0.003, frameMat)
    );
  }

  // ---------------------------------------------------------------- Hair
  const hair = new THREE.Group();
  head.add(hair);

  const addCap = (radiusMul: number, mat: THREE.Material, tiltX = -0.6, tiltZ = 0, lift = 0) => {
    // Upper hemisphere tilted back: hairline sits on the forehead, back reaches the nape
    const cap = new THREE.Mesh(new THREE.SphereGeometry(1, 44, 24, 0, Math.PI * 2, 0, 0.52 * Math.PI), mat);
    cap.scale.set(HA * radiusMul * (fem ? 1 : 0.975), HB * radiusMul * 0.995, HC * (radiusMul + 0.02));
    cap.rotation.set(tiltX, 0, tiltZ);
    cap.position.set(0, 0.004 + lift, -0.008);
    hair.add(cap);
    return cap;
  };
  // Combed volume for short hair: a second, slightly bigger cap swept to one side
  const addSweep = (side: number, radiusMul = 1.11, tiltX = -0.8, mat: THREE.Material = hairMat) =>
    addCap(radiusMul, mat, tiltX, side * 0.2, 0.006);
  const addBlob = (
    sx: number,
    sy: number,
    sz: number,
    x: number,
    y: number,
    z: number,
    rx = 0,
    ry = 0,
    rz = 0,
    mat: THREE.Material = hairMat
  ) => {
    const b = ellipsoid(sx, sy, sz, mat, 22, 16);
    b.position.set(x, y, z);
    b.rotation.set(rx, ry, rz);
    hair.add(b);
    return b;
  };
  const addCurlShell = (radius: number, count: number, minR: number, maxR: number, clearFace = true) => {
    const tilt = new THREE.Euler(-0.6, 0, 0);
    for (let i = 0; i < count; i++) {
      const yN = 1 - (i / (count - 1)) * 1.05;
      const rr = Math.sqrt(Math.max(0, 1 - yN * yN));
      const phi = i * 2.399963;
      const v = new THREE.Vector3(Math.cos(phi) * rr, yN, Math.sin(phi) * rr).multiplyScalar(radius).applyEuler(tilt);
      if (clearFace && v.z > 0.07 && v.y < 0.105) continue; // keep the face clear
      const r = minR + (((i * 7) % 5) / 4) * (maxR - minR);
      addBlob(r, r, r, v.x, v.y + 0.004, v.z - 0.008);
    }
  };
  const silverTemples = () =>
    [-1, 1].forEach((side) => addBlob(0.024, 0.05, 0.058, side * 0.158, 0.03, 0.0, 0, 0, 0, silverMat));

  switch (cfg.hairStyle) {
    case 'parted_silver': {
      // Dark-grey hair combed back with a silver sweep and silver temples
      addCap(1.06, hairMat);
      const sweepMat = new THREE.MeshStandardMaterial({
        color: hairColor.clone().lerp(new THREE.Color('#C9CBD0'), 0.22),
        roughness: 0.45,
        side: THREE.DoubleSide
      });
      addSweep(-1, 1.11, -0.82, sweepMat);
      addBlob(0.1, 0.04, 0.085, -0.02, 0.15, 0.065, 0.45, 0, 0.1, sweepMat);
      silverTemples();
      break;
    }
    case 'curly_bun': {
      // Natural curls pulled up into a high curly bun
      addCap(1.07, hairMat);
      addCurlShell(HEAD_R * 1.1, 34, 0.022, 0.03);
      const puff = new THREE.Vector3(0, 0.2, -0.03);
      for (let i = 0; i < 22; i++) {
        const yN = 1 - (i / 21) * 1.6;
        const rr = Math.sqrt(Math.max(0, 1 - Math.min(1, yN * yN)));
        const phi = i * 2.399963;
        const r = 0.032 + ((i * 3) % 4) * 0.004;
        addBlob(
          r,
          r,
          r,
          puff.x + Math.cos(phi) * rr * 0.07,
          puff.y + yN * 0.05,
          puff.z + Math.sin(phi) * rr * 0.065
        );
      }
      break;
    }
    case 'quiff': {
      addCap(1.06, hairMat);
      addSweep(1, 1.1, -0.86);
      addBlob(0.105, 0.05, 0.08, 0.0, 0.142, 0.1, 0.55, 0, -0.06);
      addBlob(0.07, 0.035, 0.05, 0.02, 0.15, 0.135, 0.85, 0, -0.12);
      break;
    }
    case 'sleek_bob': {
      // Straight jet-black bob, chin length, deep side part
      addCap(1.08, hairMat);
      const bobGeo = new THREE.SphereGeometry(1, 44, 20, Math.PI / 2 + 0.98, Math.PI * 2 - 1.96, 0.24 * Math.PI, 0.56 * Math.PI);
      const bob = new THREE.Mesh(bobGeo, hairMat);
      bob.scale.set(HA * 1.14, HB * 1.07, HC * 1.12);
      bob.position.set(0, 0.0, -0.006);
      hair.add(bob);
      addBlob(0.11, 0.045, 0.095, 0.05, 0.125, 0.075, 0.2, 0, -0.42);
      break;
    }
    case 'short_swept': {
      addCap(1.05, hairMat);
      addSweep(1, 1.1, -0.78);
      addBlob(0.09, 0.035, 0.07, 0.02, 0.15, 0.085, 0.45, 0, -0.15);
      break;
    }
    case 'wavy_shoulder': {
      // Black wavy hair to the shoulders with a side part
      addCap(1.08, hairMat);
      addBlob(0.19, 0.2, 0.12, 0, -0.07, -0.085);
      addBlob(0.115, 0.045, 0.1, -0.04, 0.135, 0.07, 0.15, 0, 0.32);
      [-1, 1].forEach((side) => {
        addBlob(0.05, 0.1, 0.06, side * 0.158, -0.05, 0.0, 0, 0, side * 0.12);
        addBlob(0.055, 0.075, 0.06, side * 0.178, -0.165, -0.02, 0, 0, -side * 0.25);
        addBlob(0.04, 0.035, 0.045, side * 0.21, -0.225, -0.015, 0, 0, side * 0.5);
      });
      break;
    }
    case 'flat_grey': {
      addCap(1.06, hairMat);
      addSweep(-1, 1.1, -0.8);
      addBlob(0.1, 0.038, 0.085, -0.015, 0.15, 0.06, 0.45, 0, 0.12);
      silverTemples();
      break;
    }
    case 'curly_pony':
    default: {
      // Loose black waves gathered in a high ponytail, a few strands framing the face
      addCap(1.07, hairMat);
      addCurlShell(HEAD_R * 1.1, 26, 0.03, 0.038);
      [-1, 1].forEach((side) => {
        addBlob(0.034, 0.075, 0.04, side * 0.155, -0.07, 0.02, 0, 0, side * 0.15);
        addBlob(0.028, 0.05, 0.035, side * 0.165, -0.15, 0.0, 0, 0, -side * 0.2);
      });
      const pony: [number, number, number, number][] = [
        [0.05, 0.0, 0.12, -0.18],
        [0.05, 0.015, 0.06, -0.225],
        [0.046, -0.01, -0.01, -0.24],
        [0.042, 0.012, -0.08, -0.24],
        [0.036, -0.004, -0.14, -0.23]
      ];
      pony.forEach(([r, x, y, z]) => addBlob(r, r * 1.15, r, x, y, z));
      break;
    }
  }

  // ---------------------------------------------------------------- Finalize
  const interactiveMeshes: THREE.Object3D[] = [];
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      const mat = mesh.material as THREE.Material;
      mesh.castShadow = !mat.transparent;
      mesh.receiveShadow = true;
      interactiveMeshes.push(mesh);
    }
  });

  const rig: Candidate3DRig = {
    root,
    body,
    torsoGroup,
    headPivot,
    hipL: legL.hip,
    hipR: legR.hip,
    kneeL: legL.knee,
    kneeR: legR.knee,
    shoulderL: armL.shoulder,
    shoulderR: armR.shoulder,
    elbowL: armL.elbow,
    elbowR: armR.elbow,
    browL,
    browR,
    lidL: eyeL.lid,
    lidR: eyeR.lid,
    irisL: eyeL.iris,
    irisR: eyeR.iris,
    smile,
    mouthOpen,
    interactiveMeshes,
    persona: {
      browBias: cfg.stern ? -0.22 : 0,
      smileMul: cfg.stern ? 0.35 : 1,
      smileAdd: cfg.bigSmile ? 0.45 : 0,
      lidAdd: cfg.stern ? 0.08 : cfg.bigSmile ? 0.06 : 0
    },
    anim: {
      initialized: false,
      walkStart: null,
      lastWalk: 1,
      nextBlink: 0,
      blinkStart: -10,
      nextSaccade: 0,
      gazeTX: 0,
      gazeTY: 0,
      gazeX: 0,
      gazeY: 0,
      speak: 0,
      lean: 0.03,
      browTilt: 0,
      browLiftL: 0,
      browLiftR: 0,
      smileCurve: 1,
      smileWidth: 1,
      smileRot: 0,
      lidMood: 0.08,
      headTilt: 0,
      headPitch: 0
    }
  };

  // Start in the seated pose so the very first frame already looks right
  animateCandidate3DAvatar(rig, 0, false, 'neutral', 0, 1);
  return rig;
}

interface MoodPose {
  lean: number;
  browTilt: number;
  browLiftL: number;
  browLiftR: number;
  smileCurve: number;
  smileWidth: number;
  smileRot: number;
  lid: number;
  headTilt: number;
  headPitch: number;
  gazeX: number;
  gazeY: number;
}

const MOOD_POSES: Record<CandidateMood, MoodPose> = {
  neutral: { lean: 0.03, browTilt: 0, browLiftL: 0, browLiftR: 0, smileCurve: 0.9, smileWidth: 1, smileRot: 0, lid: 0.1, headTilt: 0, headPitch: 0, gazeX: 0, gazeY: 0 },
  confident: { lean: -0.06, browTilt: -0.12, browLiftL: -0.002, browLiftR: 0.003, smileCurve: 1.25, smileWidth: 1.08, smileRot: 0.12, lid: 0.2, headTilt: -0.04, headPitch: -0.06, gazeX: 0, gazeY: 0 },
  thoughtful: { lean: 0.0, browTilt: -0.05, browLiftL: 0.012, browLiftR: -0.004, smileCurve: 0.35, smileWidth: 0.8, smileRot: -0.1, lid: 0.22, headTilt: 0.12, headPitch: -0.03, gazeX: 0.0045, gazeY: 0.005 },
  nervous: { lean: 0.05, browTilt: 0.3, browLiftL: 0.008, browLiftR: 0.008, smileCurve: -0.45, smileWidth: 0.78, smileRot: 0.05, lid: 0.0, headTilt: -0.05, headPitch: 0.07, gazeX: -0.002, gazeY: -0.003 },
  enthusiastic: { lean: 0.09, browTilt: 0.06, browLiftL: 0.014, browLiftR: 0.014, smileCurve: 1.9, smileWidth: 1.16, smileRot: 0, lid: 0.32, headTilt: 0.05, headPitch: -0.02, gazeX: 0, gazeY: 0.001 }
};

/**
 * Animates the stylized candidate: walk-in from the door, turn, sit down, then seated
 * idle with breathing, blinking, gaze, lip-flap, gestures and mood expressions.
 */
export function animateCandidate3DAvatar(
  rig: Candidate3DRig,
  elapsed: number,
  isSpeaking: boolean,
  mood: CandidateMood,
  cameraYaw: number,
  walkProgress: number
) {
  const st = rig.anim;
  if (!st.initialized) {
    st.initialized = true;
    st.walkStart = walkProgress < 1 ? elapsed : null;
    st.nextBlink = elapsed + 1.5 + Math.random() * 2;
    st.nextSaccade = elapsed + 1;
  } else if (walkProgress < st.lastWalk - 0.0001) {
    st.walkStart = elapsed; // walk-in restarted
  }
  st.lastWalk = walkProgress;
  const t = st.walkStart === null ? 1 : clamp01((elapsed - st.walkStart) / WALK_DURATION);

  // ------------------------------------------------------------ Locomotion phases
  const WALK_END = 0.6;
  const TURN_END = 0.72;
  let rootX = 0;
  let faceY = 0;
  let sit = 1;
  let gaitAmp = 0;
  if (t < WALK_END) {
    const p = t / WALK_END;
    rootX = WALK_START_X * (1 - smooth(p));
    faceY = -Math.PI / 2;
    sit = 0;
    gaitAmp = Math.min(1, p * 6, (1 - p) * 4);
  } else if (t < TURN_END) {
    const p = (t - WALK_END) / (TURN_END - WALK_END);
    faceY = -Math.PI / 2 * (1 - smooth(p));
    sit = 0;
    gaitAmp = 0.35 * Math.sin(Math.PI * p);
  } else if (t < 1) {
    sit = smooth((t - TURN_END) / (1 - TURN_END));
  }
  const gait = elapsed * 7.2;
  const seatedNow = sit > 0.999;

  // ------------------------------------------------------------ Mood blending
  const pose = MOOD_POSES[mood] || MOOD_POSES.neutral;
  const k = 0.08;
  st.lean = lerp(st.lean, pose.lean, k);
  const persona = rig.persona;
  st.browTilt = lerp(st.browTilt, pose.browTilt + persona.browBias, k);
  st.browLiftL = lerp(st.browLiftL, pose.browLiftL, k);
  st.browLiftR = lerp(st.browLiftR, pose.browLiftR, k);
  st.smileCurve = lerp(
    st.smileCurve,
    pose.smileCurve > 0 ? pose.smileCurve * persona.smileMul + persona.smileAdd : pose.smileCurve,
    k
  );
  st.smileWidth = lerp(st.smileWidth, pose.smileWidth, k);
  st.smileRot = lerp(st.smileRot, pose.smileRot, k);
  st.lidMood = lerp(st.lidMood, pose.lid + persona.lidAdd, k);
  st.headTilt = lerp(st.headTilt, pose.headTilt, k);
  st.headPitch = lerp(st.headPitch, pose.headPitch, k);
  st.speak = lerp(st.speak, isSpeaking ? 1 : 0, 0.15);
  const g = st.speak;

  // ------------------------------------------------------------ Root / hips
  rig.root.position.x = rootX;
  rig.root.position.y = 0;
  const bob = (1 - sit) * Math.abs(Math.sin(gait)) * 0.028 * gaitAmp;
  const breath = Math.sin(elapsed * 2.0) * 0.004;
  const excitedBounce = seatedNow && mood === 'enthusiastic' ? Math.abs(Math.sin(elapsed * 3.6)) * 0.006 : 0;
  rig.body.position.set(
    0,
    lerp(STAND_Y, SEAT_Y, sit) + bob + excitedBounce,
    lerp(STAND_Z, SEAT_Z, sit)
  );
  rig.body.rotation.y = faceY;

  // ------------------------------------------------------------ Legs
  const swing = Math.sin(gait) * 0.48 * gaitAmp;
  const nervousKnee = seatedNow && mood === 'nervous' ? Math.sin(elapsed * 15) * 0.025 : 0;
  rig.hipL.rotation.x = lerp(swing, -Math.PI / 2, sit) + nervousKnee;
  rig.hipR.rotation.x = lerp(-swing, -Math.PI / 2, sit);
  rig.hipL.rotation.z = sit * -0.04;
  rig.hipR.rotation.z = sit * 0.04;
  const kneeBendL = Math.max(0, Math.sin(gait - 1.3)) * 0.75 * gaitAmp;
  const kneeBendR = Math.max(0, Math.sin(gait + Math.PI - 1.3)) * 0.75 * gaitAmp;
  rig.kneeL.rotation.x = lerp(kneeBendL, Math.PI / 2 + 0.06, sit) - nervousKnee;
  rig.kneeR.rotation.x = lerp(kneeBendR, Math.PI / 2 + 0.06, sit);

  // ------------------------------------------------------------ Torso
  const sitDip = Math.sin(Math.PI * clamp01((t - TURN_END) / (1 - TURN_END))) * 0.28 * (t < 1 ? 1 : 0);
  rig.torsoGroup.rotation.x = lerp(0.02, st.lean, sit) + sitDip;
  rig.torsoGroup.rotation.y = (1 - sit) * Math.sin(gait) * 0.07 * gaitAmp + (seatedNow ? Math.sin(elapsed * 0.6) * 0.02 : 0);
  rig.torsoGroup.rotation.z = seatedNow ? Math.sin(elapsed * 0.45) * 0.012 : 0;
  rig.torsoGroup.position.y = breath;
  rig.torsoGroup.scale.set(1 + breath * 1.2, 1, 1 + breath * 1.5);

  // ------------------------------------------------------------ Arms
  const fidget = seatedNow && mood === 'nervous' ? Math.sin(elapsed * 9) * 0.07 : 0;
  const applyArm = (shoulder: THREE.Group, elbow: THREE.Group, side: -1 | 1) => {
    const walkSwing = -Math.sin(gait) * 0.42 * gaitAmp * (side === -1 ? -1 : 1);
    const ph = side === -1 ? 0 : 1.7;
    const gestureLift = (Math.sin(elapsed * 3.9 + ph) * 0.5 + 0.5) * 0.45 * g;
    const gestureOpen = Math.sin(elapsed * 2.4 + ph) * 0.3 * g;

    shoulder.rotation.x = lerp(walkSwing, -0.45 + Math.sin(elapsed * 3.1 + ph) * 0.08 * g, sit);
    shoulder.rotation.z = lerp(side * 0.09, side * 0.05 + side * 0.06 * g, sit);
    elbow.rotation.x = lerp(-0.22 - Math.max(0, -walkSwing) * 0.3, -Math.PI / 2 + 0.52 - gestureLift, sit);
    elbow.rotation.y = lerp(0, -side * (0.5 - 0.22 * g) + gestureOpen * -side + fidget * side, sit);
  };
  applyArm(rig.shoulderL, rig.elbowL, -1);
  applyArm(rig.shoulderR, rig.elbowR, 1);

  // ------------------------------------------------------------ Head
  const turningToCamera = -faceY / (Math.PI / 2); // 1 while facing the walking direction
  const speakNod = Math.sin(elapsed * 6.3) * 0.045 * g + Math.sin(elapsed * 2.7) * 0.02 * g;
  const idleNod = Math.sin(elapsed * 1.3) * 0.012;
  const nervousJitter = mood === 'nervous' ? Math.sin(elapsed * 17) * 0.01 : 0;
  rig.headPivot.rotation.x = st.headPitch + speakNod + idleNod - sitDip * 0.6;
  rig.headPivot.rotation.y =
    cameraYaw * 0.3 + turningToCamera * 0.75 + nervousJitter + Math.sin(elapsed * 0.7) * 0.03;
  rig.headPivot.rotation.z = st.headTilt + Math.cos(elapsed * 4.6) * 0.025 * g + Math.sin(elapsed * 0.9) * 0.012;

  // ------------------------------------------------------------ Eyes: gaze & blink
  if (elapsed > st.nextSaccade) {
    st.gazeTX = (Math.random() - 0.5) * 0.004;
    st.gazeTY = (Math.random() - 0.5) * 0.003;
    st.nextSaccade = elapsed + 0.8 + Math.random() * 2.2;
  }
  st.gazeX = lerp(st.gazeX, st.gazeTX + pose.gazeX - cameraYaw * 0.004, 0.3);
  st.gazeY = lerp(st.gazeY, st.gazeTY + pose.gazeY, 0.3);
  rig.irisL.position.set(st.gazeX, st.gazeY, 0);
  rig.irisR.position.set(st.gazeX, st.gazeY, 0);

  if (elapsed > st.nextBlink) {
    st.blinkStart = elapsed;
    st.nextBlink = elapsed + (mood === 'nervous' ? 1.0 + Math.random() * 1.4 : 2.4 + Math.random() * 2.6);
  }
  const bp = (elapsed - st.blinkStart) / 0.17;
  const blink = bp >= 0 && bp <= 1 ? 1 - Math.abs(bp * 2 - 1) : 0;
  const lidAmt = Math.max(st.lidMood, blink);
  [rig.lidL, rig.lidR].forEach((lid) => {
    lid.scale.y = Math.max(0.001, lidAmt);
    lid.visible = lidAmt > 0.02;
  });

  // ------------------------------------------------------------ Brows
  const browSpeak = Math.sin(elapsed * 5.1) * 0.003 * g;
  rig.browL.rotation.z = st.browTilt;
  rig.browR.rotation.z = -st.browTilt;
  rig.browL.position.y = st.browLiftL + browSpeak;
  rig.browR.position.y = st.browLiftR + browSpeak;

  // ------------------------------------------------------------ Mouth
  if (g > 0.35) {
    const flap =
      0.25 +
      0.75 * Math.abs(Math.sin(elapsed * 10.5)) * (0.65 + 0.35 * Math.sin(elapsed * 3.7)) * (isSpeaking ? 1 : 0.3);
    rig.smile.visible = false;
    rig.mouthOpen.visible = true;
    rig.mouthOpen.scale.set(0.82 + st.smileWidth * 0.18, Math.max(0.12, flap), 1);
    rig.mouthOpen.rotation.z = st.smileRot * 0.5;
  } else {
    rig.mouthOpen.visible = false;
    rig.smile.visible = true;
    rig.smile.scale.set(st.smileWidth, st.smileCurve, 1);
    rig.smile.rotation.z = st.smileRot;
  }
}
