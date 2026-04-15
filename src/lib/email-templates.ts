export interface EmailTemplate {
  subject: string;
  html: string;
}

const brandColor = "#1e3a8a";
const accentColor = "#3b82f6";
const successColor = "#10b981";
const warningColor = "#f59e0b";
const errorColor = "#dc2626";

const emailHeader = () => `
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e3a8a;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <div style="color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 1px;">GreenCard.ai</div>
      <div style="color: #dbeafe; font-size: 14px; margin-top: 5px;">Your Immigration Case Companion</div>
    </td>
  </tr>
</table>
`;

const emailFooter = () => `
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-top: 1px solid #1e3a8a;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <div style="color: #64748b; font-size: 12px; line-height: 1.6;">
        <div style="margin-bottom: 20px;">
          <a href="https://greencard.ai" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Website</a>
          <a href="https://greencard.ai/contact" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Contact</a>
          <a href="https://greencard.ai/privacy" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Privacy</a>
          <a href="https://wa.me/1234567890" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">WhatsApp</a>
        </div>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #1e3a8a;">
          <p style="margin: 0 0 8px 0; color: #475569; font-size: 11px;">This email was sent to your registered email address with GreenCard.ai.</p>
          <p style="margin: 5px 0 0 0; color: #475569; font-size: 11px;">Partner Immigration Law, PLLC - Licensed Immigration Attorneys</p>
          <p style="margin: 5px 0 0 0; color: #475569; font-size: 11px;">GreenCard.ai is not a law firm and does not provide legal advice. Please consult with a licensed immigration attorney for legal guidance.</p>
          <p style="margin: 5px 0 0 0; color: #475569; font-size: 11px; font-style: italic;">Phone: (555) 123-4567 | Available 24/7</p>
        </div>
      </div>
    </td>
  </tr>
</table>
`;

const ctaButton = (text: string, url: string, color: string = accentColor) => `
<table cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="background-color: ${color}; padding: 12px 30px; border-radius: 6px;">
      <a href="${url}" style="color: white; text-decoration: none; font-weight: bold; font-size: 16px;">
        ${text}
      </a>
    </td>
  </tr>
</table>
`;

export function welcomeEmail(name: string): EmailTemplate {
  return {
    subject: "Welcome to GreenCard.ai - Your Immigration Case Starts Here",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0a0f1e;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #111827;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1a2035; border-radius: 12px;">
            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 20px 0;">Welcome, ${name}!</h1>
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              We're excited to have you on board. GreenCard.ai is your intelligent companion for navigating the immigration process with confidence and clarity.
            </p>
            
            <div style="background-color: #0a0f1e; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="color: #10b981; font-size: 14px; font-weight: bold; margin: 0 0 15px 0;">GETTING STARTED</p>
              <ul style="color: #94a3b8; font-size: 14px; margin: 0; padding: 0; list-style: none;">
                <li style="margin-bottom: 10px;">✓ Complete your profile with immigration details</li>
                <li style="margin-bottom: 10px;">✓ Start your case assessment questionnaire</li>
                <li style="margin-bottom: 10px;">✓ Connect with immigration attorneys</li>
                <li style="margin-bottom: 10px;">✓ Upload and organize documents</li>
              </ul>
            </div>

            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 30px 0;">
              Let's get started:
            </p>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("Start Your Case Assessment", "https://greencard.ai/assessment")}
            </div>

            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              If you have any questions, our support team is available 24/7 at <a href="mailto:support@greencard.ai" style="color: #10b981; text-decoration: none;">support@greencard.ai</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

${emailFooter()}

</body>
</html>
    `,
  };
}

export function assessmentCompleteEmail(
  name: string,
  score: number,
  category: string
): EmailTemplate {
  return {
    subject: "Your Immigration Case Assessment is Ready - Score: " + score,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0a0f1e;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #111827;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1a2035; border-radius: 12px;">
            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 20px 0;">Assessment Complete!</h1>
            
            <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <div style="color: white; font-size: 48px; font-weight: bold; margin: 0 0 10px 0;">${score}%</div>
              <div style="color: rgba(255,255,255,0.9); font-size: 18px;">${category} Category</div>
            </div>

            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 30px 0;">
              Great news! Your case assessment has been completed and analyzed. Based on your responses, we've categorized your case and identified the best pathway forward for your application.
            </p>

            <div style="background-color: #0a0f1e; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #10b981;">
              <p style="color: #10b981; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">NEXT STEPS</p>
              <p style="color: #94a3b8; font-size: 14px; margin: 0;">Review your detailed assessment report and connect with our recommended attorneys who specialize in your category.</p>
            </div>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("View Your Assessment", "https://greencard.ai/assessment/results")}
            </div>

            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
              Questions about your assessment? Our support team can help clarify any results or recommendations.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

${emailFooter()}

</body>
</html>
    `,
  };
}

