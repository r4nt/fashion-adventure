import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfceef5);
scene.fog = new THREE.FogExp2(0xfceef5, 0.04);

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.9, 5.2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.35, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 2.5;
controls.maxDistance = 10;
controls.maxPolarAngle = Math.PI / 2 - 0.02;

// Lighting
const ambientLight = new THREE.HemisphereLight(0xfff5fa, 0xd8bfd8, 1.1);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xfff9f5, 2.0);
keyLight.position.set(3.5, 6, 4);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 15;
const d = 3;
keyLight.shadow.camera.left = -d;
keyLight.shadow.camera.right = d;
keyLight.shadow.camera.top = d;
keyLight.shadow.camera.bottom = -d;
keyLight.shadow.bias = -0.0005;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffd6eb, 0.9);
fillLight.position.set(-4, 3, 2);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xe6e6fa, 1.2);
rimLight.position.set(0, 4, -4);
scene.add(rimLight);

// Pedestal / Stage
const stageGroup = new THREE.Group();
scene.add(stageGroup);

const pedestalMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.3,
  metalness: 0.05,
});
const goldTrimMat = new THREE.MeshStandardMaterial({
  color: 0xf4c466,
  roughness: 0.25,
  metalness: 0.7,
});

const baseCylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(1.35, 1.45, 0.16, 64),
  pedestalMat
);
baseCylinder.position.y = -0.08;
baseCylinder.receiveShadow = true;
stageGroup.add(baseCylinder);

const goldRing = new THREE.Mesh(
  new THREE.TorusGeometry(1.36, 0.025, 16, 64),
  goldTrimMat
);
goldRing.rotation.x = Math.PI / 2;
goldRing.position.y = 0;
stageGroup.add(goldRing);

// Floor plane for soft shadow catch
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(18, 64),
  new THREE.MeshStandardMaterial({ color: 0xf8e3ee, roughness: 0.85 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.16;
floor.receiveShadow = true;
scene.add(floor);

// Materials for Character & Dress
const skinMat = new THREE.MeshStandardMaterial({
  color: 0xffe0d2,
  roughness: 0.55,
  metalness: 0.02,
});

const hairMat = new THREE.MeshStandardMaterial({
  color: 0x4a2c2a,
  roughness: 0.45,
  metalness: 0.08,
});

const dressMainMat = new THREE.MeshPhysicalMaterial({
  color: 0xe84a7f,
  roughness: 0.35,
  metalness: 0.05,
  sheen: 0.8,
  sheenRoughness: 0.4,
  sheenColor: new THREE.Color(0xffb3c6),
  side: THREE.DoubleSide,
});

const dressAccentMat = new THREE.MeshPhysicalMaterial({
  color: 0xfff5f8,
  roughness: 0.3,
  sheen: 0.6,
  sheenColor: new THREE.Color(0xffffff),
  side: THREE.DoubleSide,
});

const ribbonMat = new THREE.MeshStandardMaterial({
  color: 0xb81d58,
  roughness: 0.3,
  metalness: 0.1,
  side: THREE.DoubleSide,
});

const shoeMat = new THREE.MeshStandardMaterial({
  color: 0xc21e56,
  roughness: 0.2,
  metalness: 0.15,
});

const eyeDarkMat = new THREE.MeshBasicMaterial({ color: 0x231720 });
const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const blushMat = new THREE.MeshBasicMaterial({
  color: 0xff8da1,
  transparent: true,
  opacity: 0.55,
});

// Helper to enable shadows on a mesh
function withShadows(mesh: THREE.Mesh): THREE.Mesh {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// Character Hierarchy
const girlGroup = new THREE.Group();
scene.add(girlGroup);

const upperBodyGroup = new THREE.Group();
upperBodyGroup.position.y = 1.15;
girlGroup.add(upperBodyGroup);

const skirtGroup = new THREE.Group();
skirtGroup.position.y = 1.15;
girlGroup.add(skirtGroup);

// --- 1. LEGS & MARY JANE SHOES ---
function createLeg(side: number): THREE.Group {
  const legGroup = new THREE.Group();
  legGroup.position.set(side * 0.17, 0, 0);

  // Lower leg
  const legMesh = withShadows(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.052, 0.72, 24),
      skinMat
    )
  );
  legMesh.position.y = 0.44;
  legGroup.add(legMesh);

  // White frilly ankle sock
  const sockMesh = withShadows(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.058, 0.056, 0.2, 24),
      dressAccentMat
    )
  );
  sockMesh.position.y = 0.16;
  legGroup.add(sockMesh);

  const sockRuffle = withShadows(
    new THREE.Mesh(
      new THREE.TorusGeometry(0.062, 0.015, 12, 24),
      dressAccentMat
    )
  );
  sockRuffle.rotation.x = Math.PI / 2;
  sockRuffle.position.y = 0.26;
  legGroup.add(sockRuffle);

  // Mary Jane shoe
  const shoeBase = withShadows(
    new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 16), shoeMat)
  );
  shoeBase.scale.set(0.95, 0.65, 1.55);
  shoeBase.position.set(0, 0.055, 0.035);
  legGroup.add(shoeBase);

  // Shoe strap
  const strap = withShadows(
    new THREE.Mesh(
      new THREE.TorusGeometry(0.065, 0.01, 10, 24, Math.PI),
      shoeMat
    )
  );
  strap.rotation.z = side * 0.05;
  strap.position.set(0, 0.07, 0.03);
  legGroup.add(strap);

  // Small gold buckle on shoe
  const buckle = new THREE.Mesh(
    new THREE.SphereGeometry(0.014, 12, 12),
    goldTrimMat
  );
  buckle.position.set(side * 0.065, 0.085, 0.03);
  legGroup.add(buckle);

  return legGroup;
}

