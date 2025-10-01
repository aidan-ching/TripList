'use server';

import client from "@/lib/db";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

interface PackingList {
  _id: ObjectId;
  itemList: { label: string; checked: boolean }[];
  context: string;
  userId: ObjectId;
  location: string;
}

export async function addItemToList(planId: string, newItem: string) {
  try {
    const c = await client;
    const db = c.db(process.env.MONGODB_DB);
    
    const result = await db
      .collection<PackingList>("packing-lists")
      .updateOne(
        { _id: new ObjectId(planId) },
        { 
          $push: { 
            itemList: {
              label: newItem,
              checked: false
            }
          }
        }
      );

    if (result.matchedCount === 0) {
      throw new Error("Packing list not found");
    }

    revalidatePath(`/plan/${planId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding item to list:", error);
    throw new Error("Failed to add item to list");
  }
}
