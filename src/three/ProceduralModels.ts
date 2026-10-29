import * as THREE from 'three';

/**
 * Builds an ornate, multi-part 3D Emerald Banker's Lamp at local origin (0,0,0)
 * scaled for the executive desk.
 */
export function buildBankersLamp(brassMat: THREE.Material): THREE.Group {
  const lampGroup = new THREE.Group();

  // Turned stepped brass base using LatheGeometry
  const basePoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.115, 0.0),
    new THREE.Vector2(0.115, 0.016),
    new THREE.Vector2(0.095, 0.028),
    new THREE.Vector2(0.082, 0.044),
    new THREE.Vector2(0.048, 0.062),
    new THREE.Vector2(0.026, 0.085),
    new THREE.Vector2(0.02, 0.24),
    new THREE.Vector2(0.032, 0.26),
    new THREE.Vector2(0.018, 0.28),
    new THREE.Vector2(0.017, 0.42),
    new THREE.Vector2(0.0, 0.42)
  ];
  const baseGeo = new THREE.LatheGeometry(basePoints, 28);
  const baseMesh = new THREE.Mesh(baseGeo, brassMat);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  lampGroup.add(baseMesh);

  // Horizontal crossbar yoke at top of stem
  const yoke = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.24, 14), brassMat);
  yoke.rotation.z = Math.PI / 2;
  yoke.position.set(0, 0.42, 0);
  lampGroup.add(yoke);

  // Side knuckles & curved arms holding the shade
  [-0.115, 0.115].forEach((xOff) => {
    const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.019, 14, 14), brassMat);
    knuckle.position.set(xOff, 0.42, 0);
    lampGroup.add(knuckle);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.1, 12), brassMat);
    arm.position.set(xOff, 0.46, 0.022);
    arm.rotation.x = 0.35;
    lampGroup.add(arm);
  });

  // Classic Banker's curved trough shade (emerald cased glass exterior)
  const shadeMat = new THREE.MeshStandardMaterial({
    color: '#0E5A36',
    emissive: '#093D24',
    emissiveIntensity: 0.55,
    roughness: 0.18,
    metalness: 0.12,
    side: THREE.DoubleSide
  });

  const shadeHolder = new THREE.Group();
  shadeHolder.position.set(0, 0.49, 0.04);
  shadeHolder.rotation.x = 0.28;
  shadeHolder.rotation.y = 0.32;

  const outerShadeGeo = new THREE.CylinderGeometry(0.088, 0.088, 0.25, 28, 1, false, 0, Math.PI);
  outerShadeGeo.rotateZ(Math.PI / 2);
  outerShadeGeo.rotateY(Math.PI / 2);
  const outerShade = new THREE.Mesh(outerShadeGeo, shadeMat);
  outerShade.castShadow = true;
  shadeHolder.add(outerShade);

  // Inner white milk-glass liner for authentic glow reflection
  const innerLinerMat = new THREE.MeshStandardMaterial({
    color: '#FFF8E7',
    emissive: '#FFE4A3',
    emissiveIntensity: 0.85,
    roughness: 0.3,
    side: THREE.BackSide
  });
  const innerShadeGeo = new THREE.CylinderGeometry(0.084, 0.084, 0.244, 24, 1, false, 0, Math.PI);
  innerShadeGeo.rotateZ(Math.PI / 2);
  innerShadeGeo.rotateY(Math.PI / 2);
  const innerShade = new THREE.Mesh(innerShadeGeo, innerLinerMat);
  shadeHolder.add(innerShade);

  // Brass end caps on shade
  [-0.125, 0.125].forEach((xCap) => {
    const capGeo = new THREE.CircleGeometry(0.088, 24, 0, Math.PI);
    const cap = new THREE.Mesh(capGeo, brassMat);
    cap.position.set(xCap, 0, 0);
    cap.rotation.y = xCap > 0 ? Math.PI / 2 : -Math.PI / 2;
    shadeHolder.add(cap);
  });

  // Glowing warm incandescent bulb inside
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 14, 14),
    new THREE.MeshBasicMaterial({ color: '#FFF5CC' })
  );
  bulb.position.set(0, 0.01, 0);
  shadeHolder.add(bulb);

  lampGroup.add(shadeHolder);

  // Beaded pull-chain with brass acorn drop
  const chainGroup = new THREE.Group();
  chainGroup.position.set(0.05, 0.44, 0.045);
  for (let i = 0; i < 8; i++) {
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.0055, 8, 8), brassMat);
    bead.position.y = -i * 0.014;
    chainGroup.add(bead);
  }
  const acorn = new THREE.Mesh(new THREE.ConeGeometry(0.011, 0.024, 12), brassMat);
  acorn.position.y = -0.125;
  acorn.rotation.x = Math.PI;
  chainGroup.add(acorn);
  lampGroup.add(chainGroup);

  return lampGroup;
}

/**
 * Builds a high-craft potted tropical plant (Monstera / Palma del Samán)
 * with a turned terracotta planter, saucer, soil, and 14 arched sculpted fronds.
 */
