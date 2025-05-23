import { NextResponse } from "next/server";
import { dbConnect } from '../../../../../lib/mongodb'
import Product from '../../../../../model/products'

//Method: GET
//http://localhost:3000/api/product/hot
export async function GET() {
  try {
    await dbConnect();

    const hotProducts = await Product.find({ product_hot: { $ne: 0 } });

    return NextResponse.json(hotProducts);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm hot:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