girlGroup.add(createLeg(-1));
girlGroup.add(createLeg(1));

// --- 2. LAYERED FLARED DRESS SKIRT ---
function createRuffledSkirtTier(
  topRadius: number,
  bottomRadius: number,
  height: number,
  yOffset: number,
  pleats: number,
  rippleAmp: number,
  material: THREE.Material
): THREE.Mesh {
  const radialSegs = 96;
  const heightSegs = 24;
  const geom = new THREE.CylinderGeometry(
    topRadius,
    bottomRadius,
    height,
    radialSegs,
    heightSegs,
    true
  );

  const pos = geom.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    vertex.fromBufferAttribute(pos, i);
    // Normalized height from 0 (top) to 1 (bottom)
    const t = 0.5 - vertex.y / height;
    const angle = Math.atan2(vertex.z, vertex.x);

    // Flared bell curve + pleats that grow stronger toward the hem
    const bellFlare = Math.pow(t, 1.45) * 0.09;
    const pleatWave =
      Math.sin(angle * pleats) * rippleAmp * Math.pow(t, 1.15) +
      Math.cos(angle * pleats * 2) * (rippleAmp * 0.25) * t;

    const radialDist = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
    if (radialDist > 0.0001) {
      const newRadius = radialDist + bellFlare + pleatWave;
      vertex.x = (vertex.x / radialDist) * newRadius;
      vertex.z = (vertex.z / radialDist) * newRadius;
    }

    // Scalloped hem wave
    vertex.y += Math.cos(angle * pleats) * 0.015 * t;
    pos.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geom.computeVertexNormals();
  const mesh = withShadows(new THREE.Mesh(geom, material));
  mesh.position.y = yOffset;
  return mesh;
}

// Underskirt white lace petticoat tier
const petticoatTier = createRuffledSkirtTier(
  0.34,
  0.76,
  0.52,
  -0.38,
  24,
  0.04,
  dressAccentMat
);
skirtGroup.add(petticoatTier);

// Main middle tier
const middleSkirtTier = createRuffledSkirtTier(
  0.22,
  0.68,
  0.54,
  -0.29,
  18,
  0.045,
  dressMainMat
);
skirtGroup.add(middleSkirtTier);

// Upper peplum/overskirt tier
const topSkirtTier = createRuffledSkirtTier(
  0.17,
  0.48,
  0.32,
  -0.16,
  14,
  0.03,
  dressMainMat
);
skirtGroup.add(topSkirtTier);

// Waistband ribbon + bow
const waistRibbon = withShadows(
  new THREE.Mesh(
    new THREE.CylinderGeometry(0.178, 0.185, 0.09, 36),
    ribbonMat
  )
);
waistRibbon.position.y = 0.02;
skirtGroup.add(waistRibbon);