export function buildBotanicalPlant(x: number, z: number): THREE.Group {
  const plantGroup = new THREE.Group();
  plantGroup.position.set(x, 0, z);

  const terracottaMat = new THREE.MeshStandardMaterial({
    color: '#9C4A2D',
    roughness: 0.65,
    metalness: 0.05
  });
  const rimDarkMat = new THREE.MeshStandardMaterial({
    color: '#7A361E',
    roughness: 0.75
  });

  // Saucer plate at bottom
  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.05, 24), rimDarkMat);
  saucer.position.y = 0.025;
  saucer.receiveShadow = true;
  plantGroup.add(saucer);

  // Turned terracotta pot with lip via LatheGeometry
  const potPoints = [
    new THREE.Vector2(0.0, 0.04),
    new THREE.Vector2(0.19, 0.04),
    new THREE.Vector2(0.23, 0.26),
    new THREE.Vector2(0.26, 0.44),
    new THREE.Vector2(0.29, 0.45),
    new THREE.Vector2(0.29, 0.51),
    new THREE.Vector2(0.25, 0.51),
    new THREE.Vector2(0.24, 0.46),
    new THREE.Vector2(0.0, 0.46)
  ];
  const potGeo = new THREE.LatheGeometry(potPoints, 28);
  const potMesh = new THREE.Mesh(potGeo, terracottaMat);
  potMesh.castShadow = true;
  potMesh.receiveShadow = true;
  plantGroup.add(potMesh);

  // Rich organic soil mound
  const soil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.04, 24),
    new THREE.MeshStandardMaterial({ color: '#2B1B12', roughness: 0.95 })
  );
  soil.position.y = 0.47;
  plantGroup.add(soil);

  // Botanical leaf materials (3 lush tropical shades)
  const leafMats = [
    new THREE.MeshStandardMaterial({ color: '#1E522C', roughness: 0.4, side: THREE.DoubleSide }),
    new THREE.MeshStandardMaterial({ color: '#2B6B3A', roughness: 0.36, side: THREE.DoubleSide }),
    new THREE.MeshStandardMaterial({ color: '#398048', roughness: 0.42, side: THREE.DoubleSide })
  ];
  const stemMat = new THREE.MeshStandardMaterial({ color: '#1A4223', roughness: 0.6 });

  // Custom heart/monstera leaf shape
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.bezierCurveTo(0.11, 0.04, 0.15, 0.19, 0.095, 0.33);
  leafShape.bezierCurveTo(0.055, 0.42, 0.015, 0.49, 0, 0.54);
  leafShape.bezierCurveTo(-0.015, 0.49, -0.055, 0.42, -0.095, 0.33);
  leafShape.bezierCurveTo(-0.15, 0.19, -0.11, 0.04, 0, 0);

  const leafGeo = new THREE.ExtrudeGeometry(leafShape, {
    depth: 0.008,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 2
  });

  // Arrange 14 arched stems & leaves in 3 tiers
  const frondCount = 14;
  for (let i = 0; i < frondCount; i++) {
    const tier = i < 5 ? 0 : i < 10 ? 1 : 2;
    const angle = (i * (Math.PI * 2)) / frondCount + tier * 0.35;
    const height = 0.25 + tier * 0.14 + (i % 2) * 0.05;
    const tiltOut = 0.56 - tier * 0.13;

    const frondGroup = new THREE.Group();
    frondGroup.position.set(Math.cos(angle) * 0.05, 0.48, Math.sin(angle) * 0.05);
    frondGroup.rotation.y = -angle + Math.PI / 2;

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.011, 0.018, height, 8),
      stemMat
    );
    stem.position.set(0, height * 0.48, height * 0.18);
    stem.rotation.x = tiltOut * 0.55;
    stem.castShadow = true;
    frondGroup.add(stem);

    const blade = new THREE.Mesh(leafGeo, leafMats[i % leafMats.length]);
    blade.position.set(0, height * 0.88, height * 0.32);
    blade.rotation.x = Math.PI / 2 - tiltOut;
    blade.scale.setScalar(0.75 + (2 - tier) * 0.15);
    blade.castShadow = true;
    blade.receiveShadow = true;
    frondGroup.add(blade);

    plantGroup.add(frondGroup);
  }

  return plantGroup;
}

/**
 * Builds a high-craft Tufted Executive Visitor Armchair across from the desk.
 */
export function buildTuftedArmchair(woodMat: THREE.Material, brassMat: THREE.Material): THREE.Group {
  const chairGroup = new THREE.Group();
  chairGroup.position.set(0, 0, -0.78);

  const leatherMat = new THREE.MeshStandardMaterial({
    color: '#2B1711',
    roughness: 0.38,
    metalness: 0.08
  });
  const buttonMat = new THREE.MeshStandardMaterial({
    color: '#22110C',
    roughness: 0.35
  });

  // 4 Turned wooden legs with brass casters
  const legCoords: [number, number][] = [
    [-0.44, -0.28],
    [0.44, -0.28],
    [-0.44, 0.28],
    [0.44, 0.28]
  ];
  legCoords.forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.024, 0.42, 14), woodMat);
    leg.position.set(lx, 0.21, lz);
    leg.castShadow = true;
    chairGroup.add(leg);

    const brassFerrule = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.024, 0.06, 14), brassMat);
    brassFerrule.position.set(lx, 0.03, lz);
    chairGroup.add(brassFerrule);
  });

  // Wooden under-seat apron frame
  const apron = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.08, 0.66), woodMat);
  apron.position.set(0, 0.44, 0);
  apron.castShadow = true;
  chairGroup.add(apron);

  // Plush leather seat cushion + rounded front bolster
  const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.13, 0.62), leatherMat);
  seatCushion.position.set(0, 0.53, 0.02);
  seatCushion.castShadow = true;
  seatCushion.receiveShadow = true;
  chairGroup.add(seatCushion);

  const frontBolster = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.065, 0.92, 16),
    leatherMat
  );
  frontBolster.rotation.z = Math.PI / 2;
  frontBolster.position.set(0, 0.53, 0.33);
  chairGroup.add(frontBolster);

  // High sculpted wingback backrest
  const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.94, 1.18, 0.14), leatherMat);
  backrest.position.set(0, 1.12, -0.26);
  backrest.rotation.x = -0.05;
  backrest.castShadow = true;
  backrest.receiveShadow = true;
  chairGroup.add(backrest);

  // Wooden crest rail at top of backrest
  const crestRail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.052, 0.052, 0.98, 16),
    woodMat
  );
  crestRail.rotation.z = Math.PI / 2;
  crestRail.position.set(0, 1.72, -0.29);
  chairGroup.add(crestRail);

  // Side wingback bolsters & armrests
  [-0.48, 0.48].forEach((wx) => {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.88, 0.25), leatherMat);
    wing.position.set(wx, 1.22, -0.16);
    wing.rotation.y = wx < 0 ? 0.18 : -0.18;
    wing.castShadow = true;
    chairGroup.add(wing);

    const armPost = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.026, 0.3, 12), woodMat);
    armPost.position.set(wx, 0.65, 0.22);
    chairGroup.add(armPost);

    const armWood = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.045, 0.58), woodMat);
    armWood.position.set(wx, 0.78, 0.02);
    chairGroup.add(armWood);

    const armPad = new THREE.Mesh(new THREE.BoxGeometry(0.088, 0.04, 0.46), leatherMat);
    armPad.position.set(wx, 0.815, 0.0);
    chairGroup.add(armPad);
  });

  // Tufted buttons on backrest (kept below head height so they never read as earrings)
  for (let row = 0; row < 2; row++) {
    for (let col = -1; col <= 1; col++) {
      const btn = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 10), buttonMat);
      btn.scale.z = 0.5;
      btn.position.set(col * 0.24, 0.86 + row * 0.24, -0.185 - row * 0.01);
      chairGroup.add(btn);
    }
  }

  return chairGroup;
}

