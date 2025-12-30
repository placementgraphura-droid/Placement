// components/StudyMaterial.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiBookOpen,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiBook,
  FiFilter
} from 'react-icons/fi';
import { BookOpen, Search } from 'lucide-react';

const StudyMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [subjects, setSubjects] = useState([]);

  const itemsPerPage = 9

  // Subject icons
  const subjectIcons = {
    'Web Development': '🌐',
    'Mobile Development': '📱',
    'Backend Development': '⚙️',
    'Frontend Development': '🎨',
    'Full Stack Development': '🔄',
    'AI/ML': '🤖',
    'Data Science': '📊',
    'Deep Learning': '🧠',
    'Natural Language Processing': '🗣️',
    'Computer Vision': '👁️',
    'DevOps': '🚀',
    'Cloud Computing': '☁️',
    'Containerization': '📦',
    'CI/CD': '🔄',
    'Infrastructure as Code': '🏗️',
    'Database Management': '🗄️',
    'Big Data': '📈',
    'Data Analytics': '📉',
    'Data Engineering': '🔧',
    'Cybersecurity': '🛡️',
    'Network Security': '🔒',
    'Ethical Hacking': '💻',
    'Blockchain': '⛓️',
    'IoT': '📡',
    'Game Development': '🎮',
    'AR/VR': '👓',
    'Programming Fundamentals': '💻',
    'Algorithms & Data Structures': '📚',
    'Software Engineering': '🏗️',
    'System Design': '🎯',
    'Project Management': '📋',
    'UI/UX Design': '🎨',
    'Business Analytics': '💹'
  };


  // Get subject icon
  const getSubjectIcon = (subject) => {
    return subjectIcons[subject] || '📖';
  };

  // Fetch materials from backend API
  const fetchMaterials = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/intern/study-materials`, {
        params: {
          page,
          limit: itemsPerPage,
          sortBy: 'createdAt',
          order: 'desc'
        }
      });

      const materialsData = response.data.materials || [];
      setMaterials(materialsData);
      setFilteredMaterials(materialsData);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
      setError(null);

      // Extract unique subjects for filter
      if (materialsData.length > 0) {
        const uniqueSubjects = ['All', ...new Set(materialsData.map(m => m.subject))];
        setSubjects(uniqueSubjects);
      }
    } catch (err) {
      setError('Failed to fetch study materials. Please try again later.');
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter materials based on search and subject
  const filterMaterials = useCallback(() => {
    let filtered = [...materials];

    // Apply subject filter
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(material =>
        material.subject === selectedSubject
      );
    }

    // Apply search filter (case-insensitive, includes search)
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(material =>
        material.title?.toLowerCase().includes(searchLower) ||
        material.description?.toLowerCase().includes(searchLower) ||
        material.subject?.toLowerCase().includes(searchLower) ||
        material.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        material.author?.toLowerCase().includes(searchLower)
      );
    }

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    setFilteredMaterials(paginated);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [materials, selectedSubject, searchTerm, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Open PDF Modal
  const openPdfModal = async (material) => {
    setSelectedMaterial(material);
    setPdfLoading(true);

    // Track view
    try {
      await axios.post(`/api/intern/study-materials/${material._id}/view`);
    } catch (err) {
      console.error('Error tracking view:', err);
    }

    setTimeout(() => setPdfLoading(false), 500);
  };

  // Close PDF Modal
  const closePdfModal = () => {
    setSelectedMaterial(null);
  };

  // Get direct PDF URL - fix URL if needed
  const getPdfViewerUrl = (pdfUrl) => {
    if (!pdfUrl) return '';
    return `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  };


  // Initial fetch
  useEffect(() => {
    fetchMaterials(1);
  }, []);

  // Apply filters when search term or subject changes
  useEffect(() => {
    filterMaterials();
  }, [filterMaterials]);

  // Reset to page 1 when search or subject changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSubject]);

  // Loading State
  const LoadingState = () => (
    <div className="py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-6"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Error State
  const ErrorState = () => (
    <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-8 text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
        <FiBook className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={() => fetchMaterials(currentPage)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md"
      >
        Try Again
      </button>
    </div>
  );

  // Material Card
  const MaterialCard = ({ material }) => (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 overflow-hidden hover:-translate-y-1">
      <div className="p-6">
        {/* Subject Badge */}
        <div className="flex justify-between items-start mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${(material.subject)} border`}>
            <span className="text-sm">{getSubjectIcon(material.subject)}</span>
            {material.subject}
          </span>
          <FiBookOpen className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
          {material.title}
        </h3>

        {/* Description with highlighted search term */}
        <p className="text-gray-600 text-sm mb-5 line-clamp-3 min-h-[3.5rem]">
          {searchTerm ? highlightSearchTerm(material.description || '', searchTerm) : material.description}
        </p>

        <a href={material.link} target="_blank" rel="noopener noreferrer" className='text-blue-600 underline'>Visit Resources</a>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
          <span className="text-gray-400">
            {material.pages ? `${material.pages} pages` : 'PDF Document'}
          </span>
          {material.difficulty && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${material.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
              material.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
              {material.difficulty}
            </span>
          )}
        </div>

        {/* Preview Button */}
        <button
          onClick={() => openPdfModal(material)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center group/btn"
        >
          <FiBookOpen className="mr-2 w-5 h-5" />
          <span>Preview PDF</span>
        </button>
      </div>
    </div>
  );

  // Highlight search term in text
  const highlightSearchTerm = (text, term) => {
    if (!text || !term) return text;

    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ?
        <mark key={index} className="bg-yellow-200 font-semibold">{part}</mark> :
        part
    );
  };

  // PDF Modal Component
  const PdfModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full h-full md:h-[95vh] md:max-w-6xl rounded-none md:rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${(selectedMaterial.subject)}`}>
                  <span className="text-sm">{getSubjectIcon(selectedMaterial.subject)}</span>
                  {selectedMaterial.subject}
                </span>
                {selectedMaterial.difficulty && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${selectedMaterial.difficulty === 'Beginner' ? 'bg-green-500 text-white' :
                    selectedMaterial.difficulty === 'Intermediate' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                    {selectedMaterial.difficulty}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-2 line-clamp-2">
                {selectedMaterial.title}
              </h3>
            </div>
            <button
              onClick={closePdfModal}
              className="ml-4 p-2 rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content - Full PDF Viewer */}
        <div className="flex-1 min-h-0 bg-gray-100">
          {pdfLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                  <FiBookOpen className="w-8 h-8 text-white animate-pulse" />
                </div>
                <p className="text-gray-600 font-medium">Loading PDF...</p>
              </div>
            </div>
          ) : (
            <iframe
              src={getPdfViewerUrl(selectedMaterial.pdfUrl)}
              className="w-full h-full border-0"
              title={`${selectedMaterial.title} - PDF Viewer`}
              loading="lazy"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );

  // Pagination Component
  const PaginationComponent = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="text-sm text-gray-600">
        Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span> •
        Showing <span className="font-bold">{filteredMaterials.length}</span> of {materials.length} materials
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all hover:shadow-md"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-xl font-medium transition-all text-sm ${currentPage === pageNum
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:shadow-md'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all hover:shadow-md"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Study Materials</h1>
                <p className="text-gray-600 mt-2">
                  Browse through our comprehensive collection of learning resources
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiFilter className="w-4 h-4" />
              <span>
                {selectedSubject === 'All' ? 'All Subjects' : selectedSubject}
                {searchTerm && ` • Searching: "${searchTerm}"`}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search in titles, descriptions, subjects, tags, or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Search includes: Title, Description, Subject, Tags, and Author
            </div>
          </div>

          {/* Subject Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium text-sm transition-all ${selectedSubject === subject
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {subject === 'All' ? 'All Subjects' : subject}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results Info */}
          {(searchTerm || selectedSubject !== 'All') && filteredMaterials.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-blue-800 text-sm">
                Found <span className="font-bold">{filteredMaterials.length}</span> materials
                {searchTerm && ` matching "${searchTerm}"`}
                {selectedSubject !== 'All' && ` in ${selectedSubject}`}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && <LoadingState />}

          {/* Error State */}
          {error && <ErrorState />}

          {/* Materials Grid */}
          {!loading && !error && (
            <>
              {filteredMaterials.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredMaterials.map((material) => (
                      <MaterialCard key={material._id} material={material} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && <PaginationComponent />}
                </>
              ) : (
                /* No Materials Message */
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-6 shadow-inner">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No materials found</h3>
                  <p className="text-gray-600 max-w-md mx-auto text-lg mb-6">
                    {searchTerm || selectedSubject !== 'All'
                      ? 'Try adjusting your search or filter criteria'
                      : 'New materials are being added regularly. Check back soon!'}
                  </p>
                  {(searchTerm || selectedSubject !== 'All') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedSubject('All');
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* PDF Modal */}
      {selectedMaterial && <PdfModal />}
    </div>
  );
};

export default StudyMaterial;