export function deadlineReminderEmail(
  name: string,
  deadlineType: string,
  deadlineDate: string,
  caseName: string
): EmailTemplate {
  return {
    subject: `URGENT: ${deadlineType} Deadline - ${deadlineDate}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0a0f1e;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #111827;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1a2035; border-radius: 12px;">
            <div style="display: inline-block; background-color: #dc2626; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">
              URGENT DEADLINE
            </div>
            
            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 20px 0;">Action Required: ${deadlineType}</h1>
            
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              This is a critical reminder that you have an important deadline approaching for your case.
            </p>

            <div style="background-color: #0a0f1e; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #dc2626;">
              <div style="margin-bottom: 15px;">
                <p style="color: #64748b; font-size: 12px; margin: 0;">Case</p>
                <p style="color: #f1f5f9; font-size: 16px; font-weight: bold; margin: 5px 0 0 0;">${caseName}</p>
              </div>
              <div style="margin-bottom: 15px;">
                <p style="color: #64748b; font-size: 12px; margin: 0;">Deadline Type</p>
                <p style="color: #f1f5f9; font-size: 16px; font-weight: bold; margin: 5px 0 0 0;">${deadlineType}</p>
              </div>
              <div>
                <p style="color: #64748b; font-size: 12px; margin: 0;">Due Date</p>
                <p style="color: #dc2626; font-size: 16px; font-weight: bold; margin: 5px 0 0 0;">${deadlineDate}</p>
              </div>
            </div>

            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 30px 0;">
              Missing this deadline could significantly impact your case. Please take immediate action to prepare and submit all required documents.
            </p>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("Go to Case", "https://greencard.ai/cases")}
            </div>

            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
              Need assistance? Contact your assigned attorney or our support team immediately.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

${emailFooter()}

</body>
</html>
    `,
  };
}

export function caseUpdateEmail(
  name: string,
  caseName: string,
  updateType: string,
  description: string
): EmailTemplate {
  return {
    subject: `Your Case Status Updated: ${updateType}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0a0f1e;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #111827;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1a2035; border-radius: 12px;">
            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 20px 0;">Case Status Update</h1>
            
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Your case has a new status update. Here are the details:
            </p>

            <div style="background-color: #0a0f1e; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #3b82f6;">
              <div style="margin-bottom: 15px;">
                <p style="color: #64748b; font-size: 12px; margin: 0;">Case Name</p>
                <p style="color: #f1f5f9; font-size: 16px; font-weight: bold; margin: 5px 0 0 0;">${caseName}</p>
              </div>
              <div style="margin-bottom: 15px;">
                <p style="color: #64748b; font-size: 12px; margin: 0;">Update Type</p>
                <p style="color: #10b981; font-size: 16px; font-weight: bold; margin: 5px 0 0 0;">${updateType}</p>
              </div>
              <div>
                <p style="color: #64748b; font-size: 12px; margin: 0;">Details</p>
                <p style="color: #94a3b8; font-size: 14px; margin: 5px 0 0 0; line-height: 1.5;">${description}</p>
              </div>
            </div>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("View Case Details", "https://greencard.ai/cases")}
            </div>

            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
              Log in to your GreenCard.ai account for more information about this update.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

${emailFooter()}

</body>
</html>
    `,
  };
}

