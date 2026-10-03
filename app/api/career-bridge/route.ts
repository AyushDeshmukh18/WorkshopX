import { NextResponse } from 'next/server';
import { CareerBridgeRequestSchema } from '@/lib/validation/non-cse-roadmap-schema';
import { generateCareerBridgeRoadmap } from '@/lib/career-bridge/roadmap-generator';

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ error: 'Invalid JSON request payload' }, { status: 400 });
    }

    const parsed = CareerBridgeRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 422 }
      );
    }

    const result = await generateCareerBridgeRoadmap(parsed.data);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
