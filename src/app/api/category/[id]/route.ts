import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from '../../../../../lib/mongodb'
import Category from '../../../../../model/categories'

//Method: GET
//http://localhost:3000/api/category/id danh muc muon show
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  const category = await Category.findById(id); 

  return category
    ? NextResponse.json(category)
    : NextResponse.json({ message: "Không tìm thấy danh mục" }, { status: 404 });
}

//Method: PUT
//http://localhost:3000/api/category/id danh muc muon sua
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  const data = await request.json();
  
  const category = await Category.findByIdAndUpdate(id, data, { new: true });

  return category
    ? NextResponse.json(category)
    : NextResponse.json({ message: "Không tìm thấy danh mục" }, { status: 404 });
}

  