import React from 'react';

const stats = [
  {
    value: "10K+",
    title: "Active Users",
    description: "Professionals using our platform"
  },
  {
    value: "85%",
    title: "Success Rate",
    description: "Users finding better opportunities"
  },
  {
    value: "5K+",
    title: "Job Matches",
    description: "Successful job placements"
  },
  {
    value: "24/7",
    title: "AI Support",
    description: "Always available to help"
  }
];

const StatsSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-black via-gray-900 to-black text-cyan-100 py-16 neural-bg">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl font-bold mb-8 hero-title-shadow animate-fade-in">🚀 Power in Numbers!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="glass-card-modern border-cyan-400/20 shadow-lg p-8 rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/50 hover:border-cyan-400/50 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-4xl font-bold text-cyan-100 group-hover:text-cyan-300 transition-colors duration-300 glow-effect">{stat.value}</h3>
              <p className="text-lg font-semibold mt-2 text-cyan-200 group-hover:text-cyan-100 transition-colors duration-300">{stat.title}</p>
              <p className="text-cyan-300 mt-1 group-hover:text-cyan-200 transition-colors duration-300">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
