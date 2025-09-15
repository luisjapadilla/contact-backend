// server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

// --- CONFIG ---
const PORT = process.env.PORT || 3000;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM = process.env.SENDGRID_FROM || "no-reply@example.com";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:4200"; 
console.log("API Key:", process.env.SENDGRID_API_KEY?.slice(0,10)); 


sgMail.setApiKey(SENDGRID_API_KEY);

// --- APP INIT ---
const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- ROUTES ---
app.post("/api/email/send", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Build the link dynamically (frontend will handle it)
  const link = `${CLIENT_URL}/confirm?email=${encodeURIComponent(email)}`;

  const msg = {
    to: email,
    from: SENDGRID_FROM,
    subject: "Here’s your confirmation link 🚀",
    html: `<p>Click the link below to confirm:</p>
           <p><a href="${link}">${link}</a></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Email sent to", email);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    if (err.response) console.error(err.response.body);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});