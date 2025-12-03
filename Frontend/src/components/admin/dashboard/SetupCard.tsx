import { CreditCard, Truck, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const setupItems = [
  {
    title: "Add payment methods",
    description: "PayPal, Visa, Mastercard and more",
    icon: CreditCard,
    buttonText: "Activate",
  },
  {
    title: "Review your shipping rates",
    description: "Domestic and more",
    icon: Truck,
    buttonText: "Review",
  },
  {
    title: "Customize your domain",
    description: "yourstore.loukify.com",
    icon: Globe,
    buttonText: "Customize",
  },
];

export function SetupCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {setupItems.map((item) => (
        <Card key={item.title}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <item.icon className="w-5 h-5" />
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription className="text-sm">
              {item.description}
            </CardDescription>
            <Button variant="outline" className="w-full bg-transparent">
              {item.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