/**
 * Builds a detailed 3D Executive Intercom Telephone ("Citófono") with 12 raised buttons,
 * LCD caller screen, cradle, and sculpted ergonomic handset.
 */
export function buildExecutivePhone(brassMat: THREE.Material): {
  phoneGroup: THREE.Group;
  handsetGroup: THREE.Group;
  interactiveMeshes: THREE.Object3D[];
} {
  const phoneGroup = new THREE.Group();
  const interactiveMeshes: THREE.Object3D[] = [];

  const slateMat = new THREE.MeshStandardMaterial({
    color: '#181C24',
    roughness: 0.32,
    metalness: 0.25
  });
  const walnutTrimMat = new THREE.MeshStandardMaterial({
    color: '#3D2214',
    roughness: 0.45
  });
  const keyMat = new THREE.MeshStandardMaterial({
    color: '#D8CFC0',
    roughness: 0.35,
    metalness: 0.2
  });

  // Wedge console body
  const baseBody = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.056, 0.21), slateMat);
  baseBody.position.y = 0.028;
  baseBody.rotation.x = 0.16;
  baseBody.castShadow = true;
  baseBody.receiveShadow = true;
  phoneGroup.add(baseBody);
  interactiveMeshes.push(baseBody);

  // Walnut side cheeks
  [-0.128, 0.128].forEach((sx) => {
    const cheek = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.06, 0.215), walnutTrimMat);
    cheek.position.set(sx, 0.028, 0);
    cheek.rotation.x = 0.16;
    phoneGroup.add(cheek);
    interactiveMeshes.push(cheek);
  });

  // Backlit green-gold LCD display strip
  const lcd = new THREE.Mesh(
    new THREE.BoxGeometry(0.135, 0.01, 0.038),
    new THREE.MeshStandardMaterial({
      color: '#17382C',
      emissive: '#28664B',
      emissiveIntensity: 0.65,
      roughness: 0.2
    })
  );
  lcd.position.set(0.035, 0.062, -0.058);
  lcd.rotation.x = 0.16;
  phoneGroup.add(lcd);
  interactiveMeshes.push(lcd);

  // Brass emblem strip above keypad
  const brassStrip = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.009, 0.012), brassMat);
  brassStrip.position.set(0.035, 0.059, -0.024);
  brassStrip.rotation.x = 0.16;
  phoneGroup.add(brassStrip);

  // 12 individual raised 3D keypad buttons (3 cols x 4 rows)
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      const btn = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.014, 0.019), keyMat);
      const bx = -0.004 + c * 0.038;
      const bz = 0.005 + r * 0.026;
      btn.position.set(bx, 0.056 - r * 0.004, bz);
      btn.rotation.x = 0.16;
      phoneGroup.add(btn);
      interactiveMeshes.push(btn);
    }
  }

  // Sculpted ergonomic handset on left cradle
  const handsetGroup = new THREE.Group();
  handsetGroup.position.set(-0.075, 0.068, 0);

  [-0.082, 0.082].forEach((hz) => {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.022, 0.034, 18), slateMat);
    cup.position.set(0, -0.005, hz);
    cup.rotation.x = hz < 0 ? 0.15 : -0.15;
    cup.castShadow = true;
    handsetGroup.add(cup);
    interactiveMeshes.push(cup);

    const brassRing = new THREE.Mesh(new THREE.CylinderGeometry(0.029, 0.029, 0.006, 18), brassMat);
    brassRing.position.set(0, 0.005, hz);
    handsetGroup.add(brassRing);
  });

  const gripBar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 16), slateMat);
  gripBar.rotation.x = Math.PI / 2;
  gripBar.position.set(0, 0.012, 0);
  gripBar.castShadow = true;
  handsetGroup.add(gripBar);
  interactiveMeshes.push(gripBar);

  phoneGroup.add(handsetGroup);

  return { phoneGroup, handsetGroup, interactiveMeshes };
}

/**
 * Builds a Porcelain Coffee Cup & Saucer with dark Colombian Tinto and a brass spoon.
 */
