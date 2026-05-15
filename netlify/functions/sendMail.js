const nodemailer = require("nodemailer");

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
};

function jsonResponse(statusCode, body) {
    return {
        statusCode,
        headers,
        body: JSON.stringify(body),
    };
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers,
            body: "",
        };
    }

    if (event.httpMethod !== "POST") {
        return jsonResponse(405, { error: "Method Not Allowed" });
    }

    try {
        const { name, email, phone, destination, travelDate, travellers, tourType, budget, message } = JSON.parse(event.body);
        const mailUser = process.env.GMAIL_USER || "travelonwings06@gmail.com";
        const mailPass = process.env.GMAIL_APP_PASSWORD || "uwkx jwrz yvsv ipwo";

        if (!email || !phone) {
            return jsonResponse(400, { error: "Email and phone are required." });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "travelonwings06@gmail.com",
                pass: "zrlh itth qrfh fuua",
            },
        });

        await transporter.sendMail({
            from: "travelonwings06@gmail.com",
            to: "travelonwings06@gmail.com",
            replyTo: email,
            subject: `New Enquiry from ${name || "Website"}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #0d1b2a;">New Enquiry Details</h2>
            <table cellpadding="10" style="border-collapse: collapse; width: 100%;">
                <tr><td style="border-bottom: 1px solid #eee; width: 35%;"><b>Name:</b></td><td style="border-bottom: 1px solid #eee;">${escapeHtml(name) || "N/A"}</td></tr>
                <tr><td style="border-bottom: 1px solid #eee;"><b>Email:</b></td><td style="border-bottom: 1px solid #eee;">${escapeHtml(email) || "N/A"}</td></tr>
                ${phone ? `<tr><td style="border-bottom: 1px solid #eee;"><b>Phone:</b></td><td style="border-bottom: 1px solid #eee;">${escapeHtml(phone)}</td></tr>` : ""}
                ${destination ? `<tr><td style="border-bottom: 1px solid #eee;"><b>Destination:</b></td><td style="border-bottom: 1px solid #eee;">${escapeHtml(destination)}</td></tr>` : ""}
                ${travelDate ? `<tr><td style="border-bottom: 1px solid #eee;"><b>Travel Date:</b></td><td style="border-bottom: 1px solid #eee;">${escapeHtml(travelDate)}</td></tr>` : ""}
                ${travellers ? `<tr><td style="border-bottom: 1px solid #eee;"><b>Travellers:</b></td><td style="border-bottom: 1px solid #eee;">${escapeHtml(travellers)}</td></tr>` : ""}
                ${tourType ? `<tr><td style="border-bottom: 1px solid #eee;"><b>Tour Type:</b></td><td style="border-bottom: 1px solid #eee;">${escapeHtml(tourType)}</td></tr>` : ""}
                ${budget ? `<tr><td style="border-bottom: 1px solid #eee;"><b>Budget:</b></td><td style="border-bottom: 1px solid #eee;">${escapeHtml(budget)}</td></tr>` : ""}
                <tr><td colspan="2" style="padding-top: 15px;"><b>Message / Additional Requirements:</b><br/><br/>${message ? escapeHtml(message).replace(/\n/g, '<br/>') : "N/A"}</td></tr>
            </table>
        </div>
      `,
        });

        return jsonResponse(200, { message: "Email sent successfully." });

    } catch (error) {
        console.error("sendMail failed:", error);
        return jsonResponse(500, { error: "Email failed. Please try again." });
    }
};
