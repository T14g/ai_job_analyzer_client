export type Job = {
  company: string;
  title: string;
  url: string;
};

export type JobsResponse = {
  jobs: Job[];
};

export type EvaluateMatch = Job;

export type EvaluateResponse = {
  area: string;
  matches: EvaluateMatch[];
};

export type TrendArea = {
  name: string;
  volume: string;
  trend: string;
};

export type TrendsAnalysis = {
  sourceFile: string;
  totalJobs: number;
  uniqueTitles: number;
  market: TrendArea[];
  development: TrendArea[];
  warnings: string[];
  model: string;
  inputTokens: number;
  cachedTokens: number;
  outputTokens: number;
  costUsd: number;
};

export type TrendsResponse = {
  analysis: TrendsAnalysis | null;
};
