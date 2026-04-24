module.exports = `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Request Update</title>
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
                    <span style="background:#EFF6FF; color:#1e40af; padding:4px 10px;
                      border-radius:6px; font-size:11px; font-weight:600;">
                      Request Update
                    </span>
                  </td>
                </tr>
              </table>
              <p style="font-size:18px; font-weight:600; color:#1a202c; margin:14px 0 4px;">
                Your request is being processed
              </p>
              <p style="font-size:13px; color:#718096; margin:0;">We'll keep you updated</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:24px 32px;">

              <p style="font-size:14px; color:#1a202c; margin:0 0 16px;">
                Hi <strong>{{UserName}}</strong>,
              </p>

              <p style="font-size:14px; color:#4a5568; line-height:1.7; margin:0 0 16px;">
                We wanted to let you know that your request is being actively
                processed by our team. Here's the current status:
              </p>

              <!-- Status Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:16px 40px; text-align:center;">
                          <p style="margin:0; font-size:11px; color:#666; text-transform:uppercase; letter-spacing:1px;">
                            Current Status
                          </p>
                          <p style="margin:6px 0 0 0; font-size:20px; font-weight:700; color:#16a34a; text-transform:capitalize;">
                            {{NewStatus}}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Info box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;">
                <tr>
                  <td width="3" style="background:#EF9F27;">&nbsp;</td>
                  <td style="background:#FAEEDA; padding:12px 16px; font-size:13px; color:#633806;">
                    Our team will contact you shortly with further details.
                    Please keep an eye on your email and phone.
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