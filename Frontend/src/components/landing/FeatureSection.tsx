import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: ShoppingBag,
    title: "Easy Store Setup",
    description:
      "Launch your online store in minutes with our intuitive drag-and-drop builder",
  },
  {
    icon: CreditCard,
    title: "Local Payment Support",
    description:
      "Accept payments through ABA Bank, Wing, Visa, PayPal, and other popular methods",
  },
  {
    icon: Truck,
    title: "Cambodia-Friendly Shipping",
    description:
      "Integrated shipping solutions that work seamlessly within Cambodia",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Track sales, customers, and performance with detailed insights and reports",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Bank-level security with 99.9% uptime to keep your store running smoothly",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized for speed to provide the best experience for your customers",
  },
];

const FeatureSection = () => {
  return (
    <section id="feature-section" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Everything you need to sell online
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Powerful tools designed specifically for Cambodian businesses to
            succeed online
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-15">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border/50 hover:border-primary/20 hover:shadow-xl transition-all duration-300 group"
            >
              <CardContent className="pt-6">
                <div className="mb-4">
                  <feature.icon className="w-10 h-10 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
