import { ObjectId } from "mongodb";
import client from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { planId: string } }
) {
  try {
    const c = await client;
    const db = c.db(process.env.MONGODB_DB);
    const data = await db
      .collection("packing-lists")
      .find({
        _id: new ObjectId(context.params.planId),
      })
      .toArray();
    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
