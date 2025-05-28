import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import axios from 'axios';
import { 
  BarChart, 
  Package, 
  Users, 
  Settings, 
  ShoppingCart, 
  Truck, 
  Layers, 
  HelpCircle, 
  Bell, 
  ChevronLeft, 
  Menu, 
  LogOut, 
  ClipboardList, 
  Home, 
  MapPin,
  ArrowRight,
  ChartBar,
  Box,
  ShieldCheck,
  Zap
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // API base URL
  const API_BASE_URL = 'https://billgenius.onrender.com/api'

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const endpoint = `${API_BASE_URL}/notifications`;
        console.log(`Fetching notifications from: ${endpoint}`);
        
        const response = await axios.get(endpoint, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
          },
          validateStatus: function (status) {
            return status < 500;
          }
        });
        
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
          const data = response.data;
          console.log("Fetched Notifications:", data);
          
          const processedData = Array.isArray(data) ? data.map(notification => {
            let type = 'general';
            
            if (notification.message.toLowerCase().includes('order')) {
              type = 'order';
            } else if (notification.message.toLowerCase().includes('stock')) {
              type = 'inventory';
            } else if (notification.message.toLowerCase().includes('delivery') || 
                     notification.message.toLowerCase().includes('shipment')) {
              type = 'delivery';
            }
            
            let actionUrl = notification.actionUrl;
            if (!actionUrl) {
              if (type === 'order') actionUrl = '/orders';
              else if (type === 'inventory') actionUrl = '/inventory';
              else if (type === 'delivery') actionUrl = '/warehouse/shipments';
            }
            
            return { ...notification, type, actionUrl };
          }) : [];
          
          setNotifications(processedData);
          setError(null);
        } else {
          console.warn("API returned non-JSON response:", contentType);
          setError("Invalid response format from server");
          setNotifications([]);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err.message);
        
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
        } else if (err.request) {
          console.error("No response received:", err.request);
        }
        
        setError(`Failed to load notifications: ${err.message}`);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [API_BASE_URL]);
  
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role || "customer";

  // Check if menu item is active
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Role-Based Navigation Items
  const roleBasedNav = {
    admin: [
      { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
      { title: "Orders", icon: <Package size={20} />, path: "/orders" },
      { title: "Users", icon: <Users size={20} />, path: "/admin/users" },
      { title: "Inventory", icon: <Layers size={20} />, path: "/inventory" },
    ],
    customer: [
      { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
      { title: "Place Order", icon: <ShoppingCart size={20} />, path: "/customer/order" },
    ],
    warehouse_manager: [
      { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
      { title: "Inventory", icon: <Layers size={20} />, path: "/inventory" },
      { title: "Orders", icon: <Package size={20} />, path: "/orders" },
      { title: "Shipments", icon: <Truck size={20} />, path: "/warehouse/shipments" },
    ],
    driver: [
      { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
      { title: "My Deliveries", icon: <Truck size={20} />, path: "/driver/deliveries" },
      { title: "Track Shipment", icon: <MapPin size={20} />, path: "/driver/track" },
    ],
  };

  // Get items based on role
  const navItems = roleBasedNav[userRole] || [];

  // Bottom nav items
  const bottomNavItems = [
    { title: "Support", icon: <HelpCircle size={20} />, path: "/support" },
    { title: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  // Sample notifications for development
  const sampleNotifications = [
    { 
      type: "order", 
      message: "New order #12345 has been placed", 
      time: "5 min ago", 
      actionUrl: "/orders/12345" 
    },
    { 
      type: "inventory", 
      message: "Low stock alert for item SKU-789", 
      time: "2 hours ago", 
      actionUrl: "/inventory/SKU-789" 
    },
    { 
      type: "delivery", 
      message: "Shipment #54321 has been delivered", 
      time: "Yesterday", 
      actionUrl: "/warehouse/shipments/54321" 
    }
  ];

  // Use sample notifications if in development mode and no notifications fetched
  const displayNotifications = process.env.NODE_ENV === 'development' && notifications.length === 0 && !loading ? 
    sampleNotifications : notifications;

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
      
      {/* Mobile toggle button */}
      <button 
        className="fixed top-4 left-4 z-30 lg:hidden bg-indigo-600 text-white p-2 rounded-lg shadow-lg transition-all duration-300 hover:bg-indigo-700"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu size={20} />
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static top-0 left-0 z-20 h-screen 
          ${collapsed ? "w-20" : "w-64"} 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-white border-r border-slate-100 text-slate-700
          transition-all duration-300 ease-in-out shadow-lg
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="relative p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Package size={18} />
              </div>
              {!collapsed && <h2 className="text-xl font-bold text-slate-800">Bill Genius</h2>}
            </div>
            <button 
              className="text-slate-400 hover:text-indigo-600 transition-colors hidden lg:block"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft size={20} className={`transform transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Quick Stats - New Component
        {!collapsed && (
          <div className="grid grid-cols-2 gap-2 p-3 border-b border-slate-100">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Active Orders</div>
              <div className="font-medium text-slate-800 flex items-center">
                24 <Zap size={12} className="text-indigo-500 ml-1" />
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 mb-1">Shipments</div>
              <div className="font-medium text-slate-800 flex items-center">
                16 <Truck size={12} className="text-indigo-500 ml-1" />
              </div>
            </div>
          </div>
        )} */}

        {/* Main Navigation */}
        <nav className="flex-1 py-5 overflow-y-auto">
          <div className="px-3 mb-2">
            {!collapsed && (
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider px-4 mb-2">Main Menu</div>
            )}
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive(item.path) 
                        ? "bg-indigo-50 text-indigo-600 font-medium" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"}
                      ${collapsed ? "justify-center" : ""}
                    `}
                  >
                    <span className={`${isActive(item.path) ? "text-indigo-600" : "text-slate-500"}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="font-medium">{item.title}</span>
                    )}
                    {!collapsed && isActive(item.path) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 ml-auto"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Notification Card */}
          <div className="px-3 mt-4 mb-4">
            {!collapsed && (
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider px-4 mb-2">Notifications</div>
            )}
            <div
              className={`p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer
                transition-all duration-200 hover:border-indigo-200
                ${collapsed ? "text-center" : ""}`}
              onClick={() => setShowPopup(true)}
            >
              {collapsed ? (
                <Bell size={20} className="mx-auto text-slate-500" />
              ) : (
                <>
                  <div className="flex items-center space-x-2 mb-2">
                    <Bell size={16} className="text-indigo-600" />
                    <span className="text-sm font-medium text-slate-700">Notifications</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {displayNotifications.length > 0
                      ? `${displayNotifications.length} new notifications`
                      : "No new notifications"}
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPopup(true);
                      }}
                      className="group text-xs flex items-center text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
                    >
                      View all
                      <ArrowRight
                        size={12}
                        className="ml-1 group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Notification Popup */}
          {showPopup && (
            <div
              className="fixed inset-0 flex lg:justify-end z-50"
              role="dialog"
              aria-modal="true"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowPopup(false);
                }
              }}
            >
              <div className="bg-slate-900/70 backdrop-blur-sm flex-1 lg:flex-grow-0" onClick={() => setShowPopup(false)}></div>
              <div 
                className={`bg-white shadow-xl border-l border-slate-100
                  flex flex-col h-full ${collapsed ? "w-80" : "w-96"} transition-all duration-300`}
              >
                <div className="flex justify-between items-center border-b border-slate-100 p-5">
                  <h2 className="text-lg font-medium text-slate-800 flex items-center">
                    <Bell size={18} className="text-indigo-600 mr-2" />
                    Notifications
                  </h2>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-500 text-sm m-3">
                      {error}
                    </div>
                  ) : displayNotifications.length > 0 ? (
                    displayNotifications.map((notif, index) => (
                      <div 
                        key={index} 
                        className="my-2 py-3 px-3 border border-slate-100 hover:bg-slate-50 transition-all duration-200 
                                  rounded-lg"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">
                            {notif.type === 'order' && <Package size={16} />}
                            {notif.type === 'inventory' && <Box size={16} />}
                            {notif.type === 'delivery' && <Truck size={16} />}
                            {notif.type === 'security' && <ShieldCheck size={16} />}
                            {notif.type === 'analytics' && <ChartBar size={16} />}
                            {(!notif.type || !['order', 'inventory', 'delivery', 'security', 'analytics'].includes(notif.type)) && 
                              <Bell size={16} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-700">{notif.message}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-slate-500">{notif.time}</span>
                              {notif.actionUrl && (
                                <Link
                                  to={notif.actionUrl}
                                  className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors flex items-center"
                                  onClick={() => setShowPopup(false)}
                                >
                                  View details
                                  <ArrowRight size={10} className="ml-1" />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-6 text-center m-4">
                      <ClipboardList size={32} className="text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
                {displayNotifications.length > 0 && (
                  <div className="p-4 border-t border-slate-100 flex justify-between">
                    <button
                      onClick={() => setShowPopup(false)}
                      className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors flex items-center"
                    >
                      Mark all as read
                      <ClipboardList size={14} className="ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="px-3 pb-5 mt-auto">
            <div className="py-2">
              {!collapsed && (
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider px-4 mb-2">Support</div>
              )}
              <ul className="space-y-1">
                {bottomNavItems.map((item, index) => (
                  <li key={index}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                        ${isActive(item.path) 
                          ? "bg-indigo-50 text-indigo-600 font-medium" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"}
                        ${collapsed ? "justify-center" : ""}
                      `}
                    >
                      <span className={isActive(item.path) ? "text-indigo-600" : "text-slate-500"}>{item.icon}</span>
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className={`flex ${collapsed ? "justify-center" : "items-center space-x-3"}`}>
            {collapsed ? (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || "user@example.com"}</p>
                </div>
                <LogOut
                  size={18}
                  className="text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                  onClick={handleLogout}
                />
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;