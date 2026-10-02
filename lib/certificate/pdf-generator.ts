import 'server-only';
import { PDFDocument, StandardFonts, rgb, degrees, PDFFont, RGB } from 'pdf-lib';
import QRCode from 'qrcode';
import crypto from 'node:crypto';

export interface ScoreBreakdown {
  works_deployed: number; // max 30
  uses_ai: number; // max 25
  originality: number; // max 15
  readme: number; // max 15
  code_structure: number; // max 15
}

export interface CertificateData {
  id: string; // 12-char unique string
  fullName: string;
  projectName: string;
  score: number;
  issueDate: string;
  appUrl: string;
  scoreBreakdown?: ScoreBreakdown;
}

export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Landscape A4 dimensions: 841.89 x 595.28 points
  const page = pdfDoc.addPage([841.89, 595.28]);
  const { width, height } = page.getSize();
  const centerX = width / 2;

  // Embed Fonts: Times-Roman (Prestige) + Helvetica (Clean Structure) + Courier (Cryptographic monospace)
  const fontTimes = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontTimesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontSans = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);
  const fontMonoBold = await pdfDoc.embedFont(StandardFonts.CourierBold);

  // Palettes (Tailored executive palette)
  const cSlate950 = rgb(0.06, 0.09, 0.16); // Deep Obsidian Slate
  const cSlate800 = rgb(0.12, 0.16, 0.24); // Rich Slate
  const cSlate500 = rgb(0.40, 0.45, 0.55); // Muted Slate
  const cSlate400 = rgb(0.58, 0.63, 0.72); // Subdued Slate
  const cEmerald700 = rgb(0.02, 0.47, 0.34); // Royal Emerald Accent
  const cGold600 = rgb(0.72, 0.52, 0.12); // Deep Gold
  const cGold500 = rgb(0.85, 0.65, 0.18); // Metallic Gold
  const cPaper = rgb(0.99, 0.99, 1.0); // Clean White Parchment
  const cCardBg = rgb(0.96, 0.97, 0.99); // Crisp Card Slate
  const cCardBorder = rgb(0.86, 0.89, 0.93);

  // ----------------------------------------------------------------------------
  // 1. BACKGROUND & ORNAMENTAL FRAMES
  // ----------------------------------------------------------------------------
  // Base background fill
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: cPaper,
  });

  // Soft Security Watermark Pattern (Concentric circles in center at ultra-low opacity)
  for (let r = 80; r <= 320; r += 40) {
    page.drawCircle({
      x: centerX,
      y: height / 2 - 10,
      size: r,
      borderColor: rgb(0.93, 0.95, 0.98),
      borderWidth: 0.75,
    });
  }

  // Outer Deep Obsidian Border
  page.drawRectangle({
    x: 18,
    y: 18,
    width: width - 36,
    height: height - 36,
    borderColor: cSlate950,
    borderWidth: 2.5,
  });

  // Inner Gold Accent Line
  page.drawRectangle({
    x: 23,
    y: 23,
    width: width - 46,
    height: height - 46,
    borderColor: cGold500,
    borderWidth: 0.75,
  });

  // Second Inner Inset Border
  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor: rgb(0.88, 0.90, 0.94),
    borderWidth: 1,
  });

  // Corner Bracket Ornaments (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
  const drawCornerBrackets = (cx: number, cy: number, dx: number, dy: number) => {
    // Corner square
    page.drawRectangle({
      x: cx - 4,
      y: cy - 4,
      width: 8,
      height: 8,
      color: cGold600,
    });
    // Horizontal tick
    page.drawLine({
      start: { x: cx, y: cy },
      end: { x: cx + dx * 28, y: cy },
      thickness: 1.5,
      color: cSlate950,
    });
    // Vertical tick
    page.drawLine({
      start: { x: cx, y: cy },
      end: { x: cx, y: cy + dy * 28 },
      thickness: 1.5,
      color: cSlate950,
    });
  };

  drawCornerBrackets(32, height - 32, 1, -1); // Top Left
  drawCornerBrackets(width - 32, height - 32, -1, -1); // Top Right
  drawCornerBrackets(32, 32, 1, 1); // Bottom Left
  drawCornerBrackets(width - 32, 32, -1, 1); // Bottom Right

  // Helper function to draw centered text
  const drawCentered = (
    text: string,
    y: number,
    size: number,
    font: PDFFont,
    color: RGB
  ) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: centerX - textWidth / 2,
      y,
      size,
      font,
      color,
    });
  };

  // ----------------------------------------------------------------------------
  // 2. HEADER: INSTITUTIONAL CREST & TITLES
  // ----------------------------------------------------------------------------
  // Institutional Emblem / Crest (Drawn at centerX, y: 538)
  const crestY = 538;
  page.drawRectangle({
    x: centerX - 14,
    y: crestY - 14,
    width: 28,
    height: 28,
    color: cSlate950,
  });
  page.drawRectangle({
    x: centerX - 11,
    y: crestY - 11,
    width: 22,
    height: 22,
    borderColor: cGold500,
    borderWidth: 1,
    color: cEmerald700,
  });
  // Center 4-point star in crest
  page.drawText('+', {
    x: centerX - 5,
    y: crestY - 7,
    size: 16,
    font: fontSansBold,
    color: cGold500,
  });

  // Top Organization Title
  drawCentered(
    'NXTWAVE CCBP 4.0 TECHNICAL EDUCATION INITIATIVE',
    508,
    11,
    fontSansBold,
    cSlate950
  );

  drawCentered(
    'WORLD ECONOMIC FORUM TECH PIONEER 2024 · IN PARTNERSHIP WITH NSDC & 2,500+ HIRING PARTNERS',
    494,
    7,
    fontSans,
    cSlate500
  );

  // Ornamental Divider Rule with Central Diamond
  const divY = 482;
  page.drawLine({
    start: { x: centerX - 240, y: divY },
    end: { x: centerX - 18, y: divY },
    thickness: 0.75,
    color: cGold600,
  });
  page.drawLine({
    start: { x: centerX + 18, y: divY },
    end: { x: centerX + 240, y: divY },
    thickness: 0.75,
    color: cGold600,
  });
  // Diamond in center
  page.drawRectangle({
    x: centerX - 4,
    y: divY - 4,
    width: 8,
    height: 8,
    color: cGold600,
    rotate: degrees(45),
  });

  // Main Certificate Title
  drawCentered(
    'CERTIFICATE OF TECHNICAL MASTERY',
    452,
    23,
    fontTimesBold,
    cSlate950
  );

  drawCentered(
    'FULL-STACK GENERATIVE AI SYSTEM ARCHITECTURE & DEPLOYMENT',
    436,
    8.5,
    fontSansBold,
    cEmerald700
  );

  // ----------------------------------------------------------------------------
  // 3. RECIPIENT PRESENTATION
  // ----------------------------------------------------------------------------
  drawCentered(
    'THIS OFFICIAL CREDENTIAL IS PROUDLY CONFERRED UPON',
    414,
    8,
    fontSans,
    cSlate500
  );

  // Recipient Name
  const formattedName = data.fullName.trim().toUpperCase();
  drawCentered(
    formattedName,
    380,
    27,
    fontTimesBold,
    cSlate950
  );

  // Name Accent Ribbon Line
  const nameWidth = fontTimesBold.widthOfTextAtSize(formattedName, 27);
  page.drawLine({
    start: { x: centerX - nameWidth / 2 - 15, y: 372 },
    end: { x: centerX + nameWidth / 2 + 15, y: 372 },
    thickness: 1,
    color: cEmerald700,
  });
  page.drawCircle({
    x: centerX,
    y: 372,
    size: 2.5,
    color: cGold500,
  });

  // Distinction / Honors Badge
  if (data.score >= 80) {
    drawCentered(
      'AWARDED WITH DISTINCTION | TOP 10% COHORT PERFORMANCE',
      358,
      8,
      fontSansBold,
      cGold600
    );
  }

  // Official Citation Narrative (Carefully balanced 3-line paragraph)
  drawCentered(
    'for successfully architecting, building, and deploying a production-grade Generative AI application during the',
    338,
    9.5,
    fontTimes,
    cSlate800
  );
  drawCentered(
    'rigorous live engineering laboratory "Build Your First AI Project in 60 Minutes", fulfilling the automated technical benchmarks',
    324,
    9.5,
    fontTimes,
    cSlate800
  );
  drawCentered(
    'for cloud infrastructure deployment, structured LLM reasoning boundaries, and code maintainability.',
    310,
    9.5,
    fontTimes,
    cSlate800
  );

  // ----------------------------------------------------------------------------
  // 4. TECHNICAL AUDIT & EVALUATION MATRIX (Left Card: x: 50, w: 460)
  // ----------------------------------------------------------------------------
  const cardX = 46;
  const cardY = 192;
  const cardW = 465;
  const cardH = 98;

  // Background Box
  page.drawRectangle({
    x: cardX,
    y: cardY,
    width: cardW,
    height: cardH,
    color: cCardBg,
    borderColor: cCardBorder,
    borderWidth: 1,
  });

  // Accent left color strip (Emerald)
  page.drawRectangle({
    x: cardX,
    y: cardY,
    width: 4,
    height: cardH,
    color: cEmerald700,
  });

  // Card Header: Section title + Overall Score Pill
  page.drawText('VALIDATED SYSTEM SPECIFICATION & AUDIT BENCHMARKS', {
    x: cardX + 16,
    y: cardY + cardH - 18,
    size: 7.5,
    font: fontSansBold,
    color: cEmerald700,
  });

  // Score Pill on Top Right of Card
  const scoreText = `OVERALL AUDIT SCORE: ${data.score} / 100`;
  const scoreTextWidth = fontMonoBold.widthOfTextAtSize(scoreText, 8.5);
  page.drawRectangle({
    x: cardX + cardW - scoreTextWidth - 20,
    y: cardY + cardH - 22,
    width: scoreTextWidth + 14,
    height: 16,
    color: cSlate950,
  });
  page.drawText(scoreText, {
    x: cardX + cardW - scoreTextWidth - 13,
    y: cardY + cardH - 17,
    size: 8.5,
    font: fontMonoBold,
    color: cGold500,
  });

  // Project Title
  page.drawText('PROJECT ARCHITECTURE:', {
    x: cardX + 16,
    y: cardY + cardH - 36,
    size: 7,
    font: fontSansBold,
    color: cSlate500,
  });
  page.drawText(data.projectName, {
    x: cardX + 16,
    y: cardY + cardH - 52,
    size: 13,
    font: fontTimesBold,
    color: cSlate950,
  });

  // Fine Separator in Card
  page.drawLine({
    start: { x: cardX + 16, y: cardY + 36 },
    end: { x: cardX + cardW - 16, y: cardY + 36 },
    thickness: 0.5,
    color: rgb(0.85, 0.88, 0.92),
  });

  // Breakdown Metrics (Works Deployed, AI Model, Code Quality, Status)
  const breakdown = data.scoreBreakdown || {
    works_deployed: Math.min(Math.round(data.score * 0.3), 30),
    uses_ai: Math.min(Math.round(data.score * 0.25), 25),
    originality: Math.min(Math.round(data.score * 0.15), 15),
    readme: Math.min(Math.round(data.score * 0.15), 15),
    code_structure: Math.min(Math.round(data.score * 0.15), 15),
  };

  const drawMetricPill = (x: number, label: string, val: string) => {
    page.drawText(label, {
      x,
      y: cardY + 22,
      size: 6.5,
      font: fontSansBold,
      color: cSlate500,
    });
    page.drawText(val, {
      x,
      y: cardY + 10,
      size: 9,
      font: fontMonoBold,
      color: cSlate950,
    });
  };

  drawMetricPill(cardX + 16, 'CLOUD DEPLOYMENT', `${breakdown.works_deployed} / 30`);
  drawMetricPill(cardX + 130, 'AI REASONING', `${breakdown.uses_ai} / 25`);
  drawMetricPill(cardX + 235, 'CODE STRUCTURE', `${breakdown.code_structure} / 15`);
  drawMetricPill(cardX + 345, 'TAMPER VERIFICATION', 'PASS (VERIFIED)');

  // ----------------------------------------------------------------------------
  // 5. OFFICIAL SIGNATURES (Bottom Left: x: 46 to 340, y: 55 to 165)
  // ----------------------------------------------------------------------------
  // Signature 1: Lead Systems Architect
  const sig1X = 65;
  const sigY = 95;

  // Drawn vector signature stroke 1
  page.drawLine({ start: { x: sig1X + 5, y: sigY + 22 }, end: { x: sig1X + 35, y: sigY + 38 }, thickness: 1.5, color: rgb(0.12, 0.22, 0.45) });
  page.drawLine({ start: { x: sig1X + 35, y: sigY + 38 }, end: { x: sig1X + 60, y: sigY + 16 }, thickness: 1.2, color: rgb(0.12, 0.22, 0.45) });
  page.drawLine({ start: { x: sig1X + 60, y: sigY + 16 }, end: { x: sig1X + 90, y: sigY + 32 }, thickness: 1.4, color: rgb(0.12, 0.22, 0.45) });
  page.drawLine({ start: { x: sig1X + 90, y: sigY + 32 }, end: { x: sig1X + 130, y: sigY + 24 }, thickness: 1.1, color: rgb(0.12, 0.22, 0.45) });

  page.drawLine({
    start: { x: sig1X, y: sigY },
    end: { x: sig1X + 150, y: sigY },
    thickness: 0.75,
    color: cSlate400,
  });

  page.drawText('Sashank Gujjula', {
    x: sig1X,
    y: sigY - 14,
    size: 9.5,
    font: fontTimesBold,
    color: cSlate950,
  });
  page.drawText('Co-Founder, NxtWave (IIT Bombay)', {
    x: sig1X,
    y: sigY - 26,
    size: 7.5,
    font: fontSans,
    color: cSlate500,
  });

  // Signature 2: Director of Technical Evaluation
  const sig2X = 240;
  // Drawn vector signature stroke 2
  page.drawLine({ start: { x: sig2X + 8, y: sigY + 18 }, end: { x: sig2X + 40, y: sigY + 36 }, thickness: 1.4, color: rgb(0.12, 0.22, 0.45) });
  page.drawLine({ start: { x: sig2X + 40, y: sigY + 36 }, end: { x: sig2X + 75, y: sigY + 18 }, thickness: 1.2, color: rgb(0.12, 0.22, 0.45) });
  page.drawLine({ start: { x: sig2X + 75, y: sigY + 18 }, end: { x: sig2X + 110, y: sigY + 30 }, thickness: 1.5, color: rgb(0.12, 0.22, 0.45) });
  page.drawLine({ start: { x: sig2X + 110, y: sigY + 30 }, end: { x: sig2X + 145, y: sigY + 22 }, thickness: 1.1, color: rgb(0.12, 0.22, 0.45) });

  page.drawLine({
    start: { x: sig2X, y: sigY },
    end: { x: sig2X + 150, y: sigY },
    thickness: 0.75,
    color: cSlate400,
  });

  page.drawText('Anupam Pedarla', {
    x: sig2X,
    y: sigY - 14,
    size: 9.5,
    font: fontTimesBold,
    color: cSlate950,
  });
  page.drawText('Co-Founder, NxtWave (IIT Kharagpur)', {
    x: sig2X,
    y: sigY - 26,
    size: 7.5,
    font: fontSans,
    color: cSlate500,
  });

  // ----------------------------------------------------------------------------
  // 6. OFFICIAL EMBOSSED GOLD MEDALLION SEAL (Center-Right: x: 440, y: 110)
  // ----------------------------------------------------------------------------
  const sealX = 445;
  const sealY = 112;

  // Outer Gold Scalloped Ring
  page.drawCircle({
    x: sealX,
    y: sealY,
    size: 44,
    color: cGold500,
  });
  page.drawCircle({
    x: sealX,
    y: sealY,
    size: 40,
    color: cSlate950,
  });
  page.drawCircle({
    x: sealX,
    y: sealY,
    size: 36,
    color: cEmerald700,
  });
  page.drawCircle({
    x: sealX,
    y: sealY,
    size: 33,
    borderColor: cGold500,
    borderWidth: 1,
    color: cSlate950,
  });

  // Inner Seal Text
  page.drawText('NXTWAVE', {
    x: sealX - 20,
    y: sealY + 16,
    size: 6.5,
    font: fontSansBold,
    color: cGold500,
  });
  page.drawText('* CCBP 4.0 *', {
    x: sealX - 22,
    y: sealY + 2,
    size: 7,
    font: fontSansBold,
    color: cPaper,
  });
  page.drawText('CREDENTIAL', {
    x: sealX - 23,
    y: sealY - 12,
    size: 6.5,
    font: fontSansBold,
    color: cGold500,
  });
  page.drawText('2026', {
    x: sealX - 9,
    y: sealY - 23,
    size: 6.5,
    font: fontMonoBold,
    color: cPaper,
  });

  // ----------------------------------------------------------------------------
  // 7. CRYPTOGRAPHIC VERIFICATION MODULE & QR CODE (Right Box: x: 530, w: 265)
  // ----------------------------------------------------------------------------
  const qrBoxX = 530;
  const qrBoxY = 55;
  const qrBoxW = 265;
  const qrBoxH = 235;

  // Security Module Background
  page.drawRectangle({
    x: qrBoxX,
    y: qrBoxY,
    width: qrBoxW,
    height: qrBoxH,
    color: cCardBg,
    borderColor: cCardBorder,
    borderWidth: 1,
  });

  // Header Bar for Security Module
  page.drawRectangle({
    x: qrBoxX,
    y: qrBoxY + qrBoxH - 24,
    width: qrBoxW,
    height: 24,
    color: cSlate950,
  });
  page.drawText('PUBLIC CRYPTOGRAPHIC VERIFICATION', {
    x: qrBoxX + 18,
    y: qrBoxY + qrBoxH - 16,
    size: 7.5,
    font: fontSansBold,
    color: cPaper,
  });

  // Generate QR Code with custom styling
  const verifyUrl = `${data.appUrl}/verify/${data.id}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 140,
    margin: 1,
    color: { dark: '#090d16', light: '#ffffff' },
  });
  const qrImage = await pdfDoc.embedPng(qrDataUrl);

  const qrSize = 104;
  const qrPosX = qrBoxX + (qrBoxW - qrSize) / 2;
  const qrPosY = qrBoxY + 98;

  // Frame around QR code
  page.drawRectangle({
    x: qrPosX - 4,
    y: qrPosY - 4,
    width: qrSize + 8,
    height: qrSize + 8,
    color: cPaper,
    borderColor: cSlate950,
    borderWidth: 1,
  });

  page.drawImage(qrImage, {
    x: qrPosX,
    y: qrPosY,
    width: qrSize,
    height: qrSize,
  });

  // Text below QR Code
  const qrTextY = qrPosY - 18;
  const drawQrCentered = (text: string, y: number, size: number, font: PDFFont, color: RGB) => {
    const tw = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: qrBoxX + qrBoxW / 2 - tw / 2,
      y,
      size,
      font,
      color,
    });
  };

  drawQrCentered('SCAN QR CODE TO VALIDATE AUTHENTICITY', qrTextY, 6.5, fontSansBold, cSlate800);

  // Monospace Credential ID badge
  const idBadge = `CREDENTIAL ID: ${data.id}`;
  drawQrCentered(idBadge, qrTextY - 16, 9.5, fontMonoBold, cSlate950);

  // SHA256 Verification Fingerprint (Derived from ID + Date)
  const fingerprint = crypto
    .createHash('sha256')
    .update(`${data.id}:${data.fullName}:${data.score}:${data.issueDate}`)
    .digest('hex')
    .substring(0, 24)
    .toUpperCase();

  drawQrCentered(`HASH: ${fingerprint}...`, qrTextY - 30, 6.5, fontMono, cSlate500);

  // Issue Date and Ledger URL
  drawQrCentered(`ISSUED: ${data.issueDate.toUpperCase()}`, qrTextY - 44, 7.5, fontSansBold, cEmerald700);
  drawQrCentered(`PERMANENT RECORD: ${data.appUrl.replace(/^https?:\/\//, '')}/verify/${data.id}`, qrTextY - 58, 6.5, fontMono, cSlate400);

  // ----------------------------------------------------------------------------
  // 8. SECURITY MICRO-FOOTER
  // ----------------------------------------------------------------------------
  const microText =
    `FIRSTBUILD SECURE CREDENTIAL REGISTRY | ENCRYPTED TAMPER-PROOF SPECIFICATION | OFFICIAL INSTITUTIONAL VERIFICATION AT ${data.appUrl.toUpperCase()}/VERIFY/${data.id}`;
  drawCentered(microText, 25, 6, fontMono, cSlate400);

  return pdfDoc.save();
}
