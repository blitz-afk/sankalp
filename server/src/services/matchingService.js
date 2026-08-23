import { matchEntity } from './ai/matching.js';
import { University } from '../models/University.js';
import { Industry } from '../models/Industry.js';

export const findUniversityMatchesForChallenge = async (challenge) => {
  const universities = await University.find({}).limit(20);
  if (!universities.length) return [];

  const matches = await matchEntity('CHALLENGE_UNIVERSITY', challenge, universities);
  return matches;
};

export const findIndustrySponsorsForSolution = async (solution) => {
  const industries = await Industry.find({}).limit(20);
  if (!industries.length) return [];

  const matches = await matchEntity('SOLUTION_INDUSTRY', solution, industries);
  return matches;
};
