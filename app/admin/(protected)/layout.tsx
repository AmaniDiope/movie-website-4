import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const adminId = (await cookies()).get("admin_id")?.value;
  if (!adminId) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNav />
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}