export function rfeReceivedEmail(
  name: string,
  caseName: string,
  responseDeadline: string
): EmailTemplate {
  return {
    subject: "URGENT: Request for Evidence (RFE) Received - Action Required",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0a0f1e;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #111827;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1a2035; border-radius: 12px;">
            <div style="display: inline-block; background-color: #dc2626; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">
              URGENT - RFE RECEIVED
            </div>
            
            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 20px 0;">Request for Evidence (RFE) Received</h1>
            
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              USCIS has issued a Request for Evidence (RFE) for your case. This requires immediate attention and timely response.
            </p>

            <div style="background-color: #0a0f1e; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #dc2626;">
              <div style="margin-bottom: 15px;">
                <p style="color: #64748b; font-size: 12px; margin: 0;">Case Name</p>
                <p style="color: #f1f5f9; font-size: 16px; font-weight: bold; margin: 5px 0 0 0;">${caseName}</p>
              </div>
              <div>
                <p style="color: #64748b; font-size: 12px; margin: 0;">Response Deadline</p>
                <p style="color: #dc2626; font-size: 16px; font-weight: bold; margin: 5px 0 0 0;">${responseDeadline}</p>
              </div>
            </div>

            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 30px 0;">
              To increase your chances of approval, it's crucial to respond comprehensively and before the deadline. We recommend consulting with your immigration attorney immediately.
            </p>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("View RFE Details", "https://greencard.ai/cases")}
            </div>

            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
              Contact your assigned attorney or our support team for assistance in preparing your RFE response.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

${emailFooter()}

</body>
</html>
    `,
  };
}

export function weeklyDigestEmail(
  name: string,
  casesSummary: string,
  upcomingDeadlines: string[],
  visaBulletinUpdate: string
): EmailTemplate {
  return {
    subject: "Your Weekly Immigration Update - Week of " + new Date().toLocaleDateString(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0f172a;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1e3a8a; border-radius: 12px;">
            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 20px 0;">Your Weekly Update</h1>

            <p style="color: #dbeafe; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Here's what's happening with your immigration cases this week.
            </p>

            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #10b981;">
              <p style="color: #10b981; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">CASES SUMMARY</p>
              <p style="color: #cbd5e1; font-size: 14px; margin: 0; line-height: 1.5;">${casesSummary}</p>
            </div>

            ${upcomingDeadlines.length > 0 ? `
            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #dc2626;">
              <p style="color: #dc2626; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">UPCOMING DEADLINES</p>
              <ul style="color: #cbd5e1; font-size: 14px; margin: 0; padding: 0; list-style: none;">
                ${upcomingDeadlines.map(deadline => `<li style="margin-bottom: 5px;">• ${deadline}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #3b82f6;">
              <p style="color: #3b82f6; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">VISA BULLETIN UPDATE</p>
              <p style="color: #cbd5e1; font-size: 14px; margin: 0; line-height: 1.5;">${visaBulletinUpdate}</p>
            </div>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("View Full Dashboard", "https://greencard.ai/dashboard")}
            </div>

            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
              Have questions? Check your case details or contact our support team.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

${emailFooter()}

</body>
</html>
    `,
  };
}

export function caseStatusUpdateEmail(
  name: string,
  caseType: string,
  oldStatus: string,
  newStatus: string,
  nextSteps: string
): EmailTemplate {
  const statusColors: Record<string, string> = {
    approved: successColor,
    denied: errorColor,
    processing: warningColor,
    submitted: accentColor,
    completed: successColor,
  };
  const statusColor = statusColors[newStatus.toLowerCase()] || accentColor;

  return {
    subject: `Case Status Update: Your ${caseType} case is now ${newStatus}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0f172a;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1e3a8a; border-radius: 12px;">
            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 20px 0;">Case Status Updated</h1>

            <p style="color: #dbeafe; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Hi ${name}, your ${caseType} case has been updated.
            </p>

            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border: 2px solid ${statusColor};">
              <div style="text-align: center; margin-bottom: 20px;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px 0;">Status Changed From</p>
                <p style="color: #cbd5e1; font-size: 16px; font-weight: bold; margin: 0; text-transform: capitalize;">${oldStatus}</p>
              </div>

              <div style="text-align: center; color: ${statusColor}; font-size: 20px; margin: 10px 0;">
                ↓
              </div>

              <div style="text-align: center;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px 0;">Current Status</p>
                <p style="color: ${statusColor}; font-size: 20px; font-weight: bold; margin: 0; text-transform: capitalize;">${newStatus}</p>
              </div>
            </div>

            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #3b82f6;">
              <p style="color: #3b82f6; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">NEXT STEPS</p>
              <p style="color: #cbd5e1; font-size: 14px; margin: 0; line-height: 1.6;">${nextSteps}</p>
            </div>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("View Case Details", "https://greencard.ai/cases", accentColor)}
            </div>

            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0;">
              If you have questions about this update, please contact your assigned attorney or our support team.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

${emailFooter()}

</body>
</html>
    `,
  };
}

export function documentReceivedEmail(
  name: string,
  documentType: string,
  caseType: string
): EmailTemplate {
  return {
    subject: `Document Received: ${documentType} for your ${caseType} case`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0f172a;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1e3a8a; border-radius: 12px;">
            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 20px 0;">Document Received</h1>

            <p style="color: #dbeafe; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Hi ${name}, we have received a document for your case.
            </p>

            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #10b981;">
              <div style="margin-bottom: 15px;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Document Type</p>
                <p style="color: #f1f5f9; font-size: 16px; font-weight: bold; margin: 5px 0 0 0;">${documentType}</p>
              </div>
              <div>
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Case</p>
                <p style="color: #f1f5f9; font-size: 16px; font-weight: bold; margin: 5px 0 0 0;">${caseType}</p>
              </div>
            </div>

            <p style="color: #dbeafe; font-size: 16px; line-height: 1.6; margin: 30px 0;">
              Your document has been uploaded and is currently being processed. Our AI-powered system will extract relevant information to help organize your case.
            </p>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("View Documents", "https://greencard.ai/cases", accentColor)}
            </div>

            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0;">
              Need help organizing your documents? Our support team is available 24/7.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

${emailFooter()}

</body>
</html>
    `,
  };
}

export function deadlineReminderEmailNew(
  name: string,
  deadlineType: string,
  deadlineDate: string,
  daysRemaining: number,
  caseType: string
): EmailTemplate {
  const isUrgent = daysRemaining <= 7;
  const urgentStyle = isUrgent
    ? `<div style="display: inline-block; background-color: ${errorColor}; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">URGENT - ${daysRemaining} DAYS LEFT</div>`
    : `<div style="display: inline-block; background-color: ${warningColor}; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">${daysRemaining} DAYS REMAINING</div>`;

  return {
    subject: `DEADLINE REMINDER: ${deadlineType} due in ${daysRemaining} days - ${caseType}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0f172a;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1e3a8a; border-radius: 12px;">
            ${urgentStyle}

            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 20px 0;">Upcoming Deadline</h1>

            <p style="color: #dbeafe; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Hi ${name}, you have an upcoming deadline for your ${caseType} case.
            </p>

            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid ${isUrgent ? errorColor : warningColor};">
              <div style="margin-bottom: 15px;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Deadline Type</p>
                <p style="color: #f1f5f9; font-size: 16px; font-weight: bold; margin: 5px 0 0 0;">${deadlineType}</p>
              </div>
              <div style="margin-bottom: 15px;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Due Date</p>
                <p style="color: #f1f5f9; font-size: 16px; font-weight: bold; margin: 5px 0 0 0;">${deadlineDate}</p>
              </div>
              <div>
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Time Remaining</p>
                <p style="color: ${isUrgent ? errorColor : warningColor}; font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${daysRemaining} days</p>
              </div>
            </div>

            <p style="color: #dbeafe; font-size: 16px; line-height: 1.6; margin: 30px 0;">
              Missing this deadline could significantly impact your case. Please gather the necessary documents and prepare your submission immediately.
            </p>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("Go to Case", "https://greencard.ai/cases", isUrgent ? errorColor : warningColor)}
            </div>

            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0;">
              Contact your assigned attorney for assistance in preparing your submission.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

${emailFooter()}

</body>
</html>
    `,
  };
}

export function paymentReceiptEmail(
  name: string,
  amount: string,
  planName: string,
  date: string,
  receiptUrl: string
): EmailTemplate {
  return {
    subject: `Payment Confirmed: ${planName} Plan - Receipt for ${amount}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0f172a;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1e3a8a; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="display: inline-block; background-color: ${successColor}; color: white; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 18px;">
                Payment Confirmed
              </div>
            </div>

            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 10px 0; text-align: center;">Thank You, ${name}</h1>

            <p style="color: #dbeafe; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; text-align: center;">
              Your payment has been successfully processed.
            </p>

            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border: 2px solid ${successColor};">
              <div style="margin-bottom: 15px; border-bottom: 1px solid #1e3a8a; padding-bottom: 15px;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Plan</p>
                <p style="color: #f1f5f9; font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${planName}</p>
              </div>
              <div style="margin-bottom: 15px; border-bottom: 1px solid #1e3a8a; padding-bottom: 15px;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Amount Paid</p>
                <p style="color: ${successColor}; font-size: 24px; font-weight: bold; margin: 5px 0 0 0;">${amount}</p>
              </div>
              <div>
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Payment Date</p>
                <p style="color: #f1f5f9; font-size: 14px; margin: 5px 0 0 0;">${date}</p>
              </div>
            </div>

            <p style="color: #dbeafe; font-size: 16px; line-height: 1.6; margin: 30px 0;">
              Your ${planName} plan is now active and you have access to all premium features.
            </p>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("View Receipt", receiptUrl, successColor)}
            </div>

            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0;">
              If you have any questions about your payment or plan, please contact our billing support team.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

