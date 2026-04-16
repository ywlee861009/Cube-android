/**
 * SolverFactory — 솔버 구현체 생성 창구
 *
 * 나중에 다른 솔버로 교체할 때 이 파일만 수정하면 된다.
 */
class SolverFactory {
  static create() {
    return new CubingJsSolver();
  }
}
