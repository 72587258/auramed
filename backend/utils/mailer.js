const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const sendWelcomeEmail = async (userEmail, userName) => {
    console.log(`[AuraMed Mailer] Dispatching welcome signal to: ${userEmail}`);
    try {
        const transporter = createTransporter();
        const year = new Date().getFullYear();

        const mailOptions = {
            from: `"AuraMed AI Health Platform" <${process.env.SMTP_USER}>`,
            to: userEmail,
            subject: `Welcome to AuraMed, ${userName} — Your Health Journey Begins 🚀`,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to AuraMed</title>
</head>
<body style="margin:0;padding:0;background-color:#010b18;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- WRAPPER -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#010b18;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- HEADER GLOW BAR -->
          <tr>
            <td style="background:linear-gradient(90deg,#00c6ff 0%,#6a00f4 50%,#ff0080 100%);height:4px;border-radius:4px 4px 0 0;"></td>
          </tr>

          <!-- MAIN CARD -->
          <tr>
            <td style="background:linear-gradient(145deg,#0a1628 0%,#0d1f3c 60%,#111827 100%);border:1px solid rgba(0,198,255,0.15);border-top:none;border-radius:0 0 24px 24px;padding:0 0 40px 0;overflow:hidden;">

              <!-- HERO SECTION -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:linear-gradient(135deg,rgba(0,198,255,0.08) 0%,rgba(106,0,244,0.12) 100%);padding:50px 50px 40px;text-align:center;border-bottom:1px solid rgba(0,198,255,0.1);">

                    <!-- LOGO BADGE -->
                    <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="background:linear-gradient(135deg,#00c6ff,#6a00f4);border-radius:20px;padding:2px;">
                          <div style="background:#0a1628;border-radius:18px;padding:14px 26px;">
                            <span style="font-size:13px;font-weight:800;letter-spacing:4px;text-transform:uppercase;color:#00c6ff;">&#11041; AURAMED</span>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- MAIN HEADLINE -->
                    <h1 style="margin:0 0 12px;font-size:34px;font-weight:900;color:#ffffff;letter-spacing:-1px;line-height:1.2;">
                      Welcome, ${userName}! &#128075;
                    </h1>
                    <p style="margin:0 auto;font-size:16px;color:#64748b;line-height:1.6;max-width:420px;">
                      Your AI-powered health intelligence dashboard is now <strong style="color:#00c6ff;">active and ready</strong>.
                    </p>

                  </td>
                </tr>
              </table>

              <!-- BODY CONTENT -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:40px 50px 0;">

                    <!-- GREETING TEXT -->
                    <p style="margin:0 0 30px;font-size:15px;color:#94a3b8;line-height:1.8;">
                      Your neural health profile has been successfully created. AuraMed uses cutting-edge AI to analyze your vitals, track your medications, and provide intelligent health insights &#8212; all in one place.
                    </p>

                    <!-- FEATURE 1 -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;background:rgba(0,198,255,0.05);border:1px solid rgba(0,198,255,0.15);border-radius:14px;">
                      <tr>
                        <td style="padding:18px 22px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding-right:16px;font-size:28px;vertical-align:middle;">&#129302;</td>
                              <td style="vertical-align:middle;">
                                <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">AI Health Oracle</p>
                                <p style="margin:0;font-size:12px;color:#64748b;">Chat with your personal AI health advisor 24/7.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- FEATURE 2 -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;background:rgba(106,0,244,0.07);border:1px solid rgba(106,0,244,0.2);border-radius:14px;">
                      <tr>
                        <td style="padding:18px 22px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding-right:16px;font-size:28px;vertical-align:middle;">&#128202;</td>
                              <td style="vertical-align:middle;">
                                <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">Vital Sync &amp; Tracking</p>
                                <p style="margin:0;font-size:12px;color:#64748b;">Log vitals, BMI, and health milestones effortlessly.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- FEATURE 3 -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;background:rgba(255,0,128,0.05);border:1px solid rgba(255,0,128,0.15);border-radius:14px;">
                      <tr>
                        <td style="padding:18px 22px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding-right:16px;font-size:28px;vertical-align:middle;">&#128138;</td>
                              <td style="vertical-align:middle;">
                                <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">Medication Manager</p>
                                <p style="margin:0;font-size:12px;color:#64748b;">Never miss a dose with smart medication reminders.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA BUTTON -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:40px;">
                      <tr>
                        <td align="center">
                          <a href="http://localhost:3000" style="display:inline-block;background:linear-gradient(135deg,#00c6ff 0%,#6a00f4 100%);color:#ffffff;text-decoration:none;padding:16px 48px;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.5px;">
                            &#128640;&nbsp; Open My Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- DIVIDER -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:30px;">
                      <tr><td style="height:1px;background:rgba(0,198,255,0.15);"></td></tr>
                    </table>

                    <!-- ACCOUNT INFO STRIP -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.02);border-radius:12px;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:2px;">Account Details</p>
                          <p style="margin:0;font-size:13px;color:#64748b;">Email: <strong style="color:#94a3b8;">${userEmail}</strong></p>
                          <p style="margin:4px 0 0;font-size:12px;color:#475569;">If you did not create this account, please ignore this email.</p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:28px 0 0;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#1e3a5f;font-weight:700;text-transform:uppercase;letter-spacing:3px;">AuraMed &copy; ${year}</p>
              <p style="margin:0;font-size:11px;color:#1e3a5f;">AI-Powered Health Intelligence &nbsp;|&nbsp; Next-Gen Care, Starts Here.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[AuraMed Mailer] ✅ Welcome mail sent to ${userEmail} | ID: ${info.messageId}`);
        return true;
    } catch (err) {
        console.error(`[AuraMed Mailer] ❌ Mail failed for ${userEmail}:`, err.message);
        return false;
    }
};

module.exports = { sendWelcomeEmail };
