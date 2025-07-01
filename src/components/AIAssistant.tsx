// src/components/AIAssistant.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';

// Create specialized AI axios instance for longer requests
import axiosLib from 'axios';

const aiAxios = axiosLib.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api',
  withCredentials: true,
  timeout: 60000, // 60 seconds for AI requests
});

// AI axios interceptors
aiAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🤖 Making AI request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ AI request error:', error);
    return Promise.reject(error);
  }
);

aiAxios.interceptors.response.use(
  (response) => {
    console.log(`✅ AI response received from: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ AI response error:', error);
    
    if (error.code === 'ECONNABORTED') {
      console.log('⏰ AI request timed out');
      error.message = 'AI processing is taking longer than expected. Please try again with a shorter question.';
    }
    
    return Promise.reject(error);
  }
);

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

interface UserProfile {
  name: string;
  currentRole: string;
  skills: Array<{ name: string; level: number; category: string }>;
  experience: Array<{ company: string; position: string; duration: string; description: string }>;
  targetRoles: string[];
  skillGaps: Array<{ skill: string; importance: string; timeToLearn: string }>;
  careerMatches: Array<{ role: string; matchPercentage: number; requirements: string[] }>;
  learningRoadmap: Array<{ title: string; phase: string; skills: string[]; timeframe: string }>;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connected');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Enhanced quick questions with more variety
  const quickQuestions = [
    {
      icon: '🎯',
      category: 'Career Path',
      question: 'What career paths are best suited for my background?'
    },
    {
      icon: '📚',
      category: 'Learning Plan',
      question: 'Create a personalized learning roadmap for me'
    },
    {
      icon: '📄',
      category: 'Resume Tips',
      question: 'How can I improve my resume based on my target roles?'
    },
    {
      icon: '📈',
      category: 'Industry Trends',
      question: 'What are the trending skills in my industry?'
    },
    {
      icon: '💼',
      category: 'Interview Prep',
      question: 'Help me prepare for interviews in my field'
    },
    {
      icon: '🔍',
      category: 'Skill Gaps',
      question: 'What skills should I focus on developing next?'
    },
    {
      icon: '💰',
      category: 'Salary Insights',
      question: 'What salary range can I expect in my target roles?'
    },
    {
      icon: '🌟',
      category: 'Strengths',
      question: 'What are my key strengths based on my profile?'
    }
  ];

  useEffect(() => {
    loadUserProfile();
    setInitialMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUserProfile = async () => {
    try {
      setConnectionStatus('connecting');
      
      const [profileRes, historyRes] = await Promise.all([
        axios.get('/auth/me'),
        axios.get('/analysis/history')
      ]);

      const userData = profileRes.data.user;
      const historyData = historyRes.data;

      setUserProfile({
        name: userData.firstName || 'User',
        currentRole: userData.currentRole || 'Professional',
        skills: userData.skills || [],
        experience: userData.experience || [],
        targetRoles: userData.targetRoles || [],
        skillGaps: historyData.skillGaps || [],
        careerMatches: historyData.careerMatches || [],
        learningRoadmap: historyData.learningRoadmap || []
      });
      
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error loading profile:', error);
      setConnectionStatus('error');
    }
  };

  const setInitialMessage = () => {
    const initialMessage: Message = {
      id: '1',
      text: `Hi! I'm your AI Career Assistant 🤖\n\nI can help you with:\n• Career guidance and path recommendations\n• Skill development strategies\n• Interview preparation\n• Resume optimization\n• Learning roadmaps\n• Industry insights\n\nI have access to your profile data and can provide personalized advice. What would you like to explore today?`,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputText.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setConnectionStatus('connecting');

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      text: 'AI is thinking...',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Use specialized AI axios instance
      const response = await aiAxios.post('/ai/chat', {
        message: text,
        userProfile: userProfile
      });

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setConnectionStatus('connected');
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      // Handle specific error types
      if (error.code === 'ECONNABORTED') {
        errorMessage = '⏰ I need more time to process your request. Please try asking a shorter or simpler question, or try again in a moment.';
        setConnectionStatus('error');
      } else if (error.response?.status === 500) {
        errorMessage = '🔧 The AI service is currently experiencing issues. Please try again in a moment.';
        setConnectionStatus('error');
      } else if (error.response?.status === 401) {
        errorMessage = '🔐 Authentication expired. Please refresh the page and try again.';
        setConnectionStatus('error');
      } else if (!navigator.onLine) {
        errorMessage = '📡 No internet connection. Please check your connection and try again.';
        setConnectionStatus('error');
      }
      
      const aiErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInitialMessage();
  };

  const retryConnection = () => {
    loadUserProfile();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Connection Status */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900 mr-3">
              AI Career <span className="text-purple-600">Assistant</span>
            </h1>
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
              'bg-red-500'
            }`} title={`Status: ${connectionStatus}`}></div>
          </div>
          <p className="text-gray-600">
            Get personalized career advice, skill recommendations, and learning paths powered by AI.
          </p>
          {connectionStatus === 'error' && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
              Connection issues detected. 
              <button 
                onClick={retryConnection}
                className="ml-2 underline hover:no-underline"
              >
                Retry connection
              </button>
            </div>
          )}
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">AI Assistant</h3>
                  <p className="text-xs text-gray-500">
                    {userProfile ? `Helping ${userProfile.name}` : 'Loading profile...'}
                  </p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : message.isTyping
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.sender === 'ai' && !message.isTyping && (
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs">🤖</span>
                      </div>
                      <span className="text-xs text-gray-500">AI Assistant</span>
                    </div>
                  )}
                  
                  {message.isTyping ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Quick questions to get started:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {quickQuestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(item.question)}
                  disabled={isLoading}
                  className="flex items-center space-x-2 p-2 text-left text-sm bg-gray-50 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{item.icon}</span>
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-xs text-gray-500 truncate">{item.question}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isLoading ? "AI is processing..." : "Ask me anything about your career..."}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:bg-gray-100"
                  rows={1}
                  disabled={isLoading}
                  maxLength={500}
                />
                <div className="absolute right-12 top-2 text-xs text-gray-400">
                  {inputText.length}/500
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading}
                  className="absolute right-2 top-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={isLoading ? "Processing..." : "Send message"}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {isLoading && (
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2"></div>
                AI is analyzing your request... This may take up to 60 seconds.
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Career Guidance</h3>
            <p className="text-sm text-gray-600">Get personalized advice on career paths and role transitions</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Learning Plans</h3>
            <p className="text-sm text-gray-600">Receive custom study roadmaps for any skill or technology</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Industry Insights</h3>
            <p className="text-sm text-gray-600">Stay updated on trending skills and market demands</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