function createBow(scale = 1): THREE.Group {
  const bow = new THREE.Group();
  const knot = withShadows(
    new THREE.Mesh(new THREE.SphereGeometry(0.038, 16, 16), ribbonMat)
  );
  knot.scale.set(1, 0.9, 0.7);
  bow.add(knot);

  for (const side of [-1, 1]) {
    const loopGeom = new THREE.TorusGeometry(0.065, 0.024, 12, 24);
    const loop = withShadows(new THREE.Mesh(loopGeom, ribbonMat));
    loop.scale.set(1.2, 0.75, 0.5);
    loop.position.set(side * 0.075, 0.01, -0.01);
    loop.rotation.z = side * 0.2;
    bow.add(loop);

    const tail = withShadows(
      new THREE.Mesh(new THREE.PlaneGeometry(0.045, 0.22, 4, 8), ribbonMat)
    );
    tail.position.set(side * 0.05, -0.11, -0.015);
    tail.rotation.z = side * 0.28;
    bow.add(tail);
  }

  bow.scale.setScalar(scale);
  return bow;
}

const frontWaistBow = createBow(0.85);
frontWaistBow.position.set(0, 0.02, 0.185);
skirtGroup.add(frontWaistBow);

const backWaistBow = createBow(1.25);
backWaistBow.position.set(0, 0.02, -0.185);
backWaistBow.rotation.y = Math.PI;
skirtGroup.add(backWaistBow);

// --- 3. TORSO / BODICE & ARMS ---
const bodice = withShadows(
  new THREE.Mesh(
    new THREE.CylinderGeometry(0.205, 0.168, 0.42, 32),
    dressMainMat
  )
);
bodice.position.y = 0.21;
bodice.scale.set(1, 1, 0.82);
upperBodyGroup.add(bodice);

// White Peter Pan collar / neckline ruffle
const collar = withShadows(
  new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.032, 16, 36),
    dressAccentMat
  )
);
collar.rotation.x = Math.PI / 2 + 0.12;
collar.scale.set(1.15, 0.9, 0.7);
collar.position.set(0, 0.41, 0.01);
upperBodyGroup.add(collar);

// Gold brooch at the collar center
const brooch = new THREE.Mesh(
  new THREE.SphereGeometry(0.028, 16, 16),
  goldTrimMat
);
brooch.scale.set(1, 1.2, 0.6);
brooch.position.set(0, 0.39, 0.165);
upperBodyGroup.add(brooch);

// Neck
const neck = withShadows(
  new THREE.Mesh(
    new THREE.CylinderGeometry(0.072, 0.082, 0.18, 24),
    skinMat
  )
);
neck.position.y = 0.47;
upperBodyGroup.add(neck);

// Puff sleeves & arms
const leftArmGroup = new THREE.Group();
const rightArmGroup = new THREE.Group();

function populateArm(armGroup: THREE.Group, side: number): void {
  armGroup.position.set(side * 0.22, 0.38, 0);

  // Cute puff sleeve
  const puffSleeve = withShadows(
    new THREE.Mesh(new THREE.SphereGeometry(0.115, 24, 20), dressMainMat)
  );
  puffSleeve.scale.set(0.95, 1.05, 0.95);
  puffSleeve.position.set(side * 0.03, -0.02, 0);
  armGroup.add(puffSleeve);

  // White sleeve cuff trim
  const cuff = withShadows(
    new THREE.Mesh(
      new THREE.TorusGeometry(0.068, 0.015, 12, 24),
      dressAccentMat
    )
  );
  cuff.rotation.x = Math.PI / 2;
  cuff.rotation.y = side * 0.35;
  cuff.position.set(side * 0.06, -0.1, 0);
  armGroup.add(cuff);

  // Forearm angled gracefully near the skirt
  const armMesh = withShadows(
    new THREE.Mesh(
      new THREE.CapsuleGeometry(0.046, 0.36, 12, 20),
      skinMat
    )
  );
  armMesh.position.set(side * 0.12, -0.25, 0.04);
  armMesh.rotation.z = side * 0.32;
  armMesh.rotation.x = -0.18;
  armGroup.add(armMesh);

  // Hand
  const hand = withShadows(
    new THREE.Mesh(new THREE.SphereGeometry(0.052, 16, 16), skinMat)
  );
  hand.scale.set(0.85, 1.15, 0.7);
  hand.position.set(side * 0.185, -0.44, 0.085);
  armGroup.add(hand);
}

