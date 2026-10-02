import 'server-only';

export interface BaseTemplateProps {
  appUrl: string;
  unsubscribeUrl?: string;
  physicalAddress?: string;
}

const DEFAULT_ADDRESS = 'FirstBuild Technical Education Initiative, Hyderabad, India';

function renderFooter(unsubscribeUrl?: string, physicalAddress?: string): string {
  const address = physicalAddress || DEFAULT_ADDRESS;
  const unsubHtml = unsubscribeUrl
    ? `<p style="margin-top: 12px;"><a href="${unsubscribeUrl}" style="color: #71717a; text-decoration: underline;">Unsubscribe from workshop updates</a></p>`
    : '';

  return `
    <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0 16px 0;" />
    <div style="font-size: 11px; color: #a1a1aa; line-height: 1.5; font-family: monospace;">
      <p style="margin: 0;">${address}</p>
      <p style="margin: 4px 0 0 0;">Zero-cost engineering education initiative. Free participation.</p>
      ${unsubHtml}
    </div>
  `;
}

// 1. OTP Verification Email
export function renderOtpEmail(otp: string, props: BaseTemplateProps) {
  const subject = `Your Verification Code: ${otp}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; color: #18181b;">
      <div style="border: 1px solid #e4e4e7; border-radius: 6px; padding: 24px; background: #ffffff;">
        <p style="font-size: 12px; font-family: monospace; font-weight: bold; color: #16a34a; margin: 0 0 8px 0;">FIRSTBUILD ENGINE</p>
        <h1 style="font-size: 20px; font-weight: bold; margin: 0 0 16px 0; color: #09090b;">Verify Your Workshop Seat</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #3f3f46; margin: 0 0 20px 0;">
          Use the 6-digit code below to confirm your registration for <strong>Build Your First AI Project in 60 Minutes</strong>.
        </p>
        <div style="background: #f4f4f5; border: 1px solid #d4d4d8; border-radius: 4px; padding: 16px; text-align: center; margin: 24px 0;">
          <span style="font-family: monospace; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #09090b;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #71717a; margin: 0;">This code expires in 10 minutes. If you did not request this, you can safely ignore this email.</p>
        ${renderFooter(undefined, props.physicalAddress)}
      </div>
    </div>
  `;
  const text = `FIRSTBUILD WORKSHOP VERIFICATION CODE: ${otp}\n\nUse this code within 10 minutes to verify your seat for 'Build Your First AI Project in 60 Minutes'.\n\n${props.physicalAddress || DEFAULT_ADDRESS}`;
  return { subject, html, text };
}

// 2. Welcome & Seat Confirmation Email
export function renderWelcomeEmail(
  fullName: string,
  seatNumber: number,
  referralCode: string,
  projectName: string,
  props: BaseTemplateProps
) {
  const subject = `Confirmed: Seat #${seatNumber} Reserved for Workshop`;
  const shareUrl = `${props.appUrl}/r/${referralCode}`;
  const dashboardUrl = `${props.appUrl}/dashboard/me`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; color: #18181b;">
      <div style="border: 1px solid #e4e4e7; border-radius: 6px; padding: 24px; background: #ffffff;">
        <span style="font-size: 11px; font-family: monospace; font-weight: bold; background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 2px;">SEAT #${seatNumber} VERIFIED</span>
        <h1 style="font-size: 20px; font-weight: bold; margin: 16px 0 12px 0; color: #09090b;">You Are Confirmed, ${fullName}!</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #3f3f46; margin: 0 0 16px 0;">
          Your seat is officially locked for <strong>Build Your First AI Project in 60 Minutes</strong>.
        </p>
        <div style="border: 1px solid #e4e4e7; border-radius: 4px; padding: 14px; background: #fafafa; margin-bottom: 20px;">
          <p style="font-size: 11px; font-family: monospace; color: #71717a; margin: 0 0 4px 0;">YOUR SELECTED PROJECT BLUEPRINT</p>
          <p style="font-size: 14px; font-weight: bold; color: #09090b; margin: 0;">${projectName}</p>
        </div>
        <p style="font-size: 13px; line-height: 1.5; color: #3f3f46; margin: 0 0 16px 0;">
          Invite batchmates using your personal referral link:
        </p>
        <p style="margin: 0 0 20px 0;">
          <a href="${shareUrl}" style="font-family: monospace; font-size: 13px; color: #16a34a; font-weight: bold; text-decoration: underline;">${shareUrl}</a>
        </p>
        <p style="font-size: 12px; color: #52525b; margin: 0 0 20px 0;">Refer 3 friends to unlock Priority VIP code review during the live room.</p>
        <div>
          <a href="${dashboardUrl}" style="display: inline-block; background: #09090b; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 4px;">View Your Dashboard & Blueprint</a>
        </div>
        ${renderFooter(props.unsubscribeUrl, props.physicalAddress)}
      </div>
    </div>
  `;
  const text = `Confirmed: Seat #${seatNumber} Reserved\n\nHello ${fullName},\nYour seat is locked for 'Build Your First AI Project in 60 Minutes'.\nYour project: ${projectName}\n\nYour referral link: ${shareUrl}\nView dashboard: ${dashboardUrl}\n\n${props.physicalAddress || DEFAULT_ADDRESS}`;
  return { subject, html, text };
}

