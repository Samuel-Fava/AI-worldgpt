import React from 'react';
import { Bot, Zap, Shield, Globe, Sparkles, ArrowRight } from 'lucide-react';

interface DashboardProps {
  onGetStarted: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Bot,
      title: 'Multiple AI Models',
      description: 'Access GPT-4, Claude, DeepSeek and more in one place',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed with instant responses',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your conversations are encrypted and private',
    },
    {
      icon: Globe,
      title: 'Always Available',
      description: '24/7 access from anywhere in the world',
    },
  ];

  const models = [
    { name: 'GPT-4', description: 'Most capable model', badge: 'Popular' },
    { name: 'GPT-4o', description: 'Optimized for speed', badge: 'Fast' },
    { name: 'Claude', description: 'Anthropic\'s advanced AI', badge: 'Smart' },
    { name: 'DeepSeek', description: 'Advanced reasoning', badge: 'New' },
  ];

  const stats = [
    { value: '10M+', label: 'Conversations' },
    { value: '500K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '8', label: 'AI Models' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 w-full transition-colors duration-300">
      {/* Header */}
      <header className="px-6 py-4 glass-effect border-b border-gray-200 dark:border-gray-700">
        <div className="w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-professional">
              <Bot size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-heading">AI Chat</h1>
              <p className="text-sm text-caption">Next-generation AI assistant</p>
            </div>
          </div>
          <button
            onClick={onGetStarted}
            className="btn-primary shadow-professional"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-16 md:py-24 w-full">
        <div className="w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mb-8 shadow-professional">
            <Sparkles size={16} />
            Powered by the latest AI models
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-heading mb-6 leading-tight">
            Chat with the world's
            <span className="gradient-text"> most advanced</span> AI
          </h1>
          
          <p className="text-xl text-body mb-12 w-full mx-auto leading-relaxed max-w-3xl">
            Experience the power of multiple AI models in one beautiful interface. 
            Get instant answers, creative help, and intelligent assistance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 w-full">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg flex items-center gap-2 justify-center group shadow-professional-lg"
          >
            Start Chatting
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          {/* <button className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-colors font-semibold text-lg">
            View Demo
          </button> */}
        </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-heading mb-1">{stat.value}</div>
                <div className="text-sm text-caption">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="w-full mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-heading mb-4">
              Why choose AI Chat?
            </h2>
            <p className="text-lg sm:text-xl text-body w-full mx-auto max-w-2xl">
              Built for power users who demand the best AI experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-professional">
                  <feature.icon size={32} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-heading mb-3">{feature.title}</h3>
                <p className="text-body leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Models */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="w-full mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-heading mb-4">
              Choose your AI model
            </h2>
            <p className="text-lg sm:text-xl text-body w-full mx-auto max-w-2xl">
              Switch between different AI models based on your needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {models.map((model, index) => (
              <div key={index} className="card p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-professional-lg transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-professional">
                    <Bot size={24} className="text-white" />
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                    {model.badge}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-heading mb-2">{model.name}</h3>
                <p className="text-body">{model.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="w-full mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to experience the future of AI?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 w-full mx-auto">
            Join thousands of users who are already using AI Chat to boost their productivity
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-lg inline-flex items-center gap-2 group w-full sm:w-auto justify-center shadow-professional-lg"
          >
            Get Started for Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 dark:bg-black text-white transition-colors duration-300">
        <div className="w-full mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-professional">
                <Bot size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">AI Chat</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AI Chat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};