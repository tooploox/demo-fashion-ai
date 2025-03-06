import { stackServerApp } from "@/stack";
import { Topbar } from "./Topbar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await stackServerApp.getUser({ or: "redirect" });

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <Topbar />
      <main className="mx-auto w-full max-w-[960px] p-4">{children}</main>
      <footer className="border-t">
        <p className="p-4 text-center text-sm text-muted-foreground">
          Need more tokens or want to learn how we can fast-forward your AI
          strategy with our GenAi for Fashion solutions? Reach out at [xxxx].
        </p>
      </footer>
    </div>
  );
}
