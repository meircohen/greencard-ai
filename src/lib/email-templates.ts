export interface EmailTemplate {
  subject: string;
  html: string;
}

const brandColor = "#10b981";
const accentColor = "#3b82f6";

const emailHeader = () => `
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0f1e;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <div style="color: #10b981; font-size: 28px; font-weight: bold;">GreenCard.ai</div>
      <div style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Your Immigration Case Companion</div>
    </td>
  </tr>
</table>
`;

const emailFooter = () => `
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #111827; border-top: 1px solid #1a2035;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <div style="color: #64748b; font-size: 12px; line-height: 1.6;">
        <div style="margin-bottom: 15px;">
          <a href="https://greencard.ai" style="color: #10b981; text-decoration: none; margin: 0 10px;">Website</a>
          <a href="https://greencard.ai/contact" style="color: #10b981; text-decoration: none; margin: 0 10px;">Contact</a>
          <a href="https://greencard.ai/privacy" style="color: #10b981; text-decoration: none; margin: 0 10px;">Privacy</a>
        </div>
        <div style="margin-top: 15px;">
          <p style="margin: 0; color: #475569;">This email was sent to your registered email address with GreenCard.ai.</p>
          <p style="margin: 10px 0 0 0; color: #475569;">GreenCard.ai is not a law firm and does not provide legal advice. Please consult with a licensed immigration attorney for legal guidance.</p>
        </div>
      </div>
    </td>
  </tr>
</table>
`;

const ctaButton = (text: string, url: string) => `
<table cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="background-color: ${brandColor}; padding: 12px 30px; border-radius: 6px;">
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
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #0a0f1e;">

${emailHeader()}

<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #111827;">
  <tr>
    <td align="center" style="padding: 40px 20px;">
      <table width="100%" max-width="600" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 40px; background-color: #1a2035; border-radius: 12px;">
            <h1 style="color: #f1f5f9; font-size: 28px; margin: 0 0 20px 0;">Your Weekly Update</h1>
            
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Here's what's happening with your immigration cases this week.
            </p>

            <div style="background-color: #0a0f1e; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #10b981;">
              <p style="color: #10b981; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">CASES SUMMARY</p>
              <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.5;">${casesSummary}</p>
            </div>

            ${upcomingDeadlines.length > 0 ? `
            <div style="background-color: #0a0f1e; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #dc2626;">
              <p style="color: #dc2626; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">UPCOMING DEADLINES</p>
              <ul style="color: #94a3b8; font-size: 14px; margin: 0; padding: 0; list-style: none;">
                ${upcomingDeadlines.map(deadline => `<li style="margin-bottom: 5px;">• ${deadline}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            <div style="background-color: #0a0f1e; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #3b82f6;">
              <p style="color: #3b82f6; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">VISA BULLETIN UPDATE</p>
              <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.5;">${visaBulletinUpdate}</p>
            </div>

            <div align="center" style="margin: 30px 0;">
              ${ctaButton("View Full Dashboard", "https://greencard.ai/dashboard")}
            </div>

            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
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
