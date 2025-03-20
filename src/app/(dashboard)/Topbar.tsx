"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useUser } from "@stackframe/stack";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Topbar() {
  const user = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const teams = await user?.listTeams();
      if (teams?.find((team) => team.displayName === "sales")) {
        setIsAdmin(true);
      }
    }
    checkAdmin();
  }, [user, user?.selectedTeam]);
  return (
    <header className="sticky top-0 flex h-16 w-full shrink-0 items-center gap-2 border-b bg-background px-4">
      <Link href="/">
        <Logo />
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {isAdmin && <Link href="/add-user">Add user</Link>}
        <p className="text-sm font-medium">
          Tokens: {user?.clientReadOnlyMetadata?.tokens}
        </p>
        <Button variant="outline" onClick={() => user?.signOut()}>
          Logout
        </Button>
      </div>
    </header>
  );
}