${emailFooter()}

</body>
</html>
    `,
  };
}

export function welcomeEmailNew(name: string, caseType: string): EmailTemplate {
  return {
    subject: "Welcome to GreenCard.ai - Your Immigration Journey Begins",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0f172a;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1e3a8a; border-radius: 12px;">
            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 10px 0;">Welcome, ${name}!</h1>
            <p style="color: #dbeafe; font-size: 16px; margin: 0 0 30px 0;">
              Your ${caseType} case is now set up on GreenCard.ai
            </p>

            <p style="color: #dbeafe; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              We are excited to be your trusted partner in navigating your immigration case. Our intelligent platform combines expert legal guidance with cutting-edge AI to help you achieve your goals.
            </p>

            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #10b981;">
              <p style="color: #10b981; font-size: 14px; font-weight: bold; margin: 0 0 15px 0;">GET STARTED IN 3 STEPS</p>
              <ol style="color: #cbd5e1; font-size: 14px; margin: 0; padding: 0 0 0 20px;">
                <li style="margin-bottom: 10px;">Complete your profile with personal and immigration details</li>
                <li style="margin-bottom: 10px;">Upload all relevant documents for your ${caseType} case</li>
                <li style="margin-bottom: 0;">Connect with a licensed immigration attorney</li>
              </ol>
            </div>

            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #3b82f6;">
              <p style="color: #3b82f6; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">FEATURES INCLUDED</p>
              <ul style="color: #cbd5e1; font-size: 14px; margin: 0; padding: 0; list-style: none;">
                <li style="margin-bottom: 8px; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0;">✓</span> Case tracking and status updates</li>
                <li style="margin-bottom: 8px; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0;">✓</span> Document organization and AI analysis</li>
                <li style="margin-bottom: 8px; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0;">✓</span> Deadline reminders and alerts</li>
                <li style="margin-bottom: 0; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0;">✓</span> 24/7 support via email, phone, and WhatsApp</li>
              </ul>
            </div>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("Complete Your Profile", "https://greencard.ai/profile", successColor)}
            </div>

            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0;">
              If you have any questions or need assistance getting started, our support team is here to help. Contact us anytime at support@greencard.ai or via WhatsApp.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

${emailFooter()}

</body>
</html>
    `,
  };
}

