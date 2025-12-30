import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Or your SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendCertificateEmail = async ({
  email,
  data,
  pdfBuffer,
  fileName,
}) => {
  const bodyHtml = `
        Dear ${data.name},<br/>

        <br/><b>Congratulations!</b> 🎉 We are pleased to present you with a Certificate of <b>${data.certificateType}</b> in recognition of your valuable contributions as a volunteer with FEKRA Project.
        <br/>Your dedication and commitment have made a significant impact, and we are grateful for your time and effort.<br/>

        <br/>Please find the attached your certificate. Feel free to download and print it for your records.<br/>
        
        <br/><b>Share your success:</b> Post your certificate on social media and tag us:<br/>

        <br/><b>• Instagram:</b> @fekra.project<br/>

        <br/><b>• LinkedIn:</b> @FEKRA Project<br/>

        <br/>Thank you once again for your hard work and dedication. 
        <br/>We look forward to your continued involvement with <b>FEKRA Project</b>!<br/>

        <br/>Best regards,

        <br/><b>HR Team  
        <br/>FEKRA Project</b>`;
  const mailOptions = {
    from: `"FEKRA" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Congratulations on your Certificate of ${data.certificateType}!`,
    text: bodyHtml.replace("<br/>", "").replace("</b>", "").replace("<b>"),
    html: bodyHtml,
    attachments: [
      {
        filename: fileName,
        content: pdfBuffer, // The raw buffer from Puppeteer
        contentType: "application/pdf",
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};
