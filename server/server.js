require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { Resend } = require("resend");

const app = express();
const PORT = 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

const emergencyOtps = new Map();

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

app.post("/send-emergency-otp", async (req, res) => {
  try {
    const { patientEmail, emergencyContactEmail } = req.body;

    if (!patientEmail || !emergencyContactEmail) {
      return res.status(400).json({
        success: false,
        message: "Patient and emergency contact emails are required."
      });
    }

    const otp = generateOtp();

    emergencyOtps.set(patientEmail, {
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000
    });

    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#b91c1c;">MediTag Emergency Services</h2>

        <p>An emergency access request has been initiated through the MediTag system.</p>

        <p>Your emergency verification code is:</p>

        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;margin:25px 0;">
          ${otp}
        </div>

        <p>This code is valid for <strong>15 minutes</strong>.</p>

        <p>
          Do not share this code unless you are authorizing emergency access.
        </p>

        <hr>

        <p>
          <strong>MediTag Emergency Care</strong><br>
          Digital Emergency Health Record System
        </p>

        <p style="font-size:12px;color:#777;">
          This is an automated email from the MediTag system.
        </p>
      </div>
    `;

    await resend.emails.send({
      from: "MediTag Emergency Services <onboarding@resend.dev>",
      to: patientEmail,
      subject: "🚨 MediTag Emergency Verification Code",
      html: emailHtml
    });

    await resend.emails.send({
      from: "MediTag Emergency Services <onboarding@resend.dev>",
      to: emergencyContactEmail,
      subject: "🚨 MediTag Emergency Alert",
      html: emailHtml
    });

    console.log("Emergency OTP sent successfully.");

    res.json({
      success: true,
      message: "Emergency OTP sent successfully."
    });

  } catch (error) {
    console.error("Email error:", error);

    res.status(500).json({
      success: false,
      message: "Could not send emergency email."
    });
  }
});

app.post("/verify-emergency-otp", (req, res) => {
  const { patientEmail, otp } = req.body;

  const record = emergencyOtps.get(patientEmail);

  if (!record) {
    return res.status(400).json({
      success: false,
      message: "No active OTP found."
    });
  }

  if (Date.now() > record.expiresAt) {
    emergencyOtps.delete(patientEmail);

    return res.status(400).json({
      success: false,
      message: "OTP has expired."
    });
  }

  if (record.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP."
    });
  }

  emergencyOtps.delete(patientEmail);

  res.json({
    success: true,
    message: "Emergency access verified."
  });
});

app.listen(PORT, () => {
  console.log(`MediTag OTP server running at http://localhost:${PORT}`);
});