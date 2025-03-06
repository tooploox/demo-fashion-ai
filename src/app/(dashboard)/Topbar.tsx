"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useUser } from "@stackframe/stack";
import Link from "next/link";

export function Topbar() {
  const user = useUser();

  return (
    <header className="sticky top-0 flex h-16 w-full shrink-0 items-center gap-2 border-b bg-background px-4">
      <Link href="/">
        <Logo />
      </Link>
      <div className="ml-auto flex items-center gap-4">
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
