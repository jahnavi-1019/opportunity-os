import {
  CandidateProfile,
  OpportunityListing,
  MatchExplanation,
  EligibilityStatus
} from './types.js';

export class ConstraintMatcher {
  /**
   * Matches a candidate profile against an opportunity listing with transparent explanations.
   */
  public static evaluateListing(
    candidate: CandidateProfile,
    listing: OpportunityListing
  ): MatchExplanation {
    const failedConstraints: string[] = [];
    const hc = listing.hardConstraints;

    // 1. Check GPA Hard Constraint
    if (hc.minGpa !== undefined && candidate.gpa < hc.minGpa) {
      failedConstraints.push(`GPA below requirement (Requires >= ${hc.minGpa.toFixed(1)}, current: ${candidate.gpa.toFixed(1)})`);
    }

    // 2. Check Graduation Year
    if (hc.allowedGraduationYears && !hc.allowedGraduationYears.includes(candidate.graduationYear)) {
      failedConstraints.push(`Graduation year mismatch (Eligible: [${hc.allowedGraduationYears.join(', ')}], current: ${candidate.graduationYear})`);
    }

    // 3. Check Citizenship / Work Authorization
    if (hc.eligibleCitizenships && !hc.eligibleCitizenships.includes(candidate.citizenship)) {
      failedConstraints.push(`Citizenship requirement not met (Eligible: [${hc.eligibleCitizenships.join(', ')}], candidate: ${candidate.citizenship})`);
    }

    // Soft skill matching
    const matchedSkills = listing.preferredSkills.filter(s =>
      candidate.skills.map(k => k.toLowerCase()).includes(s.toLowerCase())
    );

    const skillScore = listing.preferredSkills.length > 0
      ? (matchedSkills.length / listing.preferredSkills.length) * 100
      : 100;

    let status: EligibilityStatus = 'FULLY_ELIGIBLE';
    let matchScore = Math.round(skillScore);
    let explanation = '';

    if (failedConstraints.length > 0) {
      status = 'DISQUALIFIED';
      matchScore = 0;
      explanation = `Disqualified due to ${failedConstraints.length} hard constraint failure(s): ${failedConstraints.join('; ')}.`;
    } else if (skillScore < 50) {
      status = 'BORDERLINE';
      explanation = `Eligible on all legal & academic constraints, but matches only ${matchedSkills.length}/${listing.preferredSkills.length} preferred skills.`;
    } else {
      status = 'FULLY_ELIGIBLE';
      explanation = `Strong match: Meets all hard constraints and satisfies ${matchedSkills.length}/${listing.preferredSkills.length} preferred skill competencies.`;
    }

    return {
      opportunityId: listing.id,
      title: listing.title,
      organization: listing.organization,
      status,
      matchScore,
      failedConstraints,
      matchedSkills,
      explanation
    };
  }

  /**
   * Evaluates all listings and ranks by eligibility status and match score.
   */
  public static rankOpportunities(
    candidate: CandidateProfile,
    listings: OpportunityListing[]
  ): MatchExplanation[] {
    const results = listings.map(l => this.evaluateListing(candidate, l));

    // Sort: FULLY_ELIGIBLE first, then BORDERLINE, then DISQUALIFIED
    const priority = { FULLY_ELIGIBLE: 3, BORDERLINE: 2, DISQUALIFIED: 1 };

    results.sort((a, b) => {
      if (priority[b.status] !== priority[a.status]) {
        return priority[b.status] - priority[a.status];
      }
      return b.matchScore - a.matchScore;
    });

    return results;
  }
}
