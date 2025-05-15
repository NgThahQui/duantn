import { NextResponse } from "next/server";
import { dbConnect } from '../../../../lib/mongodb'
import Category from '../../../../model/categories'

//Method: GET
//http://localhost:3000/api/category
export async function GET() {
  await dbConnect();
  return NextResponse.json(await Category.find());
}

//Method: POST
//http://localhost:3000/api/category
// {
//     "name" : "ten danh muc"
// }
export async function POST(req: Request) {
    await dbConnect();
    return NextResponse.json(await Category.create(await req.json()), { status: 201 });
  }
  