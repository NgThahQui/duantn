import { NextResponse } from 'next/server';
import { dbConnect } from "../../../../lib/mongodb";
import Blog from "../../../../model/blogs";
import User from "../../../../model/users";  // Import model User ở đây
//Method: POST
//http://localhost:3000/api/blog
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { title, subcontent, content, image, id_user } = await req.json();

    const newPost = await Blog.create({
      title,
      subcontent,
      content,
      image,
      id_user,
    });

    return NextResponse.json({ message: 'Đăng bài thành công', post: newPost });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Không thể đăng bài' }, { status: 500 });
  }
}

//Method: GET
//http://localhost:3000/api/blog
export async function GET() {
  try {
    await dbConnect();
    const posts = await Blog.find({ isHidden: false }) // 👈 chỉ hiện bài chưa ẩn
      .sort({ created_at: -1 });
    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Không thể lấy danh sách bài viết' }, { status: 500 });
  }
}