populateArm(leftArmGroup, -1);
populateArm(rightArmGroup, 1);
upperBodyGroup.add(leftArmGroup);
upperBodyGroup.add(rightArmGroup);

// --- 4. HEAD, FACE & HAIRSTYLE ---
const headGroup = new THREE.Group();
headGroup.position.y = 0.56;
upperBodyGroup.add(headGroup);

const headMesh = withShadows(
  new THREE.Mesh(new THREE.SphereGeometry(0.27, 36, 32), skinMat)
);
headMesh.scale.set(1, 1.04, 0.96);
headMesh.position.y = 0.22;
headGroup.add(headMesh);

// Ears
for (const side of [-1, 1]) {
  const ear = withShadows(
    new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), skinMat)
  );
  ear.scale.set(0.45, 0.85, 0.6);
  ear.position.set(side * 0.265, 0.21, -0.01);
  headGroup.add(ear);

  // Pearl earring
  const earring = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 14, 14),
    dressAccentMat
  );
  earring.position.set(side * 0.27, 0.165, 0.005);
  headGroup.add(earring);
}

// Eyes with anime/stylized shine
const eyeGroups: THREE.Group[] = [];
for (const side of [-1, 1]) {
  const eyeGroup = new THREE.Group();
  eyeGroup.position.set(side * 0.095, 0.215, 0.238);
  eyeGroup.rotation.y = side * 0.22;

  const iris = new THREE.Mesh(
    new THREE.SphereGeometry(0.042, 20, 20),
    eyeDarkMat
  );
  iris.scale.set(0.95, 1.25, 0.35);
  eyeGroup.add(iris);

  const bigHighlight = new THREE.Mesh(
    new THREE.SphereGeometry(0.015, 12, 12),
    eyeHighlightMat
  );
  bigHighlight.position.set(side * 0.012, 0.018, 0.014);
  eyeGroup.add(bigHighlight);

  const smallHighlight = new THREE.Mesh(
    new THREE.SphereGeometry(0.008, 10, 10),
    eyeHighlightMat
  );
  smallHighlight.position.set(-side * 0.012, -0.015, 0.014);
  eyeGroup.add(smallHighlight);

  // Upper eyelash arc
  const lash = new THREE.Mesh(
    new THREE.TorusGeometry(0.044, 0.007, 8, 20, Math.PI * 0.85),
    hairMat
  );
  lash.rotation.z = Math.PI * 0.08;
  lash.position.set(0, 0.01, 0.006);
  eyeGroup.add(lash);

  headGroup.add(eyeGroup);
  eyeGroups.push(eyeGroup);

  // Soft pink cheek blush
  const blush = new THREE.Mesh(
    new THREE.CircleGeometry(0.045, 20),
    blushMat
  );
  blush.scale.set(1.35, 0.8, 1);
  blush.position.set(side * 0.135, 0.155, 0.232);
  blush.rotation.y = side * 0.38;
  headGroup.add(blush);
}

// Cute subtle nose
const nose = new THREE.Mesh(
  new THREE.SphereGeometry(0.018, 12, 12),
  skinMat
);
nose.scale.set(0.8, 0.9, 1.2);
nose.position.set(0, 0.18, 0.265);
headGroup.add(nose);

// Gentle smile
const smile = new THREE.Mesh(
  new THREE.TorusGeometry(0.036, 0.0065, 10, 24, Math.PI * 0.8),
  new THREE.MeshBasicMaterial({ color: 0xd45d79 })
);
smile.rotation.z = Math.PI * 1.1;
smile.rotation.x = 0.2;
smile.position.set(0, 0.145, 0.252);
headGroup.add(smile);

// Hair cap
const hairCap = withShadows(
  new THREE.Mesh(
    new THREE.SphereGeometry(
      0.286,
      36,
      28,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.62
    ),
    hairMat
  )
);
hairCap.scale.set(1.02, 1.05, 1.03);
hairCap.position.set(0, 0.23, -0.015);
hairCap.rotation.x = -0.18;
headGroup.add(hairCap);

