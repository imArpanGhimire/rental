const {
    validationResult,
} = require("express-validator");

const usermodel =
    require("../model/user.model");

const transporter =
    require("../config/mailer");

/* =========================================================
   HELPERS
========================================================= */

function cleanHeader(value = "") {
    return String(value)
        .replace(/[\r\n]+/g, " ")
        .trim();
}

function formatIssueType(type) {
    const labels = {
        bug: "Bug",
        technical: "Technical issue",
        feedback: "Feedback",
        account: "Account issue",
        listing: "Listing issue",
        other: "Other",
    };

    return labels[type] || "Other";
}

/* =========================================================
   SEND SUPPORT REPORT
========================================================= */

async function sendSupportReport(
    req,
    res
) {
    const errors =
        validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message:
                "Please check the information you entered.",
            errors: errors.array(),
        });
    }

    try {
        if (
            !req.user ||
            !req.user.id
        ) {
            return res.status(401).json({
                message:
                    "You must be logged in to send a support report.",
            });
        }

        const user =
            await usermodel
                .findById(req.user.id)
                .select(
                    "name email phone role"
                );

        if (!user) {
            return res.status(404).json({
                message:
                    "User account not found.",
            });
        }

        const {
            issueType,
            subject,
            description,
            affectedPage,
            browserInfo,
        } = req.body;

        const issueLabel =
            formatIssueType(issueType);

        const safeSubject =
            cleanHeader(subject);

        const submittedAt =
            new Date();

        const emailText = `
RENTORA SUPPORT REPORT
======================

Issue type:
${issueLabel}

Subject:
${safeSubject}

Submitted by:
${user.name || "Unknown"}

Email:
${user.email || "Not available"}

Phone:
${user.phone || "Not provided"}

Role:
${user.role || req.user.role || "Unknown"}

Affected page / feature:
${affectedPage || "Not specified"}

Description:
--------------------------------------------------
${description}
--------------------------------------------------

Browser / device:
${browserInfo || "Not provided"}

Submitted:
${submittedAt.toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        })}

User ID:
${user._id}
`;

        await transporter.sendMail({
            from: {
                name: "Rentora Support",
                address:
                    process.env.SMTP_USER,
            },

            to:
                process.env.SUPPORT_EMAIL,

            replyTo:
                user.email,

            subject:
                `[Rentora Support] ${issueLabel} — ${safeSubject}`,

            text: emailText,
        });

        return res.status(200).json({
            success: true,
            message:
                "Your report has been sent to the Rentora support team.",
        });
    } catch (error) {
        console.error(
            "Support email error:",
            error
        );

        return res.status(500).json({
            message:
                "We couldn't send your report right now. Please try again.",
        });
    }
}

module.exports = {
    sendSupportReport,
};