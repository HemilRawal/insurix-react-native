// Recommendation Engine — filter and rank insurance plans for a user
export function getRecommendedPlans(userProfile, allPlans) {
  const { age, conditions = [], riskCategory } = userProfile;

  // Filter plans based on eligibility
  const eligible = allPlans.filter(plan => {
    // Age eligibility
    if (age < plan.minAge || age > plan.maxAge) return false;

    // Risk category support
    const supported = plan.riskSupported || [];
    if (supported.length > 0 && !supported.includes(riskCategory)) return false;

    return true;
  });

  // Score each plan for match quality
  const scored = eligible.map(plan => {
    let matchScore = 0;

    // Disease coverage match
    const coveredDiseases = plan.coveredDiseases || [];
    const matchedDiseases = conditions.filter(d =>
      coveredDiseases.some(cd => cd.toLowerCase() === d.toLowerCase())
    );
    matchScore += matchedDiseases.length * 20;

    // Risk category alignment bonus
    if (riskCategory === 'High' && plan.riskSupported?.includes('High')) matchScore += 30;
    if (riskCategory === 'Medium' && plan.riskSupported?.includes('Medium')) matchScore += 20;
    if (riskCategory === 'Low' && plan.riskSupported?.includes('Low')) matchScore += 10;

    // Benefit count bonus
    matchScore += (plan.benefits?.length || 0) * 5;

    return { ...plan, matchScore };
  });

  // Sort by match score descending
  scored.sort((a, b) => b.matchScore - a.matchScore);

  // Mark top as Best Match
  if (scored.length > 0) {
    scored[0].isBestMatch = true;
  }

  return scored;
}
