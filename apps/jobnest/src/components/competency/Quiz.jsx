"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { ArrowRight, Clock, CheckCircle, AlertCircle, Loader } from "lucide-react"
import api from "../../lib/axios"


const CompetencyQuiz = () => {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [quizData, setQuizData] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(900)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const { subIndustry, category } = location.state || {};

  useEffect(() => {
    const getQuiz = async () => {
      if (!categoryId || !subIndustry) {
        console.log('Missing categoryId or subIndustry, redirecting to categories');
        navigate("/competency-test/categories")
        return
      }

      try {
        setLoading(true)
        setError(null)

        console.log('🔄 Fetching quiz data:', {
          categoryId,
          subIndustry,
          apiUrl: `/quiz/${categoryId}/${subIndustry}`
        });

        const token = localStorage.getItem('token');
        const response = await api.get(`/quiz/${categoryId}/${subIndustry}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        console.log('✅ Quiz data received:', response.data);
        const data = response.data

        // Validate the response data
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No quiz questions received from server');
        }

        // Validate each question has required fields
        const invalidQuestions = data.filter(q => !q.question || !q.options || !Array.isArray(q.options));
        if (invalidQuestions.length > 0) {
          console.error('Invalid questions found:', invalidQuestions);
          throw new Error('Some quiz questions are missing required data');
        }

        const formattedQuestions = data.map((q, index) => ({
          id: `q${index + 1}`,
          question: q.question,
          options: q.options,
        }))

        setQuizData({
          quizId: `${categoryId}-${subIndustry}-${Date.now()}`,
          category,
          subIndustry,
          timeLimit: 900,
          questions: formattedQuestions,
          originalQuestions: data,
        })
        setTimeLeft(900)
        setLoading(false)

        console.log('✅ Quiz initialized successfully with', formattedQuestions.length, 'questions');
      } catch (error) {
        console.error('❌ Failed to load quiz:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });

        let errorMessage = "Failed to load quiz. Please try again.";

        if (error.response?.status === 404) {
          // Try to get available quiz combinations
          try {
            const availableResponse = await api.get('/quiz/available', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });

            const availableCombinations = availableResponse.data;
            console.log('Available quiz combinations:', availableCombinations);

            // Check if there are any quizzes available for this category
            const categoryQuizzes = availableCombinations.filter(combo =>
              combo.category.toLowerCase() === categoryId.toLowerCase()
            );

            if (categoryQuizzes.length > 0) {
              const availableSubIndustries = categoryQuizzes.map(combo => combo.subIndustry).join(', ');
              errorMessage = `Quiz not found for "${subIndustry}" in ${categoryId} category. Available options: ${availableSubIndustries}`;
            } else {
              errorMessage = `No quizzes available for ${categoryId} category yet. Please try a different category.`;
            }
          } catch (availableError) {
            console.error('Failed to fetch available quizzes:', availableError);
            errorMessage = `Quiz not found for "${subIndustry}" in ${categoryId} category. This combination may not be available yet.`;
          }
        } else if (error.response?.status === 401) {
          errorMessage = "Authentication required. Please log in again.";
          localStorage.removeItem('token');
          navigate('/auth');
          return;
        } else if (error.response?.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.message.includes('No quiz questions')) {
          errorMessage = `No quiz questions available for ${subIndustry} in ${categoryId} category.`;
        }

        setError(errorMessage);
        setLoading(false)
      }
    }

    getQuiz()
  }, [categoryId, subIndustry, navigate, category])

  useEffect(() => {
    if (!timeLeft || quizSubmitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleQuizSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, quizSubmitted])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleQuizSubmit = async () => {
    setQuizSubmitted(true)
    try {
      const answersArray = quizData.originalQuestions.map((q, index) => {
        const questionId = `q${index + 1}`;
        return answers[questionId] || "";
      });
  
      let correctCount = 0;
      const questionsWithResults = quizData.originalQuestions.map((q, index) => {
        const questionId = `q${index + 1}`;
        const userAnswer = answers[questionId] || "";
        const isCorrect = userAnswer === q.correctAnswer;
        
        if (isCorrect) correctCount++;
        
        return {
          question: q.question,
          correctAnswer: q.correctAnswer,
          userAnswer: userAnswer || "Not answered",
          isCorrect,
          explanation: q.explanation,
        }
      });
  
      const score = Math.round((correctCount / quizData.originalQuestions.length) * 100);
      
      const quizSubmissionData = {
        questions: quizData.originalQuestions,
        answers: answersArray,
        score: score,
        category,
        subIndustry,
        correctAnswers: quizData.originalQuestions.map(q => q.correctAnswer),
        questionsWithResults
      };
  
      console.log('Quiz Submission Data:', JSON.stringify(quizSubmissionData, null, 2));
  
      const response = await api.post('/quiz/submit', quizSubmissionData)
      const result = response.data
  
      navigate("/competency-test/results", {
        state: {
          quizResult: {
            quizScore: score,
            category,
            subIndustry,
            questions: questionsWithResults,
            improvementTip: result.improvementTip || "No specific improvement tips available",
            recommendations: result.recommendations // Add this line to pass recommendations
          },
        },
      })
    } catch (error) {
      console.error("Quiz Submission Full Error:", error);
      
      let errorMessage = "Failed to submit quiz. Please try again.";
      try {
        const errorDetails = JSON.parse(error.message);
        errorMessage += ` (Status: ${errorDetails.status})`;
        console.error('Detailed Error Information:', errorDetails);
      } catch {
        // If parsing fails, use default error message
      }
  
      setError(errorMessage);
      setQuizSubmitted(false)
    }
  }
  
  const answeredQuestions = Object.keys(answers).length
  const totalQuestions = quizData?.questions?.length || 0
  const progressPercentage = (answeredQuestions / totalQuestions) * 100

  if (loading) return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center justify-center">
      <Loader className="animate-spin text-cyan-400 mx-auto mb-4" size={40} />
      <p className="text-xl">Loading your competency test...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
      <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
      <p className="text-xl mb-4">{error}</p>
      <button onClick={() => navigate("/competency-test")}
        className="px-6 py-3 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600">
        Back to Categories
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-400">
            {quizData?.subIndustry} {quizData?.category} Competency Assessment
          </h1>
          <p className="text-cyan-100 mt-1">
            Complete all questions to get your personalized skill analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-4 border border-cyan-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-cyan-300">
                {answeredQuestions}/{totalQuestions} Questions
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-cyan-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Time Remaining</span>
              <div className="flex items-center text-sm">
                <Clock size={16} className="text-cyan-400 mr-1" />
                <span className={`font-mono ${timeLeft < 60 ? "text-red-400" : "text-cyan-300"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-cyan-800 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-cyan-300">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </h2>
            {answers[quizData.questions[currentQuestion].id] && (
              <span className="bg-cyan-900/30 text-cyan-300 px-3 py-1 rounded-full text-sm">Answered</span>
            )}
          </div>
          <p className="text-xl mb-6">{quizData.questions[currentQuestion].question}</p>
          <div className="space-y-3">
            {quizData.questions[currentQuestion].options.map((option, index) => (
              <div key={index}
                className={`p-4 rounded-lg border cursor-pointer transition
                  ${answers[quizData.questions[currentQuestion].id] === option
                    ? "bg-cyan-900/30 border-cyan-500"
                    : "bg-gray-800 border-gray-700 hover:border-cyan-700"}`}
                onClick={() => handleAnswerSelect(quizData.questions[currentQuestion].id, option)}>
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center
                    ${answers[quizData.questions[currentQuestion].id] === option
                      ? "bg-cyan-500"
                      : "border border-gray-600"}`}>
                    {answers[quizData.questions[currentQuestion].id] === option && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={handlePrevQuestion} disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-lg flex items-center 
              ${currentQuestion === 0
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"}`}>
            Previous
          </button>
          {currentQuestion < quizData.questions.length - 1 ? (
            <button onClick={handleNextQuestion}
              className="px-6 py-3 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 flex items-center">
              Next Question
              <ArrowRight size={18} className="ml-2" />
            </button>
          ) : (
            <button onClick={handleQuizSubmit}
              className="px-6 py-3 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 flex items-center">
              Submit Quiz
              <CheckCircle size={18} className="ml-2" />
            </button>
          )}
        </div>

        <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-cyan-800">
          <p className="text-sm text-gray-400 mb-3">Question Navigation:</p>
          <div className="flex flex-wrap gap-2">
            {quizData.questions.map((q, index) => (
              <button key={index} onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 flex items-center justify-center rounded
                  ${currentQuestion === index
                    ? "bg-cyan-700 text-white"
                    : answers[q.id]
                      ? "bg-cyan-900/40 text-cyan-300"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompetencyQuiz