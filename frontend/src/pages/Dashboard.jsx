import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminData, fetchRevenueAnalytics } from "../redux/admin/adminSlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { 
  ArrowUpRight, ArrowDownRight, TrendingUp, Users, 
  Package, IndianRupee, Archive, ChartBar, Zap, 
  Settings, Clock, Shield, Globe, PieChart
} from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { orders, revenue = 0, users, stock = 0, loading, error } = useSelector(
    (state) => state.admin || {}
  );
  const { revenueData = [], loadingnew } = useSelector((state) => state.admin);
  
  const [animateStats, setAnimateStats] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeChart, setActiveChart] = useState('revenue');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchAdminData());
    dispatch(fetchRevenueAnalytics());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);
  
  // Calculate total users - handle both array of users and direct number
  const totalUsers = Array.isArray(users) ? users.length : (typeof users === 'number' ? users : 0);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Header Section with Gradient Background */}
        <section className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 py-14">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-indigo-400 blur-3xl"></div>
            <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-indigo-300 blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-100 text-sm font-medium mb-4">
                  <Zap size={14} />
                  <span>ADMIN DASHBOARD</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  Business Analytics
                </h1>
                <p className="text-indigo-200 max-w-2xl mb-6">
                  Monitor real-time performance metrics and make data-driven decisions to optimize operations
                </p>
                
                <div className="flex flex-wrap gap-4">
                  {/* <button className="px-5 py-2 bg-white text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-all flex items-center gap-2">
                    <PieChart size={16} />
                    Generate Report
                  </button> */}
                  {/* <button className="px-5 py-2 bg-indigo-500/30 text-white font-medium rounded-lg hover:bg-indigo-500/40 transition-all flex items-center gap-2">
                    <Settings size={16} />
                    Configure Dashboard
                  </button> */}
                </div>
              </div>
              
              <div className="hidden md:flex justify-end">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 w-full max-w-lg">
                  <h3 className="text-white font-medium mb-4">Performance Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: "Orders", value: typeof orders === 'number' ? orders : 0, icon: <Package size={20} /> },
                      { title: "Revenue", value: `₹${(typeof revenue === 'number' ? revenue : 0).toLocaleString()}`, icon: <IndianRupee size={20} /> },
                      { title: "Users", value: totalUsers, icon: <Users size={20} /> },
                      { title: "Stock", value: typeof stock === 'number' ? stock : 0, icon: <Archive size={20} /> }
                    ].map((item, i) => (
                      <div key={i} className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/30 flex items-center justify-center text-white">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-indigo-200 text-sm">{item.title}</div>
                          <div className="text-white font-bold">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-xl p-8">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-xl p-8">
              <p className="bg-red-50 border border-red-200 text-red-600 font-semibold text-center p-4 rounded-xl">
                Error: {error}
              </p>
            </div>
          ) : (
            <>
              {/* Stats Cards in Horizontal Flow */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { title: "Total Orders", value: typeof orders === 'number' ? orders : 0, icon: <Package size={22} />, color: "bg-gradient-to-br from-blue-500 to-blue-700" },
                  { title: "Total Revenue", value: `₹${(typeof revenue === 'number' ? revenue : 0).toLocaleString()}`, icon: <IndianRupee size={22} />, color: "bg-gradient-to-br from-emerald-500 to-emerald-700" },
                  { title: "Total Users", value: totalUsers, icon: <Users size={22} />, color: "bg-gradient-to-br from-amber-500 to-amber-700" },
                  { title: "Available Stock", value: typeof stock === 'number' ? stock : 0, icon: <Archive size={22} />, color: "bg-gradient-to-br from-purple-500 to-purple-700" }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className={`${stat.color} text-white rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                          {stat.icon}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-3xl font-bold">{stat.value}</span>
                          <span className="text-sm opacity-80">{stat.title}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <ArrowUpRight size={16} />
                        <span className="text-sm">+8.2% from last month</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Analytics Tabs Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main Analytics Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                  <div className="flex border-b border-slate-100">
                    <button
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                        activeChart === 'revenue' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                      }`}
                      onClick={() => setActiveChart('revenue')}
                    >
                      <ChartBar size={18} />
                      Revenue Analytics
                    </button>
                    <button
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                        activeChart === 'trend' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                      }`}
                      onClick={() => setActiveChart('trend')}
                    >
                      <TrendingUp size={18} />
                      Revenue Trend
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-slate-800">Revenue Overview</h2>
                      <div className="flex gap-2">
                        <select className="px-3 py-1 border border-slate-200 rounded-lg text-slate-600 text-sm">
                          <option>Last 6 Months</option>
                          <option>Last 12 Months</option>
                          <option>Year to Date</option>
                        </select>
                      </div>
                    </div>
                    
                    {loadingnew ? (
                      <div className="flex items-center justify-center h-80">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : revenueData.length === 0 ? (
                      <div className="flex items-center justify-center h-80 text-slate-500">
                        No data available
                      </div>
                    ) : (
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          {activeChart === 'revenue' ? (
                            <BarChart data={revenueData}>
                              <XAxis dataKey="month" axisLine={false} tickLine={false} />
                              <YAxis axisLine={false} tickLine={false} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(255, 255, 255, 0.97)', 
                                  borderRadius: '0.5rem',
                                  border: '1px solid #e2e8f0',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                              />
                              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                {revenueData.map((entry, index) => (
                                  <rect key={`cell-${index}`} fill="url(#barGradient)" />
                                ))}
                              </Bar>
                              <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8}/>
                                </linearGradient>
                              </defs>
                            </BarChart>
                          ) : (
                            <LineChart data={revenueData}>
                              <XAxis dataKey="month" axisLine={false} tickLine={false} />
                              <YAxis axisLine={false} tickLine={false} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(255, 255, 255, 0.97)', 
                                  borderRadius: '0.5rem',
                                  border: '1px solid #e2e8f0',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                              />
                              <defs>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={1}/>
                                  <stop offset="100%" stopColor="#818cf8" stopOpacity={1}/>
                                </linearGradient>
                              </defs>
                              <Line 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="url(#lineGradient)" 
                                strokeWidth={3} 
                                dot={{ r: 6, strokeWidth: 3, fill: "white", stroke: "#4f46e5" }} 
                                activeDot={{ r: 8, strokeWidth: 3, fill: "white", stroke: "#4f46e5" }}
                              />
                            </LineChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Recent Activity & Summary */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {[
                      { title: "New order received", time: "2 minutes ago", icon: <Package size={16} />, color: "bg-blue-100 text-blue-600" },
                      { title: "Payment processed", time: "1 hour ago", icon: <IndianRupee size={16} />, color: "bg-green-100 text-green-600" },
                      { title: "New user registered", time: "3 hours ago", icon: <Users size={16} />, color: "bg-purple-100 text-purple-600" },
                      { title: "Inventory updated", time: "5 hours ago", icon: <Archive size={16} />, color: "bg-amber-100 text-amber-600" },
                      { title: "Report generated", time: "Yesterday", icon: <ChartBar size={16} />, color: "bg-indigo-100 text-indigo-600" },
                    ].map((activity, index) => (
                      <div key={index} className="p-4 hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${activity.color} flex items-center justify-center`}>
                            {activity.icon}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{activity.title}</div>
                            <div className="text-sm text-slate-500">{activity.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4">
                    <button className="w-full py-2 text-center text-indigo-600 hover:text-indigo-700 font-medium">
                      View All Activity
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Quick Access Features */}
              {/* <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 mb-8">
                <div className="flex justify-between items-center mb-6"> */}
                  {/* <h2 className="text-xl font-semibold text-slate-800">Quick Actions</h2> */}
                  {/* <button className="px-4 py-2 rounded-lg text-indigo-600 border border-indigo-200 hover:bg-indigo-50 text-sm font-medium">
                    Configure Widgets
                  </button> */}
                {/* </div> */}
                
                {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: "Run Reports", icon: <TrendingUp size={20} />, color: "bg-indigo-100 text-indigo-600" },
                    { label: "Manage Inventory", icon: <Archive size={20} />, color: "bg-amber-100 text-amber-600" },
                    { label: "User Analytics", icon: <Users size={20} />, color: "bg-purple-100 text-purple-600" },
                    { label: "Order Processing", icon: <Package size={20} />, color: "bg-blue-100 text-blue-600" },
                    { label: "Shipping Status", icon: <Globe size={20} />, color: "bg-emerald-100 text-emerald-600" },
                    { label: "System Settings", icon: <Settings size={20} />, color: "bg-slate-100 text-slate-600" },
                  ].map((action, index) => (
                    <button 
                      key={index}
                      className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all hover:shadow-md group"
                    >
                      <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center transform transition-all duration-300 group-hover:scale-110`}>
                        {action.icon}
                      </div>
                      <span className="font-medium text-slate-700 text-sm">{action.label}</span>
                    </button>
                  ))}
                </div> */}
              {/* </div> */}
              
              {/* Bottom Section - Split Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                  {/* <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Top Products</h2>
                  </div> */}
                  
                  {/* <div className="divide-y divide-slate-100">
                    {[
                      { name: "Premium Package", sales: 234, revenue: "₹23,400", growth: "+12%" },
                      { name: "Standard Plan", sales: 187, revenue: "₹18,700", growth: "+8%" },
                      { name: "Basic Subscription", sales: 345, revenue: "₹17,250", growth: "+5%" },
                      { name: "Advanced Bundle", sales: 127, revenue: "₹12,700", growth: "+3%" },
                    ].map((product, index) => (
                      <div key={index} className="p-4 hover:bg-slate-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                              <Package size={18} />
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{product.name}</div>
                              <div className="text-sm text-slate-500">{product.sales} sales</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-slate-800">{product.revenue}</div>
                            <div className="text-sm text-emerald-600">{product.growth}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div> */}
                </div>
                
                {/* Recent Orders */}
                {/* <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {[
                      { id: "#ORD-7234", customer: "Alex Johnson", amount: "₹12,400", status: "Completed" },
                      { id: "#ORD-7233", customer: "Sarah Williams", amount: "₹8,700", status: "Processing" },
                      { id: "#ORD-7232", customer: "Mike Chen", amount: "₹15,250", status: "Completed" },
                      { id: "#ORD-7231", customer: "Ravi Kumar", amount: "₹5,800", status: "Pending" },
                    ].map((order, index) => (
                      <div key={index} className="p-4 hover:bg-slate-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                              <Archive size={18} />
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{order.id}</div>
                              <div className="text-sm text-slate-500">{order.customer}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-slate-800">{order.amount}</div>
                            <div className={`text-sm ${
                              order.status === 'Completed' ? 'text-emerald-600' : 
                              order.status === 'Processing' ? 'text-amber-600' : 'text-blue-600'
                            }`}>
                              {order.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;