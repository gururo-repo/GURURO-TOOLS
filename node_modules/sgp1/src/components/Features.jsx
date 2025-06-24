import React from 'react';
import { Card, CardContent } from './ui/card';
import { BriefcaseIcon, BookOpen, LineChart, FileText, Award, Trophy } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <BriefcaseIcon className="h-10 w-10 text-cyan-400" />,
      title: "AI Job Matching",
      description: "Get personalized job recommendations based on your skills and preferences."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-cyan-400" />,
      title: "Skill Gap Analysis",
      description: "Identify missing skills and get course recommendations to improve your profile."
    },
    {
      icon: <LineChart className="h-10 w-10 text-cyan-400" />,
      title: "Industry Insights",
      description: "Access real-time data on industry trends, salary ranges, and in-demand skills."
    },
    {
      icon: <FileText className="h-10 w-10 text-cyan-400" />,
      title: "Resume Builder",
      description: "Create an ATS-optimized resume with AI assistance and get feedback."
    },
    {
      icon: <Award className="h-10 w-10 text-cyan-400" />,
      title: "Competency Testing",
      description: "Take assessments to showcase your skills and stand out to employers."
    },
    {
      icon: <Trophy className="h-10 w-10 text-cyan-400" />,
    title:"Get Your Personalized Career Roadmap",
    description:"Let AI guide your journey — assess your skills, fix your gaps, build your resume, all in one smart plan."
    },
  ];

  return (
    <section className="relative mobile-section bg-gradient-to-b from-black via-gray-900 to-black neural-bg">
      <div className="mobile-container relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in">
          <h2 className="mobile-heading font-bold mb-6 text-cyan-100 hero-title-shadow">
            Features That Set Us Apart
          </h2>
          <p className="mobile-text sm:text-lg lg:text-xl text-cyan-200 max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform helps you navigate your career journey with confidence and precision.
          </p>
        </div>

        <div className="mobile-grid max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="glass-card-modern border-cyan-400/20 transform duration-500 shadow-lg rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50 hover:border-cyan-400/50 hover:border-2 h-auto min-h-[240px] sm:min-h-[260px] w-auto group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4 sm:p-6 text-center flex flex-col items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center text-cyan-50 space-y-3 sm:space-y-4">
                  <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-cyan-100 text-center group-hover:text-cyan-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-cyan-200 text-center leading-relaxed group-hover:text-cyan-100 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features