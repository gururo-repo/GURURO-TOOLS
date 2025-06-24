import React from "react";

const steps = [
  {
    number: "1",
    title: "Sign Up & Set Up Your Profile",
    description:
      "Create an account, fill in your details, and let our AI get to know you.",
  },
  {
    number: "2",
    title: "Take the Smart Competency Test",
    description:
      "Answer a few fun questions and get your competency score.",
  },
  {
    number: "3",
    title: "Discover Your Skill Gaps",
    description:
      "Identify missing skills and get course recommendations.",
  },
  {
    number: "4",
    title: "Get AI-Powered Job & Training Recommendations",
    description:
      "Find the best jobs and courses tailored to your profile.",
  },
  {
    number: "5",
    title: "Build Your Resume in Seconds",
    description:
      "Create a professional, ATS-optimized resume effortlessly.",
  },
  {
    number: "6",
    title: "Unlock Your Complete Career Toolkit",
    description:
      "Access your personalized competency scores, discover skill gaps, get AI-powered job recommendations, and build a top-tier resume — all in one place.",
  },
  {
    number: "7",
    title: "Stay Ahead with Real-Time Job Market Insights",
    description:
      "Explore trending skills and in-demand jobs.",
  },
  {
    number: "8",
    title: "Apply & Start Your Career Journey!",
    description:
      "Click, apply, and land the job! With everything in one place, getting hired has never been this easy!",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="relative py-16 bg-gradient-to-b from-gray-900 via-black to-gray-900 neural-bg">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-cyan-100 hero-title-shadow">How It Works</h2>
          <p className="text-xl text-cyan-200 max-w-3xl mx-auto leading-relaxed">
            Our simple process to help you land your dream job with AI-powered precision
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.slice(0, 4).map((step, index) => (
            <div
              key={step.number}
              className="glass-card-modern border-cyan-400/20 p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-cyan-400/50 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 glow-effect">
                <span className="text-white font-bold">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-cyan-100 group-hover:text-cyan-300 transition-colors duration-300">{step.title}</h3>
              <p className="text-cyan-200 group-hover:text-cyan-100 transition-colors duration-300">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mt-8">
          {steps.slice(4).map((step, index) => (
            <div
              key={step.number}
              className="glass-card-modern border-cyan-400/20 p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-cyan-400/50 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${(index + 4) * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 glow-effect">
                <span className="text-white font-bold">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-cyan-100 group-hover:text-cyan-300 transition-colors duration-300">{step.title}</h3>
              <p className="text-cyan-200 group-hover:text-cyan-100 transition-colors duration-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
