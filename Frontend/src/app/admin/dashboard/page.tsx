import { PromoBanner } from "@/components/admin/dashboard/PromoBanner";
import { ProductCard } from "@/components/admin/dashboard/ProductCard";
import { ThemeCard } from "@/components/admin/dashboard/ThemeCard";
import { DomainCard } from "@/components/admin/dashboard/DomainCard";

export default function DashboardPage() {
  return (
    <>
      <PromoBanner />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductCard />
        <ThemeCard />
      </div>
      <div className="flex justify-center mt-6">
        <DomainCard />
      </div>
    </>
  );
}
