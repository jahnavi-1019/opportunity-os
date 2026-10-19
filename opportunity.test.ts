import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CandidateProfile, OpportunityListing } from './types.js';
import { ConstraintMatcher } from './constraint-matcher.js';

test('OpportunityOS Matcher: identifies strong match satisfying all hard constraints and skills', () => {
  const candidate: CandidateProfile = {
    id: 'cand-1',
    name: 'Elena Rostova',
    gpa: 3.85,
    graduationYear: 2026,
    citizenship: 'US_CITIZEN',
    skills: ['Python', 'PyTorch', 'Distributed Systems'],
    preferredLocations: ['San Francisco']
  };

  const listing: OpportunityListing = {
    id: 'opp-ai-intern',
    title: 'AI Research Engineering Intern',
    organization: 'DeepTech Labs',
    type: 'INTERNSHIP',
    stipendOrReward: '$10,000 / month',
    hardConstraints: {
      minGpa: 3.5,
      allowedGraduationYears: [2026, 2027],
      eligibleCitizenships: ['US_CITIZEN', 'PERMANENT_RESIDENT']
    },
    preferredSkills: ['Python', 'PyTorch'],
    location: 'San Francisco, CA'
  };

  const res = ConstraintMatcher.evaluateListing(candidate, listing);
  assert.equal(res.status, 'FULLY_ELIGIBLE');
  assert.equal(res.matchScore, 100);
  assert.equal(res.failedConstraints.length, 0);
  assert.ok(res.explanation.includes('Strong match'));
});

test('OpportunityOS Matcher: clearly explains disqualification on hard constraint failure', () => {
  const candidate: CandidateProfile = {
    id: 'cand-2',
    name: 'Marcus Bell',
    gpa: 3.1, // Below 3.5 floor
    graduationYear: 2025, // Not 2026
    citizenship: 'INTERNATIONAL',
    skills: ['Python'],
    preferredLocations: ['Remote']
  };

  const listing: OpportunityListing = {
    id: 'opp-scholarship',
    title: 'Aerospace Engineering Fellowship',
    organization: 'NASA Space Grant',
    type: 'SCHOLARSHIP',
    stipendOrReward: '$25,000 fellowship',
    hardConstraints: {
      minGpa: 3.5,
      allowedGraduationYears: [2026, 2027],
      eligibleCitizenships: ['US_CITIZEN']
    },
    preferredSkills: ['Python'],
    location: 'Remote'
  };

  const res = ConstraintMatcher.evaluateListing(candidate, listing);
  assert.equal(res.status, 'DISQUALIFIED');
  assert.equal(res.matchScore, 0);
  assert.equal(res.failedConstraints.length, 3);
  assert.ok(res.failedConstraints.some(f => f.includes('GPA below requirement')));
  assert.ok(res.failedConstraints.some(f => f.includes('Citizenship requirement')));
});
