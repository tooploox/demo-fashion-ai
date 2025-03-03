import { Button } from "@/components/ui/button";
import { Sparkle } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <header className="sticky top-0 flex h-16 w-full shrink-0 items-center gap-2 border-b bg-background px-4">
        <Link href="/">
          <h1 className="font-semibold">Fashion AI</h1>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <p className="text-sm font-medium">Tokens: 40</p>
          <Button variant="outline">Logout</Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[960px] p-4">{children}</main>
    </div>
  );
}
