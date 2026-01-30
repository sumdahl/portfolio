export interface GitHubContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubRawContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: string;
}

export interface GitHubContributionWeek {
  contributionDays: GitHubRawContributionDay[];
}

export interface GitHubContributionCalendar {
  totalContributions: number;
  weeks: GitHubContributionWeek[];
}

export interface GitHubRepository {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  languages: {
    edges: Array<{
      node: {
        name: string;
        color: string;
      };
    }>;
  };
  updatedAt: string;
}

export interface GitHubUser {
  login: string;
  name: string;
  bio: string | null;
  avatarUrl: string;
  contributionsCollection: {
    contributionCalendar: GitHubContributionCalendar;
  };
  pinnedItems: {
    nodes: GitHubRepository[];
  };
}

export interface GitHubResponse {
  user: GitHubUser;
}
