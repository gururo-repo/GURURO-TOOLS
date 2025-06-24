import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import {
  Factory,
  Briefcase,
  Code,
  Building,
  DollarSign,
  RefreshCw
} from 'lucide-react';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    industry: '',
    subIndustry: '',
    experience: '',
    skills: [],
    country: '',
    salaryExpectation: '',
    competencyScore: 0
  });

  useEffect(() => {
    // Fetch user profile data when component mounts
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth');
          return;
        }

        // Fetch user profile
        const response = await api.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Profile data loaded:', response.data);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data. Please try again.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // For development/debugging - clear cached insights when component mounts
  useEffect(() => {
    // Clear any cached insights data from localStorage or sessionStorage
    try {
      // Remove any cached insights from local storage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData.insights) {
        delete userData.insights;
        localStorage.setItem('userData', JSON.stringify(userData));
      }

      // You might also want to clear any insights data in sessionStorage if used
      if (sessionStorage.getItem('industryInsights')) {
        sessionStorage.removeItem('industryInsights');
      }
    } catch (e) {
      console.error('Error clearing cached insights:', e);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data with the new value
    setFormData(prev => {
      // Create updated form data with the new field value
      const updated = {
        ...prev,
        [name]: value
      };

      // If changing industry, also reset subIndustry to prevent invalid combinations
      if (name === 'industry') {
        updated.subIndustry = '';
      }

      // No longer generating insights automatically when fields change
      // Insights will only be generated when the user clicks "Save Changes"

      return updated;
    });
  };

  // We've removed the separate generateInsights function since we now only generate insights
  // when the user clicks "Save Changes" in the handleSubmit function

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess('');
      const token = localStorage.getItem('token');

      // Get the current user data to compare changes
      const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      const countryChanged = currentUserData.country !== formData.country;
      const industryChanged = currentUserData.industry !== formData.industry || currentUserData.subIndustry !== formData.subIndustry;

      console.log('Profile update changes detected:', {
        countryChanged,
        industryChanged,
        oldCountry: currentUserData.country,
        newCountry: formData.country,
        oldIndustry: currentUserData.industry,
        newIndustry: formData.industry
      });

      // First, update the user profile
      const profileResponse = await api.put('/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile updated successfully:', profileResponse.data);

      // Show success message
      setSuccess('Profile updated successfully! Generating new insights...');

      // Clear ALL cached insights data completely when country or industry changes
      if (countryChanged || industryChanged) {
        try {
          // Clear localStorage insights
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          if (userData.insights) {
            delete userData.insights;
          }
          if (userData.lastInsightsUpdate) {
            delete userData.lastInsightsUpdate;
          }
          localStorage.setItem('userData', JSON.stringify(userData));

          // Clear sessionStorage insights
          sessionStorage.removeItem('industryInsights');
          sessionStorage.removeItem('insightData');
          sessionStorage.removeItem('comparisonData');
          sessionStorage.removeItem('comparisonInputs');

          // Clear localStorage comparison data as well
          localStorage.removeItem('comparisonData');
          localStorage.removeItem('comparisonInputs');

          console.log('🧹 Cleared all cached insights and comparison data due to profile changes');
        } catch (e) {
          console.error('Error clearing cache:', e);
        }
      }

      // Force timestamp to prevent caching
      const timestamp = new Date().getTime();

      // After updating profile, generate new insights with all relevant profile data
      setInsightsLoading(true);
      // Prepare insight generation data with detailed logging
      const insightData = {
        industry: formData.subIndustry || formData.industry,
        subIndustry: formData.subIndustry,
        experience: parseInt(formData.experience) || 0,
        skills: formData.skills,
        country: formData.country,
        salaryExpectation: formData.salaryExpectation,
        isIndianData: formData.country.toLowerCase().includes('india'),
        forceRefresh: true,
        clearCache: countryChanged || industryChanged, // Signal backend to clear cache
        profileUpdateTimestamp: timestamp
      };

      console.log('🔄 Generating insights with data:', insightData);
      console.log('🌍 Country:', formData.country);
      console.log('🇮🇳 Is Indian Data:', insightData.isIndianData);
      console.log('🔄 Force cache clear:', countryChanged || industryChanged);

      const insightResponse = await api.post(`/industry-insights/generate?t=${timestamp}&clearCache=${countryChanged || industryChanged}`, insightData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('New insights generated:', insightResponse.data);

      // Debug: Check if the backend returned country-specific data
      if (insightResponse.data.citySalaryData) {
        console.log('🏙️ Cities in response:', insightResponse.data.citySalaryData.map(city => city.city));
        console.log('🌍 Expected country:', formData.country);

        // Check if we're still getting Indian cities for non-Indian countries
        const indianCities = ['Bangalore', 'Mumbai', 'Delhi', 'Noida', 'Pune', 'Chennai', 'Hyderabad'];
        const responseCities = insightResponse.data.citySalaryData.map(city => city.city);
        const hasIndianCities = responseCities.some(city => indianCities.includes(city));

        if (hasIndianCities && !formData.country.toLowerCase().includes('india')) {
          console.warn('⚠️ Backend returned Indian cities for non-Indian country!');
          console.warn('Expected country:', formData.country);
          console.warn('Received cities:', responseCities);
        }
      }

      // Update local storage with new user data and timestamp
      const updatedUserData = {
        ...profileResponse.data,
        lastInsightsUpdate: timestamp
      };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));

      // Store the fresh insights in session storage
      sessionStorage.setItem('industryInsights', JSON.stringify({
        data: insightResponse.data,
        timestamp: timestamp,
        industry: formData.industry,
        subIndustry: formData.subIndustry
      }));

      // Navigate back to insights page with fresh data
      console.log('🔄 Navigating to insights page with fresh data');

      // Wait a moment for the insights to be fully processed
      setTimeout(() => {
        // Use navigate with state to indicate fresh data is available
        navigate('/industry-insights', {
          replace: true,
          state: {
            freshInsights: true,
            timestamp: timestamp,
            profileUpdated: true
          }
        });
      }, 1000); // Give backend time to process
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      setSuccess('');
    } finally {
      setLoading(false);
      setInsightsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-zinc-900 p-4">
        <div className="text-red-400 text-xl mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 pt-20">
      {insightsLoading && (
        <div className="fixed top-20 right-4 bg-cyan-900/90 text-cyan-100 px-4 py-2 rounded-lg shadow-lg flex items-center z-50">
          <RefreshCw className="animate-spin mr-2 h-5 w-5" />
          <span>Generating new industry insights...</span>
        </div>
      )}
      {success && (
        <div className="fixed top-20 right-4 bg-green-900/90 text-green-100 px-4 py-2 rounded-lg shadow-lg flex items-center z-50">
          <span>{success}</span>
        </div>
      )}
      <div className="max-w-2xl mx-auto bg-zinc-800/50 p-6 rounded-xl border border-cyan-400">
        <h2 className="text-2xl font-bold text-cyan-50 mb-6">Edit Your Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-cyan-100 mb-2 flex items-center">
              <Factory className="mr-2 h-5 w-5" />
              Industry
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
              required
            >
              <option value="">Select Industry</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
            </select>
          </div>

          <div>
            <label className="block text-cyan-100 mb-2 flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Sub-Industry
            </label>
            <select
              name="subIndustry"
              value={formData.subIndustry}
              onChange={handleChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
            >
              <option value="">Select Sub-Industry</option>
              {formData.industry === 'Technology' && (
                <>
                  <option value="Software Development">Software Development</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Game Development">Game Development</option>
                  <option value="Embedded Systems Development">Embedded Systems Development</option>
                  <option value="API Development">API Development</option>
                  <option value="DevOps Engineering">DevOps Engineering</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="Frontend Development">Frontend Development</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Data Engineering">Data Engineering</option>
                  <option value="Big Data">Big Data</option>
                  <option value="Business Intelligence (BI)">Business Intelligence (BI)</option>
                  <option value="Artificial Intelligence (AI)">Artificial Intelligence (AI)</option>
                  <option value="Machine Learning (ML)">Machine Learning (ML)</option>
                  <option value="Deep Learning">Deep Learning</option>
                  <option value="Natural Language Processing (NLP)">Natural Language Processing (NLP)</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="Data Analytics">Data Analytics</option>

                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Technical Program Management">Technical Program Management</option>
                  <option value="Project Management (IT)">Project Management (IT)</option>
                  <option value="Technology Consulting">Technology Consulting</option>
                  <option value="Tech Strategy & Innovation">Tech Strategy & Innovation</option>
                  <option value="Digital Transformation">Digital Transformation</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Managed Services">Managed Services</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="IT Service Management (ITSM)">IT Service Management (ITSM)</option>
                  <option value="Help Desk Support">Help Desk Support</option>
                  <option value="Database Administration">Database Administration</option>
                  <option value="Data Warehousing">Data Warehousing</option>


                  <option value="Digital Marketing">Digital Marketing</option>
                </>
              )}


              {formData.industry === 'Finance' && (
                <>
                  <option value="Banking">Banking</option>
                  <option value="Investment">Investment</option>
                  <option value="Insurance">Insurance</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-cyan-100 mb-2 flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Years of Experience
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
              required
              min="0"
              max="50"
            />
          </div>

          <div>
            <label className="block text-cyan-100 mb-2 flex items-center">
              <Code className="mr-2 h-5 w-5" />
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills}
              onChange={handleSkillsChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
              required
            />
          </div>



          <div>
            <label className="block text-cyan-100 mb-2 flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
              placeholder="e.g. United States, India, Canada"
            />
          </div>

          <div>
            <label className="block text-cyan-100 mb-2 flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Salary Expectation
            </label>
            <input
              type="text"
              name="salaryExpectation"
              value={formData.salaryExpectation}
              onChange={handleChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
            />
          </div>



          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/industry-insights')}
              className="bg-zinc-600 hover:bg-zinc-700 text-white py-2 px-6 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-6 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;