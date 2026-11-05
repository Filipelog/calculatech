/**
 * Matemática da caixa sem tampa.
 * Folha C x W, cortes quadrados de lado x nos cantos.
 * V(x) = x(C - 2x)(W - 2x), domínio 0 < x < min(C, W)/2
 * V'(x) = 12x² - 4(C + W)x + CW
 * Para folha quadrada (C = W = L): V'(x) = (L - 2x)(L - 6x), x* = L/6, Vmáx = 2L³/27
 */

export const volume = (x: number, c: number, w: number) => x * (c - 2 * x) * (w - 2 * x);

export const derivative = (x: number, c: number, w: number) =>
  12 * x * x - 4 * (c + w) * x + c * w;

export const secondDerivative = (x: number, c: number, w: number) => 24 * x - 4 * (c + w);

/** Raízes de V'(x) = 0 (pontos críticos), em ordem crescente. */
export function criticalPoints(c: number, w: number): [number, number] {
  const s = Math.sqrt(c * c - c * w + w * w);
  return [(c + w - s) / 6, (c + w + s) / 6];
}

export type Optimization = {
  x: number;
  height: number;
  baseLength: number;
  baseWidth: number;
  maxVolume: number;
  domainMax: number;
  critical: [number, number];
  secondDeriv: number;
  sheetArea: number;
  usedArea: number;
};

export function validate(c: number, w: number): string | null {
  if (!Number.isFinite(c) || !Number.isFinite(w)) return "Informe valores numéricos.";
  if (c <= 0 || w <= 0) return "As dimensões devem ser maiores que zero.";
  if (c > 10000 || w > 10000) return "Use dimensões de até 10.000 cm.";
  return null;
}

export function optimize(c: number, w: number): Optimization {
  const critical = criticalPoints(c, w);
  const x = critical[0]; // a única raiz dentro do domínio 0 < x < min/2
  const baseLength = c - 2 * x;
  const baseWidth = w - 2 * x;
  return {
    x,
    height: x,
    baseLength,
    baseWidth,
    maxVolume: volume(x, c, w),
    domainMax: Math.min(c, w) / 2,
    critical,
    secondDeriv: secondDerivative(x, c, w),
    sheetArea: c * w,
    usedArea: c * w - 4 * x * x,
  };
}
