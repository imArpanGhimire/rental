const nodemailer = require("nodemailer");

const smtpPort =
    Number(process.env.SMTP_PORT) || 465;

const secure =
    String(
        process.env.SMTP_SECURE ?? "true"
    ).toLowerCase() === "true";

const transporter =
    nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure,

        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

module.exports = transporter;