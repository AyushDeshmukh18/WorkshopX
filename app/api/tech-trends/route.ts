import { NextResponse } from 'next/server';
import { fetchTechTrends } from '@/lib/trends/trends-aggregator';

export async function GET() {
  try {
    const data = await fetchTechTrends();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      },
    });
  } catch (err) {
    console.error('[API /api/tech-trends] Error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve tech trends data.' },
      { status: 500 }
    );
  }
}
