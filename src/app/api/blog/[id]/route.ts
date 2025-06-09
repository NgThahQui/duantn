import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/mongodb";
import Blog from "../../../../../model/blogs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split("/");
    const id = parts[parts.length - 1];

    await dbConnect();

    const blog = await Blog.findById(id).select(
      "title subcontent content image id_user created_at updated_at isHidden"
    );

    if (!blog || blog.isHidden) {
      return NextResponse.json(
        { error: "Bài viết không tồn tại hoặc đã bị ẩn" },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split("/");
    const id = parts[parts.length - 1];

    await dbConnect();

    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { error: "Không tìm thấy bài viết" },
        { status: 404 }
      );
    }

    // PATCH ở đây chỉ sửa nội dung nếu muốn, hoặc để trống nếu không dùng
    return NextResponse.json({ message: "PATCH chưa được cài đặt" });
  } catch (err) {
    console.error("Lỗi server:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
