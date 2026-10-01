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

export type TrendCount = {
  label: string;
  count: number;
};

export type TrendsResponse = {
  totalJobs: number;
  byDay: TrendCount[];
  byCompany: TrendCount[];
  topTerms: TrendCount[];
};
