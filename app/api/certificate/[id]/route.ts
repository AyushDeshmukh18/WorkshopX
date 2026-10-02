import { NextRequest, NextResponse } from 'next/server';
import { generateCertificatePdf } from '@/lib/certificate/pdf-generator';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id.length < 6) {
    return NextResponse.json({ error: 'Invalid certificate ID.' }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;

  try {
    const pdfBytes = await generateCertificatePdf({
      id,
      fullName: 'Arjun Sharma',
      projectName: 'Campus Placement Resume Screener AI',
      score: 88,
      issueDate: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      appUrl,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="FirstBuild-Certificate-${id}.pdf"`,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (err: unknown) {
    console.error('[API /api/certificate] PDF generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate certificate PDF.' },
      { status: 500 }
    );
  }
}
