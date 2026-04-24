module.exports = `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Activity Update</title>
</head>

<body style="margin:0; padding:0; background:#f6f9fc; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f9fc; padding:32px 16px;">
    <tr>
      <td align="center">

        <table width="560" cellpadding="0" cellspacing="0" border="0"
          style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td style="padding:28px 32px 20px; border-bottom:1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:15px; font-weight:600; color:#1a202c;">{{YourCompanyName}}</td>
                  <td align="right">
                    <span style="background:#EEF2FF; color:#3730a3; padding:4px 10px;
                      border-radius:6px; font-size:11px; font-weight:600;">
                      Activity Update
                    </span>
                  </td>
                </tr>
              </table>
              <p style="font-size:18px; font-weight:600; color:#1a202c; margin:14px 0 4px;">
                New activity on your request
              </p>
              <p style="font-size:13px; color:#718096; margin:0;">Our team took an action on your request</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:24px 32px;">

              <p style="font-size:14px; color:#1a202c; margin:0 0 16px;">
                Hi <strong>{{UserName}}</strong>,
              </p>

              <p style="font-size:14px; color:#4a5568; line-height:1.7; margin:0 0 20px;">
                Our team has logged a new activity on your request. Here are the details:
              </p>

              <!-- Activity Type Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr>
                  <td>
                    <span style="background:{{ActivityBadgeBg}}; color:{{ActivityBadgeColor}};
                      padding:5px 14px; border-radius:20px; font-size:12px; font-weight:600;
                      text-transform:capitalize;">
                      {{ActivityIcon}} {{ActivityType}}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Activity Details Table -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; margin-bottom:20px;">

                <!-- Title -->
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td width="35%" style="padding:12px 16px; background:#f8fafc; font-size:12px; color:#718096; font-weight:600;">
                    Title
                  </td>
                  <td style="padding:12px 16px; font-size:14px; color:#1a202c;">
                    {{ActivityTitle}}
                  </td>
                </tr>

                <!-- Description -->
                {{DescriptionRow}}

                <!-- CALL specific rows -->
                {{CallDurationRow}}
                {{CallOutcomeRow}}

                <!-- EMAIL specific rows -->
                {{EmailSubjectRow}}

                <!-- MEETING specific rows -->
                {{MeetingLinkRow}}
                {{MeetingDateRow}}
                {{MeetingLocationRow}}

                <!-- Logged by -->
                <tr>
                  <td width="35%" style="padding:12px 16px; background:#f8fafc; font-size:12px; color:#718096; font-weight:600;">
                    Logged By
                  </td>
                  <td style="padding:12px 16px; font-size:14px; color:#1a202c;">
                    {{LoggedBy}}
                  </td>
                </tr>

              </table>

              <!-- Info box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="3" style="background:#EF9F27;">&nbsp;</td>
                  <td style="background:#FAEEDA; padding:12px 16px; font-size:13px; color:#633806;">
                    If you have any questions about this activity, feel free to contact our support team.
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:16px 32px; border-top:1px solid #e2e8f0;">
              <p style="font-size:12px; color:#718096; margin:0;">
                Questions? Contact us at
                <a href="mailto:{{SupportEmail}}"
                  style="color:#185FA5; text-decoration:none;">{{SupportEmail}}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;