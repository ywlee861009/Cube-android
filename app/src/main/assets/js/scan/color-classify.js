const CLASSIFY_CENTER_INDICES = [4, 13, 22, 31, 40, 49];
const CLASSIFY_COLORS = 6;
const CLASSIFY_PER_COLOR = 9;

function classifyFacelets(samples) {
  validateSamples(samples);
  const labSamples = samples.map(rgbToLab);
  let centers = CLASSIFY_CENTER_INDICES.map(index => labSamples[index].slice());
  let facelets = [];

  // Deterministic anchored refinement. The center stickers remain fixed to the
  // scanned U/R/F/D/L/B face labels while every label keeps exactly 9 slots.
  for (let iteration = 0; iteration < 3; iteration++) {
    const cost = expandedCostMatrix(labSamples, centers);
    const slots = hungarian(cost);
    facelets = slots.map(slot => Math.floor(slot / CLASSIFY_PER_COLOR));
    centers = centers.map((anchor, color) => {
      const members = labSamples.filter((_, index) => facelets[index] === color);
      return members.reduce(
        (sum, value) => sum.map((component, i) => component + value[i]),
        [0, 0, 0]
      ).map(component => component / members.length);
    });
  }

  const confidence = labSamples.map((sample, index) => {
    const distances = centers.map(center => labDistance(sample, center));
    const assigned = distances[facelets[index]];
    const next = Math.min(...distances.filter((_, color) => color !== facelets[index]));
    if (next <= 1e-9) return assigned <= 1e-9 ? 1 : 0;
    return clamp01(1 - assigned / next);
  });

  return {
    facelets,
    confidence,
    centerMap: CLASSIFY_CENTER_INDICES.map((_, face) => face)
  };
}

function validateSamples(samples) {
  if (!Array.isArray(samples) || samples.length !== 54) {
    throw new TypeError('samples must contain 54 RGB values');
  }
  samples.forEach((rgb, index) => {
    if (!Array.isArray(rgb) || rgb.length !== 3 ||
        rgb.some(value => !Number.isFinite(value) || value < 0 || value > 255)) {
      throw new TypeError(`invalid RGB sample at index ${index}`);
    }
  });
}

function expandedCostMatrix(samples, centers) {
  return samples.map((sample, sampleIndex) => {
    const centerFace = CLASSIFY_CENTER_INDICES.indexOf(sampleIndex);
    return Array.from({ length: 54 }, (_, slot) => {
      const color = Math.floor(slot / CLASSIFY_PER_COLOR);
      if (centerFace >= 0 && color !== centerFace) return 1e9;
      return labDistanceSquared(sample, centers[color]);
    });
  });
}

// Minimum-cost assignment for a square matrix (Hungarian algorithm).
function hungarian(cost) {
  const size = cost.length;
  const u = Array(size + 1).fill(0);
  const v = Array(size + 1).fill(0);
  const p = Array(size + 1).fill(0);
  const way = Array(size + 1).fill(0);
  for (let row = 1; row <= size; row++) {
    p[0] = row;
    let column0 = 0;
    const minValue = Array(size + 1).fill(Infinity);
    const used = Array(size + 1).fill(false);
    do {
      used[column0] = true;
      const row0 = p[column0];
      let delta = Infinity;
      let column1 = 0;
      for (let column = 1; column <= size; column++) {
        if (used[column]) continue;
        const current = cost[row0 - 1][column - 1] - u[row0] - v[column];
        if (current < minValue[column]) {
          minValue[column] = current;
          way[column] = column0;
        }
        if (minValue[column] < delta) {
          delta = minValue[column];
          column1 = column;
        }
      }
      for (let column = 0; column <= size; column++) {
        if (used[column]) {
          u[p[column]] += delta;
          v[column] -= delta;
        } else {
          minValue[column] -= delta;
        }
      }
      column0 = column1;
    } while (p[column0] !== 0);
    do {
      const column1 = way[column0];
      p[column0] = p[column1];
      column0 = column1;
    } while (column0 !== 0);
  }
  const assignment = Array(size).fill(-1);
  for (let column = 1; column <= size; column++) {
    assignment[p[column] - 1] = column - 1;
  }
  return assignment;
}

function rgbToLab(rgb) {
  const linear = rgb.map(value => {
    const normalized = value / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  const x = (linear[0] * 0.4124564 + linear[1] * 0.3575761 + linear[2] * 0.1804375) / 0.95047;
  const y = linear[0] * 0.2126729 + linear[1] * 0.7151522 + linear[2] * 0.0721750;
  const z = (linear[0] * 0.0193339 + linear[1] * 0.1191920 + linear[2] * 0.9503041) / 1.08883;
  const transform = value => value > 0.008856
    ? Math.cbrt(value)
    : 7.787 * value + 16 / 116;
  const fx = transform(x);
  const fy = transform(y);
  const fz = transform(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function labDistanceSquared(first, second) {
  return first.reduce((sum, value, index) => {
    const delta = value - second[index];
    return sum + delta * delta;
  }, 0);
}

function labDistance(first, second) {
  return Math.sqrt(labDistanceSquared(first, second));
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

if (typeof module !== 'undefined') {
  module.exports = { classifyFacelets, rgbToLab, hungarian };
}
