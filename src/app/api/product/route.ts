import { NextResponse } from "next/server";
import { dbConnect } from '../../../../lib/mongodb'
import Product from '../../../../model/products'

export async function POST(req: Request) {
    await dbConnect();
    return NextResponse.json(await Product.create(await req.json()), { status: 201 });
  }
  