export function buildPorcelainCoffeeSet(brassMat: THREE.Material): {
  coffeeGroup: THREE.Group;
  interactiveMeshes: THREE.Object3D[];
} {
  const coffeeGroup = new THREE.Group();
  const interactiveMeshes: THREE.Object3D[] = [];

  const porcelainMat = new THREE.MeshStandardMaterial({
    color: '#F7F2E7',
    roughness: 0.16,
    metalness: 0.05
  });

  // Turned saucer via LatheGeometry
  const saucerPoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.055, 0.0),
    new THREE.Vector2(0.095, 0.014),
    new THREE.Vector2(0.098, 0.018),
    new THREE.Vector2(0.06, 0.007),
    new THREE.Vector2(0.0, 0.007)
  ];
  const saucer = new THREE.Mesh(new THREE.LatheGeometry(saucerPoints, 28), porcelainMat);
  saucer.castShadow = true;
  saucer.receiveShadow = true;
  coffeeGroup.add(saucer);
  interactiveMeshes.push(saucer);

  // Cup body via LatheGeometry
  const cupPoints = [
    new THREE.Vector2(0.0, 0.008),
    new THREE.Vector2(0.038, 0.008),
    new THREE.Vector2(0.052, 0.048),
    new THREE.Vector2(0.058, 0.098),
    new THREE.Vector2(0.053, 0.098),
    new THREE.Vector2(0.048, 0.02),
    new THREE.Vector2(0.0, 0.02)
  ];
  const cup = new THREE.Mesh(new THREE.LatheGeometry(cupPoints, 28), porcelainMat);
  cup.castShadow = true;
  coffeeGroup.add(cup);
  interactiveMeshes.push(cup);

  // Gold rim around cup top
  const goldRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.055, 0.003, 10, 28),
    brassMat
  );
  goldRim.rotation.x = Math.PI / 2;
  goldRim.position.y = 0.098;
  coffeeGroup.add(goldRim);

  // Glossy dark Colombian coffee surface
  const tintoSurface = new THREE.Mesh(
    new THREE.CircleGeometry(0.051, 24),
    new THREE.MeshStandardMaterial({
      color: '#1C0D06',
      roughness: 0.08,
      metalness: 0.15
    })
  );
  tintoSurface.rotation.x = -Math.PI / 2;
  tintoSurface.position.y = 0.086;
  coffeeGroup.add(tintoSurface);
  interactiveMeshes.push(tintoSurface);

  // Curved cup handle
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.024, 0.006, 12, 20, Math.PI * 1.15),
    porcelainMat
  );
  handle.position.set(0.053, 0.056, 0);
  handle.rotation.z = -Math.PI / 2;
  coffeeGroup.add(handle);

  // Small brass spoon resting on saucer
  const spoonHandle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.003, 0.008), brassMat);
  spoonHandle.position.set(0.01, 0.015, 0.06);
  spoonHandle.rotation.y = 0.25;
  coffeeGroup.add(spoonHandle);

  return { coffeeGroup, interactiveMeshes };
}

/**
 * Adds architectural wood wainscoting, crown moldings, baseboards, and framed diplomas
 * to the 3D office room.
 */
export function buildRoomArchitecture(
  scene: THREE.Scene,
  frameMat: THREE.Material,
  walnutMat: THREE.Material,
  brassMat: THREE.Material
) {
  // Wainscoting panels on the left and right front wall pillars
  [-2.35, 2.35].forEach((px) => {
    const lowerPanel = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.92, 0.24), frameMat);
    lowerPanel.position.set(px, 0.46, -2.08);
    lowerPanel.receiveShadow = true;
    scene.add(lowerPanel);

    const innerBevel = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.66, 0.26), walnutMat);
    innerBevel.position.set(px, 0.46, -2.07);
    scene.add(innerBevel);
  });

  // Side wall wainscoting & chair rails
  [-3.0, 3.0].forEach((wx) => {
    const sideWainscot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.92, 5.8), frameMat);
    sideWainscot.position.set(wx, 0.46, 0.5);
    scene.add(sideWainscot);

    const sideRail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 5.8), brassMat);
    sideRail.position.set(wx, 0.93, 0.5);
    scene.add(sideRail);
  });

  // Framed Javeriana diplomas/engravings on the front wall pillars flanking the window
  [-2.35, 2.35].forEach((fx, idx) => {
    const frameGroup = new THREE.Group();
    frameGroup.position.set(fx, 2.05, -1.98);

    const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.96, 0.04), walnutMat);
    outerFrame.castShadow = true;
    frameGroup.add(outerFrame);

    const goldBorder = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.84, 0.046), brassMat);
    frameGroup.add(goldBorder);

    const parchmentMat = new THREE.MeshStandardMaterial({
      color: idx === 0 ? '#F5ECD8' : '#EFE4CE',
      roughness: 0.4
    });
    const parchment = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.78, 0.052), parchmentMat);
    frameGroup.add(parchment);

    const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.058, 20), brassMat);
    seal.rotation.x = Math.PI / 2;
    seal.position.set(0, -0.22, 0.005);
    frameGroup.add(seal);

    scene.add(frameGroup);
  });
}

/**
 * Helper that builds a single high-detail 3D Hardcover Book with overhanging leather covers,
 * cream paper page block, rounded spine, and raised gold spine ribs.
 */
