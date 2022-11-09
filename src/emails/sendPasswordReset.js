import sgMail from '@sendgrid/mail';
import passwordResetStyle from './content/passwordResetStyle.js';
import logoContent from './content/logoContent.js';
import footerContent from './content/footerContent.js';
import { orgName, custServiceEmail } from '../assets/index.js';

sgMail.setApiKey(`SG.${process.env.SENDGRID_API_KEY}`);

const sendPasswordReset = async ({ email, url }) => {
    const msg = {
        to: email,
        from: custServiceEmail,
        subject: `Your ${orgName} Password Reset Token - Valid for 30 Minutes`,
        html: `
        <!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${orgName} Password Reset</title>
        ${passwordResetStyle}
    </head>
    <body style="font-family: Helvetica, sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f6f6f6; margin: 0; padding: 0">
        <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6" width="100%" bgcolor="#f6f6f6">
            <tr>
                <td style="font-family: Helvetica, sans-serif; font-size: 14px; vertical-align: top" valign="top">&nbsp;</td>
                <td class="container" style="font-family: Helvetica, sans-serif; font-size: 14px; vertical-align: top; margin: 0 auto !important; max-width: 600px; padding: 0; padding-top: 24px; width: 600px" width="600" valign="top">
                    <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 0">
                        <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0">Your Ice Realty Group password reset request.</span>
                        <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #fff; border-radius: 4px" width="100%">
                            <tr>
                                <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 24px" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%" width="100%">
                                        <tr>
                                            <td style="font-family: Helvetica, sans-serif; font-size: 14px; vertical-align: top" valign="top">
                                                <div class="header" style="margin-bottom: 24px; margin-top: 0; width: 100%; background-color: #fff">
                                                    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; min-width: 100%" width="100%">
                                                        ${logoContent}
                                                    </table>
                                                </div>
                                                <h1 style="color: #222222; font-family: Helvetica, sans-serif; font-weight: 300; line-height: 1.4; margin: 0; font-size: 36px; margin-bottom: 24px; text-align: center; text-transform: capitalize">Password reset</h1>
                                                <p style="font-family: Helvetica, sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 16px">Seems like you forgot your password for Ice Realty Group. If this is true, click below to reset your password.</p>
                                                <br />
                                                <p style="font-family: Helvetica, sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 16px">This link is only active for 30 minutes after your reset request.</p>
                                                <br />
                                                <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box; min-width: 100% !important" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td align="center" style="font-family: Helvetica, sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 16px" valign="top">
                                                                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style="font-family: Helvetica, sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 4px; text-align: center" valign="top" bgcolor="#3498db" align="center">
                                                                                <a href="${url}" target="_blank" style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 2px #3498db; border-radius: 4px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 24px; text-transform: capitalize; border-color: #3498db">Reset my password</a>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <br />
                                                <p style="font-family: Helvetica, sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 16px">If you did not forgot your password you can safely ignore this email.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        ${footerContent}
                    </div>
                </td>
                <td style="font-family: Helvetica, sans-serif; font-size: 14px; vertical-align: top" valign="top">&nbsp;</td>
            </tr>
        </table>
    </body>
</html>
        `,
    };

    sgMail.send(msg);
};

export default sendPasswordReset;
