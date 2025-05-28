import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { 
  Package, ArrowRight, Mail, Lock, User, Briefcase,
  Shield, BarChart, Globe, Clock
} from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const getRoleOptions = () => [
    { value: "customer", label: "Customer" },
    { value: "driver", label: "Driver" },
    { value: "warehouse_manager", label: "Warehouse Manager" },
    { value: "admin", label: "Admin" }
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Calculate password strength
    if (name === "password") {
      let strength = 0;
      if (value.length > 6) strength += 1;
      if (value.length > 10) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordRegex.test(formData.password)) {
      alert("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }
    dispatch(registerUser(formData)).then((res) => {
      if (!res.error) navigate("/dashboard");
    });
  };
  
  const getStrengthColor = () => {
    if (passwordStrength < 2) return "bg-red-500";
    if (passwordStrength < 4) return "bg-amber-500";
    return "bg-green-500";
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
            <a href="/login" className="px-5 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:border-indigo-600 hover:text-indigo-600 transition">
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* Signup Section */}
      <section className="pt-24 min-h-screen flex items-center bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Signup Form */}
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
                <User size={14} />
                <span>Create your account</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Join the <span className="text-indigo-600">Bill Genius</span> platform
              </h1>
              
              <p className="text-lg text-slate-600 mb-8">
                Get started with our intelligent supply chain management solution to optimize your logistics operations.
              </p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Your full name" 
                      onChange={handleChange} 
                      className="w-full pl-10 p-3 bg-white border border-slate-200 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                      required 
                    />
                  </div>
                </div>
                
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
                  <label className="block text-slate-700 text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="password" 
                      name="password" 
                      placeholder="Create a secure password" 
                      onChange={handleChange} 
                      className="w-full pl-10 p-3 bg-white border border-slate-200 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                      required 
                    />
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-500">Password strength:</span>
                        <span className="text-xs text-slate-500">
                          {passwordStrength < 2 ? "Weak" : passwordStrength < 4 ? "Medium" : "Strong"}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStrengthColor()} transition-all duration-300`} 
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-2">Account Type</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase size={18} className="text-slate-400" />
                    </div>
                    <select 
                      name="role" 
                      onChange={handleChange} 
                      className="w-full pl-10 p-3 bg-white border border-slate-200 text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none shadow-sm"
                      style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236366F1' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: `right 0.5rem center`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      {getRoleOptions().map(option => (
                        <option key={option.value} value={option.value} className="bg-white text-slate-800">
                          {option.label}
                        </option>
                      ))}
                    </select>
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
                      Creating account...
                    </span>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-8">
                <p className="text-slate-600">
                  Already have an account?{" "}
                  <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                    Sign In
                  </a>
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 max-w-md">
                <div className="text-sm text-slate-500">
                  By creating an account, you agree to our{" "}
                  <a href="/terms" className="text-indigo-600 hover:text-indigo-700">Terms of Service</a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</a>
                </div>
              </div>
            </div>
            
            {/* Illustration */}
            <div className="order-1 md:order-2">
              <div className="relative flex justify-center">
                <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-3xl opacity-10"></div>
                
                {/* Feature illustration */}
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 w-full max-w-lg aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 flex flex-col">
                    <div className="h-24 bg-indigo-600"></div>
                    <div className="flex-1 p-8">
                      {/* Feature grid */}
                      <div className="grid grid-cols-2 gap-4 h-full">
                        {[
                          { icon: <Globe size={24} />, title: "Global Network" },
                          { icon: <Clock size={24} />, title: "Real-time Tracking" },
                          { icon: <Shield size={24} />, title: "Secure Platform" },
                          { icon: <BarChart size={24} />, title: "Analytics" }
                        ].map((feature, i) => (
                          <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group flex flex-col justify-center items-center text-center">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-600 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              {feature.icon}
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">{feature.title}</h3>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Account badge */}
                  <div className="absolute top-4 left-4 right-4 p-4 bg-indigo-700 rounded-lg text-white flex items-center">
                    <div className="bg-white/20 p-2 rounded-lg mr-3">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-indigo-200">Welcome to</div>
                      <div className="font-bold">Your Bill Genius Account</div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute bottom-12 right-12 p-4 bg-white rounded-lg shadow-lg border border-slate-100 flex items-center gap-3 animate-pulse-slow delay-300">
                    <Shield size={20} className="text-indigo-600" />
                    <span className="text-sm font-medium text-slate-700">Start now</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                  <Shield size={14} />
                  <span>14-day free trial with full access</span>
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

export default Signup;