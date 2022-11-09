import { mainAddress, orgName } from '../../assets/index.js';

const footerContent = `
        <div class="footer" style="clear: both; padding-top: 24px; text-align: center; width: 100%">
            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%" width="100%">
                <tr>
                    <td class="content-block" style="font-family: Helvetica, sans-serif; vertical-align: top; padding-top: 0; padding-bottom: 24px; font-size: 12px; color: #999999; text-align: center" valign="top" align="center">
                        <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center">${orgName}, ${mainAddress}</span>
                        <br />
                    </td>
                </tr>
            </table>
        </div>
`;

export default footerContent;
