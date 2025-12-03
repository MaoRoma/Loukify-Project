import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

export function ThemeCard() {
  return (
    <Card className="rounded-3xl h-160 w-180 bg-ring border-2 border-[#C9C8C7]">
      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-160 h-100 rounded-3xl bg-white flex items-center justify-center mb-6">
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-10 h-10 rounded",
                    i === 4 ? "bg-muted-foreground" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mb-4">
          <CardTitle className="text-base mb-2">
            Choose your store theme
          </CardTitle>
          <CardDescription className="text-sm">
            Select from 8 professionally designed themes including Dawn, Sense,
            Craft, and more
          </CardDescription>
        </div>
        <a href="/admin/online-store">
          <Button className="w-full" variant="default">
            <Palette className="w-4 h-4 mr-2" />
            Browse Themes
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
