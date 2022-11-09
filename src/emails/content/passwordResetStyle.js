const passwordResetStyle = `
<style media="all" type="text/css">
            @media only screen and (max-width: 640px) {
                .span-2,
                .span-3 {
                    float: none !important;
                    max-width: none !important;
                    width: 100% !important;
                }
                .span-2 > table,
                .span-3 > table {
                    max-width: 100% !important;
                    width: 100% !important;
                }
            }

            @media all {
                .btn-primary table td:hover {
                    background-color: #34495e !important;
                }
                .btn-primary a:hover {
                    background-color: #34495e !important;
                    border-color: #34495e !important;
                }
            }

            @media all {
                .btn-secondary a:hover {
                    border-color: #34495e !important;
                    color: #34495e !important;
                }
            }

            @media only screen and (max-width: 640px) {
                h1 {
                    font-size: 36px !important;
                    margin-bottom: 16px !important;
                }
                h2 {
                    font-size: 28px !important;
                    margin-bottom: 8px !important;
                }
                h3 {
                    font-size: 22px !important;
                    margin-bottom: 8px !important;
                }
                .main p,
                .main ul,
                .main ol,
                .main td,
                .main span {
                    font-size: 16px !important;
                }
                .wrapper {
                    padding: 8px !important;
                }
                .article {
                    padding-left: 8px !important;
                    padding-right: 8px !important;
                }
                .content {
                    padding: 0 !important;
                }
                .container {
                    padding: 0 !important;
                    padding-top: 8px !important;
                    width: 100% !important;
                }
                .header {
                    margin-bottom: 8px !important;
                    margin-top: 0 !important;
                }
                .main {
                    border-left-width: 0 !important;
                    border-radius: 0 !important;
                    border-right-width: 0 !important;
                }
                .btn table {
                    max-width: 100% !important;
                    width: 100% !important;
                }
                .btn a {
                    font-size: 16px !important;
                    max-width: 100% !important;
                    width: 100% !important;
                }
                .img-responsive {
                    height: auto !important;
                    max-width: 100% !important;
                    width: auto !important;
                }
                .alert td {
                    border-radius: 0 !important;
                    font-size: 16px !important;
                    padding-bottom: 16px !important;
                    padding-left: 8px !important;
                    padding-right: 8px !important;
                    padding-top: 16px !important;
                }
                .receipt,
                .receipt-container {
                    width: 100% !important;
                }
                .hr tr:first-of-type td,
                .hr tr:last-of-type td {
                    height: 16px !important;
                    line-height: 16px !important;
                }
            }

            @media all {
                .ExternalClass {
                    width: 100%;
                }
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
                    line-height: 100%;
                }
                .apple-link a {
                    color: inherit !important;
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                    text-decoration: none !important;
                }
                #MessageViewBody a {
                    color: inherit;
                    text-decoration: none;
                    font-size: inherit;
                    font-family: inherit;
                    font-weight: inherit;
                    line-height: inherit;
                }
            }
        </style>
`;

export default passwordResetStyle;
