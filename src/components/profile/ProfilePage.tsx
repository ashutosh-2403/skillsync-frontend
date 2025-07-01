import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Plus, Edit3, Save, X, Github, Linkedin, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  currentRole: string;
  yearsOfExperience: number;
  bio: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  skills: Array<{
    _id?: string;
    name: string;
    level: number;
    category: string;
  }>;
  experience: Array<{
    _id?: string;
    company: string;
    position: string;
    duration: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    _id?: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
  }>;
}

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/profile');
      setProfile(response.data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const response = await axios.put('/profile', profile);
      setProfile(response.data.profile);
      updateUser({
        firstName: profile.firstName,
        lastName: profile.lastName,
        currentRole: profile.currentRole
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      skills: [...profile.skills, { name: '', level: 50, category: '' }]
    });
  };

  const updateSkill = (index: number, field: string, value: any) => {
    if (!profile) return;
    const updatedSkills = [...profile.skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setProfile({ ...profile, skills: updatedSkills });
  };

  const removeSkill = (index: number) => {
    if (!profile) return;
    const updatedSkills = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: updatedSkills });
  };

  const addExperience = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      experience: [...profile.experience, {
        company: '',
        position: '',
        duration: '',
        description: '',
        current: false
      }]
    });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    if (!profile) return;
    const updatedExperience = [...profile.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setProfile({ ...profile, experience: updatedExperience });
  };

  const removeExperience = (index: number) => {
    if (!profile) return;
    const updatedExperience = profile.experience.filter((_, i) => i !== index);
    setProfile({ ...profile, experience: updatedExperience });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-8 pb-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-8 pb-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Profile not found</h2>
          <p className="text-neutral-600">Unable to load profile data.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'experience', label: 'Experience', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <section className="min-h-screen pt-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900 mb-1">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-lg text-neutral-600 mb-2">
                    {profile.currentRole || 'Add your current role'}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-neutral-500">
                    {profile.location && (
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.location}
                      </span>
                    )}
                    {profile.yearsOfExperience && (
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {profile.yearsOfExperience} years experience
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 transition-all flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:border-neutral-400 transition-all flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 transition-all flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-2">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'personal' && (
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                    placeholder="Add your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Current Role
                  </label>
                  <input
                    type="text"
                    value={profile.currentRole || ''}
                    onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                    placeholder="Your current job title"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={profile.linkedinUrl || ''}
                    onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={profile.githubUrl || ''}
                    onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={profile.portfolioUrl || ''}
                    onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-neutral-900">Skills</h3>
                {isEditing && (
                  <button
                    onClick={addSkill}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="p-4 border border-neutral-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateSkill(index, 'name', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Skill name"
                        className="px-3 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50"
                      />
                      <input
                        type="text"
                        value={skill.category}
                        onChange={(e) => updateSkill(index, 'category', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Category"
                        className="px-3 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50"
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                          disabled={!isEditing}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium text-neutral-600 w-12">
                          {skill.level}%
                        </span>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(index)}
                          className="text-error-600 hover:text-error-700 p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-neutral-900">Experience</h3>
                {isEditing && (
                  <button
                    onClick={addExperience}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="p-6 border border-neutral-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Company name"
                        className="px-3 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50"
                      />
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Position"
                        className="px-3 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50"
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Duration (e.g., Jan 2020 - Present)"
                        className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50"
                      />
                    </div>
                    <div className="mb-4">
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        placeholder="Describe your role and achievements..."
                        className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50"
                      />
                    </div>
                    {isEditing && (
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                            className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-neutral-700">Current position</span>
                        </label>
                        <button
                          onClick={() => removeExperience(index)}
                          className="text-error-600 hover:text-error-700 p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProfilePage;