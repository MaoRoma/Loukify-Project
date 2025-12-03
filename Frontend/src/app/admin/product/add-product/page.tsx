import { AddProductForm } from "@/components/admin/product/AddProductCard";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Upload } from "lucide-react";

const AddProductPage = () => {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage and engage with your product catalog
          </p>
        </div>
        <div className="flex space-x-2">
          <a href="/admin/product">
            <Button className="bg-white text-black border border-gray-500">
              <ArrowBigLeft className="w-4 h-4" />
              Back
            </Button>
          </a>
        </div>
      </div>
      <div className="max-w-3xl mx-auto py-10">
        <AddProductForm />
      </div>
    </>
  );
};

export default AddProductPage;
