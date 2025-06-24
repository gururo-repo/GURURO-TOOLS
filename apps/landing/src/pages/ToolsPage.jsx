import React, { useState } from 'react';
import { 
  Code, 
  FileText
} from 'lucide-react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const ToolsPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const tools = [
    {
      id: 1,
      title: "JobNest",
      description: "Advanced job search and career management platform",
      icon: Code,
      color: "from-orange-500 to-red-500",
      category: "Career",
      url: "/jobnest"
    },
    {
      id: 2,
      title: "Resume Refiner AI",
      description: "AI-powered resume optimization and enhancement",
      icon: FileText,
      color: "from-purple-500 to-violet-600",
      category: "Productivity",
      url: "/resume-refiner"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="mobile-container max-w-7xl mx-auto py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <nav className="h-16 flex items-center">
                <Link to="/" className="touch-target">
                  <img
                    src={logo}
                    alt="Gururo Tools"
                    width={200}
                    height={50}
                    className='h-8 sm:h-10 lg:h-12 w-auto object-contain'
                  />
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mobile-container max-w-7xl mx-auto mobile-section">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="mobile-hero-heading font-light text-gray-900 mb-6">
            Professional{' '}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Toolkit
            </span>
          </h1>
          <p className="mobile-text sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Enterprise-grade tools designed for modern professionals
          </p>
        </div>

        {/* Tools Grid */}
        <div className="mobile-grid">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.id}
                className={`relative bg-white backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group cursor-pointer touch-target ${
                  hoveredCard === tool.id ? 'transform scale-105 -translate-y-2' : ''
                }`}
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
                onMouseEnter={() => setHoveredCard(tool.id)}
                onMouseLeave={() => setHoveredCard(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    window.location.href = tool.url;
                  }
                }}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative p-4 sm:p-6 h-full flex flex-col">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                      {tool.category}
                    </span>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${tool.color} rounded-md flex items-center justify-center opacity-80`}>
                      <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-300">
                    {tool.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 flex-grow">
                    {tool.description}
                  </p>
                  
                  {/* Action Area */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                    <button
                      onClick={() => {
                        // Use window.open to open in same tab but ensure proper navigation
                        window.location.href = tool.url;
                      }}
                      className="text-gray-600 hover:text-gray-900 mobile-text font-medium transition-colors duration-200 touch-target"
                    >
                      Launch →
                    </button>
                  </div>
                </div>

                {/* Hover effect line */}
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${tool.color} transition-all duration-500 ${
                  hoveredCard === tool.id ? 'w-full' : 'w-0'
                }`}></div>
              </div>
            );
          })}
        </div>

        
      </div>
    </div>
  );
};

export default ToolsPage;