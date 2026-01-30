import { graphql } from '@octokit/graphql';
import type { GitHubResponse, GitHubContributionCalendar, GitHubRepository } from '@/types/github';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'sumdahl';

if (!GITHUB_TOKEN) {
  console.warn('GITHUB_TOKEN is not set. GitHub features will be limited.');
}

const graphqlWithAuth = GITHUB_TOKEN
  ? graphql.defaults({
      headers: {
        authorization: `token ${GITHUB_TOKEN}`,
      },
    })
  : graphql;

const CONTRIBUTION_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const PINNED_REPOS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            homepageUrl
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
            languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                node {
                  name
                  color
                }
              }
            }
            updatedAt
          }
        }
      }
    }
  }
`;

export async function getContributionCalendar(
  year?: number
): Promise<GitHubContributionCalendar | null> {
  if (!GITHUB_TOKEN) {
    console.warn('Cannot fetch contribution calendar without GITHUB_TOKEN');
    return null;
  }

  try {
    const currentYear = year || new Date().getFullYear();
    const from = new Date(`${currentYear}-01-01T00:00:00Z`).toISOString();
    const to = new Date(`${currentYear}-12-31T23:59:59Z`).toISOString();

    const response = await graphqlWithAuth<GitHubResponse>(CONTRIBUTION_QUERY, {
      username: GITHUB_USERNAME,
      from,
      to,
    });

    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error('Error fetching GitHub contribution calendar:', error);
    return null;
  }
}

export async function getPinnedRepositories(): Promise<GitHubRepository[] | null> {
  if (!GITHUB_TOKEN) {
    console.warn('Cannot fetch pinned repositories without GITHUB_TOKEN');
    return null;
  }

  try {
    const response = await graphqlWithAuth<{
      user: { pinnedItems: { nodes: GitHubRepository[] } };
    }>(PINNED_REPOS_QUERY, {
      username: GITHUB_USERNAME,
    });

    return response.user.pinnedItems.nodes;
  } catch (error) {
    console.error('Error fetching GitHub pinned repositories:', error);
    return null;
  }
}

export async function getGitHubData() {
  const [contributionCalendar, pinnedRepos] = await Promise.all([
    getContributionCalendar(),
    getPinnedRepositories(),
  ]);

  return {
    contributionCalendar,
    pinnedRepos,
  };
}
