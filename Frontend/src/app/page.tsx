import React from "react";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import CustomerSection from "@/components/landing/CustomerSection";
import Section4 from "@/components/landing/Section4";
import Section5 from "@/components/landing/Section5";
import Footer from "@/components/landing/Footer";
import { Section } from "lucide-react";

const LandingPage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <FeatureSection />
      <CustomerSection />
      <Section4 />
      <Section5 />
      <Footer />
    </>
  );
};

export default LandingPage;