// 3. T-24h Reminder Email
export function renderReminder24hEmail(
  fullName: string,
  joinToken: string,
  props: BaseTemplateProps
) {
  const subject = 'Tomorrow: 60-Minute Live AI Workshop';
  const commitUrl = `${props.appUrl}/commit?t=${joinToken}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; color: #18181b;">
      <div style="border: 1px solid #e4e4e7; border-radius: 6px; padding: 24px; background: #ffffff;">
        <span style="font-size: 11px; font-family: monospace; font-weight: bold; color: #16a34a;">24 HOURS REMAINING</span>
        <h1 style="font-size: 20px; font-weight: bold; margin: 12px 0 12px 0; color: #09090b;">Workshop Starts Tomorrow</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #3f3f46; margin: 0 0 16px 0;">
          Hi ${fullName}, your live hands-on build session starts in exactly 24 hours.
        </p>
        <div style="background: #fafafa; border: 1px solid #e4e4e7; padding: 14px; border-radius: 4px; margin-bottom: 20px;">
          <p style="font-size: 12px; font-weight: bold; margin: 0 0 6px 0;">Quick 15-second preparation step:</p>
          <p style="font-size: 12px; color: #52525b; margin: 0 0 10px 0;">Review and lock your chosen project blueprint so your development environment is ready.</p>
          <a href="${commitUrl}" style="display: inline-block; background: #16a34a; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 600; padding: 8px 14px; border-radius: 4px;">Confirm Your Project Choice</a>
        </div>
        ${renderFooter(props.unsubscribeUrl, props.physicalAddress)}
      </div>
    </div>
  `;
  const text = `Tomorrow: 60-Minute Live AI Workshop\n\nHi ${fullName},\nYour session starts in 24 hours.\nConfirm your project: ${commitUrl}\n\n${props.physicalAddress || DEFAULT_ADDRESS}`;
  return { subject, html, text };
}

