// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Brain, 
  Database, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Users,
  Clock,
  Cloud,
  Moon,
  Sun,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

// Custom SVG icons for social media
const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ FIXED: Use useEffect instead of useState
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Brain size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Command Center
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">Features</a>
              <a href="#solutions" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">Solutions</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">Pricing</a>
              <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Zap size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">AI-Powered Analytics Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Data Analytics & <br />
            Machine Learning Command Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your data into actionable insights with our enterprise-grade analytics platform. 
            Train ML models, generate forecasts, and create stunning visualizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
            >
              <LayoutDashboard size={20} />
              Go to Dashboard
            </Link>
            <a
              href="#features"
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2 justify-center"
            >
              Watch Demo
              <ArrowRight size={18} />
            </a>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uptime SLA</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">10K+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Models Trained</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">1M+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Predictions Daily</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">500+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enterprise Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800/50 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Powerful Features</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to turn data into decisions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl transition-colors duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Database size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Data Management</h3>
              <p className="text-gray-600 dark:text-gray-400">Upload CSV/Excel files, manage datasets, and prepare data for analysis.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl transition-colors duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Brain size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Machine Learning</h3>
              <p className="text-gray-600 dark:text-gray-400">Train XGBoost models with automatic hyperparameter tuning.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl transition-colors duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Forecasting</h3>
              <p className="text-gray-600 dark:text-gray-400">Time series forecasting with confidence intervals and seasonality.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl transition-colors duration-300">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 size={24} className="text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Interactive Dashboards</h3>
              <p className="text-gray-600 dark:text-gray-400">Real-time visualizations and customizable widgets.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl transition-colors duration-300">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Enterprise Security</h3>
              <p className="text-gray-600 dark:text-gray-400">Role-based access control and audit logging.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl transition-colors duration-300">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                <Cloud size={24} className="text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Cloud Native</h3>
              <p className="text-gray-600 dark:text-gray-400">Deploy anywhere with Docker and Kubernetes support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Solutions for Every Team</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From data scientists to business analysts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Data Scientists</h3>
              <p className="text-gray-600 dark:text-gray-400">Train custom ML models with XGBoost and track performance metrics.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Business Analysts</h3>
              <p className="text-gray-600 dark:text-gray-400">Create reports, dashboards, and forecasts without code.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">IT Administrators</h3>
              <p className="text-gray-600 dark:text-gray-400">Manage users, roles, and monitor system health.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-800/50 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the plan that works for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Free</h3>
              <p className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">$0<span className="text-sm font-normal text-gray-600 dark:text-gray-400">/month</span></p>
              <ul className="space-y-2 mb-6 text-left">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> Up to 5 datasets</li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> Basic ML models</li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> Community support</li>
              </ul>
              <Link href="/register" className="block w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Get Started
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 text-center border-2 border-blue-500 shadow-lg transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Pro</h3>
              <p className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">$49<span className="text-sm font-normal text-gray-600 dark:text-gray-400">/month</span></p>
              <ul className="space-y-2 mb-6 text-left">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> Unlimited datasets</li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> Advanced ML models</li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> Priority support</li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> API access</li>
              </ul>
              <Link href="/register" className="block w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition">
                Start Free Trial
              </Link>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Enterprise</h3>
              <p className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Custom</p>
              <ul className="space-y-2 mb-6 text-left">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> Custom SLAs</li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> On-premise deployment</li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> 24/7 phone support</li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><CheckCircle size={16} className="text-green-500 flex-shrink-0" /> Dedicated account manager</li>
              </ul>
              <a href="#contact" className="block w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 dark:bg-gray-950 text-white py-12 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Brain size={20} className="text-white" />
                </div>
                <span className="text-lg font-bold">Command Center</span>
              </div>
              <p className="text-gray-400 text-sm">
                Enterprise-grade data analytics and machine learning platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-blue-400 transition"><GitHubIcon /></a>
                <a href="#" className="hover:text-blue-400 transition"><XIcon /></a>
                <a href="#" className="hover:text-blue-400 transition"><LinkedinIcon /></a>
                <a href="#" className="hover:text-blue-400 transition"><MailIcon /></a>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                support@commandcenter.com<br />
                +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Command Center. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}