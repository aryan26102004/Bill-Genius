import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory, removeProduct } from "../redux/inventory/inventorySlice";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import { 
  Pencil, Trash, Plus, Search, Package, Filter, 
  RefreshCw, IndianRupee, ArrowUpRight, ArrowDownRight,
  Zap, Settings, PieChart, ChartBar, Archive, TrendingUp,
  Globe, Users
} from "lucide-react";
import { PieChart as RechartsePieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const InventoryDashboard = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.inventory);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [animateStats, setAnimateStats] = useState(false);
  const [activeView, setActiveView] = useState('table');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchInventory());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Error: Missing product ID");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
  
    try {
      await dispatch(removeProduct(id));
      alert("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };
  
  // Get unique categories
  const categories = ["all", ...new Set(items.map(item => item.category))];

  // Filter items by search term and category
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockClass = (stock) => {
    if (stock <= 5) return "text-red-600 bg-red-100";
    if (stock <= 20) return "text-yellow-600 bg-yellow-100";
    return "text-emerald-600 bg-emerald-100";
  };

  // Group items by category for chart visualization
  const categoryData = categories
    .filter(cat => cat !== "all")
    .map(category => {
      const itemsInCategory = items.filter(item => item.category === category);
      return {
        name: category,
        value: itemsInCategory.length,
        total: itemsInCategory.reduce((acc, item) => acc + item.price * item.stock, 0)
      };
    });

  // Create stock level distribution data
  const stockLevelData = [
    { name: "Critical (0-5)", value: items.filter(item => item.stock <= 5).length },
    { name: "Low (6-20)", value: items.filter(item => item.stock > 5 && item.stock <= 20).length },
    { name: "Adequate (21+)", value: items.filter(item => item.stock > 20).length }
  ];

  // Create price range distribution
  const priceRangeData = [
    { name: "< ₹1k", value: items.filter(item => item.price < 1000).length },
    { name: "₹1k-5k", value: items.filter(item => item.price >= 1000 && item.price < 5000).length },
    { name: "₹5k-10k", value: items.filter(item => item.price >= 5000 && item.price < 10000).length },
    { name: "₹10k+", value: items.filter(item => item.price >= 10000).length }
  ];

  // Chart colors
  const COLORS = ['#4f46e5', '#818cf8', '#60a5fa', '#34d399', '#fbbf24', '#f87171'];
  
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
                  <Package size={14} />
                  <span>INVENTORY MANAGEMENT</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  Inventory Dashboard
                </h1>
                <p className="text-indigo-200 max-w-2xl mb-6">
                  Track products, monitor stock levels, and manage your inventory efficiently for optimal business operations
                </p>
                
                <div className="flex flex-wrap gap-4">
                  {/* <button className="px-5 py-2 bg-white text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-all flex items-center gap-2">
                    <PieChart size={16} />
                    Generate Report
                  </button> */}
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-2 bg-indigo-500/30 text-white font-medium rounded-lg hover:bg-indigo-500/40 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add New Product
                  </button>
                </div>
              </div>
              
              <div className="hidden md:flex justify-end">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 w-full max-w-lg">
                  <h3 className="text-white font-medium mb-4">Inventory Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: "Total Products", value: items.length, icon: <Package size={20} /> },
                      { title: "Low Stock Items", value: items.filter(item => item.stock <= 5).length, icon: <RefreshCw size={20} /> },
                      { title: "Categories", value: new Set(items.map(item => item.category)).size, icon: <Filter size={20} /> },
                      { title: "Total Value", value: `₹${items.reduce((sum, item) => sum + (item.price * item.stock), 0).toLocaleString()}`, icon: <IndianRupee size={20} /> }
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
                  { title: "Total Products", value: items.length, icon: <Package size={22} />, color: "bg-gradient-to-br from-blue-500 to-blue-700" },
                  { title: "Low Stock Items", value: items.filter(item => item.stock <= 5).length, icon: <RefreshCw size={22} />, color: "bg-gradient-to-br from-red-500 to-red-700" },
                  { title: "Total Categories", value: new Set(items.map(item => item.category)).size, icon: <Filter size={22} />, color: "bg-gradient-to-br from-amber-500 to-amber-700" },
                  { title: "Inventory Value", value: `₹${items.reduce((sum, item) => sum + (item.price * item.stock), 0).toLocaleString()}`, icon: <IndianRupee size={22} />, color: "bg-gradient-to-br from-emerald-500 to-emerald-700" }
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
              
              {/* View Toggle & Search/Filter Section */}
              <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden mb-8">
                <div className="flex border-b border-slate-100">
                  <button
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                      activeView === 'table' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                    }`}
                    onClick={() => setActiveView('table')}
                  >
                    <ChartBar size={18} />
                    Table View
                  </button>
                  <button
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                      activeView === 'charts' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                    }`}
                    onClick={() => setActiveView('charts')}
                  >
                    <PieChart size={18} />
                    Charts & Analytics
                  </button>
                  <button
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                      activeView === 'cards' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                    }`}
                    onClick={() => setActiveView('cards')}
                  >
                    <Archive size={18} />
                    Card View
                  </button>
                </div>
                
                {/* Search & Filter Panel */}
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-2 w-full border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="md:w-64">
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full p-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category === "all" ? "All Categories" : category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Table View */}
              {activeView === 'table' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                  <div className="lg:col-span-8 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h2 className="text-xl font-bold text-slate-800">Product List</h2>
                    </div>
                    {filteredItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                        <Package size={48} className="text-slate-300 mb-4" />
                        <p>No products found matching your criteria.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-slate-700">
                              <th className="p-4 font-semibold">Product Name</th>
                              <th className="p-4 font-semibold">Category</th>
                              <th className="p-4 font-semibold">Stock</th>
                              <th className="p-4 font-semibold">Price</th>
                              {(user?.role === "admin" || user?.role === "warehouse_manager") && (
                                <th className="p-4 font-semibold">Actions</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredItems.slice(0, 6).map((product) => (
                              <tr key={product._id} className="border-t hover:bg-indigo-50/30 transition-colors">
                                <td className="p-4 font-medium text-slate-800">{product.name}</td>
                                <td className="p-4">
                                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                                    {product.category}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStockClass(product.stock)}`}>
                                    {product.stock} units
                                  </span>
                                </td>
                                <td className="p-4 font-medium">₹{product.price.toLocaleString()}</td>
                                {(user?.role === "admin" || user?.role === "warehouse_manager") && (
                                  <td className="p-4">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => setEditProduct(product)}
                                        className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
                                        title="Edit Product"
                                      >
                                        <Pencil size={16} />
                                      </button>
                                      <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                                        title="Delete Product"
                                      >
                                        <Trash size={16} />
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {filteredItems.length > 6 && (
                      <div className="p-4 border-t border-slate-100 text-center">
                        <button className="text-indigo-600 font-medium hover:text-indigo-800">
                          View All ({filteredItems.length}) Products
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Stock Summary */}
                  <div className="lg:col-span-4 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h2 className="text-xl font-bold text-slate-800">Stock Summary</h2>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-slate-700 mb-2">Stock Level Distribution</h3>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={stockLevelData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {stockLevelData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center mt-4">
                          {stockLevelData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                              <span className="text-sm text-slate-700">{entry.name}: {entry.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-medium text-slate-700 mb-4">Critical Stock Items</h3>
                        {items.filter(item => item.stock <= 5).slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0 last:mb-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                <Package size={16} />
                              </div>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <span className="text-red-600 font-medium">{item.stock} left</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Charts View */}
              {activeView === 'charts' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Category Distribution */}
                  <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h2 className="text-xl font-bold text-slate-800">Category Distribution</h2>
                    </div>
                    <div className="p-6">
                      <div className="h-64 md:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsePieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              outerRadius={90}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
                          </RechartsePieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price Range Distribution */}
                  <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h2 className="text-xl font-bold text-slate-800">Price Range Distribution</h2>
                    </div>
                    <div className="p-6">
                      <div className="h-64 md:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={priceRangeData}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                              {priceRangeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Value Distribution */}
                  <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h2 className="text-xl font-bold text-slate-800">Category Value Distribution</h2>
                    </div>
                    <div className="p-6">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryData} layout="vertical">
                            <XAxis type="number" axisLine={false} tickLine={false} />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Total Value']} />
                            <Bar dataKey="total" radius={[0, 6, 6, 0]} fill="url(#barGradient)" />
                            <defs>
                              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8}/>
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stock Distribution */}
                  <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h2 className="text-xl font-bold text-slate-800">Stock Level Summary</h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 gap-6">
                        {stockLevelData.map((level, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              index === 0 ? 'bg-red-100 text-red-600' : 
                              index === 1 ? 'bg-yellow-100 text-yellow-600' : 
                              'bg-green-100 text-green-600'
                            }`}>
                              <Package size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-slate-800">{level.name}</h3>
                                <span className="font-bold text-slate-700">{level.value} products</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    index === 0 ? 'bg-red-500' : 
                                    index === 1 ? 'bg-yellow-500' : 
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${(level.value / items.length * 100) || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Card View */}
              {activeView === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredItems.length === 0 ? (
                    <div className="col-span-full bg-white rounded-xl shadow-md border border-slate-100 p-8 text-center">
                      <Package size={48} className="text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No products found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredItems.map((product) => (
                      <div 
                        key={product._id} 
                        className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                      >
                        <div className="p-6 border-b border-slate-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                                {product.category}
                              </span>
                              <h3 className="text-xl font-bold text-slate-800 mt-2">{product.name}</h3>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStockClass(product.stock)}`}>
                              {product.stock} units
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex justify-between items-center mb-4">
                            <div className="text-lg font-bold text-slate-800">₹{product.price.toLocaleString()}</div>
                            <div className="text-slate-500 text-sm">Total Value: ₹{(product.price * product.stock).toLocaleString()}</div>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
                            <div 
                              className={`h-2.5 rounded-full ${getStockClass(product.stock)}`}
                              style={{ width: `${(product.stock / 100 * 100) || 0}%` }}
                            ></div>
                          </div>
                          
                          {(user?.role === "admin" || user?.role === "warehouse_manager") && (
                            <div className="flex justify-end gap-2 mt-4">
                              <button
                                onClick={() => setEditProduct(product)}
                                className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
                                title="Edit Product"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                                title="Delete Product"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {/* Add Product Button (Floating) */}
              <button 
                onClick={() => setShowAddModal(true)}
                className="fixed right-8 bottom-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-10 flex items-center justify-center"
              >
                <Plus size={24} />
              </button>
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddProductModal 
          onClose={() => setShowAddModal(false)} 
        />
      )}

      {editProduct && (
        <EditProductModal 
          product={editProduct} 
          onClose={() => setEditProduct(null)} 
        />
      )}
    </div>
  );
};

export default InventoryDashboard;