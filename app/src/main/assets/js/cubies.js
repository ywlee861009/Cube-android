// ─── 26개 cubie 생성 ───────────────────────────────────────────────────────
const GAP = 1.04;
const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
const cubies = [];

for (let cx = -1; cx <= 1; cx++) {
  for (let cy = -1; cy <= 1; cy++) {
    for (let cz = -1; cz <= 1; cz++) {
      if (cx === 0 && cy === 0 && cz === 0) continue;
      const geo = new THREE.BoxGeometry(0.95, 0.95, 0.95);
      const mats = Array.from({ length: 6 }, () => blackMat.clone());
      const mesh = new THREE.Mesh(geo, mats);
      mesh.position.set(cx * GAP, cy * GAP, cz * GAP);
      mesh.userData = { cx, cy, cz };
      cubieGroup.add(mesh);
      cubies.push({ mesh, cx, cy, cz });
    }
  }
}

// ─── 유틸 ──────────────────────────────────────────────────────────────────
function findCubie(cx, cy, cz) {
  return cubies.find(c => c.cx === cx && c.cy === cy && c.cz === cz);
}

// ─── facelets → cubie 색상 적용 ────────────────────────────────────────────
function applyFacelets() {
  cubies.forEach(({ mesh }) => {
    for (let i = 0; i < 6; i++) mesh.material[i].color.set(0x111111);
  });

  FACE_DEFS.forEach((faceDef, faceIdx) => {
    faceDef.slots.forEach((slot, pos) => {
      const colorIdx = facelets[faceIdx * 9 + pos];
      let cx, cy, cz;
      if (faceDef.fixedAxis === 'y') {
        cy = faceDef.fixedVal; cx = slot[0]; cz = slot[1];
      } else if (faceDef.fixedAxis === 'x') {
        cx = faceDef.fixedVal; cz = slot[0]; cy = slot[1];
      } else {
        cz = faceDef.fixedVal; cx = slot[0]; cy = slot[1];
      }
      const cubie = findCubie(cx, cy, cz);
      if (cubie) cubie.mesh.material[faceDef.matIdx].color.set(FACE_COLORS[colorIdx]);
    });
  });
}
