// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import axios from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
  current?: boolean;
}

interface SkillGap {
  skill: string;
  importance: string;
  timeToLearn: string;
  resources?: string[];
}

interface RoadmapStep {
  title: string;
  phase: string;
  skills?: string[];
  resources?: string[];
  timeframe: string;
  status: string;
}

interface CareerMatch {
  role: string;
  matchPercentage: number;
  requirements: string[];
  missingSkills: string[];
}

interface UserProfile {
  name: string;
  currentRole: string;
  experience: Experience[] | string;
  skills: Skill[];
  targetRoles: string[];
  skillGaps: SkillGap[];
  roadmap: RoadmapStep[];
  careerMatches: CareerMatch[];
}

interface DashboardProps {
  userProfile?: any;
  onAuthRequired?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile: propUserProfile, onAuthRequired }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(propUserProfile || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'gaps' | 'roadmap'>('overview');
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          console.log('❌ No user found, requiring authentication');
          onAuthRequired?.();
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          console.log('❌ No token found, requiring authentication');
          onAuthRequired?.();
          return;
        }

        console.log('🔑 Fetching profile data...');

        const [res1, res2] = await Promise.all([
          axios.get('/analysis/history'),
          axios.get('/auth/me'),
        ]);

        const history = res1.data;
        const userData = res2.data;

        const combined: UserProfile = {
          name: userData?.user?.firstName || user?.firstName || 'User',
          currentRole: userData?.user?.currentRole || 'Professional',
          experience: userData?.user?.experience || [],
          skills: userData?.user?.skills || [],
          targetRoles: history?.careerMatches?.map((r: any) => r.role) || [],
          skillGaps: history?.skillGaps || [],
          roadmap: history?.learningRoadmap || [],
          careerMatches: userData?.user?.careerMatches || []
        };

        setUserProfile(combined);
        console.log('✅ Profile loaded:', combined);
      } catch (err: any) {
        console.error('❌ Fetch error:', err);
        
        if (err.response?.status === 401) {
          console.log('🔐 Unauthorized - logging out');
          logout();
          onAuthRequired?.();
        } else {
          setError(`Failed to load dashboard data: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, onAuthRequired, logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No profile data available</p>
          <p className="text-sm text-gray-500">Please upload your resume to get started</p>
        </div>
      </div>
    );
  }

  // Process skills for visualization
  const skillCategories = userProfile.skills.reduce((acc: any, skill: Skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const skillDistributionData = Object.entries(skillCategories).map(
    ([category, skills]: [string, any]) => ({
      name: category,
      value: skills.length,
      skills: skills.map((s: Skill) => s.name).join(', ')
    })
  );

  const skillLevelData = userProfile.skills.map(skill => ({
    name: skill.name.length > 12 ? skill.name.substring(0, 12) + '...' : skill.name,
    level: skill.level,
    category: skill.category
  }));

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6'];

  const TabButton = ({ id, label, icon, isActive, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        isActive 
          ? 'bg-purple-600 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Current Role: <span className="font-semibold text-purple-600">{userProfile.currentRole}</span>
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          <TabButton
            id="overview"
            label="Overview"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            isActive={activeTab === 'overview'}
            onClick={setActiveTab}
          />
          <TabButton
            id="skills"
            label="Skills Analysis"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            isActive={activeTab === 'skills'}
            onClick={setActiveTab}
          />
          <TabButton
            id="gaps"
            label="Skill Gaps"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" /></svg>}
            isActive={activeTab === 'gaps'}
            onClick={setActiveTab}
          />
          <TabButton
            id="roadmap"
            label="Learning Roadmap"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>}
            isActive={activeTab === 'roadmap'}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Career Matches */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6" />
                </svg>
                Recommended Career Paths
              </h3>
              
              {userProfile.careerMatches && userProfile.careerMatches.length > 0 ? (
                <div className="space-y-4">
                  {userProfile.careerMatches.slice(0, 3).map((match, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{match.role}</h4>
                          <p className="text-sm text-gray-600">{match.matchPercentage}% match • High demand</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6" />
                  </svg>
                  <p>Upload your resume to get personalized career recommendations</p>
                </div>
              )}
            </div>

            {/* Skill Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Skill Distribution</h3>
              {skillDistributionData.length > 0 ? (
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={skillDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {skillDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [
                        `${value} skills`,
                        props.payload.skills
                      ]} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {skillDistributionData.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm text-gray-600">{entry.name}</span>
                        <span className="text-sm font-medium text-gray-900">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p>No skills data available</p>
                  <p className="text-sm mt-2">Upload your resume to see your skill analysis</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Skills Analysis</h3>
            {skillLevelData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={skillLevelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Proficiency Level']} />
                  <Bar dataKey="level" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No skills data available for analysis</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gaps' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <svg className="w-6 h-6 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900">Critical Skill Gaps</h3>
            </div>
            
            {userProfile.skillGaps && userProfile.skillGaps.length > 0 ? (
              <div className="space-y-4">
                {userProfile.skillGaps.map((gap, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{gap.skill}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          gap.importance === 'High' ? 'bg-red-100 text-red-800' :
                          gap.importance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {gap.importance} Priority
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        Essential for {userProfile.targetRoles[0] || 'your target role'} and similar roles
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {gap.timeToLearn}
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Start Learning
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Great! No critical skill gaps identified</p>
                <p className="text-sm mt-2">Your skills align well with your target roles</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Personalized Learning Roadmap</h3>
            {userProfile.roadmap && userProfile.roadmap.length > 0 ? (
              <div className="space-y-6">
                {userProfile.roadmap.map((step, index) => (
                  <div key={index} className="relative">
                    {index < userProfile.roadmap.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        step.status === 'completed' ? 'bg-green-500' :
                        step.status === 'current' ? 'bg-blue-500' :
                        'bg-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{step.title}</h4>
                          <div className="flex space-x-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {step.phase}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded ${
                              step.status === 'completed' ? 'bg-green-100 text-green-800' :
                              step.status === 'current' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {step.status}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 font-medium mb-1">Skills to develop:</p>
                            <p className="text-gray-800">{step.skills?.join(', ') || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium mb-1">Timeframe:</p>
                            <p className="text-gray-800">{step.timeframe}</p>
                          </div>
                        </div>
                        {step.resources && step.resources.length > 0 && (
                          <div className="mt-3">
                            <p className="text-gray-600 font-medium mb-1 text-sm">Recommended resources:</p>
                            <p className="text-gray-700 text-sm">{step.resources.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p>No learning roadmap available yet</p>
                <p className="text-sm mt-2">Upload your resume to get a personalized learning path</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