// Front bangs (swept locks)
const bangConfigs = [
  { x: -0.13, y: 0.33, z: 0.21, rx: 0.35, rz: 0.32, sx: 0.075, sy: 0.16 },
  { x: -0.045, y: 0.35, z: 0.24, rx: 0.42, rz: 0.1, sx: 0.07, sy: 0.15 },
  { x: 0.045, y: 0.35, z: 0.24, rx: 0.42, rz: -0.08, sx: 0.07, sy: 0.15 },
  { x: 0.13, y: 0.33, z: 0.21, rx: 0.35, rz: -0.32, sx: 0.075, sy: 0.16 },
];
for (const b of bangConfigs) {
  const bang = withShadows(
    new THREE.Mesh(new THREE.SphereGeometry(1, 18, 16), hairMat)
  );
  bang.scale.set(b.sx, b.sy, 0.055);
  bang.position.set(b.x, b.y, b.z);
  bang.rotation.set(b.rx, 0, b.rz);
  headGroup.add(bang);
}

// Side hair locks framing the face
const sideLocks: THREE.Mesh[] = [];
for (const side of [-1, 1]) {
  const lock = withShadows(
    new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.28, 12, 18), hairMat)
  );
  lock.scale.set(0.85, 1, 0.65);
  lock.position.set(side * 0.24, 0.11, 0.11);
  lock.rotation.z = side * 0.12;
  lock.rotation.x = 0.12;
  headGroup.add(lock);
  sideLocks.push(lock);
}

// Flowing back hair + cute high hair bun with matching ribbon bow
const hairBun = withShadows(
  new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 24), hairMat)
);
hairBun.position.set(0, 0.51, -0.12);
headGroup.add(hairBun);

const hairBow = createBow(1.1);
hairBow.position.set(0, 0.44, -0.01);
hairBow.rotation.x = -0.35;
headGroup.add(hairBow);

const backHairFlow = withShadows(
  new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.42, 16, 24), hairMat)
);
backHairFlow.scale.set(1.15, 1, 0.55);
backHairFlow.position.set(0, 0.06, -0.2);
backHairFlow.rotation.x = 0.16;
headGroup.add(backHairFlow);

// --- 5. FLOATING SPARKLES AROUND THE STAGE ---
const sparkleCount = 36;
const sparklePositions = new Float32Array(sparkleCount * 3);
const sparklePhases: number[] = [];

for (let i = 0; i < sparkleCount; i++) {
  const angle = (i / sparkleCount) * Math.PI * 2;
  const radius = 0.85 + Math.random() * 0.7;
  sparklePositions[i * 3] = Math.cos(angle) * radius;
  sparklePositions[i * 3 + 1] = 0.2 + Math.random() * 2.1;
  sparklePositions[i * 3 + 2] = Math.sin(angle) * radius;
  sparklePhases.push(Math.random() * Math.PI * 2);
}

const sparkleGeometry = new THREE.BufferGeometry();
sparkleGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(sparklePositions, 3)
);
const sparkleMaterial = new THREE.PointsMaterial({
  color: 0xffe4f2,
  size: 0.06,
  transparent: true,
  opacity: 0.85,
});
const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
scene.add(sparkles);

// --- 6. ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate(): void {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Gentle breathing & cheerful sway
  upperBodyGroup.position.y = 1.15 + Math.sin(t * 2.2) * 0.012;
  girlGroup.rotation.y = Math.sin(t * 0.8) * 0.18;

  // Head tilt & subtle nod
  headGroup.rotation.z = Math.sin(t * 1.4) * 0.045;
  headGroup.rotation.y = Math.sin(t * 0.9) * 0.08;

  // Periodic natural blink
  const blinkCycle = t % 4.2;
  const isBlinking = blinkCycle > 4.0 && blinkCycle < 4.14;
  for (const eye of eyeGroups) {
    eye.scale.y = isBlinking ? 0.1 : 1;
  }

  // Dress skirt gentle twirl / sway
  skirtGroup.rotation.z = Math.sin(t * 1.6) * 0.03;
  skirtGroup.rotation.y = Math.sin(t * 1.2 - 0.4) * 0.05;

  // Arms gentle counter-sway
  leftArmGroup.rotation.z = Math.sin(t * 1.6) * 0.04;
  rightArmGroup.rotation.z = -Math.sin(t * 1.6) * 0.04;

  // Floating sparkles animation
  const posAttr = sparkleGeometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < sparkleCount; i++) {
    const baseY = posAttr.getY(i);
    posAttr.setY(
      i,
      ((baseY + 0.0025) % 2.3) + Math.sin(t * 2 + sparklePhases[i]) * 0.001
    );
  }
  posAttr.needsUpdate = true;
  sparkles.rotation.y = t * 0.15;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Responsive resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
