/**
 * CubeSolverBase — 솔버 추상 클래스
 *
 * 새로운 솔버 구현 시 이 클래스를 상속하여 solve()와 isReady()를 구현한다.
 */
class CubeSolverBase {
  /**
   * facelets 배열을 받아 솔브 이동 시퀀스 문자열을 반환한다.
   * @param {number[]} facelets - 54개 원소 (face*9+slot, U=0,R=1,F=2,D=3,L=4,B=5)
   * @returns {Promise<string>} - 예: "R U R' U'"
   */
  async solve(facelets) {
    throw new Error(`${this.constructor.name}.solve() is not implemented`);
  }

  /**
   * 솔버가 사용 준비 완료 상태인지 반환한다.
   * @returns {boolean}
   */
  isReady() {
    throw new Error(`${this.constructor.name}.isReady() is not implemented`);
  }
}
