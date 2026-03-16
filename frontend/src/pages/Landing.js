import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Search, Shield } from 'lucide-react';
import logo from '../assets/sakuraPanjang.png';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: 'Smart Document Upload',
      description: 'Upload and organize scanned company documents efficiently.',
      testId: 'feature-upload'
    },
    {
      icon: Search,
      title: 'Intelligent Search',
      description: 'Find documents instantly by department, date, or rack position.',
      testId: 'feature-search'
    },
    {
      icon: Shield,
      title: 'Secure & Structured',
      description: 'Role-based access and organized digital archive system.',
      testId: 'feature-secure'
    }
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO ONLY */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Company Logo"
              className="h-10 object-contain"
            />
          </div>

          <button
            data-testid="nav-login-btn"
            onClick={() => navigate('/login')}
            className="px-6 py-2 text-green-900 font-medium hover:bg-green-50 rounded-lg transition-colors duration-200"
          >
            Login
          </button>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-bg pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">

          {/* COMPANY LOGO */}
          <div className="flex justify-center mb-10">
            <div className="bg-white rounded-2xl shadow-lg px-8 py-6">
              <img
                src={logo}
                alt="Company Logo"
                className="h-20 object-contain"
              />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Professional Document Management System
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Digitize, organize, and search company documents quickly and securely.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  data-testid={feature.testId}
                  className="feature-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                >
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="text-green-900" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-2xl mx-auto text-center">
          <button
            data-testid="get-started-btn"
            onClick={() => navigate('/register')}
            className="bg-green-900 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-green-800 mb-4"
          >
            Get Started
          </button>
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              data-testid="cta-login-link"
              onClick={() => navigate('/login')}
              className="text-green-900 font-medium hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          © 2026 Your Company. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default Landing;