// 4. T-2h Reminder Email
export function renderReminder2hEmail(fullName: string, props: BaseTemplateProps) {
  const subject = '2 Hours to Workshop: Technical Checklist';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; color: #18181b;">
      <div style="border: 1px solid #e4e4e7; border-radius: 6px; padding: 24px; background: #ffffff;">
        <span style="font-size: 11px; font-family: monospace; font-weight: bold; color: #ea580c;">2 HOURS TO LAUNCH</span>
        <h1 style="font-size: 20px; font-weight: bold; margin: 12px 0 12px 0; color: #09090b;">Preparation Checklist</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #3f3f46; margin: 0 0 16px 0;">
          Hi ${fullName}, we go live in 2 hours. Here is what you need ready:
        </p>
        <ul style="font-size: 13px; line-height: 1.8; color: #3f3f46; padding-left: 20px; margin: 0 0 20px 0;">
          <li>A laptop or desktop with Chrome or Firefox</li>
          <li>A free GitHub account to push your project code</li>
          <li>Stable internet connection for the live build stream</li>
        </ul>
        <p style="font-size: 12px; color: #71717a; margin: 0;">We will email your direct join link 15 minutes prior to start.</p>
        ${renderFooter(props.unsubscribeUrl, props.physicalAddress)}
      </div>
    </div>
  `;
  const text = `2 Hours to Workshop: Checklist\n\nHi ${fullName},\nWe start in 2 hours.\nChecklist: Laptop with browser, GitHub account, stable connection.\nJoin link arrives 15m before start.\n\n${props.physicalAddress || DEFAULT_ADDRESS}`;
  return { subject, html, text };
}

// 5. T-15m Reminder Email (With Direct Live Room Token)
export function renderReminder15mEmail(
  fullName: string,
  joinToken: string,
  props: BaseTemplateProps
) {
  const subject = 'Starting in 15 Minutes: Join Live Room';
  const liveUrl = `${props.appUrl}/live?t=${joinToken}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; color: #18181b;">
      <div style="border: 1px solid #e4e4e7; border-radius: 6px; padding: 24px; background: #ffffff;">
        <span style="font-size: 11px; font-family: monospace; font-weight: bold; color: #dc2626;">STARTING NOW</span>
        <h1 style="font-size: 20px; font-weight: bold; margin: 12px 0 12px 0; color: #09090b;">Doors Are Open</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #3f3f46; margin: 0 0 20px 0;">
          Hi ${fullName}, the build room is open. Click below to enter directly and record your attendance:
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${liveUrl}" style="display: inline-block; background: #16a34a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: bold; padding: 12px 24px; border-radius: 4px;">Enter Live Build Room</a>
        </div>
        <p style="font-size: 11px; color: #71717a; margin: 0;">Direct link: <a href="${liveUrl}" style="color: #16a34a;">${liveUrl}</a></p>
        ${renderFooter(props.unsubscribeUrl, props.physicalAddress)}
      </div>
    </div>
  `;
  const text = `Starting in 15 Minutes\n\nHi ${fullName},\nEnter the live build room here: ${liveUrl}\n\n${props.physicalAddress || DEFAULT_ADDRESS}`;
  return { subject, html, text };
}

// 6. Milestone Achieved Email
export function renderMilestoneEmail(
  fullName: string,
  milestoneKind: 'refs_3' | 'refs_10',
  props: BaseTemplateProps
) {
  const isCaptain = milestoneKind === 'refs_10';
  const subject = isCaptain
    ? 'Achievement: Campus Captain Status Unlocked'
    : 'Unlocked: Priority VIP Review for Workshop';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; color: #18181b;">
      <div style="border: 1px solid #e4e4e7; border-radius: 6px; padding: 24px; background: #ffffff;">
        <span style="font-size: 11px; font-family: monospace; font-weight: bold; color: #16a34a;">MILESTONE ACHIEVED</span>
        <h1 style="font-size: 20px; font-weight: bold; margin: 12px 0 12px 0; color: #09090b;">Congratulations, ${fullName}!</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #3f3f46; margin: 0 0 16px 0;">
          ${
            isCaptain
              ? 'You have reached 10 verified student referrals. You have earned official Campus Captain status and your verified leadership credential.'
              : 'You have reached 3 verified referrals. You have unlocked Priority VIP code review for your project during the live workshop.'
          }
        </p>
        <p>
          <a href="${props.appUrl}/dashboard/me" style="display: inline-block; background: #09090b; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 4px;">View In Your Dashboard</a>
        </p>
        ${renderFooter(props.unsubscribeUrl, props.physicalAddress)}
      </div>
    </div>
  `;
  const text = `${subject}\n\nHi ${fullName},\nYour milestone has been recorded!\nView in dashboard: ${props.appUrl}/dashboard/me\n\n${props.physicalAddress || DEFAULT_ADDRESS}`;
  return { subject, html, text };
}
