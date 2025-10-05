import React from 'react';
import { 
  ArrowRight, 
  Users, 
  RefreshCw, 
  Shield, 
  Star, 
  TrendingUp, 
  Heart, 
  Package, 
  MessageCircle, 
  CheckCircle,
  Globe,
  Zap
} from 'lucide-react';
import Link from 'next/link';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black/95 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-emerald-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                TradeHub
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how" className="text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">How it Works</a>
              <a href="#community" className="text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Community</a>
              <a href="#safety" className="text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Safety</a>
              <Link href="/login" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-30"></div>
        </div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Trade Goods,
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent block">
                Build Community
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Exchange goods, share resources, and build 
              meaningful connections in their local communities. No money required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-purple-600 px-8 py-4 rounded-xl text-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center group shadow-lg hover:shadow-emerald-500/25">
                Start Trading
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="border border-gray-700 hover:border-transparent hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-purple-500/20 px-8 py-4 rounded-xl text-lg font-medium transition-all backdrop-blur-sm">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* Features Overview */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="relative container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Community First
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Connect with like-minded people in your area who share your values of sustainability and community building.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50 hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Sustainable Living
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Reduce waste and environmental impact by giving items a second life through meaningful exchanges.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800/50 hover:border-emerald-500/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                Safe & Secure
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Trade with confidence using our secure platform designed to protect every member of our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Trading goods has never been easier. Follow these simple steps to start 
              building your community network.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-emerald-500/25">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">List Your Items</h3>
              <p className="text-gray-300 leading-relaxed">
                Upload photos and descriptions of items you want to trade. From books 
                to electronics, furniture to clothes - everything has value.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-cyan-500/25">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Connect Locally</h3>
              <p className="text-gray-300 leading-relaxed">
                Find people in your area who have what you need or want what you have. 
                Build relationships with your neighbors.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/25">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Make the Trade</h3>
              <p className="text-gray-300 leading-relaxed">
                Meet safely, exchange items, and rate your experience. Every trade 
                strengthens the community ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900/50 to-black"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                More Than Just Trading
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                TradeHub isn&apos;t just about exchanging goods - it&apos;s about building sustainable 
                communities, reducing waste, and creating meaningful connections with people 
                around you.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-3 rounded-xl backdrop-blur-sm">
                    <Heart className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Build Relationships</h3>
                    <p className="text-gray-300">Connect with neighbors and create lasting friendships through shared interests.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-3 rounded-xl backdrop-blur-sm">
                    <Globe className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Environmental Impact</h3>
                    <p className="text-gray-300">Reduce waste by giving items a second life instead of throwing them away.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Save Money</h3>
                    <p className="text-gray-300">Get what you need without spending money while decluttering your space.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-800/50">
                <div className="text-center space-y-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                      Join the Movement
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Be part of a growing community that values sustainability, connection, and meaningful exchange over consumption.
                    </p>
                    <button className="bg-gradient-to-r from-emerald-500 to-purple-500 hover:from-emerald-600 hover:to-purple-600 px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105">
                      Get Started Today
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Trade with Confidence</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your safety and security are our top priorities. We&apos;ve built comprehensive 
              systems to ensure every trade is safe and trustworthy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 hover:border-emerald-500/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Profiles</h3>
              <p className="text-gray-300">All users go through identity verification to ensure authentic community members.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rating System</h3>
              <p className="text-gray-300">Rate and review every trade to help build trust within the community.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Messaging</h3>
              <p className="text-gray-300">Communicate safely through our encrypted messaging system.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 hover:border-orange-500/50 transition-all duration-300 group">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trade Protection</h3>
              <p className="text-gray-300">Our support team monitors all activities to prevent fraud and disputes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/30 to-transparent"></div>
        </div>
        <div className="relative container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Trading?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our community and start making meaningful exchanges today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center group shadow-lg">
              <Zap className="mr-2 h-5 w-5" />
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-6 w-6 text-emerald-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">TradeHub</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Building sustainable communities through goods exchange and meaningful connections.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">How it Works</a></li>
                <li><a href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Safety</a></li>
                <li><a href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Community Guidelines</a></li>
                <li><a href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Help Center</a></li>
                <li><a href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Contact Us</a></li>
                <li><a href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Report Issue</a></li>
                <li><a href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Trust & Safety</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">About Us</a></li>
                <li><a href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Careers</a></li>
                <li><a href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Press</a></li>
                <li><a href="#" className="hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 TradeHub. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-emerald-400 hover:to-cyan-400 hover:bg-clip-text transition-all">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;