import { Button } from "../ui/button";
import { ModeToggle } from "../ui/theme-toggle";
import { Luggage, KeyRound } from "lucide-react";
import Link from "next/link";
import { signIn, signOut } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { auth } from "@/auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function Header() {
  const session = await auth();

  console.log("Session:", session);

  return (
    <div className="flex flex-row justify-between items-center m-6 mb-28">
      <Link
        href="/"
        className="text-2xl font-bold flex flex-row items-center gap-2"
      >
        <Luggage />
        TripList
      </Link>
      <div className="flex flex-row items-center gap-4">
        <ModeToggle />
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={session?.user.image ? session?.user.image : ""}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button type="submit">Sign Out</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn();
            }}
          >
            <Button type="submit">
              Login <KeyRound />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
