// components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Mail, Phone, BookOpen, GraduationCap, 
  Calendar, Briefcase, Code, Linkedin, Github, 
  FileText, Camera, Edit2, Save, X, Plus, Globe,
  Award, Star, ChevronRight, CheckCircle, Upload
} from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    course: '',
    yearOfStudy: 1,
    domain: '',
    skills: [],
    linkedinUrl: '',
    githubUrl: '',
    resumeUrl: '',
    profileImage: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [profileImage, setProfileImage] = useState('/default-avatar.png');


  // Skill color mapping for different technologies
  const getSkillColor = (skill) => {
    const skillLower = skill.toLowerCase();
    const colors = {
      blue: 'bg-gradient-to-r from-blue-100 to-blue-50 border-blue-200 text-blue-800',
      green: 'bg-gradient-to-r from-emerald-100 to-emerald-50 border-emerald-200 text-emerald-800',
      purple: 'bg-gradient-to-r from-purple-100 to-purple-50 border-purple-200 text-purple-800',
      orange: 'bg-gradient-to-r from-orange-100 to-orange-50 border-orange-200 text-orange-800',
      red: 'bg-gradient-to-r from-red-100 to-red-50 border-red-200 text-red-800',
      pink: 'bg-gradient-to-r from-pink-100 to-pink-50 border-pink-200 text-pink-800',
      indigo: 'bg-gradient-to-r from-indigo-100 to-indigo-50 border-indigo-200 text-indigo-800',
      cyan: 'bg-gradient-to-r from-cyan-100 to-cyan-50 border-cyan-200 text-cyan-800'
    };

    if (['react', 'javascript', 'typescript', 'html', 'css', 'vue', 'angular'].includes(skillLower))
      return colors.blue;
    if (['node.js', 'express', 'python', 'django', 'flask', 'java', 'spring boot', 'php'].includes(skillLower))
      return colors.green;
    if (['mongodb', 'mysql', 'postgresql', 'redis', 'sqlite', 'oracle'].includes(skillLower))
      return colors.purple;
    if (['react native', 'flutter', 'android', 'ios', 'swift', 'kotlin'].includes(skillLower))
      return colors.orange;
    if (['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'jenkins'].includes(skillLower))
      return colors.red;
    if (['figma', 'adobe xd', 'sketch', 'photoshop', 'illustrator'].includes(skillLower))
      return colors.pink;
    if (['machine learning', 'ai', 'data science', 'nlp', 'computer vision'].includes(skillLower))
      return colors.indigo;
    return colors.cyan;
  };

  // Year of study options with icons
  const yearOptions = [
    { value: 1, label: '1st Year'},
    { value: 2, label: '2nd Year'},
    { value: 3, label: '3rd Year'},
    { value: 4, label: '4th Year' },
  ];

  // Domain options
  const domainOptions = [
    'Web Development', 'Mobile Development', 'Data Science',
    'DevOps', 'UI/UX Design', 'Machine Learning',
    'Cloud Computing', 'Cybersecurity', 'Backend Development',
    'Frontend Development', 'Full Stack Development'
  ];

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/intern/profile');
      const internData = response.data;

      // Transform skills from [{name: "React"}] to ["React"]
      const skillsArray = internData.skills ? internData.skills.map(skill => skill.name) : [];

      setFormData({
        name: internData.name || '',
        email: internData.email || '',
        phone: internData.phone || '',
        college: internData.college || '',
        course: internData.course || '',
        yearOfStudy: internData.yearOfStudy || 1,
        domain: internData.domain || '',
        skills: skillsArray,
        linkedinUrl: internData.linkedinUrl || '',
        githubUrl: internData.githubUrl || '',
        resumeUrl: internData.resumeUrl || '',
        profileImage: internData.profileImage || ''
      });

      if (internData.profileImage) {
        setProfileImage(internData.profileImage);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post('/api/intern/upload-profile-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        setProfileImage(response.data.url);
        setFormData(prev => ({ ...prev, profileImage: response.data.url }));
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Transform skills array to match backend schema before sending
      const skillsForBackend = formData.skills.map(skill => ({ name: skill }));

      // Update profile API call
      await axios.put('/api/intern/profile', {
        ...formData,
        skills: skillsForBackend, // Send skills in backend format
        profileImage
      });
      
      setIsEditing(false);
      await fetchProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleCancel = () => {
    fetchProfileData();
    setIsEditing(false);
  };

  const getYearIcon = (year) => {
    const option = yearOptions.find(opt => opt.value === year);
    return option ? option.icon : '📚';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">Manage your professional identity and information</p>
            </div>
            <div className="flex items-center gap-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Edit Profile</span>
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-8">
              {/* Profile Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <div className="absolute top-4 right-4">
                  {isEditing ? (
                    <label className="cursor-pointer">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                        {uploading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Camera className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  ) : (
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-center text-center pt-8">
                  <div className="relative">
                    <img
                      src={profileImage || '/default-avatar.png'}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
                    />
                    {isEditing && !uploading && (
                      <label className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 rounded-full cursor-pointer hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mt-6">{formData.name || 'Your Name'}</h2>
                  <p className="text-blue-100 mt-1">{formData.domain || 'Add your domain'}</p>
                  
                  <div className="mt-4 flex gap-3">
                    {formData.yearOfStudy && (
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-lg">{getYearIcon(formData.yearOfStudy)}</span>
                        <span className="text-white text-sm font-medium">
                          {yearOptions.find(opt => opt.value === formData.yearOfStudy)?.label || 'Student'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 truncate">{formData.email || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Phone</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-transparent font-medium text-gray-900 outline-none"
                          placeholder="+1 234 567 8900"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{formData.phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">College</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="college"
                          value={formData.college}
                          onChange={handleInputChange}
                          className="w-full bg-transparent font-medium text-gray-900 outline-none"
                          placeholder="Enter your college"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{formData.college || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="p-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Social Links
                </h3>
                
                <div className="space-y-3">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">LinkedIn</label>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Linkedin className="w-4 h-4 text-blue-600" />
                          </div>
                          <input
                            type="url"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleInputChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">GitHub</label>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Github className="w-4 h-4 text-gray-800" />
                          </div>
                          <input
                            type="url"
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleInputChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://github.com/username"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {formData.linkedinUrl && (
                        <a
                          href={formData.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                        >
                          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <Linkedin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">LinkedIn Profile</p>
                            
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </a>
                      )}
                      
                      {formData.githubUrl && (
                        <a
                          href={formData.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                        >
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                            <Github className="w-5 h-5 text-gray-800" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">GitHub Profile</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Resume Section */}
              <div className="p-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Resume
                </h3>
                
                {formData.resumeUrl ? (
                  <div className="space-y-4">
                    <a
                      href={formData.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl hover:from-emerald-100 hover:to-green-100 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                          <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">View Resume</p>
                          <p className="text-sm text-gray-500">Click to open</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-emerald-500" />
                    </a>
                    
                    {isEditing && (
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">Update Resume URL</label>
                        <input
                          type="url"
                          name="resumeUrl"
                          value={formData.resumeUrl}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://drive.google.com/..."
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">Resume URL</label>
                          <input
                            type="url"
                            name="resumeUrl"
                            value={formData.resumeUrl}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://drive.google.com/..."
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-xl">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No resume uploaded</p>
                        <p className="text-sm text-gray-500 mt-1">Upload your resume to get started</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Editable Sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Academic Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Academic Information</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Course
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Computer Science"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <p className="font-medium text-gray-900">{formData.course || 'Not specified'}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Year of Study
                  </label>
                  {isEditing ? (
                    <select
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {yearOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getYearIcon(formData.yearOfStudy)}</span>
                        <p className="font-medium text-gray-900">
                          {yearOptions.find(opt => opt.value === formData.yearOfStudy)?.label || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Professional Domain
                  </label>
                  {isEditing ? (
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select your domain</option>
                      {domainOptions.map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                      <p className="font-semibold text-blue-800">{formData.domain || 'No domain selected'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Skills & Technologies</h2>
                </div>
                <div className="text-sm text-gray-500">
                  {formData.skills.length} skills
                </div>
              </div>

              {/* Skills Display */}
              <div className="flex flex-wrap gap-3 mb-6">
                {formData.skills.length > 0 ? (
                  formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className={`group relative px-4 py-2 rounded-full border ${getSkillColor(skill)} transition-all duration-300`}
                    >
                      <span className="font-medium">{skill}</span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center w-full py-8">
                    <Code className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No skills added yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add your first skill to get started</p>
                  </div>
                )}
              </div>

              {/* Add Skill Input */}
              {isEditing && (
                <div className="border-t border-gray-100 pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Add New Skill</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      placeholder="e.g., React, Spring Boot, MongoDB, Docker"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      Add Skill
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Press Enter or click Add to add the skill
                  </p>
                </div>
              )}
            </div>

            {/* Resume Upload Section (only shown in edit mode) */}
            {isEditing && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Upload Documents</h3>
                    <p className="text-sm text-gray-600">Enhance your profile with documents</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                    <div className="flex items-center gap-4">
                      <img
                        src={profileImage || '/default-avatar.png'}
                        alt="Current"
                        className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
                      />
                      <label className="flex-1">
                        <div className="cursor-pointer px-6 py-3 bg-white border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 transition-colors text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Camera className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-600">Choose new photo</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (Max 5MB)</p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-white rounded-xl border border-gray-300">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="url"
                          name="resumeUrl"
                          value={formData.resumeUrl}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Paste your resume URL here..."
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Or upload directly: Google Drive, Dropbox, OneDrive links supported
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;