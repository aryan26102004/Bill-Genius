import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus, cancelOrder } from "../redux/orders/orderSlice";
import { 
  ShoppingBag, Truck, Package, ArrowUpRight, ArrowDownRight, Calendar, 
  IndianRupee, CheckCircle, XCircle, Filter, ArrowUp, ArrowDown,
  MoreHorizontal, Search, Clock, Users, Zap, ChevronDown
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const OrderDashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalType, setModalType] = useState(null); // 'update' or 'cancel'
  const [status, setStatus] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [animateStats, setAnimateStats] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchOrders());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !status) return;
    await dispatch(updateOrderStatus({ orderId: selectedOrder, status }));
    closeModal();
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason) return;
    await dispatch(cancelOrder({ orderId: selectedOrder, reason: cancelReason }));
    closeModal();
  };

  const openModal = (type, orderId) => {
    setSelectedOrder(orderId);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalType(null);
    setStatus("");
    setCancelReason("");
  };

  // Calculate summary statistics
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(order => order.orderStatus === "Processing").length || 0;
  const deliveredOrders = orders?.filter(order => order.orderStatus === "Delivered").length || 0;
  const shippedOrders = orders?.filter(order => order.orderStatus === "Shipped").length || 0;
  const cancelledOrders = orders?.filter(order => order.orderStatus === "Cancelled").length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500";
      case "Processing":
        return "bg-amber-500";
      case "Shipped":
        return "bg-blue-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-800";
      case "Processing":
        return "bg-amber-100 text-amber-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    // Filter by status tab
    if (activeTab !== 'all' && order.orderStatus.toLowerCase() !== activeTab) {
      return false;
    }
    
    // Filter by search
    if (searchTerm && !order._id.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortConfig.key === 'totalAmount') {
      return sortConfig.direction === 'asc' 
        ? a.totalAmount - b.totalAmount 
        : b.totalAmount - a.totalAmount;
    } else if (sortConfig.key === 'createdAt') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.createdAt) - new Date(b.createdAt) 
        : new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortConfig.key === 'customer') {
      return sortConfig.direction === 'asc' 
        ? a.customer.name.localeCompare(b.customer.name)
        : b.customer.name.localeCompare(a.customer.name);
    }
    return 0;
  });

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

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
                  <ShoppingBag size={14} />
                  <span>ORDER MANAGEMENT</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  Order Analytics
                </h1>
                <p className="text-indigo-200 max-w-2xl mb-6">
                  Track, manage, and analyze all customer orders with comprehensive metrics and real-time updates
                </p>
                
                <div className="flex flex-wrap gap-4">
                  {/* <button className="px-5 py-2 bg-white text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-all flex items-center gap-2">
                    <Filter size={16} />
                    Filter Orders
                  </button> */}
                  {/* <button className="px-5 py-2 bg-indigo-500/30 text-white font-medium rounded-lg hover:bg-indigo-500/40 transition-all flex items-center gap-2">
                    <Clock size={16} />
                    Recent Activity
                  </button> */}
                </div>
              </div>
              
              <div className="hidden md:flex justify-end">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 w-full max-w-lg">
                  <h3 className="text-white font-medium mb-4">Order Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: "Total Orders", value: totalOrders, icon: <ShoppingBag size={20} /> },
                      { title: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <IndianRupee size={20} /> },
                      { title: "Pending", value: pendingOrders, icon: <Clock size={20} /> },
                      { title: "Delivered", value: deliveredOrders, icon: <Truck size={20} /> }
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
          {/* Status Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div 
              className={`bg-white rounded-xl shadow-md p-6 border-t-4 border-indigo-500 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
                  <ShoppingBag size={18} />
                </div>
                <span className="text-sm font-semibold text-indigo-600">100%</span>
              </div>
              <h3 className="text-slate-800 font-medium">All Orders</h3>
              <p className="text-3xl font-bold mt-1">{totalOrders}</p>
              <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
            
            <div 
              className={`bg-white rounded-xl shadow-md p-6 border-t-4 border-amber-500 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                  <Clock size={18} />
                </div>
                <span className="text-sm font-semibold text-amber-600">{((pendingOrders/totalOrders)*100 || 0).toFixed(0)}%</span>
              </div>
              <h3 className="text-slate-800 font-medium">Processing</h3>
              <p className="text-3xl font-bold mt-1">{pendingOrders}</p>
              <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{width: `${(pendingOrders/totalOrders)*100 || 0}%`}}></div>
              </div>
            </div>
            
            <div 
              className={`bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <Package size={18} />
                </div>
                <span className="text-sm font-semibold text-blue-600">{((shippedOrders/totalOrders)*100 || 0).toFixed(0)}%</span>
              </div>
              <h3 className="text-slate-800 font-medium">Shipped</h3>
              <p className="text-3xl font-bold mt-1">{shippedOrders}</p>
              <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{width: `${(shippedOrders/totalOrders)*100 || 0}%`}}></div>
              </div>
            </div>
            
            <div 
              className={`bg-white rounded-xl shadow-md p-6 border-t-4 border-emerald-500 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                  <Truck size={18} />
                </div>
                <span className="text-sm font-semibold text-emerald-600">{((deliveredOrders/totalOrders)*100 || 0).toFixed(0)}%</span>
              </div>
              <h3 className="text-slate-800 font-medium">Delivered</h3>
              <p className="text-3xl font-bold mt-1">{deliveredOrders}</p>
              <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{width: `${(deliveredOrders/totalOrders)*100 || 0}%`}}></div>
              </div>
            </div>
            
            <div 
              className={`bg-white rounded-xl shadow-md p-6 border-t-4 border-red-500 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-3 rounded-lg bg-red-100 text-red-600">
                  <XCircle size={18} />
                </div>
                <span className="text-sm font-semibold text-red-600">{((cancelledOrders/totalOrders)*100 || 0).toFixed(0)}%</span>
              </div>
              <h3 className="text-slate-800 font-medium">Cancelled</h3>
              <p className="text-3xl font-bold mt-1">{cancelledOrders}</p>
              <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{width: `${(cancelledOrders/totalOrders)*100 || 0}%`}}></div>
              </div>
            </div>
          </div>

          {/* Revenue Overview Card */}
          <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Revenue Overview</h2>
                  <p className="text-slate-500">Total revenue from orders</p>
                </div>
                <div className="bg-indigo-500 text-white p-3 rounded-lg">
                  <IndianRupee size={20} />
                </div>
              </div>
              <div className="mt-6 flex items-center gap-8">
                <div>
                  <p className="text-sm text-slate-500">Total Revenue</p>
                  <p className="text-3xl font-bold text-slate-800">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Average Order Value</p>
                  <p className="text-3xl font-bold text-slate-800">
                    ₹{(totalOrders ? (totalRevenue / totalOrders).toFixed(2) : 0).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
                  <ArrowUpRight size={16} />
                  <span className="ml-1 text-sm font-medium">+12.5% from last month</span>
                </div>
              </div>
            </div>
          </div>

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
              {/* Order Management Section */}
              <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 md:mb-0">Order Management</h2>
                    
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                      {/* <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search orders..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div> */}
                      
                      {/* <div className="flex gap-2">
                        <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors flex items-center gap-1">
                          <Filter size={16} />
                          Filter
                        </button>
                        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-1">
                          <MoreHorizontal size={16} />
                          More
                        </button>
                      </div> */}
                    </div>
                  </div>

                  {/* Status Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <button 
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <ShoppingBag size={16} />
                      All Orders ({totalOrders})
                    </button>
                    <button 
                      onClick={() => setActiveTab('processing')}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === 'processing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Clock size={16} />
                      Processing ({pendingOrders})
                    </button>
                    <button 
                      onClick={() => setActiveTab('shipped')}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Package size={16} />
                      Shipped ({shippedOrders})
                    </button>
                    <button 
                      onClick={() => setActiveTab('delivered')}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Truck size={16} />
                      Delivered ({deliveredOrders})
                    </button>
                    <button 
                      onClick={() => setActiveTab('cancelled')}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <XCircle size={16} />
                      Cancelled ({cancelledOrders})
                    </button>
                  </div>
                </div>

                {/* Order Cards - Modern Card Layout */}
                <div className="p-6">
                  {sortedOrders.length === 0 ? (
                    <div className="text-center p-12 bg-slate-50 rounded-xl">
                      <ShoppingBag size={48} className="mx-auto mb-4 text-slate-300" />
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">No Orders Found</h3>
                      <p className="text-slate-500 max-w-md mx-auto">
                        {searchTerm ? 'No orders match your search criteria.' : 'There are no orders in the selected category.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Header Sort Row */}
                      <div className="hidden md:flex items-center py-2 px-4 bg-slate-50 rounded-lg text-slate-600 text-sm font-medium">
                        <div className="w-1/12">ID</div>
                        <div 
                          className="w-2/12 flex items-center cursor-pointer" 
                          onClick={() => toggleSort('customer')}
                        >
                          Customer {sortConfig.key === 'customer' && (
                            sortConfig.direction === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                          )}
                        </div>
                        <div 
                          className="w-2/12 flex items-center cursor-pointer"
                          onClick={() => toggleSort('createdAt')}
                        >
                          Date {sortConfig.key === 'createdAt' && (
                            sortConfig.direction === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                          )}
                        </div>
                        <div 
                          className="w-2/12 flex items-center cursor-pointer"
                          onClick={() => toggleSort('totalAmount')}
                        >
                          Amount {sortConfig.key === 'totalAmount' && (
                            sortConfig.direction === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                          )}
                        </div>
                        <div className="w-2/12">Status</div>
                        <div className="w-3/12 text-right">Actions</div>
                      </div>
                      
                      {/* Order Cards */}
                      {sortedOrders.map((order) => (
                        <div 
                          key={order._id} 
                          className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                        >
                          <div 
                            className="flex flex-col md:flex-row md:items-center cursor-pointer p-4" 
                            onClick={() => toggleOrderExpansion(order._id)}
                          >
                            <div className="md:w-1/12 mb-2 md:mb-0">
                              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700">
                                {order._id.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div className="md:w-2/12 mb-2 md:mb-0">
                              <p className="font-medium text-slate-800">{order.customer.name}</p>
                              <p className="text-xs text-slate-500">ID: {order._id.substring(0, 6)}...</p>
                            </div>
                            <div className="md:w-2/12 mb-2 md:mb-0">
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1 text-slate-400" />
                                <span className="text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                              </div>
                              <span className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <div className="md:w-2/12 mb-2 md:mb-0">
                              <div className="flex items-center font-medium text-slate-800">
                                <IndianRupee size={14} className="mr-1" />
                                {order.totalAmount.toFixed(2)}
                              </div>
                              <span className="text-xs text-emerald-600">+₹{(order.totalAmount * 0.12).toFixed(2)} tax</span>
                            </div>
                            <div className="md:w-2/12 mb-3 md:mb-0">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.orderStatus)}`}>
                                {order.orderStatus}
                              </span>
                            </div>
                            <div className="md:w-3/12 flex justify-between md:justify-end items-center gap-2">
                              <div className="md:hidden flex items-center text-slate-600">
                                <ChevronDown size={16} className={`transform transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openModal('update', order._id);
                                  }}
                                  className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
                                  title="Update Status"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openModal('cancel', order._id);
                                  }}
                                  className="p-2 bg-red-500 text-white rounded-lg hover:shadow-lg transition-all"
                                  title="Cancel Order"
                                >
                                  <XCircle size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {expandedOrder === order._id && (
                            <div className="bg-slate-50 p-4 border-t border-slate-200">
                              <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-slate-500 mb-2">Order Details</h4>
                                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-slate-600">Order Date:</span>
                                      <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-slate-600">Items:</span>
                                      <span className="font-medium">{order.items?.length || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-600">Payment:</span>
                                      <span className="font-medium">Online</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-slate-500 mb-2">Customer Information</h4>
                                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                                    <div className="flex items-center mb-2">
                                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
                                        <Users size={14} />
                                      </div>
                                      <div>
                                        <p className="font-medium text-slate-800">{order.customer.name}</p>
                                        <p className="text-xs text-slate-500">{order.customer.email}</p>
                                      </div>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                      <p>{order.customer.address?.street}</p>
                                      <p>{order.customer.address?.city}, {order.customer.address?.state} {order.customer.address?.zipCode}</p>
                                      <p>{order.customer.phone}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-slate-500 mb-2">Order Summary</h4>
                                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-slate-600">Subtotal:</span>
                                      <span className="font-medium">₹{(order.totalAmount * 0.88).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-slate-600">Tax (12%):</span>
                                      <span className="font-medium">₹{(order.totalAmount * 0.12).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold border-t border-slate-100 pt-1 mt-1">
                                      <span className="text-slate-800">Total:</span>
                                      <span>₹{order.totalAmount.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Order Items */}
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Order Items</h4>
                                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                  <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                      <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                      {order.items?.map((item, idx) => (
                                        <tr key={idx}>
                                          <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                              <div className="flex-shrink-0 h-10 w-10 rounded bg-slate-100"></div>
                                              <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-800">{item.product.name}</div>
                                                <div className="text-xs text-slate-500">SKU: {item.product._id?.substring(0, 6)}</div>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{item.quantity}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">₹{item.price?.toFixed(2)}</td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-700">₹{(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              
                              {/* Order Timeline */}
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Order Timeline</h4>
                                <div className="bg-white p-4 rounded-lg border border-slate-200">
                                  <div className="flex">
                                    <div className="flex flex-col items-center mr-4">
                                      <div className="rounded-full h-8 w-8 flex items-center justify-center bg-emerald-100 text-emerald-600">
                                        <CheckCircle size={16} />
                                      </div>
                                      <div className="h-full border-l border-slate-200 my-1"></div>
                                    </div>
                                    <div className="pb-4">
                                      <p className="text-sm font-medium text-slate-800">Order Placed</p>
                                      <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex">
                                    <div className="flex flex-col items-center mr-4">
                                      <div className={`rounded-full h-8 w-8 flex items-center justify-center ${order.orderStatus === "Processing" || order.orderStatus === "Shipped" || order.orderStatus === "Delivered" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                                        <Package size={16} />
                                      </div>
                                      <div className="h-full border-l border-slate-200 my-1"></div>
                                    </div>
                                    <div className="pb-4">
                                      <p className="text-sm font-medium text-slate-800">Processing</p>
                                      <p className="text-xs text-slate-500">Order is being prepared</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex">
                                    <div className="flex flex-col items-center mr-4">
                                      <div className={`rounded-full h-8 w-8 flex items-center justify-center ${order.orderStatus === "Shipped" || order.orderStatus === "Delivered" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                                        <Truck size={16} />
                                      </div>
                                      <div className="h-full border-l border-slate-200 my-1"></div>
                                    </div>
                                    <div className="pb-4">
                                      <p className="text-sm font-medium text-slate-800">Shipped</p>
                                      <p className="text-xs text-slate-500">Order has been shipped</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex">
                                    <div className="flex flex-col items-center mr-4">
                                      <div className={`rounded-full h-8 w-8 flex items-center justify-center ${order.orderStatus === "Delivered" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                                        <CheckCircle size={16} />
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-slate-800">Delivered</p>
                                      <p className="text-xs text-slate-500">Order has been delivered</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      {/* Modal for Update Status */}
      {modalType === 'update' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Update Order Status</h3>
            <p className="text-slate-600 mb-4">Change the current status of order #{selectedOrder?.substring(0, 6)}</p>
            
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Status</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            
            <div className="flex gap-3">
              <button 
                onClick={closeModal}
                className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleStatusUpdate}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                disabled={!status}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal for Cancel Order */}
      {modalType === 'cancel' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Cancel Order</h3>
            <p className="text-slate-600 mb-4">Are you sure you want to cancel order #{selectedOrder?.substring(0, 6)}?</p>
            
            <textarea 
              value={cancelReason} 
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please provide a reason for cancellation..."
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-24"
            ></textarea>
            
            <div className="flex gap-3">
              <button 
                onClick={closeModal}
                className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Go Back
              </button>
              <button 
                onClick={handleCancelOrder}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={!cancelReason}
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDashboard;