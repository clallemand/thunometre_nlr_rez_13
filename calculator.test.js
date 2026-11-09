import test from "node:test";
import assert from "node:assert/strict";

import { calculateScore, roundDown } from "./calculator.js";

test("roundDown reproduit l'arrondi vers zéro d'Excel", () => {
  assert.equal(roundDown(12.9), 12);
  assert.equal(roundDown(-12.9), -12);
});

test("calcule le revenu et les réponses pondérées", () => {
  assert.equal(calculateScore(2_000, [100, 50, -100]), 105);
});

test("calcule correctement un résultat négatif", () => {
  assert.equal(calculateScore(0, [-100, -25]), -12);
});

test("refuse les valeurs invalides", () => {
  assert.throws(() => calculateScore(-1, []), TypeError);
  assert.throws(() => calculateScore(1_000, [Number.NaN]), TypeError);
});
