import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative py-12 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#F1F0EF] from-green-600/10 to-lime-500/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="text-left animate-fade-in-up">
            <div className="mb-8 md:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-6 md:mb-8 font-inter leading-tight">
                Build your online store in{" "}
                <span className="text-stone-600">Cambodia </span>
                <span className="text-black">easily.</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-600 mb-8 md:mb-12 max-w-xl font-sans leading-relaxed">
                Create a beautiful online store in minutes with local payment
                support, Cambodia friendly shipping, and everything you need to
                sell online successfully.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 animate-fade-in-up animate-delay-200">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#443F3B] text-white hover:bg-[#2B2524] hover:scale-105 transition-all duration-300 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-sans font-semibold"
                >
                  Start Build Your Store
                </Button>
              </Link>
              <Link href="/LearnMore">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-stone-600 text-stone-600 hover:bg-[#D4D4D4] hover:text-stone-600 hover:scale-105 transition-all duration-300 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-sans font-semibold bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in-up animate-delay-300">
            <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
              <Image
                src="/image/heroimage.png" // Replace with your actual image path
                alt="E-commerce platform illustration showing online store features"
                width={600}
                height={500}
                className="w-full h-auto object-contain"
                priority
              />

              {/* Optional: Add floating elements for visual appeal */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#443F3B] rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white font-bold text-sm">24h</span>
              </div>

              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-stone-600 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-xs">SALE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
