import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProductCard() {
  return (
    <Card className="rounded-3xl h-160 w-180 bg-ring border-2 border-[#C9C8C7]">
      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-160 h-100 rounded-3xl bg-white flex items-center justify-center mb-6">
          <div className="w-50 h-50 border border-[#C9C8C7] rounded-2xl bg-muted flex items-center justify-center mb-6">
            <Package className="w-16 h-16 text-muted-foreground" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">No products yet</p>
        <a href="/admin/product/add-product">
          <Button>Add product</Button>
        </a>
      </CardContent>
    </Card>
  );
}
