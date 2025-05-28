import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { 
  Package, ArrowRight, Mail, Lock, 
  Truck, BarChart, Shield
} from "lucide-react";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordRegex.test(formData.password)) {
      alert("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }
    dispatch(loginUser(formData)).then((res) => {
      if (!res.error) navigate("/dashboard");
    });
  };

  return (
    <div className="font-sans min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md shadow-slate-200/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">Bill Genius</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="/signup" className="px-5 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:border-indigo-600 hover:text-indigo-600 transition">
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <section className="pt-24 min-h-screen flex items-center bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Login Form */}
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
                <Lock size={14} />
                <span>Access your account</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Welcome back to <span className="text-indigo-600">Bill Genius</span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8">
                Log in to access your dashboard and continue optimizing your supply chain operations.
              </p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Your email address" 
                      onChange={handleChange} 
                      className="w-full pl-10 p-3 bg-white border border-slate-200 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-slate-700 text-sm font-medium">Password</label>
                    {/* <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors">
                      Forgot password?
                    </a> */}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="password" 
                      name="password" 
                      placeholder="Your password" 
                      onChange={handleChange} 
                      className="w-full pl-10 p-3 bg-white border border-slate-200 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="group w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-200 flex items-center justify-center transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-8">
                <p className="text-slate-600">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                    Create one now
                  </a>
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 max-w-md">
                <div className="text-sm text-slate-500">
                  By signing in, you agree to our{" "}
                  <a href="/terms" className="text-indigo-600 hover:text-indigo-700">Terms of Service</a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</a>
                </div>
              </div>
            </div>
            
            {/* Illustration */}
            <div className="order-1 md:order-2 animate-float">
              <div className="relative flex justify-center">
                <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-3xl opacity-10"></div>
                
                {/* Abstract visualization */}
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
                    <Lock size={20} className="text-indigo-600" />
                    <span className="text-sm font-medium text-slate-700">Secure login</span>
                  </div>
                  
                  <div className="absolute bottom-12 right-12 p-4 bg-white rounded-lg shadow-lg border border-slate-100 flex items-center gap-3 animate-pulse-slow delay-300">
                    <Shield size={20} className="text-indigo-600" />
                    <span className="text-sm font-medium text-slate-700">Protected</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-4">
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
          </div>
        </div>
      </section>
      
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

export default Login;