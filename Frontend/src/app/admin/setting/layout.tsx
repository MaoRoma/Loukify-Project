import { SettingTab } from "@/components/admin/setting/SettingTab";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SettingTab />
      <main>{children}</main>
    </>
  );
}