function buildSingle3DBook(
  height: number,
  depth: number,
  thickness: number,
  leatherMat: THREE.Material,
  paperMat: THREE.Material,
  brassMat: THREE.Material
): THREE.Group {
  const book = new THREE.Group();
  const coverThick = 0.007;
  const pageThick = Math.max(0.016, thickness - coverThick * 2);

  // Cream paper block recessed slightly inside covers
  const pageBlock = new THREE.Mesh(
    new THREE.BoxGeometry(depth - 0.014, height - 0.014, pageThick),
    paperMat
  );
  pageBlock.position.set(-0.004, height / 2, 0);
  book.add(pageBlock);

  // Left and Right Leather Covers
  [-1, 1].forEach((side) => {
    const cover = new THREE.Mesh(
      new THREE.BoxGeometry(depth, height, coverThick),
      leatherMat
    );
    cover.position.set(0, height / 2, side * (pageThick / 2 + coverThick / 2));
    cover.castShadow = true;
    book.add(cover);
  });

  // Rounded Leather Spine facing outward (+X)
  const spineRadius = thickness / 2;
  const spine = new THREE.Mesh(
    new THREE.CylinderGeometry(spineRadius, spineRadius, height, 14, 1, false, 0, Math.PI),
    leatherMat
  );
  spine.position.set(depth / 2, height / 2, 0);
  book.add(spine);

  // 3 Raised Gold Spine Bands/Ribs
  [0.22, 0.5, 0.78].forEach((frac) => {
    const rib = new THREE.Mesh(
      new THREE.CylinderGeometry(
        spineRadius + 0.0025,
        spineRadius + 0.0025,
        0.008,
        14,
        1,
        false,
        0,
        Math.PI
      ),
      brassMat
    );
    rib.position.set(depth / 2, height * frac, 0);
    book.add(rib);
  });

  return book;
}

/**
 * Builds an ornate 3D Academic Library Bookcase filled with multi-part leather-bound 3D books,
 * horizontal book stacks, brass bookends, and a 3D Brass Terrestrial Globe.
 */
export function buildAcademicBookcase(
  frameMat: THREE.Material,
  walnutMat: THREE.Material,
  brassMat: THREE.Material
): THREE.Group {
  const shelfGroup = new THREE.Group();
  shelfGroup.position.set(-2.74, 0, -1.02);

  // Backboard & Molded Frame
  const shelfBack = new THREE.Mesh(new THREE.BoxGeometry(0.36, 2.82, 1.64), frameMat);
  shelfBack.position.set(-0.04, 1.41, 0);
  shelfBack.castShadow = true;
  shelfBack.receiveShadow = true;
  shelfGroup.add(shelfBack);

  // Side Fluted Pilasters
  [-0.78, 0.78].forEach((sz) => {
    const pilaster = new THREE.Mesh(new THREE.BoxGeometry(0.44, 2.84, 0.08), walnutMat);
    pilaster.position.set(0, 1.42, sz);
    pilaster.castShadow = true;
    shelfGroup.add(pilaster);
  });

  // Top Crown Cornice Molding
  const cornice = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.12, 1.74), walnutMat);
  cornice.position.set(0.02, 2.82, 0);
  shelfGroup.add(cornice);

  const paperMat = new THREE.MeshStandardMaterial({ color: '#F3EAD8', roughness: 0.75 });
  const leatherPalette = [
    '#14365D',
    '#6E1E1E',
    '#1F4D2B',
    '#7A4B19',
    '#3B2314',
    '#224948',
    '#571B27'
  ].map((hex) => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.45, metalness: 0.06 }));

  // 4 Shelves with detailed 3D Books & Academic Curios
  for (let row = 0; row < 4; row++) {
    const shelfY = 0.56 + row * 0.56;
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.045, 1.54), walnutMat);
    plank.position.set(0.01, shelfY, 0);
    plank.receiveShadow = true;
    shelfGroup.add(plank);

    // Brass trim along shelf front edge
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.016, 1.50), brassMat);
    trim.position.set(0.23, shelfY, 0);
    shelfGroup.add(trim);

    let cursorZ = -0.66;
    const maxZ = row === 2 ? 0.25 : 0.64; // Leave space on row 2 for the 3D Brass Globe
    let bIdx = 0;

    while (cursorZ < maxZ) {
      const bHeight = 0.26 + ((row * 3 + bIdx * 5) % 4) * 0.032;
      const bDepth = 0.21 + ((bIdx * 2) % 3) * 0.018;
      const bThick = 0.044 + (bIdx % 3) * 0.012;
      const mat = leatherPalette[(row * 5 + bIdx) % leatherPalette.length];

      const bookMesh = buildSingle3DBook(bHeight, bDepth, bThick, mat, paperMat, brassMat);
      bookMesh.position.set(0.06, shelfY + 0.022, cursorZ + bThick / 2);

      // Lean the last book slightly for realism
      if (cursorZ + bThick * 2 >= maxZ) {
        bookMesh.rotation.x = -0.16;
        bookMesh.position.z += 0.025;
      }

      shelfGroup.add(bookMesh);
      cursorZ += bThick + 0.005;
      bIdx++;
    }

    // On Shelf Row 2, place a 3D Brass & Parchment Terrestrial Globe!
    if (row === 2) {
      const globeGroup = new THREE.Group();
      globeGroup.position.set(0.08, shelfY + 0.022, 0.48);

      const gBase = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.03, 18), brassMat);
      gBase.position.y = 0.015;
      globeGroup.add(gBase);

      const gStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.07, 12), brassMat);
      gStem.position.y = 0.06;
      globeGroup.add(gStem);

      const gArc = new THREE.Mesh(
        new THREE.TorusGeometry(0.115, 0.008, 10, 24, Math.PI * 1.15),
        brassMat
      );
      gArc.position.y = 0.19;
      gArc.rotation.z = -Math.PI / 2 + 0.35;
      globeGroup.add(gArc);

      const gSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.098, 22, 18),
        new THREE.MeshStandardMaterial({
          color: '#D8C398',
          roughness: 0.42,
          metalness: 0.1
        })
      );
      gSphere.position.y = 0.19;
      gSphere.rotation.z = 0.35;
      gSphere.castShadow = true;
      globeGroup.add(gSphere);

      shelfGroup.add(globeGroup);
    }
  }

  return shelfGroup;
}

