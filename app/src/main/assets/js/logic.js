// ─── 헬퍼 ──────────────────────────────────────────────────────────────────
function repeat(n, fn) { for (let i = 0; i < n; i++) fn(); }

function rotateFaceCW(f, faceIndex) {
  const o = faceIndex * 9;
  let tmp = f[o];
  f[o]   = f[o+6]; f[o+6] = f[o+8];
  f[o+8] = f[o+2]; f[o+2] = tmp;
  let tmp2 = f[o+1];
  f[o+1] = f[o+3]; f[o+3] = f[o+7];
  f[o+7] = f[o+5]; f[o+5] = tmp2;
}

// a→b→c→d→a 순환 치환
function cycle4(f, a0,a1,a2, b0,b1,b2, c0,c1,c2, d0,d1,d2) {
  const t0=f[a0], t1=f[a1], t2=f[a2];
  f[a0]=f[d0]; f[a1]=f[d1]; f[a2]=f[d2];
  f[d0]=f[c0]; f[d1]=f[c1]; f[d2]=f[c2];
  f[c0]=f[b0]; f[c1]=f[b1]; f[c2]=f[b2];
  f[b0]=t0;    f[b1]=t1;    f[b2]=t2;
}

// ─── 18개 기본 무브 ────────────────────────────────────────────────────────
const MOVES = {
  U: f => { rotateFaceCW(f,0); cycle4(f, 18,19,20, 9,10,11, 45,46,47, 36,37,38); },
  R: f => { rotateFaceCW(f,1); cycle4(f, 2,5,8, 51,48,45, 29,32,35, 20,23,26); },
  F: f => { rotateFaceCW(f,2); cycle4(f, 6,7,8, 9,12,15, 29,28,27, 44,41,38); },
  D: f => { rotateFaceCW(f,3); cycle4(f, 24,25,26, 42,43,44, 51,52,53, 15,16,17); },
  L: f => { rotateFaceCW(f,4); cycle4(f, 0,3,6, 18,21,24, 27,30,33, 53,50,47); },
  B: f => { rotateFaceCW(f,5); cycle4(f, 2,1,0, 36,39,42, 33,34,35, 17,14,11); },
};

const ALL_MOVES = ['U',"U'","U2",'R',"R'","R2",'F',"F'","F2",'D',"D'","D2",'L',"L'","L2",'B',"B'",'B2'];

function applyMoveInPlace(name, f) {
  if (name.endsWith("'")) {
    const base = name[0]; repeat(3, () => MOVES[base](f));
  } else if (name.endsWith('2')) {
    const base = name[0]; repeat(2, () => MOVES[base](f));
  } else {
    MOVES[name](f);
  }
}
