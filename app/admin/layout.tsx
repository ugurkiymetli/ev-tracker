import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // Allow only localhost or 127.0.0.1
  const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1");

  if (!isLocalhost) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-2 text-center text-sm font-bold animate-fade-in rounded-xl">
        ADMINISTRATION PANEL - LOCAL ONLY
      </div>
      <AdminNav />
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
}
