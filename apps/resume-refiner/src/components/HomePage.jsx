import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, ArrowRight, Brain, Target, TrendingUp, Upload, FileText, Sparkles } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your resume against job requirements with precision and intelligence.',
    },
    {
      icon: Target,
      title: 'ATS Optimization',
      description: 'Ensure your resume passes Applicant Tracking Systems with our comprehensive scoring and optimization system.',
    },
    {
      icon: TrendingUp,
      title: 'Skill Matching',
      description: 'Identify missing skills and get personalized course recommendations to boost your career prospects.',
    },
  ];

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: 'Upload Your Resume',
      description: 'Upload your resume in PDF, JSON, or Markdown format. Our system will extract and analyze the content with AI precision.',
    },
    {
      number: 2,
      icon: FileText,
      title: 'Add Job Description',
      description: 'Paste the job description you\'re targeting. Our AI will analyze the requirements and match them with your skills.',
    },
    {
      number: 3,
      icon: Sparkles,
      title: 'Get AI Analysis',
      description: 'Receive detailed insights including ATS score, skill matching, improvement suggestions, and course recommendations.',
    },
  ];

  return (
    <div className="min-h-screen bg-black w-full relative overflow-hidden">
      {/* Grid Background */}
      <div className="grid-background"></div>

      {/* Hero Section */}
      <div className="relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-cyan-500/5"></div>
        <div className="relative text-center py-24 px-4 fade-in w-full">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl gradient-title animate-gradient-x mb-6">
              Resume Refiner AI
            </h1>
            <p className="mx-auto max-w-[800px] text-muted-foreground md:text-2xl text-cyan-50 mb-8 leading-relaxed">
              Transform your resume with AI-powered analysis and optimization.
              Get hired faster with intelligent insights and recommendations.
            </p>

            <div className="flex justify-center mb-12">
              <Link
                to="/analyzer"
                className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200 animate-pulse-glow"
              >
                <Search className="h-5 w-5" />
                <span>Analyze Resume</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Hero Visual Element */}
            <div className="relative mx-auto max-w-4xl">
              <div className="glass-card p-8 animate-float">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                      <Brain className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                      <Target className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">ATS Ready</h3>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                      <TrendingUp className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Career Growth</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mobile-section w-full">
        <div className="mobile-container max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="mobile-heading font-bold mb-4 text-cyan-100">
              Features That Set Us Apart
            </h2>
            <p className="mobile-text sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto text-cyan-50 leading-relaxed">
              Our AI-powered platform helps you navigate your career journey with confidence and precision.
            </p>
          </div>

          <div className="mobile-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-card group transform duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50 hover:border-cyan-400/50 h-auto min-h-[280px] sm:min-h-[300px] w-auto p-4 sm:p-6 lg:p-8 text-center flex flex-col items-center justify-center"
                >
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 rounded-full bg-cyan-500/20 border border-cyan-500/30 group-hover:bg-cyan-500/30 transition-all duration-300">
                      <Icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-cyan-100 mb-3 sm:mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-cyan-50/80 leading-relaxed text-center">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-4 bg-gray-900/50 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-100 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-cyan-50 max-w-3xl mx-auto">
              Transform your resume in three simple steps with our AI-powered platform
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex items-center space-x-6 glass-card p-6 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 text-black rounded-full flex items-center justify-center font-bold text-xl group-hover:shadow-glow-cyan transition-all duration-300">
                    {step.number}
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      
      
    </div>
  );
};

export default HomePage;
