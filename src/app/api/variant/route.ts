import { NextResponse } from "next/server";
import { dbConnect } from '../../../../lib/mongodb'
import Variant from '../../../../model/variants'

//Method: GET
//http://localhost:3000/api/variant
export async function GET() {
  await dbConnect();
  return NextResponse.json(await Variant.find());
}

//Method: POST
//http://localhost:3000/api/variant
export async function POST(req: Request) {
    await dbConnect();
    return NextResponse.json(await Variant.create(await req.json()), { status: 201 });
  }
  