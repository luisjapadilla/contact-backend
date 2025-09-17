const express = require("express");
const EmailService = require("../services/emailService");

const router = express.Router();

router.post("/send", async (req, res) => {
  const { email, phone, apiKey, customerName, productName, renewalDate } =
    req.body;

  if (!email || !phone || !apiKey) {
    return res
      .status(400)
      .json({ error: "Email, phone, and apiKey are required" });
  }

  const verifyUrl = `${
    process.env.CLIENT_URL
  }/verify?phone=${encodeURIComponent(phone)}&apiKey=${encodeURIComponent(
    apiKey
  )}`;

  const subject = "🔔 Renewal Assistance Invitation";

  const htmlMessage = `
    <p>Hi <strong>${customerName || "Customer"}</strong>,</p>
    <p>
      Your subscription for <strong>${productName || "your product(s)"}</strong>
      is approaching renewal on <strong>${
        renewalDate || "the upcoming date"
      }</strong>.
      I’d love to walk through your options to ensure your plan continues
      to support your goals.
    </p>
    <p>
      Please use the link below to access the Renewal UI and schedule
      an assisted walkthrough of renewal options via scheduled call or chat:
    </p>
    <p>
      <a href="${verifyUrl}" style="display:inline-block;
        padding:10px 20px;
        background:#4F46E5;
        color:#fff;
        border-radius:8px;
        text-decoration:none;">
        👉 Confirm & Schedule
      </a>
    </p>
    <p>
      If you are no longer the correct contact managing this renewal,
      you can simply reply to this email.
    </p>
    <p>Best regards,<br/>Your Renewals Team</p>
  `;

  try {
    await EmailService.sendEmail(email, subject, htmlMessage);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
