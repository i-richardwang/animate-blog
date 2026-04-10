import { type NextRequest, NextResponse } from 'next/server';
import { fetchTokenUsage } from '@/lib/token-usage/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') ?? '30d';

    const validRanges = ['7d', '30d', '90d', 'all'];
    if (!validRanges.includes(range)) {
      return NextResponse.json(
        { error: `Invalid range. Must be one of: ${validRanges.join(', ')}` },
        { status: 400 },
      );
    }

    const data = await fetchTokenUsage(range);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Token usage API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token usage data' },
      { status: 500 },
    );
  }
}
