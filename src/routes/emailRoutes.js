// src/routes/emailRoutes.js
const express = require("express");
const EmailService = require("../services/emailService");

const router = express.Router();

// POST /api/email/send
router.post("/send", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    await EmailService.sendEmail(
      email,
      "Here’s your link 🚀",
      `<p>Click here: <a href="https://example.com/confirm?email=${email}">Confirm</a></p>`
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;