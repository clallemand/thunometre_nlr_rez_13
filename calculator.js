/** Reproduit ROUNDDOWN(..., 0) d'Excel, qui arrondit toujours vers zéro. */
export function roundDown(value) {
  return value < 0 ? Math.ceil(value) : Math.floor(value);
}

export function calculateScore(income, weightedAnswers) {
  const numericIncome = Number(income);
  const answers = weightedAnswers.map(Number);

  if (numericIncome < 0 || !Number.isFinite(numericIncome) || answers.some((answer) => !Number.isFinite(answer))) {
    throw new TypeError("Les réponses doivent être des nombres valides.");
  }

  const weightedTotal = answers.reduce((total, answer) => total + answer, numericIncome);
  return roundDown(weightedTotal / 10);
}