/**
 * Generates a crisp printed page texture for the 3D Open Hardcover Book on the desk
 */
function createOpenBookPagesTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FBF5E8';
  ctx.fillRect(0, 0, 512, 384);

  // Center spine crease shadow
  const grad = ctx.createLinearGradient(236, 0, 276, 0);
  grad.addColorStop(0, 'rgba(60,35,15,0)');
  grad.addColorStop(0.5, 'rgba(50,25,10,0.28)');
  grad.addColorStop(1, 'rgba(60,35,15,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(230, 0, 52, 384);

  // Gold borders on both pages
  ctx.strokeStyle = '#C8963E';
  ctx.lineWidth = 3;
  ctx.strokeRect(18, 18, 220, 348);
  ctx.strokeRect(274, 18, 220, 348);

  // Left Page: Title & Javeriana Values
  ctx.fillStyle = '#0B2545';
  ctx.font = 'bold 16px serif';
  ctx.fillText('MANUAL DEL', 36, 54);
  ctx.fillText('CAZATALENTOS', 36, 76);

  ctx.fillStyle = '#8C4A15';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('SELECCIÓN JAVERIANA', 36, 100);

  ctx.fillStyle = '#2B2623';
  ctx.font = '12px sans-serif';
  const leftLines = [
    '1. Fija el Perfil [P]',
    '   sin sesgos de edad,',
    '   género o estado civil.',
    '',
    '2. Usa la Lupa [L]',
    '   para leer gestos y',
    '   notas ocultas en CV.',
    '',
    '3. Llama al Citófono [T]',
    '   para validar hechos.'
  ];
  leftLines.forEach((line, i) => {
    ctx.fillText(line, 34, 132 + i * 20);
  });

  // Right Page: STAR Method Diagram
  ctx.fillStyle = '#0B2545';
  ctx.font = 'bold 15px serif';
  ctx.fillText('MÉTODO S.T.A.R.', 292, 54);

  const starBoxes = [
    ['S', 'Situación real vivida'],
    ['T', 'Tarea y reto asumido'],
    ['A', 'Acción concreta propia'],
    ['R', 'Resultado con datos']
  ];
  starBoxes.forEach(([letter, desc], i) => {
    const by = 78 + i * 62;
    ctx.fillStyle = '#0B2545';
    ctx.fillRect(292, by, 32, 32);
    ctx.fillStyle = '#E5C178';
    ctx.font = 'bold 18px serif';
    ctx.fillText(letter, 302, by + 22);

    ctx.fillStyle = '#1F1B18';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(desc, 334, by + 21);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Builds a high-craft 3D Open Hardcover Book ("Manual del Cazatalentos")
 * resting on the desk with curved sculpted pages, leather cover, gold corners, and silk ribbon.
 */
export function buildOpenDeskBook(brassMat: THREE.Material): {
  bookGroup: THREE.Group;
  interactiveMeshes: THREE.Object3D[];
} {
  const bookGroup = new THREE.Group();
  const interactiveMeshes: THREE.Object3D[] = [];

  const leatherCoverMat = new THREE.MeshStandardMaterial({
    color: '#4E1917', // Deep Javeriana oxblood leather
    roughness: 0.42,
    metalness: 0.08
  });
  const pageBlockEdgeMat = new THREE.MeshStandardMaterial({
    color: '#EFE3CA',
    roughness: 0.7
  });
  const printedSurfaceMat = new THREE.MeshStandardMaterial({
    map: createOpenBookPagesTexture(),
    roughness: 0.65
  });

  // Left & Right Hardcover Boards lying flat
  [-0.105, 0.105].forEach((bx) => {
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.008, 0.28), leatherCoverMat);
    board.position.set(bx, 0.004, 0);
    board.castShadow = true;
    board.receiveShadow = true;
    bookGroup.add(board);
    interactiveMeshes.push(board);
  });

  // Center Spine Ridge
  const spineRidge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.014, 0.284, 14, 1, false, 0, Math.PI),
    leatherCoverMat
  );
  spineRidge.rotation.x = Math.PI / 2;
  spineRidge.position.set(0, 0.004, 0);
  bookGroup.add(spineRidge);

  // Thick Sculpted Page Stack Left & Right (slightly arched)
  [-0.098, 0.098].forEach((px, idx) => {
    const stack = new THREE.Mesh(new THREE.BoxGeometry(0.185, 0.024, 0.264), pageBlockEdgeMat);
    stack.position.set(px, 0.018, 0);
    stack.rotation.z = idx === 0 ? -0.045 : 0.045;
    stack.castShadow = true;
    bookGroup.add(stack);
    interactiveMeshes.push(stack);
  });

  // Top Printed Spread Surface with subtle arch
  const topPagesGeo = new THREE.PlaneGeometry(0.37, 0.262, 16, 1);
  const posAttr = topPagesGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    // Arch pages upward on left and right, dipping into the center spine crease
    const archY = Math.sin((Math.abs(vx) / 0.185) * Math.PI) * 0.008;
    posAttr.setZ(i, archY);
  }
  topPagesGeo.computeVertexNormals();

  const topPagesMesh = new THREE.Mesh(topPagesGeo, printedSurfaceMat);
  topPagesMesh.rotation.x = -Math.PI / 2;
  topPagesMesh.position.set(0, 0.031, 0);
  bookGroup.add(topPagesMesh);
  interactiveMeshes.push(topPagesMesh);

  // Gold Corner Protectors on Hardcover
  [
    [-0.195, -0.132],
    [-0.195, 0.132],
    [0.195, -0.132],
    [0.195, 0.132]
  ].forEach(([cx, cz]) => {
    const corner = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.011, 0.022), brassMat);
    corner.position.set(cx, 0.005, cz);
    bookGroup.add(corner);
  });

  // Crimson & Gold Bookmark Ribbon extending from center spine
  const ribbon = new THREE.Mesh(
    new THREE.BoxGeometry(0.014, 0.003, 0.09),
    new THREE.MeshStandardMaterial({ color: '#9E1B1B', roughness: 0.5 })
  );
  ribbon.position.set(0.015, 0.012, 0.155);
  ribbon.rotation.y = 0.22;
  bookGroup.add(ribbon);

  return { bookGroup, interactiveMeshes };
}


