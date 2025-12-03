import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Section5 = () => {
  return (
    <section className="py-24 px-4 bg-[#F1F0EF]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-4xl font-bold mb-6 ">
          Ready to start your online business?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 text-pretty">
          Join thousands of Cambodian entrepreneurs who trust Loukify to power
          their online stores.
        </p>
        <Link href="/auth/signup">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-[#443F3B] text-white hover:bg-[#2B2524] hover:scale-105 transition-all duration-300 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-sans font-semibold"
          >
            Start Building Your Store
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground mt-4">
          Free 14-day trial • No setup fees • Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default Section5;
