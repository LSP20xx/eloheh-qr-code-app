import { NextResponse } from "next/server";
import emailjs from "emailjs-com";

export async function POST(request: Request) {
  const { email, code } = await request.json();

  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      { to_email: email, code },
      process.env.EMAILJS_USER_ID!
    );
    return NextResponse.json({ message: "Email sent successfully", response });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to send email", error },
      { status: 500 }
    );
  }
}