/**
 * Rounded-rectangle outline used by the stationery props (clipboard, folders, notebook).
 */
function roundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/**
 * Builds a flat slab lying on the desk (XZ plane) from a 2D shape, `thickness` tall,
 * with its bottom face at y = 0. Shape +Y maps to world -Z (towards the candidate).
 */
function buildFlatSlab(shape: THREE.Shape, thickness: number, mat: THREE.Material, bevel = 0.003): THREE.Mesh {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 10
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, bevel, 0);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Real hardboard clipboard: rounded masonite board, chromed spring clip with lever & rivets,
 * and a printed sheet (paperMat) held under the clip.
 */
export function buildClipboardProp(paperMat: THREE.Material): {
  group: THREE.Group;
  paperMesh: THREE.Mesh;
  interactiveMeshes: THREE.Object3D[];
} {
  const group = new THREE.Group();
  const boardMat = new THREE.MeshStandardMaterial({ color: '#8A5A32', roughness: 0.55, metalness: 0.02 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: '#D9DDE2', roughness: 0.22, metalness: 0.9 });

  const board = buildFlatSlab(roundedRectShape(0.36, 0.49, 0.022), 0.008, boardMat);
  group.add(board);

  // A second sheet peeking out underneath for a lived-in stack
  const underSheet = new THREE.Mesh(
    new THREE.PlaneGeometry(0.325, 0.43),
    new THREE.MeshStandardMaterial({ color: '#EFE8DA', roughness: 0.9 })
  );
  underSheet.rotation.x = -Math.PI / 2;
  underSheet.rotation.z = 0.035;
  underSheet.position.set(0.006, 0.0135, 0.02);
  group.add(underSheet);

  // Printed sheet held by the clip
  const paperMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.325, 0.43), paperMat);
  paperMesh.rotation.x = -Math.PI / 2;
  paperMesh.position.set(0, 0.0145, 0.018);
  paperMesh.receiveShadow = true;
  group.add(paperMesh);

  // Spring clip: base plate + curved jaw + lever loop + rivets
  const clipGroup = new THREE.Group();
  clipGroup.position.set(0, 0.012, -0.205);
  const clipPlate = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.006, 0.045), chromeMat);
  clipPlate.position.y = 0.004;
  clipGroup.add(clipPlate);

  const jaw = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.15, 20, 1, false, 0, Math.PI), chromeMat);
  jaw.rotation.z = Math.PI / 2;
  jaw.scale.set(0.55, 1, 1);
  jaw.position.set(0, 0.008, 0.012);
  clipGroup.add(jaw);

  const lever = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.0045, 10, 24, Math.PI), chromeMat);
  lever.rotation.x = -Math.PI / 2 + 0.5;
  lever.position.set(0, 0.024, -0.004);
  clipGroup.add(lever);

  [-0.055, 0.055].forEach((rx) => {
    const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.0055, 10, 8), chromeMat);
    rivet.scale.y = 0.5;
    rivet.position.set(rx, 0.008, -0.012);
    clipGroup.add(rivet);
  });
  clipGroup.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) c.castShadow = true;
  });
  group.add(clipGroup);

  return { group, paperMesh, interactiveMeshes: [board, paperMesh, underSheet, clipPlate, jaw, lever] };
}

/**
 * Manila file folder with a top index tab, a colored label and a CV sheet peeking out.
 */
export function buildManilaFolderProp(folderHex: string, labelHex: string): {
  group: THREE.Group;
  interactiveMeshes: THREE.Object3D[];
} {
  const group = new THREE.Group();
  const folderMat = new THREE.MeshStandardMaterial({ color: folderHex, roughness: 0.82 });
  const labelMat = new THREE.MeshStandardMaterial({ color: labelHex, roughness: 0.6 });
  const paperMat = new THREE.MeshStandardMaterial({ color: '#FBF7EE', roughness: 0.9 });

  // Folder outline with an index tab sticking out of the back edge
  const w = 0.34;
  const h = 0.25;
  const r = 0.008;
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  shape.lineTo(w / 2, h / 2);
  shape.lineTo(0.15, h / 2);
  shape.lineTo(0.135, h / 2 + 0.03);
  shape.lineTo(0.03, h / 2 + 0.03);
  shape.lineTo(0.015, h / 2);
  shape.lineTo(-w / 2, h / 2);
  shape.lineTo(-w / 2, -h / 2 + r);
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

  const back = buildFlatSlab(shape, 0.002, folderMat, 0.0015);
  group.add(back);

  // CV sheet peeking out
  const sheet = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.003, 0.24), paperMat);
  sheet.position.set(-0.012, 0.007, -0.006);
  sheet.rotation.y = 0.04;
  sheet.castShadow = true;
  group.add(sheet);

  // Front cover lying on top
  const front = buildFlatSlab(roundedRectShape(w, h - 0.012, r), 0.002, folderMat, 0.0015);
  front.position.set(0.003, 0.011, 0.006);
  group.add(front);

  // Colored label on the tab
  const label = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.0035, 0.016), labelMat);
  label.position.set(0.083, 0.005, -h / 2 - 0.015);
  group.add(label);

  return { group, interactiveMeshes: [back, sheet, front, label] };
}

