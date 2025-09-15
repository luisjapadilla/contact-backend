const sgMail = require("@sendgrid/mail");

// Load API key from environment
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  static async sendEmail(to, subject, html) {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM, // must be verified in SendGrid
      subject,
      html,
    };

    try {
      const response = await sgMail.send(msg);
      console.log("✅ Email sent:", response[0].statusCode);
      return true;
    } catch (error) {
      console.error("❌ Error sending email:", error);
      if (error.response) {
        console.error(error.response.body);
      }
      throw error;
    }
  }
}

module.exports = EmailService;