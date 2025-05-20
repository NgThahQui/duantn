import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from '../../../../../lib/mongodb'
import Variant from '../../../../../model/variants'

//Method: GET
//http://localhost:3000/api/product/id san pham muon show
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  const product = await Product.findById(id).populate("id_category");

  return product
    ? NextResponse.json(product)
    : NextResponse.json({ message: "Không tìm thấy sản phẩm" }, { status: 404 });
}

//Method: PUT
//http://localhost:3000/api/product/id san pham muon sua
//sua cai nao thi truyen cai do vao con lai du nguyen
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  const updateData = await request.json();

  const existingProduct = await Product.findById(id);
  if (!existingProduct) {
    return NextResponse.json({ message: "Không tìm thấy sản phẩm để cập nhật" }, { status: 404 });
  }

 
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { ...existingProduct.toObject(), ...updateData },
    { new: true }
  );

  return NextResponse.json(updatedProduct);
}
