import Link from "next/link";
import { Card } from "@repo/ui/card";
import { Gradient } from "@repo/ui/gradient";

const FEATURES = [
  {
    title: "AI-Powered Learning",
    href: "/dashboard",
    description: "GPT-4o powered personalized study plans with predictive analytics and 90%+ score accuracy.",
    icon: "🧠"
  },
  {
    title: "Voice AI Tutor",
    href: "/tutor",
    description: "NEET Buddy 3.0 - Voice AI support in 8 Indian languages with cultural context.",
    icon: "🗣️"
  },
  {
    title: "Adaptive Quizzes",
    href: "/practice",
    description: "IRT-based adaptive testing with emotional intelligence and real-time difficulty adjustment.",
    icon: "🎯"
  },
  {
    title: "AR Question Scanner",
    href: "/scanner",
    description: "Advanced OCR with Battle Mode - gamified competitive problem-solving experience.",
    icon: "📱"
  },
];

const STATS = [
  { number: "230,000+", label: "Active Students" },
  { number: "50,000+", label: "NEET Questions" },
  { number: "30+", label: "Years of Data" },
  { number: "90%+", label: "Score Accuracy" },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Gradient
            className="opacity-20 w-[800px] h-[800px] top-[-400px] left-1/2 transform -translate-x-1/2"
            conic
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">NEET Prep AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Pricing
              </Link>
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sign In
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              India's Most{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Intelligent
              </span>
              <br />
              NEET Preparation Platform
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
              Transform your NEET preparation with AI-powered personalized learning, adaptive quizzes,
              voice tutoring in 8 Indian languages, and predictive analytics that improve scores by 30-50%.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                href="/demo"
                className="border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Watch Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {STATS.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why 230,000+ Students Choose NEET Prep AI
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of NEET preparation with cutting-edge AI technology,
              comprehensive question bank, and personalized learning paths.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, index) => (
              <Card
                key={index}
                href={feature.href}
                title={feature.title}
                className="p-6 h-full border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your NEET Preparation?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have improved their scores by 30-50% with our AI-powered platform.
          </p>
          <Link
            href="/signup"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Start Your Free Trial Today
          </Link>
        </div>
      </div>
    </main>
  );
}
