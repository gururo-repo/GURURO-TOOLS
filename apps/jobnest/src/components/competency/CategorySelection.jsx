"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Code, Users, Briefcase, AlertCircle, Loader } from "lucide-react"
import api from "../../lib/axios"

const CompetencyCategories = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubIndustry, setSelectedSubIndustry] = useState(null)
  const [subIndustries, setSubIndustries] = useState([])
  const [availableQuizzes, setAvailableQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Predefined category to sub-industries mapping
  const categorySubIndustries = {
    technical: [
      "Web Development", 
      "Mobile App Development", 
      "Cloud Computing", 
      "Data Science", 
      "Cybersecurity", 
      "DevOps", 
      "AI/Machine Learning"
    ],
    behavioral: [
      "Team Leadership", 
      "Project Management", 
      "Communication", 
      "Conflict Resolution", 
      "Emotional Intelligence"
    ],
    industry: [
      "Technology", 
      "Finance", 
      "Healthcare", 
      "Marketing", 
      "Consulting"
    ]
  }

  const categories = [
    {
      id: "technical",
      name: "Technical Skills",
      icon: <Code size={32} className="text-cyan-400" />,
      description: "Assess your programming, database, and system architecture knowledge",
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "API Design"],
    },
    {
      id: "behavioral",
      name: "Behavioral Assessment",
      icon: <Users size={32} className="text-cyan-400" />,
      description: "Evaluate your communication, teamwork, and leadership abilities",
      skills: ["Communication", "Problem-solving", "Teamwork", "Leadership", "Adaptability"],
    },
    {
      id: "industry",
      name: "Industry Knowledge",
      icon: <Briefcase size={32} className="text-cyan-400" />,
      description: "Test your understanding of industry trends and best practices",
      skills: ["Market Analysis", "Competitive Intelligence", "Industry Trends", "Best Practices"],
    },
  ]

  // Fetch available quiz combinations on component mount
  useEffect(() => {
    const fetchAvailableQuizzes = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/auth');
          return;
        }

        const response = await api.get('/quiz/available', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setAvailableQuizzes(response.data);
        console.log('Available quizzes loaded:', response.data);
      } catch (error) {
        console.error('Failed to fetch available quizzes:', error);

        // If the endpoint doesn't exist, fall back to showing all options
        if (error.response?.status === 404) {
          console.log('Available quizzes endpoint not found, showing all options');
          setError('Quiz availability check not available. Some combinations may not work.');
        } else {
          setError('Failed to load quiz options. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableQuizzes();
  }, [navigate]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    // Reset sub-industry when category changes
    setSelectedSubIndustry(null)

    // Set sub-industries based on selected category
    if (category) {
      // If we have available quizzes data, filter by what's actually available
      if (availableQuizzes.length > 0) {
        const availableForCategory = availableQuizzes
          .filter(quiz => quiz.category.toLowerCase() === category.id.toLowerCase())
          .map(quiz => quiz.subIndustry);

        if (availableForCategory.length > 0) {
          setSubIndustries(availableForCategory);
        } else {
          // Fallback to predefined list if no available quizzes for this category
          setSubIndustries(categorySubIndustries[category.id] || []);
        }
      } else {
        // Fallback to predefined list if no available quizzes data
        setSubIndustries(categorySubIndustries[category.id] || []);
      }
    }
  }

  const handleSubIndustrySelect = (subIndustry) => {
    setSelectedSubIndustry(subIndustry)
  }

  const handleStartTest = () => {
    console.log('Selected Category:', selectedCategory);
    console.log('Selected Sub-Industry:', selectedSubIndustry);
  
    if (selectedCategory && selectedSubIndustry) {
      console.log('Navigating to:', `/competency-test/quiz/${selectedCategory.id}`);
      navigate(`/competency-test/quiz/${selectedCategory.id}`, {
        state: { 
          category: selectedCategory.id, 
          subIndustry: selectedSubIndustry 
        }
      });
    } else {
      console.error('Cannot start test: Category or Sub-Industry not selected');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center justify-center">
        <Loader className="animate-spin text-cyan-400 mx-auto mb-4" size={40} />
        <p className="text-xl">Loading quiz categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">Competency Assessment</h1>
          <p className="text-cyan-100">Select a category and specific area to assess your skills</p>

          {error && (
            <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg">
              <div className="flex items-center text-yellow-300">
                <AlertCircle className="mr-2" size={20} />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
        

        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`bg-gray-900 rounded-xl p-6 border transition-all cursor-pointer ${
                selectedCategory?.id === category.id
                  ? "border-cyan-400 shadow-lg shadow-cyan-900/20"
                  : "border-cyan-800 hover:border-cyan-600"
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-cyan-900/20 rounded-lg mr-4">{category.icon}</div>
                <h2 className="text-xl font-medium text-white">{category.name}</h2>
              </div>
              <p className="text-gray-400 mb-4">{category.description}</p>
              <div>
                <h3 className="text-sm font-medium text-cyan-300 mb-2">Skills Assessed:</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sub-Industry Selection (only show if a category is selected) */}
        {selectedCategory && (
          <div className="mb-10">
            <h2 className="text-2xl font-medium text-cyan-300 mb-4">
              Select {selectedCategory.name} Specialization
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subIndustries.map((subIndustry) => (
                <div
                  key={subIndustry}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedSubIndustry === subIndustry
                      ? "bg-cyan-900/30 border-cyan-500"
                      : "bg-gray-800 border-gray-700 hover:border-cyan-700"
                  }`}
                  onClick={() => handleSubIndustrySelect(subIndustry)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                        selectedSubIndustry === subIndustry
                          ? "bg-cyan-500"
                          : "border border-gray-600"
                      }`}
                    >
                      {selectedSubIndustry === subIndustry && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span>{subIndustry}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-medium text-cyan-300 mb-4">About This Assessment</h2>
          <div className="bg-gray-900 rounded-xl p-6 border border-cyan-800">
            <div className="space-y-4">
              <p>
                This assessment will help you identify your strengths and areas for improvement in your chosen category.
              </p>
              <p>
                Each test takes approximately <span className="text-cyan-300 font-medium">15-20 minutes</span> to
                complete and consists of multiple-choice questions.
              </p>
              <p>After completing the assessment, you'll receive:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>A detailed skill gap analysis</li>
                <li>Personalized learning recommendations</li>
                <li>Job matches based on your current skill profile</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleStartTest}
            disabled={!selectedCategory || !selectedSubIndustry}
            className={`px-10 py-3 rounded-lg text-lg font-medium transition-all ${
              selectedCategory && selectedSubIndustry
                ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {selectedCategory && selectedSubIndustry 
              ? `Start ${selectedSubIndustry} Assessment` 
              : "Select Category & Specialization"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompetencyCategories