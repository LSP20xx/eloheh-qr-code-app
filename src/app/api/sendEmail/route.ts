import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, subject, message } = await request.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: subject || "Billete.io Notification",
    text: message || "This is a test email from Billete.io",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully", info });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to send email", error },
      { status: 500 }
    );
  }
}
