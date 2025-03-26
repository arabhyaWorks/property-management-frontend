import React from 'react';
import { TopBar } from '../components/TopBar';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { HowItWorks } from '../components/HowItWorks';
import { Schemes } from '../components/Schemes';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';

export function Landing() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Schemes />
      <FAQ />
      <Footer />
    </div>
  );
}