'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  BookOpen,
  Video,
  MessageCircle,
  FileText,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Play,
  Download,
  Star,
  Clock,
  Users,
  Lightbulb,
  Settings,
  CreditCard,
  UserPlus,
  BarChart3,
  Mail,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  rating: number;
  views: number;
  lastUpdated: string;
  content?: string;
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  views: number;
  rating: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  views: number;
}

export default function HelpPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSection, setActiveSection] = useState<'articles' | 'videos' | 'faq' | 'contact'>('articles');

  const categories = [
    { id: 'all', name: 'All Categories', icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', icon: UserPlus },
    { id: 'student-management', name: 'Student Management', icon: Users },
    { id: 'assessments', name: 'Tests & Assignments', icon: FileText },
    { id: 'analytics', name: 'Analytics & Reports', icon: BarChart3 },
    { id: 'billing', name: 'Billing & Payments', icon: CreditCard },
    { id: 'settings', name: 'Settings & Configuration', icon: Settings },
  ];

  const helpArticles: HelpArticle[] = [
    {
      id: '1',
      title: 'Getting Started with NEETAI Coach Portal',
      description: 'Learn the basics of setting up your coaching institute on our platform',
      category: 'getting-started',
      difficulty: 'beginner',
      readTime: 5,
      rating: 4.8,
      views: 1234,
      lastUpdated: '2024-01-15',
      content: 'Complete guide to getting started...',
    },
    {
      id: '2',
      title: 'How to Add and Manage Students',
      description: 'Step-by-step guide for student enrollment and profile management',
      category: 'student-management',
      difficulty: 'beginner',
      readTime: 8,
      rating: 4.6,
      views: 987,
      lastUpdated: '2024-01-12',
    },
    {
      id: '3',
      title: 'Creating and Scheduling Tests',
      description: 'Advanced test creation with custom questions and automatic grading',
      category: 'assessments',
      difficulty: 'intermediate',
      readTime: 12,
      rating: 4.7,
      views: 756,
      lastUpdated: '2024-01-10',
    },
    {
      id: '4',
      title: 'Understanding Analytics Dashboard',
      description: 'How to interpret performance metrics and generate reports',
      category: 'analytics',
      difficulty: 'intermediate',
      readTime: 15,
      rating: 4.5,
      views: 623,
      lastUpdated: '2024-01-08',
    },
    {
      id: '5',
      title: 'Subscription Plans and Billing',
      description: 'Managing your subscription, payments, and invoices',
      category: 'billing',
      difficulty: 'beginner',
      readTime: 6,
      rating: 4.4,
      views: 892,
      lastUpdated: '2024-01-05',
    },
  ];

  const videoTutorials: VideoTutorial[] = [
    {
      id: '1',
      title: 'Complete Platform Walkthrough',
      description: 'A comprehensive tour of all features and capabilities',
      duration: '15:32',
      thumbnail: '/videos/walkthrough-thumb.jpg',
      category: 'getting-started',
      difficulty: 'beginner',
      views: 2345,
      rating: 4.9,
    },
    {
      id: '2',
      title: 'Bulk Student Import Tutorial',
      description: 'How to import multiple students using CSV files',
      duration: '8:45',
      thumbnail: '/videos/bulk-import-thumb.jpg',
      category: 'student-management',
      difficulty: 'intermediate',
      views: 1876,
      rating: 4.7,
    },
    {
      id: '3',
      title: 'Advanced Test Configuration',
      description: 'Creating complex tests with multiple question types',
      duration: '12:28',
      thumbnail: '/videos/test-config-thumb.jpg',
      category: 'assessments',
      difficulty: 'advanced',
      views: 1234,
      rating: 4.8,
    },
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I reset a student\'s password?',
      answer: 'Go to Students → Select the student → Click on "Reset Password". The student will receive an email with instructions.',
      category: 'student-management',
      helpful: 45,
      views: 234,
    },
    {
      id: '2',
      question: 'Can I customize the test duration for different students?',
      answer: 'Yes, you can set individual test durations by going to the test settings and enabling "Custom Duration" option.',
      category: 'assessments',
      helpful: 38,
      views: 198,
    },
    {
      id: '3',
      question: 'How do I export student performance data?',
      answer: 'Navigate to Analytics → Select the desired date range → Click "Export" and choose your preferred format (CSV, PDF, or Excel).',
      category: 'analytics',
      helpful: 52,
      views: 156,
    },
    {
      id: '4',
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and bank transfers. International payments are supported through Stripe.',
      category: 'billing',
      helpful: 29,
      views: 134,
    },
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredVideos = videoTutorials.filter(video => {
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
        <p className="text-gray-600">Find answers, tutorials, and get support for your coaching institute</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for help articles, tutorials, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        'w-full flex items-center space-x-3 px-4 py-3 text-left text-sm hover:bg-gray-50',
                        selectedCategory === category.id ? 'bg-primary/5 text-primary border-r-2 border-primary' : 'text-gray-600'
                      )}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Live Chat
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Schedule Call
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Section Tabs */}
          <div className="flex space-x-1 mb-6">
            {[
              { id: 'articles', label: 'Articles', icon: BookOpen },
              { id: 'videos', label: 'Video Tutorials', icon: Video },
              { id: 'faq', label: 'FAQ', icon: HelpCircle },
              { id: 'contact', label: 'Contact Support', icon: MessageCircle },
            ].map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium',
                    activeSection === section.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>

          {/* Articles Section */}
          {activeSection === 'articles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Help Articles</h2>
                <span className="text-sm text-gray-600">{filteredArticles.length} articles</span>
              </div>
              
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{article.title}</h3>
                          <Badge className={getDifficultyColor(article.difficulty)}>
                            {article.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{article.readTime} min read</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                            <span>{article.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{article.views} views</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Videos Section */}
          {activeSection === 'videos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Video Tutorials</h2>
                <span className="text-sm text-gray-600">{filteredVideos.length} videos</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVideos.map((video) => (
                  <Card key={video.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                          <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center">
                            <Play className="h-6 w-6 text-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm">{video.title}</h3>
                          <Badge className={getDifficultyColor(video.difficulty)}>
                            {video.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-xs mb-3">{video.description}</p>
                        
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                            <span>{video.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{video.views} views</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {activeSection === 'faq' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
                <span className="text-sm text-gray-600">{filteredFAQs.length} questions</span>
              </div>
              
              {filteredFAQs.map((faq) => (
                <Card key={faq.id}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm mb-4">{faq.answer}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>{faq.helpful} people found this helpful</span>
                        <span>{faq.views} views</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-xs">
                          👍 Helpful
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          👎 Not helpful
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Contact Support</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5" />
                      <span>Live Chat</span>
                    </CardTitle>
                    <CardDescription>Get instant help from our support team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      Start Live Chat
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Average response time: 2 minutes
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Mail className="h-5 w-5" />
                      <span>Email Support</span>
                    </CardTitle>
                    <CardDescription>Send us a detailed message</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Send Email
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Average response time: 4 hours
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Phone className="h-5 w-5" />
                      <span>Phone Support</span>
                    </CardTitle>
                    <CardDescription>Schedule a call with our experts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Schedule Call
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Available: Mon-Fri, 9 AM - 6 PM IST
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5" />
                      <span>Feature Request</span>
                    </CardTitle>
                    <CardDescription>Suggest new features or improvements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Submit Request
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Help us improve the platform
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Send us a message and we'll get back to you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Input placeholder="Brief description of your issue" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      placeholder="Please provide as much detail as possible about your question or issue..."
                      className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
                    />
                  </div>
                  
                  <Button>Send Message</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}