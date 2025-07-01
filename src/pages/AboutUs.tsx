// src/components/pages/AboutUs.tsx
import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">About SkillSync</h1>
          <p className="text-xl max-w-3xl mx-auto">
            An innovative AI-powered career intelligence platform designed to bridge skill gaps 
            and accelerate professional growth through cutting-edge technology.
          </p>
        </div>
      </div>

      {/* Creator Section - Most Important */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg mb-8">
              <h2 className="text-3xl font-bold mb-2">🎓 Educational Project</h2>
              <p className="text-lg">Created for Learning & Portfolio Development</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 lg:p-12 border-2 border-purple-200 shadow-xl">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white font-bold">AM</span>
              </div>
              
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                **Created by Ashutosh Mishra**
              </h3>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <p className="text-xl text-gray-800 font-semibold mb-6">
                  **This entire SkillSync platform has been conceptualized, designed, and developed by Ashutosh Mishra 
                  as a comprehensive learning project and portfolio demonstration.**
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h4 className="font-bold text-purple-800 mb-3">🎯 Project Objectives</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Demonstrate full-stack development expertise</li>
                      <li>• Showcase AI integration capabilities</li>
                      <li>• Build a comprehensive portfolio project</li>
                      <li>• Explore modern web technologies</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="font-bold text-blue-800 mb-3">💡 Learning Focus</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• AI-powered application development</li>
                      <li>• Advanced React & TypeScript patterns</li>
                      <li>• Backend API design and optimization</li>
                      <li>• User experience and interface design</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
                <p className="text-lg font-medium">
                  **"This project represents my journey in mastering modern web development technologies 
                  and creating innovative solutions that combine AI with practical career guidance."**
                </p>
                <p className="text-purple-200 mt-2">- Ashutosh Mishra, Creator & Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Technical Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Frontend Excellence</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• React 18 with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Responsive design principles</li>
                <li>• Modern component architecture</li>
                <li>• State management optimization</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Backend Architecture</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Node.js with Express framework</li>
                <li>• MongoDB database integration</li>
                <li>• RESTful API design</li>
                <li>• JWT authentication system</li>
                <li>• Error handling & validation</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">AI Integration</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Cohere AI for natural language processing</li>
                <li>• Dynamic resume analysis</li>
                <li>• Intelligent career recommendations</li>
                <li>• Personalized learning paths</li>
                <li>• Real-time AI chat assistant</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Project Highlights</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600 text-sm">Custom Built</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600 text-sm">Technologies Used</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600 text-sm">Components Created</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">AI</div>
              <div className="text-gray-600 text-sm">Powered Features</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Interested in This Project?</h2>
            <p className="text-lg mb-6 text-purple-100">
              Connect with Ashutosh Mishra to discuss the technical implementation, 
              learning journey, or potential collaborations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:ashutoshmishra2403@gmail.com"
                className="bg-white text-purple-600 px-8 py-3 rounded-xl hover:bg-gray-100 transition-all font-medium"
              >
                Get in Touch
              </a>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl hover:bg-white hover:text-purple-600 transition-all font-medium">
                View Project Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
