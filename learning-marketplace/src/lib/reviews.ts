export interface RawReview {
  id: string;
  studentName: string;
  rating: number; // 1-5
  completionRatio: number; // 0.0 - 1.0 (How much of the session was completed)
  interactionScore: number; // 0.0 - 1.0 (Based on questions asked, video on/off)
  sessionDuration: number; // in minutes
  text: string;
}

/**
 * Calculates the credibility score of a single review.
 * Formula: credibility_score = (0.4 * completion) + (0.3 * interaction) + (0.3 * min(session_duration / 60, 1.0))
 * Note: session_duration is normalized to a maximum of 60 minutes for scoring purposes.
 */
export function calculateCredibilityScore(review: RawReview): number {
  const durationNormalized = Math.min(review.sessionDuration / 60, 1.0);
  
  const score = 
    (0.4 * review.completionRatio) + 
    (0.3 * review.interactionScore) + 
    (0.3 * durationNormalized);

  return Math.max(0, Math.min(score, 1.0)); // Clamp between 0 and 1
}

/**
 * Computes the weighted average rating across all reviews based on their credibility scores.
 * Formula: weighted_rating = sum(rating * credibility_score) / sum(credibility_score)
 */
export function computeWeightedRating(reviews: RawReview[]): number {
  if (!reviews || reviews.length === 0) return 0;

  let totalWeightedRating = 0;
  let totalCredibilityScore = 0;

  for (const review of reviews) {
    const credibility = calculateCredibilityScore(review);
    totalWeightedRating += (review.rating * credibility);
    totalCredibilityScore += credibility;
  }

  if (totalCredibilityScore === 0) return 0;

  return totalWeightedRating / totalCredibilityScore;
}
