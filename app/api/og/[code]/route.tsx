import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const { searchParams } = new URL(req.url);
  const isVertical = searchParams.get('format') === 'vertical';

  const width = isVertical ? 1080 : 1200;
  const height = isVertical ? 1920 : 630;

  const referralCode = (code || 'FIRSTBUILD').toUpperCase();
  const seatNumber = searchParams.get('seat') || '42';
  const projectName = searchParams.get('project') || 'Campus Placement Resume Screener AI';
  const collegeName = searchParams.get('college') || 'Engineering College Cohort';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#09090b',
          color: '#fafafa',
          padding: isVertical ? '120px 80px' : '64px 72px',
          fontFamily: 'sans-serif',
          border: '12px solid #18181b',
        }}
      >
        {/* Header Tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#22c55e',
                borderRadius: '4px',
              }}
            />
            <span
              style={{
                fontSize: isVertical ? 32 : 24,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '2px',
                color: '#fafafa',
              }}
            >
              FIRSTBUILD ENGINE
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#14532d',
              border: '2px solid #22c55e',
              padding: isVertical ? '14px 28px' : '8px 20px',
              borderRadius: '6px',
            }}
          >
            <span
              style={{
                fontSize: isVertical ? 28 : 18,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#dcfce7',
              }}
            >
              SEAT #{seatNumber} VERIFIED
            </span>
          </div>
        </div>

        {/* Main Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <span
            style={{
              fontSize: isVertical ? 30 : 20,
              fontFamily: 'monospace',
              color: '#a1a1aa',
              textTransform: 'uppercase',
            }}
          >
            {collegeName}
          </span>

          <h1
            style={{
              fontSize: isVertical ? 72 : 46,
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#ffffff',
              margin: 0,
            }}
          >
            {projectName}
          </h1>

          <p
            style={{
              fontSize: isVertical ? 34 : 22,
              color: '#d4d4d8',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Building and deploying live in &ldquo;Build Your First AI Project in 60 Minutes&rdquo;
          </p>
        </div>

        {/* Footer / Call To Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #27272a',
            paddingTop: isVertical ? '48px' : '28px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: isVertical ? 24 : 15, color: '#71717a', fontFamily: 'monospace' }}>
              RESERVE YOUR FREE SEAT
            </span>
            <span
              style={{
                fontSize: isVertical ? 36 : 24,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#22c55e',
              }}
            >
              firstbuild.dev/r/{referralCode}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              backgroundColor: '#fafafa',
              color: '#09090b',
              padding: isVertical ? '18px 36px' : '10px 24px',
              borderRadius: '6px',
              fontSize: isVertical ? 28 : 18,
              fontWeight: 700,
            }}
          >
            Verified Workshop Pass
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
    }
  );
}
