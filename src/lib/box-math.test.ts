import { describe, it, expect } from "vitest";
import { optimize, derivative, validate } from "./box-math";

describe("box optimization", () => {
  it("square sheet: x = L/6", () => {
    expect(optimize(30, 30).x).toBeCloseTo(5);
  });
  it("square sheet: Vmax = 2L³/27", () => {
    expect(optimize(30, 30).maxVolume).toBeCloseTo((2 * 30 ** 3) / 27);
  });
  it("derivative matches (L-2x)(L-6x)", () => {
    expect(derivative(3, 30, 30)).toBeCloseTo((30 - 6) * (30 - 18));
  });
  it("rejects non-positive dimensions", () => {
    expect(validate(0, 10)).not.toBeNull();
  });
});
