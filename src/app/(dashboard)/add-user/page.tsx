"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { createInvitation } from "./actions";
import { useUser } from "@stackframe/stack";

export default function AddUserPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [state, formAction, pending] = useActionState(createInvitation, {
    error: "",
  });

  const user = useUser();

  useEffect(() => {
    async function checkAdmin() {
      const teams = await user?.listTeams();
      if (teams?.find((team) => team.displayName === "sales")) {
        setIsAdmin(true);
      }
      setLoading(false);
    }
    checkAdmin();
  }, [user, user?.selectedTeam]);

  if (loading) return <p>Loading...</p>;

  if (!isAdmin) return <p>Access Denied: Admins Only</p>;

  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Generate User Invitation
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the user&apos;s email to generate an authentication
            invitation.
          </p>
        </div>
        <form action={formAction}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              Generate Invitation
            </Button>

            {state?.error && <p className="text-red-600">{state.error}</p>}
            {state?.inviteUrl && (
              <div>
                Send this to the client and smile a bit:
                <p className="text-green-600">
                  {window.location.origin + state.inviteUrl}
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
