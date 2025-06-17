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
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/">
                  <img
                    src={logo} 
                    alt="JobNest"
                    width={200}
                    height={50}
                    className='h-12 px-0 w-auto object-contain'
                  />
                </Link>
              </nav>
            </div>
            <div className="text-gray-600 text-sm">Professional Tools Suite</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-light text-gray-900 mb-6">
            Professional 
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 ml-4">
              Toolkit
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Enterprise-grade tools designed for modern professionals
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.id}
                className={`relative bg-white backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group cursor-pointer ${
                  hoveredCard === tool.id ? 'transform scale-105 -translate-y-2' : ''
                }`}
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
                onMouseEnter={() => setHoveredCard(tool.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative p-6 h-full flex flex-col">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                      {tool.category}
                    </span>
                    <div className={`w-8 h-8 bg-gradient-to-r ${tool.color} rounded-md flex items-center justify-center opacity-80`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-300">
                    {tool.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
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
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
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

        {/* Bottom Section */}
        <div className="mt-24">
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 shadow-lg overflow-hidden relative"
               style={{
                 clipPath: 'polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 40px 100%, 0 calc(100% - 40px))'
               }}>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/3 to-red-500/3"></div>
            <div className="relative px-12 py-16 text-center">
              <h2 className="text-3xl font-light text-gray-900 mb-4">
                Ready to <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">elevate</span> your workflow?
              </h2>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                Access the complete professional toolkit with advanced features and enterprise support
              </p>
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                      }}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;