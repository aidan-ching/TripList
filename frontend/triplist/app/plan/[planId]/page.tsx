import { ObjectId } from "mongodb";
import { CheckList } from "@/components/PackingList/CheckList";
import { ShareButton } from "@/components/ShareButton";
import client from "@/lib/db";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

async function addItemToList(planId: string, newItem: string) {
  'use server';
  
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

interface PackingList {
  _id: ObjectId;
  itemList: { label: string; checked: boolean }[];
  context: string;
  userId: ObjectId;
  location: string;
}

async function getPackingList(planId: string): Promise<PackingList> {
  try {
    const c = await client;
    const db = c.db(process.env.MONGODB_DB);
    
    const packingList = await db
      .collection<PackingList>("packing-lists")
      .findOne({
        _id: new ObjectId(planId),
      });

    if (!packingList) {
      notFound();
    }

    return packingList;
  } catch (error) {
    console.error("Error fetching packing list:", error);
    throw new Error("Failed to load packing list");
  }
}

export default async function PlanId({params}: {params: Promise<{ planId: string }>}) {
  const { planId } = await params;
  const packingList = await getPackingList(planId);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="relative">
          <div className="absolute right-0 top-2">
            <ShareButton />
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Your trip to {packingList.location}</h1>
            <p className="text-muted-foreground">{packingList.context}</p>
          </div>
        </div>

        <CheckList planId={planId} initialItems={packingList.itemList} />
      </div>
    </div>
  );
}
