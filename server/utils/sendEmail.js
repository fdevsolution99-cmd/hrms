import nodemailer from "nodemailer";

/**
 * Send an email using Nodemailer
 * Works in both development and production (Render/Vercel)
 * 
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email content in HTML
 * @param {Array} attachments - Optional attachments array
 * @returns {Promise<object|null>} - Result of the send operation
 */
const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpPort = process.env.SMTP_PORT?.trim();
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim().replace(/\s+/g, ""); // Clean app password

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn("⚠️ Missing SMTP configuration. Email will not be sent.");
      return null;
    }

    if (!to || !to.includes("@")) {
      console.warn(`⚠️ Invalid recipient email: ${to}. Skipping.`);
      return null;
    }

    console.log(`📧 Preparing to send email to: ${to}`);

    // Configuration for nodemailer
    let transporterConfig;

    // Use Gmail service preset if host is smtp.gmail.com for better reliability on Render/Vercel
    if (smtpHost === "smtp.gmail.com") {
      transporterConfig = {
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      };
      console.log("📧 Using Gmail service configuration.");
    } else {
      // Generic SMTP configuration
      transporterConfig = {
        host: smtpHost,
        port: parseInt(smtpPort) || 587,
        secure: smtpPort === "465", // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false, // Recommended for some shared hosting/VPS
        },
      };
      console.log(`📧 Using generic SMTP configuration (${smtpHost}:${smtpPort}).`);
    }

    const transporter = nodemailer.createTransport(transporterConfig);

    // Verify connection (optional but helpful for debugging production issues)
    try {
      await transporter.verify();
      console.log("✅ SMTP connection verified.");
    } catch (verifyError) {
      console.error("❌ SMTP Verification failed:", verifyError.message);
      // We'll still try to send, as verify can sometimes fail even if send works
    }

    const mailOptions = {
      from: `"FDEV SOLUTIONS PVT LTD" <${smtpUser}>`,
      to,
      subject,
      html,
    };

    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
      console.log(`📧 Attaching ${attachments.length} file(s).`);
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Nodemailer error:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    return null;
  }
};

export default sendEmail;

