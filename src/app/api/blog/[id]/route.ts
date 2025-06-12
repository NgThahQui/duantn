import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/mongodb";
import Blog from "../../../../../model/blogs";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

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
    await dbConnect();

    const url = new URL(request.url);
    const parts = url.pathname.split("/");
    const id = parts[parts.length - 1];

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const contentType = request.headers.get("content-type") || "";
    const contentLength = request.headers.get("content-length") || "0";
    const nodeReadable = Readable.fromWeb(request.body as any);

    const fakeReq = Object.assign(nodeReadable, {
      headers: {
        "content-type": contentType,
        "content-length": contentLength,
      },
    });

    const form = formidable({ uploadDir, keepExtensions: true });

    const { fields, files }: any = await new Promise((resolve, reject) => {
      form.parse(fakeReq as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    }

    blog.title = fields.title?.[0] || blog.title;
    blog.subcontent = fields.subcontent?.[0] || blog.subcontent;
    blog.content = fields.content?.[0] || blog.content;
    blog.id_user = fields.id_user?.[0] || blog.id_user;

    // Nếu có ảnh mới
    if (files.image) {
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
      blog.image = "/uploads/" + path.basename(imageFile.filepath);
    }

    await blog.save();

    return NextResponse.json({ message: "Cập nhật bài viết thành công", blog });
  } catch (err) {
    console.error("Lỗi server khi cập nhật bài viết:", err);
    return NextResponse.json({ error: "Lỗi server khi cập nhật bài viết" }, { status: 500 });
  }
}
