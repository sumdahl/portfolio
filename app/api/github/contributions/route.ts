import { NextResponse } from 'next/server';
import { getContributionCalendar } from '@/lib/github';

export async function GET() {
  try {
    const calendar = await getContributionCalendar();
    
    if (!calendar) {
      return NextResponse.json(
        { error: 'Failed to fetch GitHub contributions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
