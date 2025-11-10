import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { 
  Upload, 
  Lock, 
  Zap, 
  Shield, 
  Download, 
  FileText, 
  Image, 
  Video, 
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Moon,
  Sun,
  Menu,
  X,
  Server,
  Eye,
  Search,
  Smartphone
} from 'lucide-react';

export default function Landing() {
  const { isDark, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const features = [
    {
      icon: Lock,
      title: 'Complete Privacy',
      description: 'Your chats never leave your server. Self-hosted solution means you own your data 100%.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant chat loading with smart caching. View thousands of messages without lag.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Secure Storage',
      description: 'Military-grade encryption for stored chats. Multi-user support with isolated data.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Eye,
      title: 'Exact WhatsApp UI',
      description: 'Pixel-perfect replica of WhatsApp Web. Familiar interface, zero learning curve.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Find any message instantly. Search through text, dates, and media files.',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      icon: Server,
      title: 'Self-Hosted',
      description: 'Deploy on your own VPS. No third-party services, no data sharing, ever.',
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

  const exportSteps = [
    {
      number: '01',
      title: 'Open WhatsApp',
      description: 'Launch WhatsApp on your phone (iOS or Android)',
      details: [
        'Open the WhatsApp application',
        'Navigate to the chat you want to export',
        'Works with individual chats and group chats'
      ]
    },
    {
      number: '02',
      title: 'Access Chat Options',
      description: 'Tap the three dots menu in the chat',
      details: [
        'iOS: Tap the contact/group name at the top',
        'Android: Tap the three vertical dots (⋮) in top-right',
        'Look for "More" or "Export Chat" option'
      ]
    },
    {
      number: '03',
      title: 'Export Chat',
      description: 'Select "Export Chat" from the menu',
      details: [
        'Choose "Include Media" for complete export',
        'Or "Without Media" for text-only (faster)',
        'WhatsApp will prepare your chat archive'
      ]
    },
    {
      number: '04',
      title: 'Save ZIP File',
      description: 'Save the exported .zip file to your device',
      details: [
        'Choose "Save to Files" or similar option',
        'Remember the location where you saved it',
        'File will be named like "WhatsApp Chat with [Name].zip"'
      ]
    },
    {
      number: '05',
      title: 'Transfer to Computer',
      description: 'Move the ZIP file to your computer',
      details: [
        'Use USB cable, AirDrop, or cloud storage',
        'Email it to yourself (if file size permits)',
        'Or use any file transfer method you prefer'
      ]
    }
  ];

  const importSteps = [
    {
      icon: Upload,
      title: 'Upload ZIP File',
      description: 'Drag and drop your WhatsApp export ZIP file or click to browse',
      color: 'text-blue-500'
    },
    {
      icon: FileText,
      title: 'Automatic Processing',
      description: 'Our system extracts and parses your chat.txt file and media folder',
      color: 'text-green-500'
    },
    {
      icon: Image,
      title: 'Media Mapping',
      description: 'All photos, videos, and files are automatically linked to their messages',
      color: 'text-purple-500'
    },
    {
      icon: MessageSquare,
      title: 'Ready to View',
      description: 'Your chat appears in the exact WhatsApp interface you know and love',
      color: 'text-pink-500'
    }
  ];

  const howItWorks = [
    {
      title: 'ZIP Extraction',
      description: 'When you upload a WhatsApp export, we use streaming extraction to handle files of any size without memory issues.',
      technical: 'Node.js streams + yauzl library for efficient ZIP processing'
    },
    {
      title: 'Text Parsing',
      description: 'The _chat.txt file is parsed line-by-line to extract timestamps, senders, and message content with support for multiple date formats.',
      technical: 'Regex-based parser supporting DD/MM/YYYY and MM/DD/YYYY formats'
    },
    {
      title: 'Media Linking',
      description: 'Media files are matched to messages using filename patterns and stored with unique identifiers to prevent conflicts.',
      technical: 'PostgreSQL with indexed media_path column for fast lookups'
    },
    {
      title: 'Thumbnail Generation',
      description: 'Images and videos get optimized thumbnails for fast loading in the chat list and message view.',
      technical: 'Sharp library for image processing, FFmpeg for video thumbnails'
    },
    {
      title: 'Background Processing',
      description: 'Large imports run in background jobs using Bull queue system, so you can close the browser and come back later.',
      technical: 'Redis-backed job queue with progress tracking and retry logic'
    },
    {
      title: 'Secure Storage',
      description: 'All data is stored on your VPS with user-isolated directories. Each user can only access their own uploaded chats.',
      technical: 'JWT authentication + filesystem isolation + PostgreSQL row-level security'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'} border-b transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ChatVault
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Features
              </a>
              <a href="#how-to-export" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                Export Guide
              </a>
              <a href="#how-it-works" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                How It Works
              </a>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} transition-colors`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${isDark ? 'bg-gray-800' : 'bg-gray-50'} border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2">Features</a>
              <a href="#how-to-export" className="block py-2">Export Guide</a>
              <a href="#how-it-works" className="block py-2">How It Works</a>
              <Link to="/register" className="block w-full px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10 pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/10 rounded-full mb-8 animate-fade-in">
              <Shield className="w-4 h-4 text-green-500" />
              <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                100% Self-Hosted • Your Data, Your Server
              </span>
            </div>

            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'} animate-slide-up`}>
              View Your WhatsApp
              <span className="block mt-2 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                Chats Anywhere
              </span>
            </h1>

            <p className={`text-xl sm:text-2xl mb-12 ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto animate-slide-up delay-100`}>
              Self-hosted WhatsApp chat viewer with pixel-perfect UI replication. 
              Import your exported chats and browse them in the exact WhatsApp Web interface.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-2xl hover:shadow-green-500/50 hover:scale-105 flex items-center space-x-2"
              >
                <span>Start Viewing Chats</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-to-export"
                className={`px-8 py-4 ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} rounded-xl font-semibold text-lg transition-all flex items-center space-x-2`}
              >
                <Download className="w-5 h-5" />
                <span>Learn How to Export</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>100%</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Private</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>∞</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Chats</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>0</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tracking</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Powerful Features
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Everything you need to view, search, and manage your WhatsApp chat exports
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl ${isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-all hover:shadow-2xl hover:scale-105 cursor-pointer`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Export Section */}
      <section id="how-to-export" className={`py-20 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 rounded-full mb-6">
              <Smartphone className="w-4 h-4 text-blue-500" />
              <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Step-by-Step Guide
              </span>
            </div>
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              How to Export WhatsApp Chats
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Follow these simple steps to export your WhatsApp conversations
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {exportSteps.map((step, index) => (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className={`group cursor-pointer p-8 rounded-2xl ${isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'} border-2 ${activeStep === index ? 'border-green-500 shadow-2xl shadow-green-500/20' : isDark ? 'border-gray-700' : 'border-gray-200'} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-start space-x-6">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl ${activeStep === index ? 'bg-gradient-to-br from-green-500 to-green-600' : isDark ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center font-bold text-2xl ${activeStep === index ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'} transition-all group-hover:scale-110`}>
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                    {activeStep === index && (
                      <ul className="space-y-2 animate-fade-in">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-12 p-8 rounded-2xl ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} border-2`}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Pro Tip: Include Media
                </h4>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Always choose "Include Media" when exporting to get the full experience with all photos, videos, and files. 
                  The ZIP file will be larger, but you'll have a complete archive of your conversation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Import Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Import Process
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Once you have your WhatsApp export, importing is incredibly simple
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {importSteps.map((step, index) => (
              <div
                key={index}
                className="relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`p-8 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} h-full transition-all hover:shadow-2xl hover:scale-105`}>
                  <div className={`w-14 h-14 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-white'} flex items-center justify-center mb-6 shadow-lg`}>
                    <step.icon className={`w-7 h-7 ${step.color}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {step.title}
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </div>
                {index < importSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className={`w-8 h-8 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-2xl hover:shadow-green-500/50 hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              <span>Start Importing Now</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works (Technical) Section */}
      <section id="how-it-works" className={`py-20 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/10 rounded-full mb-6">
              <Server className="w-4 h-4 text-purple-500" />
              <span className={`text-sm font-medium ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                Under the Hood
              </span>
            </div>
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              How It Works
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Technical overview of the chat processing pipeline
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-all hover:shadow-2xl hover:scale-105`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                </div>
                <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
                </p>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-900/50' : 'bg-gray-100'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <code className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {item.technical}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-4xl sm:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Your Data,
                <span className="block mt-2 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  Your Control
                </span>
              </h2>
              <p className={`text-xl mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Unlike cloud-based solutions, ChatVault runs entirely on your own server. 
                No third parties, no data mining, no privacy concerns.
              </p>
              <div className="space-y-6">
                {[
                  {
                    icon: Lock,
                    title: 'Zero Data Collection',
                    description: 'We never see your chats. Everything stays on your VPS.'
                  },
                  {
                    icon: Shield,
                    title: 'Military-Grade Security',
                    description: 'JWT authentication, encrypted storage, isolated user data.'
                  },
                  {
                    icon: Server,
                    title: 'Full Ownership',
                    description: 'You own the code, the server, and all your data forever.'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {benefit.title}
                      </h4>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-12 rounded-3xl ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-2xl`}>
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-6 shadow-2xl">
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Self-Hosted Architecture
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Your VPS', value: '100%', color: 'green' },
                    { label: 'Third-Party Services', value: '0%', color: 'red' },
                    { label: 'Data Ownership', value: '100%', color: 'blue' },
                    { label: 'Privacy Concerns', value: '0%', color: 'red' }
                  ].map((stat, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {stat.label}
                        </span>
                        <span className={`font-bold ${stat.color === 'green' ? 'text-green-500' : stat.color === 'blue' ? 'text-blue-500' : 'text-red-500'}`}>
                          {stat.value}
                        </span>
                      </div>
                      <div className={`h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                        <div
                          className={`h-full rounded-full ${stat.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' : stat.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-red-500 to-red-600'} transition-all duration-1000`}
                          style={{ width: stat.value }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className={`relative overflow-hidden rounded-3xl ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-900 to-gray-800'} p-12 shadow-2xl`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Ready to View Your Chats?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join ChatVault today and start browsing your WhatsApp exports in a beautiful, 
                privacy-focused interface that you control.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="group px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 flex items-center space-x-2"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-gray-700 text-white rounded-xl font-semibold text-lg hover:bg-gray-600 transition-all flex items-center space-x-2"
                >
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ChatVault
                </span>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                Self-hosted WhatsApp chat viewer. Your data, your control.
              </p>
            </div>

            <div>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Features</a></li>
                <li><a href="#how-to-export" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Export Guide</a></li>
                <li><a href="#how-it-works" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Documentation</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>API Reference</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Deployment Guide</a></li>
              </ul>
            </div>

            <div>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Privacy Policy</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Terms of Service</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>License</a></li>
              </ul>
            </div>
          </div>

          <div className={`pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} text-center`}>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              © 2025 ChatVault. Open source and self-hosted. Built with privacy in mind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