/**
 * Generates the printed cover of the interview notebook (kraft label on navy linen).
 */
function createNotebookCoverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1E3A5F';
  ctx.fillRect(0, 0, 256, 320);
  // Linen weave
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = '#FFFFFF';
  for (let i = 0; i < 320; i += 3) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Kraft label
  ctx.fillStyle = '#E9D7B4';
  ctx.fillRect(40, 96, 176, 92);
  ctx.strokeStyle = '#B89865';
  ctx.lineWidth = 2;
  ctx.strokeRect(46, 102, 164, 80);
  ctx.fillStyle = '#1F1B18';
  ctx.textAlign = 'center';
  ctx.font = 'bold 22px serif';
  ctx.fillText('PREGUNTAS', 128, 135);
  ctx.font = 'bold 15px monospace';
  ctx.fillStyle = '#8C1D24';
  ctx.fillText('MÉTODO S.T.A.R.', 128, 160);

  ctx.fillStyle = '#E5C178';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('LIBRETA DE ENTREVISTA', 128, 282);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Spiral-bound interview notebook ("libreta") with printed cover, wire coil, elastic band
 * and a yellow pencil resting beside it.
 */
export function buildSpiralNotebookProp(): {
  group: THREE.Group;
  interactiveMeshes: THREE.Object3D[];
} {
  const group = new THREE.Group();
  const w = 0.2;
  const h = 0.27;

  const coverSideMat = new THREE.MeshStandardMaterial({ color: '#1E3A5F', roughness: 0.55 });
  const pagesMat = new THREE.MeshStandardMaterial({ color: '#F6F1E4', roughness: 0.92 });
  const wireMat = new THREE.MeshStandardMaterial({ color: '#C9CED6', roughness: 0.25, metalness: 0.9 });

  const backCover = buildFlatSlab(roundedRectShape(w, h, 0.01), 0.003, coverSideMat, 0.0015);
  group.add(backCover);

  const pages = new THREE.Mesh(new THREE.BoxGeometry(w - 0.008, 0.014, h - 0.012), pagesMat);
  pages.position.set(0.002, 0.012, 0.004);
  pages.castShadow = true;
  group.add(pages);

  const frontCover = buildFlatSlab(roundedRectShape(w, h, 0.01), 0.003, coverSideMat, 0.0015);
  frontCover.position.y = 0.019;
  group.add(frontCover);

  const coverPrint = new THREE.Mesh(
    new THREE.PlaneGeometry(w - 0.006, h - 0.03),
    new THREE.MeshStandardMaterial({ map: createNotebookCoverTexture(), roughness: 0.6 })
  );
  coverPrint.rotation.x = -Math.PI / 2;
  coverPrint.position.set(0, 0.0255, 0.012);
  group.add(coverPrint);

  // Wire coil along the top (far) edge
  const loops = 13;
  for (let i = 0; i < loops; i++) {
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.0125, 0.0018, 8, 16), wireMat);
    loop.position.set(-w / 2 + 0.014 + (i * (w - 0.028)) / (loops - 1), 0.0125, -h / 2 + 0.006);
    loop.rotation.y = Math.PI / 2;
    group.add(loop);
  }

  // Elastic closure band
  const band = new THREE.Mesh(
    new THREE.BoxGeometry(0.008, 0.024, h + 0.004),
    new THREE.MeshStandardMaterial({ color: '#8C1D24', roughness: 0.7 })
  );
  band.position.set(w / 2 - 0.03, 0.0125, 0);
  group.add(band);

  // Pencil (hexagonal body, wood cone, graphite tip, ferrule & eraser)
  const pencil = new THREE.Group();
  pencil.position.set(w / 2 + 0.03, 0.0065, 0.02);
  pencil.rotation.y = 0.12;
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0065, 0.0065, 0.17, 6),
    new THREE.MeshStandardMaterial({ color: '#F2B705', roughness: 0.45 })
  );
  body.rotation.x = Math.PI / 2;
  pencil.add(body);
  const woodTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.0065, 0.022, 6),
    new THREE.MeshStandardMaterial({ color: '#E8C99A', roughness: 0.7 })
  );
  woodTip.rotation.x = Math.PI / 2;
  woodTip.position.z = 0.096;
  pencil.add(woodTip);
  const lead = new THREE.Mesh(
    new THREE.ConeGeometry(0.0022, 0.007, 8),
    new THREE.MeshStandardMaterial({ color: '#2A2A2A', roughness: 0.4 })
  );
  lead.rotation.x = Math.PI / 2;
  lead.position.z = 0.1085;
  pencil.add(lead);
  const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.0068, 0.0068, 0.012, 12), wireMat);
  ferrule.rotation.x = Math.PI / 2;
  ferrule.position.z = -0.091;
  pencil.add(ferrule);
  const eraser = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0064, 0.0064, 0.01, 12),
    new THREE.MeshStandardMaterial({ color: '#E88A8A', roughness: 0.8 })
  );
  eraser.rotation.x = Math.PI / 2;
  eraser.position.z = -0.102;
  pencil.add(eraser);
  pencil.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) c.castShadow = true;
  });
  group.add(pencil);

  return { group, interactiveMeshes: [backCover, pages, frontCover, coverPrint, band, body] };
}
