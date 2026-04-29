module.exports = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>You've Been Shortlisted!</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:40px 40px 30px;text-align:center;">
              <p style="margin:0 0 16px;font-size:13px;color:#c8a84b;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Arslan Larik & Company</p>
              <div style="width:64px;height:64px;background:rgba(200,168,75,0.15);border:2px solid #c8a84b;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:28px;line-height:64px;text-align:center;">🎉</div>
              <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">You've Been Shortlisted!</h1>
              <p style="margin:10px 0 0;font-size:14px;color:#94a3b8;">Great news — your application has been reviewed</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="margin:0 0 20px;font-size:15px;color:#374151;">Dear <strong>{{UserName}}</strong>,</p>

              <p style="margin:0 0 24px;font-size:15px;color:#4b5563;line-height:1.7;">
                Congratulations! We are pleased to inform you that you have been <strong style="color:#1a1a2e;">shortlisted for {{ProgramName}}</strong>. 
                Our team has reviewed your application and we'd love to have you on board.
              </p>

              <!-- Highlight Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6e3;border:1px solid #e8d5a3;border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#c8a84b;text-transform:uppercase;letter-spacing:0.1em;">Next Step Required</p>
                    <p style="margin:0;font-size:15px;color:#1a1a2e;font-weight:600;">Complete Your Contract & Personal Details</p>
                    <p style="margin:8px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">
                      To confirm your enrollment, please fill in your contract details and sign the agreement. 
                      This only takes a few minutes.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Steps -->
              <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#1a1a2e;text-transform:uppercase;letter-spacing:0.08em;">What to do next:</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;height:32px;background:#1a1a2e;border-radius:50%;text-align:center;vertical-align:middle;font-size:13px;font-weight:700;color:#c8a84b;">1</td>
                        <td style="padding-left:14px;font-size:14px;color:#374151;">Log in to your dashboard</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;height:32px;background:#1a1a2e;border-radius:50%;text-align:center;vertical-align:middle;font-size:13px;font-weight:700;color:#c8a84b;">2</td>
                        <td style="padding-left:14px;font-size:14px;color:#374151;">Fill in your contract & personal details</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;height:32px;background:#1a1a2e;border-radius:50%;text-align:center;vertical-align:middle;font-size:13px;font-weight:700;color:#c8a84b;">3</td>
                        <td style="padding-left:14px;font-size:14px;color:#374151;">Sign the agreement & submit</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="{{ContractLink}}" style="display:inline-block;background:linear-gradient(135deg,#c8a84b,#e8c96b);color:#1a1a2e;font-size:15px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:8px;letter-spacing:0.03em;">
                      Complete My Contract →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 6px;font-size:13px;color:#9ca3af;text-align:center;">
                If the button doesn't work, copy this link:
              </p>
              <p style="margin:0;font-size:12px;color:#6b7280;text-align:center;word-break:break-all;">{{ContractLink}}</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#1a1a2e;">Arslan Larik & Company</p>
              <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">Center for Human Brilliance & Behavioral Reengineering</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">Questions? <a href="mailto:{{SupportEmail}}" style="color:#c8a84b;text-decoration:none;">{{SupportEmail}}</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;