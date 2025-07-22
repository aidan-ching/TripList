import client from "../../../lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { ObjectId } from "mongodb";

export const GET = auth(async function GET(req) {
  // Ensure the user is authenticated
  // if (!req.auth)
  //   return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  console.log(req.auth?.user?.id);

  try {
    const c = await client;
    const db = c.db(process.env.MONGODB_DB);
    const data = await db
      .collection("packing-lists")
      .find({ userId: new ObjectId(req.auth?.user?.id) })
      .toArray();
    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});

export const POST = auth(async function POST(req) {
  // Ensure the user is authenticated
  // if (!req.auth)
  //   return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  try {
    const { name, items } = await req.json();
    const c = await client;
    const db = c.db(process.env.MONGODB_DB);

    const itemsArray = Array.isArray(items)
      ? items.map((item: string) => ({ item, checked: false }))
      : [];


    const result = await db.collection("packing-lists").insertOne({ name, items: itemsArray });

    return NextResponse.json({
      message: "Packing list created",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});

// // POST new user
// export async function POST(req: Request) {
//   try {
//     const { name, email } = await req.json();
//     const c = await client;
//     const db = c.db(process.env.MONGODB_DB);

//     const result = await db.collection("users").insertOne({ name, email });
//     console.log("User created:", result);
//     return NextResponse.json({
//       message: "User created",
//       userId: result.insertedId,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