export function rfeAlertEmail(
  name: string,
  caseType: string,
  rfeDeadline: string,
  rfeDescription: string
): EmailTemplate {
  return {
    subject: `URGENT: Request for Evidence (RFE) - Action Required for ${caseType} Case`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0f172a;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1e3a8a; border-radius: 12px;">
            <div style="display: inline-block; background-color: ${errorColor}; color: white; padding: 10px 20px; border-radius: 6px; font-weight: bold; margin-bottom: 20px;">
              URGENT - RFE RECEIVED
            </div>

            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 20px 0;">Request for Evidence (RFE) Received</h1>

            <p style="color: #dbeafe; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Hi ${name}, USCIS has issued a Request for Evidence for your ${caseType} case. This requires immediate action.
            </p>

            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border: 2px solid ${errorColor};">
              <div style="margin-bottom: 20px;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">Response Deadline</p>
                <p style="color: ${errorColor}; font-size: 20px; font-weight: bold; margin: 8px 0 0 0;">${rfeDeadline}</p>
              </div>
              <div>
                <p style="color: #94a3b8; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">What USCIS is Requesting</p>
                <p style="color: #cbd5e1; font-size: 14px; margin: 8px 0 0 0; line-height: 1.6;">${rfeDescription}</p>
              </div>
            </div>

            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #f59e0b;">
              <p style="color: #f59e0b; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">CRITICAL NEXT STEPS</p>
              <ol style="color: #cbd5e1; font-size: 14px; margin: 0; padding: 0 0 0 20px;">
                <li style="margin-bottom: 8px;">Contact your attorney immediately</li>
                <li style="margin-bottom: 8px;">Gather all requested documents</li>
                <li style="margin-bottom: 8px;">Prepare a comprehensive response</li>
                <li style="margin-bottom: 0;">Submit before the deadline</li>
              </ol>
            </div>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("View RFE Details", "https://greencard.ai/cases", errorColor)}
            </div>

            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0;">
              Your assigned attorney is standing by to help. Contact them immediately or reach out to our support team at (555) 123-4567.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

${emailFooter()}

</body>
</html>
    `,
  };
}

export function caseApprovedEmail(
  name: string,
  caseType: string,
  approvalDate: string,
  nextSteps: string
): EmailTemplate {
  return {
    subject: `Congratulations! Your ${caseType} Case Has Been Approved`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0f172a;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1e3a8a; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="display: inline-block; background-color: ${successColor}; color: white; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 18px;">
                CASE APPROVED
              </div>
            </div>

            <h1 style="color: #f1f5f9; font-size: 32px; margin: 0 0 10px 0; text-align: center;">Congratulations, ${name}!</h1>
            <p style="color: #dbeafe; font-size: 18px; margin: 0 0 30px 0; text-align: center; font-weight: bold;">
              Your ${caseType} case has been approved!
            </p>

            <p style="color: #dbeafe; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              This is wonderful news! After careful review, USCIS has approved your application. Your case is now moving to the next phase.
            </p>

            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border: 2px solid ${successColor};">
              <div style="margin-bottom: 15px;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Approval Date</p>
                <p style="color: #f1f5f9; font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${approvalDate}</p>
              </div>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #1e3a8a;">
                <p style="color: #10b981; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">YOUR NEXT STEPS</p>
                <p style="color: #cbd5e1; font-size: 14px; margin: 0; line-height: 1.6;">${nextSteps}</p>
              </div>
            </div>

            <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #3b82f6;">
              <p style="color: #3b82f6; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">WHAT HAPPENS NOW</p>
              <ul style="color: #cbd5e1; font-size: 14px; margin: 0; padding: 0; list-style: none;">
                <li style="margin-bottom: 8px; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0;">✓</span> Your case file will be updated with approval documentation</li>
                <li style="margin-bottom: 8px; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0;">✓</span> Your attorney will guide you through next steps</li>
                <li style="margin-bottom: 0; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0;">✓</span> You will receive additional instructions within 5 business days</li>
              </ul>
            </div>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("View Your Case", "https://greencard.ai/cases", successColor)}
            </div>

            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0;">
              Please review the official approval documents in your case file. Congratulations again on this milestone achievement!
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

${emailFooter()}

</body>
</html>
    `,
  };
}
