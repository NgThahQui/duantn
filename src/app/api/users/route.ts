import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongodb";
import User from "../../../../model/users";

//Method: GET
//http://localhost:3000/api/users
export async function GET() {
  try {
    await dbConnect();

    // Lấy tất cả user, trừ password
    const users = await User.find({}, { password: 0 });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
