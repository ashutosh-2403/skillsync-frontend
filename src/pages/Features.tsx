// src/pages/Features.tsx
import React from 'react';

const Features: React.FC = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Resume Analysis',
      description: 'Advanced AI analyzes your resume and provides personalized career insights based on industry trends and your unique background.',
      benefits: [
        'Industry-specific recommendations',
        'Real-time market analysis', 
        'Personalized skill gap identification',
        'Dynamic content extraction'
      ]
    },
    {
      icon: '📊',
      title: 'Interactive Dashboard',
      description: 'Dynamic dashboard with real-time visualizations of your skills, career matches, and learning progress with tabbed interface.',
      benefits: [
        'Skill distribution charts',
        'Career match percentages',
        'Progress tracking',
        'Responsive design'
      ]
    },
    {
      icon: '💬',
      title: 'AI Career Assistant',
      description: '24/7 AI assistant that answers career questions and provides guidance based on your profile and goals with specialized timeout handling.',
      benefits: [
        'Instant career advice',
        'Interview preparation',
        'Learning recommendations',
        'Personalized responses'
      ]
    },
    {
      icon: '🎯',
      title: 'Smart Career Matching',
      description: 'Intelligent matching system that identifies the best career paths based on your skills and experience with percentage scoring.',
      benefits: [
        'Role compatibility scoring',
        'Growth opportunity analysis',
        'Industry insights',
        'Salary expectations'
      ]
    },
    {
      icon: '📚',
      title: 'Personalized Learning Paths',
      description: 'Custom learning roadmaps designed specifically for your career goals and current skill level with timeline optimization.',
      benefits: [
        'Step-by-step learning plans',
        'Resource recommendations',
        'Timeline optimization',
        'Progress tracking'
      ]
    },
    {
      icon: '📈',
      title: 'Dynamic Skill Gap Analysis',
      description: 'Detailed analysis of missing skills for your target roles with prioritized learning recommendations based on actual resume content.',
      benefits: [
        'Priority-based skill ranking',
        'Learning time estimates',
        'Resource suggestions',
        'Industry-specific gaps'
      ]
    }
  ];

  const technologies = [
    { name: 'React 18', category: 'Frontend', color: 'from-blue-500 to-cyan-500' },
    { name: 'TypeScript', category: 'Language', color: 'from-blue-600 to-blue-700' },
    { name: 'Node.js', category: 'Backend', color: 'from-green-500 to-green-600' },
    { name: 'MongoDB', category: 'Database', color: 'from-green-600 to-green-700' },
    { name: 'Cohere AI', category: 'AI/ML', color: 'from-purple-500 to-purple-600' },
    { name: 'Tailwind CSS', category: 'Styling', color: 'from-cyan-500 to-blue-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Powerful Features</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover how SkillSync's AI-powered features can accelerate your career growth 
            and help you make informed professional decisions with cutting-edge technology.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-lg text-gray-600">Everything you need for intelligent career development</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built with Modern Technology</h2>
            <p className="text-lg text-gray-600">Powered by industry-leading technologies for optimal performance</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${tech.color} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <span className="text-white font-bold text-lg">{tech.name.charAt(0)}</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">{tech.name}</h4>
                <p className="text-xs text-gray-500">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How SkillSync Works</h2>
            <p className="text-lg text-gray-600">Simple steps to transform your career journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Upload Resume', desc: 'Upload your resume and let our AI analyze your background', icon: '📄' },
              { step: '2', title: 'AI Analysis', desc: 'Advanced AI extracts skills, experience, and career insights', icon: '🔍' },
              { step: '3', title: 'Get Recommendations', desc: 'Receive personalized career paths and skill gap analysis', icon: '🎯' },
              { step: '4', title: 'Follow Roadmap', desc: 'Execute your custom learning roadmap and track progress', icon: '🚀' }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {item.step}
                </div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
                
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <svg className="w-full h-2" viewBox="0 0 100 2" fill="none">
                      <path d="M0 1h100" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Career?</h2>
          <p className="text-lg text-purple-100 mb-8">
            Join thousands of professionals who are using SkillSync to accelerate their career growth with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all font-medium text-lg transform hover:scale-105">
              Get Started Free
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-purple-600 transition-all font-medium text-lg">
              View Live Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
