import { stackServerApp } from "@/stack";
import { Topbar } from "./Topbar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await stackServerApp.getUser({ or: "redirect" });

  return (
    <div>
      <Topbar />
      <main className="mx-auto w-full max-w-[960px] p-4">{children}</main>
    </div>
  );
}
