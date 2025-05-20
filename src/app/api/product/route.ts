import { NextResponse } from "next/server";
import { dbConnect } from '../../../../lib/mongodb'
import Product from '../../../../model/products'

//Method: GET
//http://localhost:3000/api/product
export async function GET() {
  await dbConnect();
  return NextResponse.json(await Product.find());
}

//Method: POST
//http://localhost:3000/api/product
export async function POST(req: Request) {
    await dbConnect();
    return NextResponse.json(await Product.create(await req.json()), { status: 201 });
  }
  