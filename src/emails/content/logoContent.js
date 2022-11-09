import { logoMain, websiteAddress } from '../../assets/index.js';

const logoContent = `
    <div class="header" style="margin-bottom: 24px; margin-top: 24px; width: 100%">
        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; min-width: 100%" width="100%">
            <tr>
                <td class="align-center" style="font-family: Helvetica, sans-serif; font-size: 14px; vertical-align: top; text-align: center" valign="top" align="center">
                    <a href="${websiteAddress}" target="_blank" style="color: #3498db; text-decoration: underline"><img src="${logoMain}" width="200" height="40" alt="Logo" align="center" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%" /></a>
                </td>
            </tr>
        </table>
    </div>           
`;

export default logoContent;
