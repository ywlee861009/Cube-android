/**
 * CubingJsSolver — cubing.js 기반 솔버 구현체
 *
 * 번들된 cubing-solver.bundle.js 의 CubingSolver.solveFromFacelets() 를 래핑한다.
 * 번들이 로드되지 않은 상태에서 solve()를 호출하면 에러를 던진다.
 */
class CubingJsSolver extends CubeSolverBase {
  constructor() {
    super();
    this._ready = typeof CubingSolver !== 'undefined';
  }

  isReady() {
    if (!this._ready) {
      this._ready = typeof CubingSolver !== 'undefined';
    }
    return this._ready;
  }

  async solve(facelets) {
    if (!this.isReady()) {
      throw new Error('CubingJsSolver: 번들이 아직 로드되지 않았습니다.');
    }
    return CubingSolver.solveFromFacelets(facelets);
  }
}
