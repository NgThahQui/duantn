import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongodb";
import User from "../../../../model/users";
import { twilio } from "../../../../lib/twilio";
//Method: POST
//http://localhost:3000/api/send-otp
export async function POST(req: Request) {
  await dbConnect();

  const { phone } = await req.json();
  if (!phone) return NextResponse.json({ error: "Thiếu số điện thoại" }, { status: 400 });

  const formattedPhone = phone.startsWith("+") ? phone : `+84${phone.slice(1)}`;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

  try {
    await twilio.messages.create({
      body: `Mã xác thực OTP của bạn là: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: formattedPhone
    });

    let user = await User.findOne({ phone: formattedPhone });
    if (!user) user = new User({ phone: formattedPhone });

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.otpVerified = false;
    await user.save();

    return NextResponse.json({ message: "Gửi OTP thành công" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Không gửi được OTP" }, { status: 500 });
  }
  
}
