import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/mongodb';
import Blog from '../../../../model/blogs'
import "../../../../model/users"; 
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

// Tắt bodyParser mặc định
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    await dbConnect();

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const contentType = req.headers.get('content-type') || '';
    const contentLength = req.headers.get('content-length') || '0';
    const nodeReadable = Readable.fromWeb(req.body as any);

    const fakeReq = Object.assign(nodeReadable, {
      headers: {
        'content-type': contentType,
        'content-length': contentLength,
      },
    });

    const form = formidable({ uploadDir, keepExtensions: true });

    const { fields, files }: any = await new Promise((resolve, reject) => {
      form.parse(fakeReq as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const newPost = await Blog.create({
      title: fields.title?.[0] || '',
      subcontent: fields.subcontent?.[0] || '',
      content: fields.content?.[0] || '',
      image: '/uploads/' + path.basename(files.image?.[0]?.filepath || ''),
      id_user: fields.id_user?.[0] || '',
    });

    return NextResponse.json({ message: 'Đăng bài thành công', post: newPost });
  } catch (err) {
    console.error('Lỗi:', err);
    return NextResponse.json({ error: 'Không thể đăng bài' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const posts = await Blog.find({ isHidden: false })
      .populate('id_user', 'username')
      .sort({ created_at: -1 });

    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Không thể lấy danh sách bài viết' }, { status: 500 });
  }
}


