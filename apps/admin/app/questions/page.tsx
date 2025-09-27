'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@neet/ui/button';

interface MockQuestion {
  id: string;
  question_text: string;
  options: { A: string; B: string; C: string; D: string };
  subject: 'Physics' | 'Chemistry' | 'Biology';
  year: number;
  difficulty: { level: number };
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: { text: string };
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function QuestionsPage() {
  const [questions] = useState<MockQuestion[]>([
    {
      id: '1',
      question_text: 'A particle moves along a straight line with constant acceleration. If its initial velocity is 5 m/s and it travels 100 m in 10 seconds, what is its acceleration?',
      options: {
        A: '0.5 m/s²',
        B: '1.0 m/s²',
        C: '1.5 m/s²',
        D: '2.0 m/s²'
      },
      subject: 'Physics',
      year: 2024,
      difficulty: { level: 3 },
      correct_option: 'B',
      explanation: { text: 'Using s = ut + (1/2)at², we get 100 = 5×10 + (1/2)×a×100, solving gives a = 1.0 m/s²' },
      status: 'approved',
      created_at: '2025-01-15T10:35:00Z',
      updated_at: '2025-01-15T10:45:00Z'
    },
    {
      id: '2',
      question_text: 'Which of the following compounds exhibits geometrical isomerism?',
      options: {
        A: 'CH₃-CH₂-CH₂-CH₃',
        B: 'CH₃-CH=CH-CH₃',
        C: 'CH₃-CH₂-OH',
        D: 'CH₃-CO-CH₃'
      },
      subject: 'Chemistry',
      year: 2023,
      difficulty: { level: 2 },
      correct_option: 'B',
      explanation: { text: 'But-2-ene can exist as cis and trans isomers due to restricted rotation around the C=C double bond.' },
      status: 'pending',
      created_at: '2025-01-15T11:05:00Z',
      updated_at: '2025-01-15T11:05:00Z'
    },
    {
      id: '3',
      question_text: 'The process of photosynthesis primarily occurs in which part of the plant cell?',
      options: {
        A: 'Mitochondria',
        B: 'Chloroplasts',
        C: 'Nucleus',
        D: 'Ribosomes'
      },
      subject: 'Biology',
      year: 2022,
      difficulty: { level: 1 },
      correct_option: 'B',
      explanation: { text: 'Chloroplasts contain chlorophyll and are the primary site of photosynthesis in plant cells.' },
      status: 'pending',
      created_at: '2025-01-14T14:20:00Z',
      updated_at: '2025-01-15T09:15:00Z'
    }
  ]);

  const [selectedQuestion, setSelectedQuestion] = useState<MockQuestion | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    subject: 'all',
    status: 'all',
    difficulty: 'all',
    year: 'all',
    search: ''
  });

  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      if (filters.subject !== 'all' && question.subject !== filters.subject) return false;
      if (filters.status !== 'all' && question.status !== filters.status) return false;
      if (filters.difficulty !== 'all' && question.difficulty.level.toString() !== filters.difficulty) return false;
      if (filters.year !== 'all' && question.year.toString() !== filters.year) return false;
      if (filters.search && !question.question_text.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [questions, filters]);

  const stats = useMemo(() => {
    return {
      total: questions.length,
      approved: questions.filter(q => q.status === 'approved').length,
      pending: questions.filter(q => q.status === 'pending').length,
      rejected: questions.filter(q => q.status === 'rejected').length,
    };
  }, [questions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateQuestionStatus = (questionId: string, newStatus: 'approved' | 'pending' | 'rejected') => {
    console.log(`Updating question ${questionId} status to ${newStatus}`);
  };

  const deleteQuestion = (questionId: string) => {
    console.log(`Deleting question ${questionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  ← Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Question Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Export Questions
              </Button>
              <Button size="sm">
                Add Question
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Questions</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters & Question List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.subject}
                    onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                  >
                    <option value="all">All Subjects</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.difficulty}
                    onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                  >
                    <option value="all">All Levels</option>
                    <option value="1">1 (Easy)</option>
                    <option value="2">2</option>
                    <option value="3">3 (Medium)</option>
                    <option value="4">4</option>
                    <option value="5">5 (Hard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters.year}
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                  >
                    <option value="all">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Questions ({filteredQuestions.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {filteredQuestions.map((question) => (
                  <div
                    key={question.id}
                    className={`p-6 cursor-pointer transition-colors ${
                      selectedQuestion?.id === question.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedQuestion(question)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm text-blue-600">
                            {question.subject}
                          </span>
                          <span className="text-sm text-gray-500">
                            Level {question.difficulty.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {question.question_text}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(question.status)}`}>
                        {question.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Year: {question.year}</span>
                        <span>4 options</span>
                      </div>
                      <span>
                        {new Date(question.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredQuestions.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No questions match the current filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Question Details */}
          <div>
            {selectedQuestion ? (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Question Details
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        Question Details
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedQuestion.status)}`}>
                        {selectedQuestion.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Subject:</span>
                        <span className="ml-2 font-medium">{selectedQuestion.subject}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Difficulty:</span>
                        <span className="ml-2 font-medium">Level {selectedQuestion.difficulty.level}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Year:</span>
                        <span className="ml-2 font-medium">{selectedQuestion.year}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Answer:</span>
                        <span className="ml-2 font-medium">{selectedQuestion.correct_option}</span>
                      </div>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                      {selectedQuestion.question_text}
                    </p>
                  </div>

                  {/* Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    <div className="space-y-2">
                      {Object.entries(selectedQuestion.options).map(([key, value]) => (
                        <div key={key} className="flex items-start space-x-2">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                            selectedQuestion.correct_option === key
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {key}
                          </span>
                          <span className="flex-1 text-sm text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                      {selectedQuestion.explanation.text}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="border-t pt-4">
                    <div className="flex space-x-2">
                      {selectedQuestion.status !== 'approved' && (
                        <Button
                          size="sm"
                          onClick={() => updateQuestionStatus(selectedQuestion.id, 'approved')}
                        >
                          Approve
                        </Button>
                      )}

                      {selectedQuestion.status !== 'rejected' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuestionStatus(selectedQuestion.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      )}

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteQuestion(selectedQuestion.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">Select a question to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}