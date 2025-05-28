import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/admin/adminSlice";
import { 
  Users, Mail, ShieldCheck, XCircle, Search, Filter, MoreHorizontal, 
  PieChart, UserPlus, UserCheck, UserX, Zap, PlusCircle, 
  ChevronDown, ExternalLink, HelpCircle, Shield
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [animateStats, setAnimateStats] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchUsers());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  // Filter users based on search term and active tab
  const filteredUsers = Array.isArray(users) 
    ? users.filter(user => {
        const matchesSearch = 
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'admin') return matchesSearch && user.isAdmin;
        if (activeTab === 'active') return matchesSearch && user.isActive;
        if (activeTab === 'inactive') return matchesSearch && !user.isActive;
        
        return matchesSearch;
      })
    : [];

  // Calculate stats
  const totalUsers = Array.isArray(users) ? users.length : 0;
  const adminUsers = Array.isArray(users) ? users.filter(user => user.isAdmin).length : 0;
  const activeUsers = Array.isArray(users) ? users.filter(user => user.isActive).length : 0;
  const inactiveUsers = Array.isArray(users) ? users.filter(user => !user.isActive).length : 0;

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Toggle expanded user
  const toggleExpandedUser = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header Section */}
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
                  <span>USER MANAGEMENT</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  User Administration
                </h1>
                <p className="text-indigo-200 max-w-2xl mb-6">
                  Manage your user base, track activity, and control permissions for optimal platform security
                </p>
                
                {/* <div className="flex flex-wrap gap-4">
                  <button className="px-5 py-2 bg-white text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-all flex items-center gap-2">
                    <UserPlus size={16} />
                    Add New User
                  </button>
                  <button className="px-5 py-2 bg-indigo-500/30 text-white font-medium rounded-lg hover:bg-indigo-500/40 transition-all flex items-center gap-2">
                    <PieChart size={16} />
                    Export User Data
                  </button>
                </div> */}
              </div>
              
              <div className="hidden md:flex justify-end">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 w-full max-w-lg">
                  <h3 className="text-white font-medium mb-4">User Distribution</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/30 flex items-center justify-center text-white">
                        <Users size={20} />
                      </div>
                      <div>
                        <div className="text-indigo-200 text-sm">Total Users</div>
                        <div className="text-white font-bold">{totalUsers}</div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/30 flex items-center justify-center text-white">
                        <Shield size={20} />
                      </div>
                      <div>
                        <div className="text-indigo-200 text-sm">Admins</div>
                        <div className="text-white font-bold">{adminUsers}</div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/30 flex items-center justify-center text-white">
                        <UserCheck size={20} />
                      </div>
                      <div>
                        <div className="text-indigo-200 text-sm">Active</div>
                        <div className="text-white font-bold">{activeUsers}</div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/30 flex items-center justify-center text-white">
                        <UserX size={20} />
                      </div>
                      <div>
                        <div className="text-indigo-200 text-sm">Inactive</div>
                        <div className="text-white font-bold">{inactiveUsers}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* User Stats Summary - Colorful Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Users" 
              value={totalUsers} 
              icon={<Users size={22} />}
              color="bg-gradient-to-br from-blue-500 to-blue-700"
              trend="+12.3%"
              isPositive={true}
            />
            <StatCard 
              title="Admin Users" 
              value={adminUsers} 
              icon={<ShieldCheck size={22} />}
              color="bg-gradient-to-br from-purple-500 to-purple-700"
              trend="+5.7%"
              isPositive={true}
            />
            <StatCard 
              title="Active Users" 
              value={activeUsers} 
              icon={<UserCheck size={22} />}
              color="bg-gradient-to-br from-emerald-500 to-emerald-700"
              trend="+8.2%"
              isPositive={true}
            />
            <StatCard 
              title="Inactive Users" 
              value={inactiveUsers} 
              icon={<UserX size={22} />}
              color="bg-gradient-to-br from-amber-500 to-amber-700"
              trend="-3.1%"
              isPositive={false}
            />
          </div>
          
          {/* Search and Filter Panel */}
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg overflow-hidden border border-slate-200">
                  <button 
                    className={`px-4 py-2 flex items-center gap-1 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <PieChart size={16} />
                    <span>Grid</span>
                  </button>
                  <button 
                    className={`px-4 py-2 flex items-center gap-1 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <Users size={16} />
                    <span>List</span>
                  </button>
                </div>
                {/* <button className="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                  <Filter size={16} />
                  <span>Filter</span>
                  <ChevronDown size={16} />
                </button> */}
                {/* <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg hover:shadow-md transition-all flex items-center gap-2">
                  <PlusCircle size={16} />
                  Add User
                </button> */}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden mb-6">
            <div className="flex border-b border-slate-100 overflow-x-auto">
              <button
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                }`}
                onClick={() => setActiveTab('all')}
              >
                <Users size={18} />
                All Users ({totalUsers})
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'admin' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                }`}
                onClick={() => setActiveTab('admin')}
              >
                <ShieldCheck size={18} />
                Admins ({adminUsers})
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'active' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                }`}
                onClick={() => setActiveTab('active')}
              >
                <UserCheck size={18} />
                Active Users ({activeUsers})
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'inactive' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                }`}
                onClick={() => setActiveTab('inactive')}
              >
                <UserX size={18} />
                Inactive Users ({inactiveUsers})
              </button>
            </div>
          </div>
          
          {/* User Display */}
          {loading ? (
            <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-lg p-8">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-6 rounded-xl shadow-md flex items-center">
              <XCircle className="w-8 h-8 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Error Loading Users</h3>
                <p>{error}</p>
              </div>
            </div>
          ) : !Array.isArray(users) || filteredUsers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-16 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Users Found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                There are no users matching your criteria. Try adjusting your search or add a new user.
              </p>
              <button className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg hover:shadow-md transition-all inline-flex items-center gap-2">
                <UserPlus size={16} />
                Add First User
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredUsers.map((user) => (
                <div 
                  key={user._id}
                  className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1"
                >
                  <div className={`h-3 ${user.isAdmin ? 'bg-indigo-600' : user.isActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                        {user.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex gap-1">
                        <button 
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                          onClick={() => toggleExpandedUser(user._id)}
                        >
                          <ExternalLink size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg text-slate-800 mb-1">{user.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                      <Mail size={14} />
                      <span className="truncate">{user.email}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {user.isAdmin && (
                        <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          <ShieldCheck size={12} className="mr-1" />
                          Admin
                        </span>
                      )}
                      {user.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                          <UserCheck size={12} className="mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          <UserX size={12} className="mr-1" />
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 text-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors">
                        Edit
                      </button>
                      <button className="flex-1 py-2 text-center text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden mb-8">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-4 px-6 font-semibold text-slate-600">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={() => {
                            if (selectedUsers.length === filteredUsers.length) {
                              setSelectedUsers([]);
                            } else {
                              setSelectedUsers(filteredUsers.map(user => user._id));
                            }
                          }}
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        />
                        <span>Name</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 font-semibold text-slate-600">Email</th>
                    <th className="py-4 px-6 font-semibold text-slate-600">Role</th>
                    <th className="py-4 px-6 font-semibold text-slate-600">Status</th>
                    <th className="py-4 px-6 font-semibold text-slate-600">Last Login</th>
                    <th className="py-4 px-6 font-semibold text-slate-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user._id} 
                      className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                        expandedUser === user._id ? 'bg-indigo-50' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => toggleUserSelection(user._id)}
                          />
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="font-medium text-slate-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {user.email}
                      </td>
                      <td className="py-4 px-6">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                            <ShieldCheck size={12} className="mr-1" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                            User
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {user.isActive ? (
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                            <span className="text-emerald-600 text-sm font-medium">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-red-600 text-sm font-medium">Inactive</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-sm">
                        {new Date().toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                            <HelpCircle size={18} />
                          </button>
                          <button 
                            className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                            onClick={() => toggleExpandedUser(user._id)}
                          >
                            <ExternalLink size={18} />
                          </button>
                          <button className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">Showing {filteredUsers.length} of {totalUsers} users</p>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Previous</button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:shadow-md transition-all">Next</button>
                </div>
              </div>
            </div>
          )}
          
          {/* Selected User Actions */}
          {selectedUsers.length > 0 && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 flex items-center gap-4 z-50">
              <span className="font-medium text-slate-700">{selectedUsers.length} users selected</span>
              <div className="h-6 border-r border-slate-200"></div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:shadow-md transition-all">
                  Bulk Edit
                </button>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-all">
                  Export
                </button>
                <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-all">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend, isPositive }) => {
  return (
    <div className={`${color} text-white rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
            {icon}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-sm opacity-80">{title}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {isPositive ? (
            <div className="flex items-center text-emerald-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm">{trend}</span>
            </div>
          ) : (
            <div className="flex items-center text-red-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7L17 17M17 17V7M17 17H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm">{trend}</span>
            </div>
          )}
          <span className="text-sm opacity-80">from last month</span>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;