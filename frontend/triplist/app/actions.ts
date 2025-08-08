'use server';

import { ObjectId } from "mongodb";
import client from "@/lib/db";

export async function updatePackingList(planId: string, itemList: { label: string; checked: boolean }[]) {
  try {
    const c = await client;
    const db = c.db(process.env.MONGODB_DB);

    const result = await db
      .collection("packing-lists")
      .updateOne(
        { _id: new ObjectId(planId) },
        { $set: { itemList } }
      );

    if (result.matchedCount === 0) {
      throw new Error("Packing list not found");
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating packing list:", error);
    throw new Error("Failed to update packing list");
  }
}
