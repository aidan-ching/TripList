import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Luggage } from "lucide-react";
import { ObjectId } from "mongodb";
import client from "@/lib/db";

interface PackingList {
  _id: ObjectId;
  location: string;
  context: string;
  itemList: { label: string; checked: boolean }[];
}

async function getUserLists(userId: string) {
  try {
    const c = await client;
    const db = c.db(process.env.MONGODB_DB);
    
    const lists = await db
      .collection<PackingList>("packing-lists")
      .find({
        userId: new ObjectId(userId)
      })
      .sort({ createdAt: -1 })
      .toArray();

    return lists;
  } catch (error) {
    console.error("Error fetching user lists:", error);
    throw new Error("Failed to load packing lists");
  }
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const lists = await getUserLists(session.user.id);

// const lists = []

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="p-8">
          <div className="flex items-start space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={session.user.image ?? ""} />
              <AvatarFallback className="text-2xl">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{session.user.name}</h1>
                <p className="text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Packing Lists</h2>
            <Button asChild>
              <Link href="/plan">Create New List</Link>
            </Button>
          </div>

          {lists.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <Luggage className="w-12 h-12 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">No packing lists yet</h3>
                  <p className="text-muted-foreground">Create your first packing list to get started!</p>
                </div>
                <Button asChild>
                  <Link href="/plan">Create Your First List</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {lists.map((list) => (
                <Link key={list._id.toString()} href={`/plan/${list._id.toString()}`}>
                  <Card className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Trip to {list.location}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{list.context}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{list.itemList.filter(item => item.checked).length} of {list.itemList.length} items packed</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
