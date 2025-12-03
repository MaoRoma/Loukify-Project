import { Header } from "@/components/admin/dashboard/Header";
import { Sidebar } from "@/components/admin/dashboard/SideBar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute requiredRole="admin">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-60 mt-14 overflow-y-auto">
          <div className="max-w-8xl mx-auto p-6 space-y-6">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
