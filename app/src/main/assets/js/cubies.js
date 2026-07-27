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
      if (cubie) cubie.mesh.material[faceDef.matIdx].color.set(activeFaceColors[colorIdx]);
    });
  });
  markDirty();
}

// Raycast로 직접 누른 스티커 한 칸만 대비색 50% 혼합으로 표시한다.
// 흰색으로만 섞으면 스캔한 파스텔·밝은 팔레트에서 피드백이 보이지 않으므로
// 스티커가 밝으면 어둡게, 어두우면 밝게 섞는다.
function highlightTouchedSticker(mesh, materialIndex) {
  if (!mesh || materialIndex === undefined || !mesh.material[materialIndex]) return;
  const color = mesh.material[materialIndex].color;
  // sRGB 상대 휘도 근사. 정확도보다 밝고/어두움 판정만 필요하다.
  const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
  color.lerp(new THREE.Color(luminance > 0.55 ? 0x000000 : 0xffffff), 0.5);
  markDirty();
}

function clearTouchedStickerHighlight() {
  applyFacelets();
}
