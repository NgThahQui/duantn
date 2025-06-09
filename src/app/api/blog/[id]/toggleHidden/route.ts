import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/mongodb";
import Blog from "../../../../../../model/blogs";

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split("/");
    const id = parts[parts.length - 2]; // phần [id] trong path /api/blog/[id]/toggleHidden

    await dbConnect();

    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { error: "Không tìm thấy bài viết" },
        { status: 404 }
      );
    }

    blog.isHidden = !blog.isHidden;
    await blog.save();

    return NextResponse.json({
      message: blog.isHidden ? "Đã ẩn bài viết" : "Đã hiện bài viết",
      post: blog,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái ẩn/hiện:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
