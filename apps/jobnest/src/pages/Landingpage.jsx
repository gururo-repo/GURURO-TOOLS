import React from 'react';
import { ChevronRight, Award, Book, LineChart, FileText, BriefcaseIcon, Trophy } from 'lucide-react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorksSection from '../components/Howitworks';
import StatsSection from '../components/StatsSection';
// import Footer from '../components/Footer';
import IndustryInsightsPage from './IndustryInsightsPage';

const LandingPage = () => {

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Grid Background */}
      <div className="grid-background"></div>

      {/* Hero Section with integrated Features */}
      <Hero/>
      

      {/* Features Section */}
      <Features/>

      
    </div>
  );
};

export default LandingPage;