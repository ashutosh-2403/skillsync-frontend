// src/components/pages/Contact.tsx
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! This is a demo project by Ashutosh Mishra.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Have questions about SkillSync? Get in touch with the creator and learn more about this innovative project.
          </p>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="project">About the Project</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="feedback">Feedback</option>
                    <option value="technical">Technical Questions</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Tell me about your thoughts on this project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-medium transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">Ashutosh Mishra</div>
                      <div className="text-gray-600">Project Creator & Developer</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <div className="text-purple-600 font-medium">ashutoshmishra2403@gmail.com</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Response Time</div>
                      <div className="text-gray-600">Usually within 24-48 hours</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Project Purpose</div>
                      <div className="text-gray-600">Learning & Portfolio Development</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-xl font-bold mb-6">About This Project</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">🎯 Purpose</h4>
                    <p className="text-purple-100 text-sm">Educational project showcasing AI integration and full-stack development skills.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">🚀 Technologies</h4>
                    <p className="text-purple-100 text-sm">React, TypeScript, Node.js, MongoDB, Cohere AI, Tailwind CSS</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">💡 Features</h4>
                    <p className="text-purple-100 text-sm">AI-powered resume analysis, career guidance, and personalized recommendations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
