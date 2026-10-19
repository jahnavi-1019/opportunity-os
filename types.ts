export type EligibilityStatus = 'FULLY_ELIGIBLE' | 'BORDERLINE' | 'DISQUALIFIED';

export interface CandidateProfile {
  id: string;
  name: string;
  gpa: number; // e.g. 3.7
  graduationYear: number; // e.g. 2026
  citizenship: 'US_CITIZEN' | 'PERMANENT_RESIDENT' | 'INTERNATIONAL';
  skills: string[]; // e.g. ["Python", "Machine Learning", "FastAPI"]
  preferredLocations: string[];
}

export interface HardConstraints {
  minGpa?: number;
  allowedGraduationYears?: number[];
  eligibleCitizenships?: Array<'US_CITIZEN' | 'PERMANENT_RESIDENT' | 'INTERNATIONAL'>;
}

export interface OpportunityListing {
  id: string;
  title: string;
  organization: string;
  type: 'INTERNSHIP' | 'SCHOLARSHIP' | 'RESEARCH_GRANT';
  stipendOrReward: string;
  hardConstraints: HardConstraints;
  preferredSkills: string[];
  location: string;
}

export interface MatchExplanation {
  opportunityId: string;
  title: string;
  organization: string;
  status: EligibilityStatus;
  matchScore: number; // 0 to 100
  failedConstraints: string[];
  matchedSkills: string[];
  explanation: string;
}
