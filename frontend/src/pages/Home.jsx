import { useState, useEffect } from "react";
import { 
  Truck, Package, Shield, BarChart, 
  ArrowRight, Globe, Clock, Zap, 
  Users, Settings, PieChart
} from "lucide-react";

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('track');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div className="font-sans bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md shadow-slate-200/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">Bill Genius</span>
          </div>
          
          {/* <div className="hidden md:flex items-center gap-8">
            {['Solutions', 'Industries', 'Resources', 'Pricing'].map(item => (
              <a key={item} href={`/${item.toLowerCase()}`} className="text-slate-600 hover:text-indigo-600 font-medium">
                {item}
              </a>
            ))}
          </div> */}
          
          <div className="flex items-center gap-4">
            <a href="/login" className="hidden md:block text-slate-700 font-medium hover:text-indigo-600">
              Login
            </a>
            {/* <a href="/demo" className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
              Get Started
            </a> */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
                <Zap size={14} />
                <span>Simplify your supply chain</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
                Streamline your <span className="text-indigo-600">logistics</span> with intelligent automation
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Our platform provides real-time visibility, predictive insights, and end-to-end control of your entire supply chain. Cut costs, reduce delays, and enhance customer satisfaction.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="/signup" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all">
                  Start free trial
                  <ArrowRight size={18} />
                </a>
                {/* <a href="/demo" className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition-all">
                  Watch demo
                </a> */}
              </div>
              
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                  ))}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-bold text-slate-700">1,200+ companies</span> trust Bill Genius
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2 animate-float">
              <div className="relative flex justify-center">
                <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-3xl opacity-10"></div>
                
                {/* Abstract visualization of supply chain */}
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 w-full max-w-lg aspect-square flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className="w-full h-full">
                    <circle cx="200" cy="200" r="180" fill="#f8fafc" />
                    <circle cx="200" cy="200" r="150" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="200" cy="200" r="100" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    
                    {/* Connection lines */}
                    <path d="M130,120 L200,200 L280,100" fill="none" stroke="#4f46e5" strokeWidth="2" />
                    <path d="M100,220 L200,200 L300,220" fill="none" stroke="#4f46e5" strokeWidth="2" />
                    <path d="M150,300 L200,200 L250,300" fill="none" stroke="#4f46e5" strokeWidth="2" />
                    
                    {/* Nodes */}
                    <circle cx="130" cy="120" r="15" fill="#c7d2fe" />
                    <circle cx="280" cy="100" r="15" fill="#c7d2fe" />
                    <circle cx="100" cy="220" r="15" fill="#c7d2fe" />
                    <circle cx="300" cy="220" r="15" fill="#c7d2fe" />
                    <circle cx="150" cy="300" r="15" fill="#c7d2fe" />
                    <circle cx="250" cy="300" r="15" fill="#c7d2fe" />
                    
                    {/* Center hub */}
                    <circle cx="200" cy="200" r="25" fill="#4f46e5" />
                    <circle cx="200" cy="200" r="22" fill="#818cf8" />
                  </svg>
                  
                  {/* Floating elements */}
                  <div className="absolute top-12 left-12 p-4 bg-white rounded-lg shadow-lg border border-slate-100 flex items-center gap-3 animate-pulse-slow">
                    <Truck size={20} className="text-indigo-600" />
                    <span className="text-sm font-medium text-slate-700">Shipment tracking</span>
                  </div>
                  
                  <div className="absolute bottom-12 right-12 p-4 bg-white rounded-lg shadow-lg border border-slate-100 flex items-center gap-3 animate-pulse-slow delay-300">
                    <BarChart size={20} className="text-indigo-600" />
                    <span className="text-sm font-medium text-slate-700">Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Brands Section */}
      {/* <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-slate-500 font-medium mb-8">Trusted by forward-thinking companies worldwide</p>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-32 h-12 bg-slate-100 rounded-md animate-pulse"></div>
            ))}
          </div>
        </div>
      </section> */}
      
      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
              <Settings size={14} />
              <span>PLATFORM FEATURES</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Everything you need to optimize your supply chain
            </h2>
            
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our comprehensive platform connects your entire logistics network, providing real-time data and actionable insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck size={24} />,
                title: "Shipment Visibility",
                description: "Real-time GPS tracking with automated notifications and accurate ETAs across your entire fleet."
              },
              {
                icon: <Package size={24} />,
                title: "Inventory Management",
                description: "Automate replenishment, reduce stockouts, and optimize storage with intelligent forecasting."
              },
              {
                icon: <BarChart size={24} />,
                title: "Predictive Analytics",
                description: "Make data-driven decisions with AI-powered insights and customizable dashboards."
              },
              {
                icon: <Globe size={24} />,
                title: "Global Network",
                description: "Connect with carriers, warehouses, and suppliers across our worldwide logistics network."
              },
              {
                icon: <Clock size={24} />,
                title: "On-Time Delivery",
                description: "Improve fulfillment speed and accuracy with optimized routes and priority management."
              },
              {
                icon: <Shield size={24} />,
                title: "Risk Management",
                description: "Proactively identify disruptions and implement contingency plans before they impact operations."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-8 border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Interactive Demo Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
              <PieChart size={14} />
              <span>INTERACTIVE PLATFORM</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Experience the power of our platform
            </h2>
            
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our intuitive dashboard puts critical information at your fingertips and provides actionable insights
            </p>
          </div>
          
          {/* Platform Preview with Tabs */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-100">
              {[
                { id: 'track', label: 'Shipment Tracking', icon: <Truck size={18} /> },
                { id: 'inventory', label: 'Inventory', icon: <Package size={18} /> },
                { id: 'analytics', label: 'Analytics', icon: <BarChart size={18} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'track' && (
                <div className="grid md:grid-cols-5 gap-6 min-h-96">
                  <div className="md:col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="font-medium text-slate-700 mb-4">Active Shipments</h4>
                    
                    {[1, 2, 3].map(i => (
                      <div key={i} className="mb-4 p-4 bg-white rounded-lg border border-slate-100 hover:border-indigo-200 cursor-pointer">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-slate-800">Order #{1000 + i}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            i === 1 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {i === 1 ? 'On Time' : 'In Transit'}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 mb-3">
                          {i === 1 ? 'Chicago to New York' : i === 2 ? 'Seattle to Denver' : 'Miami to Atlanta'}
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${i * 25}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="md:col-span-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="font-medium text-slate-700 mb-4">Shipment Map</h4>
                    
                    <div className="bg-indigo-50 rounded-lg border border-indigo-100 h-64 w-full flex items-center justify-center">
                      <div className="text-center text-slate-500">
                        <Globe size={48} className="mx-auto mb-2 text-indigo-300" />
                        <p>Interactive map preview</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {[
                        { label: 'Total Distance', value: '1,432 mi' },
                        { label: 'Estimated Arrival', value: 'Apr 12, 2025' },
                        { label: 'Current Status', value: 'On Schedule' },
                      ].map((item, i) => (
                        <div key={i} className="bg-white p-3 rounded-lg border border-slate-100">
                          <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                          <div className="font-medium text-slate-800">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'inventory' && (
                <div className="min-h-96 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Package size={48} className="mx-auto mb-2 text-indigo-300" />
                    <p>Inventory management dashboard preview</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'analytics' && (
                <div className="min-h-96 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <BarChart size={48} className="mx-auto mb-2 text-indigo-300" />
                    <p>Analytics dashboard preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
              <Users size={14} />
              <span>SUCCESS STORIES</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Hear from our customers
            </h2>
            
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Companies of all sizes have transformed their logistics with our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "We reduced shipping costs by 27% within six months and virtually eliminated delivery delays.",
                author: "Alexandra Chen",
                role: "Operations Director, NexGen Retail",
                image: "AC"
              },
              {
                quote: "The predictive analytics have completely transformed how we manage inventory across our 24 warehouses.",
                author: "Marcus Williams",
                role: "VP of Supply Chain, Global Distributors",
                image: "MW"
              },
              {
                quote: "Implementation was seamless, and we saw ROI within the first quarter. Customer satisfaction is at an all-time high.",
                author: "Priya Sharma",
                role: "CEO, FastTrack Logistics",
                image: "PS"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-8 border border-slate-100 hover:shadow-md transition-all flex flex-col">
                <div className="flex-1">
                  <div className="text-indigo-600 mb-4">
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{testimonial.author}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            {/* <a href="/testimonials" className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700">
              View all case studies
              <ArrowRight size={16} />
            </a> */}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-24 bg-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transforming global logistics
            </h2>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              Our platform moves the needle on key performance indicators that matter
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "34%", label: "Average cost reduction" },
              { value: "99.8%", label: "Delivery accuracy" },
              { value: "28M+", label: "Shipments tracked" },
              { value: "2.5h", label: "Average response time" }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-xl bg-indigo-700/20 border border-indigo-500/30 text-center">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            Ready to revolutionize your supply chain?
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Join industry leaders who are already using our platform to streamline operations, reduce costs, and improve customer satisfaction.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/signup" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2">
              Start your free trial
              <ArrowRight size={18} />
            </a>
            {/* <a href="/demo" className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-all">
              Schedule a demo
            </a> */}
          </div>
          
          <p className="mt-6 text-slate-500 text-sm">
            No credit card required. 14-day free trial with full platform access.
          </p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Package size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">Bill Genius</span>
              </div>
              
              <p className="mb-6">
                Intelligent supply chain management for the modern enterprise. Streamline operations, reduce costs, and boost efficiency.
              </p>
              
              <div className="flex gap-4">
                {['twitter', 'linkedin', 'facebook'].map(platform => (
                  <a key={platform} href={`/${platform}`} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors">
                    <span className="w-4 h-4 bg-slate-300 rounded-sm"></span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium text-lg mb-4">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Integrations', 'Pricing', 'Security', 'API'].map(item => (
                  <li key={item}>
                    <a href={`/${item.toLowerCase()}`} className="hover:text-indigo-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium text-lg mb-4">Resources</h4>
              <ul className="space-y-3">
                {['Documentation', 'Blog', 'Case Studies', 'Webinars', 'Help Center'].map(item => (
                  <li key={item}>
                    <a href={`/${item.toLowerCase()}`} className="hover:text-indigo-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                {['About', 'Careers', 'Partners', 'Contact', 'Legal'].map(item => (
                  <li key={item}>
                    <a href={`/${item.toLowerCase()}`} className="hover:text-indigo-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} Bill Genius. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex gap-6">
              <a href="/privacy" className="hover:text-white">Privacy Policy</a>
              <a href="/terms" className="hover:text-white">Terms of Service</a>
              <a href="/cookies" className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default Home;