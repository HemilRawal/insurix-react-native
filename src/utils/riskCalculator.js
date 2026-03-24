// Risk Calculator — weighted scoring system (0-100)
export function calculateRisk(profile) {
  let score = 0;

  // BMI calculation
  const heightM = (profile.height || 170) / 100;
  const bmi = (profile.weight || 70) / (heightM * heightM);

  if (bmi > 30) score += 20;
  else if (bmi >= 25) score += 10;

  // Pre-existing conditions (+10 each)
  const conditions = profile.conditions || [];
  score += conditions.length * 10;

  // Smoking
  if (profile.smoking) score += 15;

  // Alcohol
  if (profile.alcohol) score += 5;

  // Exercise frequency
  const exercise = profile.exerciseFreq || 'occasional';
  if (exercise === 'never') score += 10;
  else if (exercise === 'occasional') score += 5;

  // Diet quality (1-10, low diet = higher risk)
  const diet = profile.dietQuality || 5;
  if (diet <= 3) score += 10;
  else if (diet <= 5) score += 5;

  // Cap at 100
  score = Math.min(score, 100);

  // Determine category
  let riskCategory = 'Low';
  if (score >= 60) riskCategory = 'High';
  else if (score >= 30) riskCategory = 'Medium';

  return {
    riskScore: score,
    riskCategory,
    bmi: parseFloat(bmi.toFixed(1)),
  };
}
