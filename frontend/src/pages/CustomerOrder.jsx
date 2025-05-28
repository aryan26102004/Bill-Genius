import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/products/productSlice";
import { placeOrder } from "../redux/orders/orderSlice";
import { 
  ShoppingCart, Package, Plus, Minus, Trash2, CreditCard, 
  DollarSign, CheckCircle, Clock, MapPin, User
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const CustomerOrder = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products || {});
  const [cart, setCart] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchProducts());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  const handleAddToCart = (product) => {
    const exists = cart.find((item) => item.product === product._id);
    if (exists) {
      setCart(cart.map((item) => item.product === product._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { 
        product: product._id, 
        name: product.name, 
        price: product.price, 
        quantity: 1,
        image: product.image || null 
      }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    const exists = cart.find((item) => item.product === productId);
    if (exists.quantity === 1) {
      setCart(cart.filter((item) => item.product !== productId));
    } else {
      setCart(cart.map((item) => item.product === productId ? { ...item, quantity: item.quantity - 1 } : item));
    }
  };

  const handleDeleteFromCart = (productId) => {
    setCart(cart.filter((item) => item.product !== productId));
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
  
    const orderData = {
      items: cart,
      totalAmount: calculateTotal(),
    };
  
    dispatch(placeOrder(orderData))
      .unwrap()
      .then(() => {
        setOrderSuccess(true);
        setCart([]);
      })
      .catch((error) => {
        console.error("Order failed:", error);
        alert("Failed to place order. Please try again.");
      });
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Get the status badge styling - similar to CustomerDashboard
  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case "New": 
        return "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white";
      case "OnSale": 
        return "bg-gradient-to-r from-teal-500 to-teal-600 text-white";
      case "Featured": 
        return "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white";
      default: 
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Background with depth layers - updated to match Dashboard style */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700 h-64"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          {/* Geometric shapes for modern aesthetic */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-indigo-400 blur-3xl"
                 style={{ transform: `translateY(${scrollY * 0.15}px)` }}></div>
            <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-cyan-500 blur-3xl"
                 style={{ transform: `translateY(${-scrollY * 0.2}px)` }}></div>
            <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full bg-indigo-400 blur-3xl"
                 style={{ transform: `translateY(${-scrollY * 0.25}px)` }}></div>
          </div>
        </div>
        
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 pt-6 text-white">
              <div className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-200 text-sm font-medium tracking-wider">
                <ShoppingCart size={16} className="mr-2" />
                ORDER MANAGEMENT CENTER
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-zinc-50 block">Place Your Order</span>
                <span className="bg-gradient-to-r from-indigo-200 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
                  Browse Products & Checkout
                </span>
              </h1>
              <p className="text-zinc-300 mt-2">Add items to your cart and complete your purchase with ease.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-16">
              <StatCard 
                title="Available Products" 
                value={products?.length || 0}
                icon={<Package size={24} className="text-white" />} 
                delay={0} 
                animate={animateStats}
                color="indigo" 
              />
              <StatCard 
                title="Cart Items" 
                value={getItemsCount()}
                icon={<ShoppingCart size={24} className="text-white" />} 
                delay={100} 
                animate={animateStats}
                color="blue" 
              />
              <StatCard 
                title="Cart Total" 
                value={`₹${calculateTotal().toLocaleString()}`}
                icon={<DollarSign size={24} className="text-white" />} 
                delay={200} 
                animate={animateStats}
                color="indigo" 
              />
            </div>

            {/* Tabs Navigation - Similar to CustomerDashboard */}
            <div className="bg-white rounded-t-xl border border-slate-100">
              <div className="flex border-b border-slate-100">
                {[
                  { id: 'products', label: 'Product Catalog', icon: <Package size={18} /> },
                  { id: 'cart', label: 'Your Cart', icon: <ShoppingCart size={18} /> },
                  { id: 'shipping', label: 'Shipping Details', icon: <MapPin size={18} /> }
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
            
              {/* Tabs Content */}
              <div className="p-6">
                {/* Products Catalog Tab */}
                {activeTab === 'products' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                        <Package className="w-5 h-5 mr-2 text-indigo-600" />
                        Available Products
                      </h2>
                      {products?.length > 0 && (
                        <span className="text-sm text-slate-500">
                          Showing {products.length} product{products.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    {loading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : products?.length === 0 ? (
                      <div className="text-center py-16 bg-slate-50 rounded-lg">
                        <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 mb-4 text-lg">No products available.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products.map((product) => (
                          <div 
                            key={product._id} 
                            className="p-5 border border-slate-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-indigo-200 bg-white group"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-1">{product.name}</h3>
                                <div className="flex items-center mt-1 mb-2">
                                  <DollarSign className="w-4 h-4 text-indigo-600 mr-1" />
                                  <span className="font-bold text-slate-700">₹{product.price.toLocaleString()}</span>
                                </div>
                                {product.tags && (
                                  <span 
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      getStatusBadgeStyle(product.tags)
                                    } inline-block mb-2`}
                                  >
                                    {product.tags || "Standard"}
                                  </span>
                                )}
                                {product.description && (
                                  <p className="text-slate-500 text-sm mt-2">{product.description}</p>
                                )}
                              </div>
                              {product.image && (
                                <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100 shadow-md">
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:from-indigo-700 hover:to-blue-700 transform transition-transform duration-200 hover:scale-105 shadow-md"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Shopping Cart Tab */}
                {activeTab === 'cart' && (
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center mb-6">
                      <ShoppingCart className="w-5 h-5 mr-2 text-indigo-600" />
                      Your Shopping Cart
                    </h2>

                    {orderSuccess ? (
                      <div className="text-center py-16 bg-slate-50 rounded-lg animate-fadeIn">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-12 h-12 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">Order Placed Successfully!</h3>
                        <p className="text-slate-600 mb-6">Your order has been placed and is being processed.</p>
                        <button
                          onClick={() => {
                            setOrderSuccess(false);
                            setActiveTab('products');
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transform transition-transform duration-200 hover:scale-105 shadow-md"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    ) : cart.length === 0 ? (
                      <div className="text-center py-16 bg-slate-50 rounded-lg">
                        <ShoppingCart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 mb-4 text-lg">Your cart is empty.</p>
                        <button
                          onClick={() => setActiveTab('products')}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transform transition-transform duration-200 hover:scale-105 shadow-md"
                        >
                          Browse Products
                        </button>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-5 gap-6">
                        <div className="md:col-span-3">
                          <div className="bg-slate-50 rounded-lg border border-slate-100 p-5">
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                              {cart.map((item) => (
                                <div 
                                  key={item.product} 
                                  className="p-4 border border-slate-200 rounded-lg bg-white hover:border-indigo-200 transition-colors group hover:shadow-md"
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 mr-3">
                                        {item.image ? 
                                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> :
                                          <Package className="w-full h-full p-2 text-slate-400" />
                                        }
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-slate-800">{item.name}</h3>
                                        <p className="text-slate-500 text-sm">₹{item.price.toLocaleString()} per unit</p>
                                      </div>
                                    </div>
                                    <p className="font-bold text-slate-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                                  </div>
                                  <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center space-x-3">
                                      <button 
                                        onClick={() => handleRemoveFromCart(item.product)}
                                        className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors"
                                      >
                                        <Minus className="w-4 h-4 text-slate-700" />
                                      </button>
                                      <span className="font-medium text-slate-800">{item.quantity}</span>
                                      <button 
                                        onClick={() => handleAddToCart({ _id: item.product, name: item.name, price: item.price })}
                                        className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors"
                                      >
                                        <Plus className="w-4 h-4 text-slate-700" />
                                      </button>
                                    </div>
                                    <button 
                                      onClick={() => handleDeleteFromCart(item.product)}
                                      className="p-2 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <div className="bg-slate-50 rounded-lg border border-slate-100 p-5">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                              <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                              Order Summary
                            </h3>
                            
                            <div className="space-y-3 mb-6">
                              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                                <span className="text-slate-600">Subtotal:</span>
                                <span className="font-medium">₹{calculateTotal().toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Shipping:</span>
                                <span className="font-medium">₹0.00</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Tax:</span>
                                <span className="font-medium">₹{(calculateTotal() * 0.18).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                                <span className="text-slate-800 font-semibold">Total:</span>
                                <span className="font-bold text-lg text-slate-800">₹{(calculateTotal() * 1.18).toLocaleString()}</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={handlePlaceOrder}
                              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-medium flex items-center justify-center hover:from-indigo-700 hover:to-blue-700 transform transition-transform duration-200 hover:scale-105 shadow-md"
                            >
                              <CreditCard className="w-5 h-5 mr-2" />
                              Place Order
                            </button>
                            
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-600 flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                Estimated delivery: 3-5 business days
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Shipping Details Tab */}
                {activeTab === 'shipping' && (
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center mb-6">
                      <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                      Shipping Details
                    </h2>
                    
                    <div className="p-8 bg-slate-50 rounded-lg border border-slate-100 animate-fadeIn">
                      <h3 className="text-lg font-semibold text-slate-800 mb-6">Delivery Information</h3>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                            <input
                              type="text"
                              placeholder="Your Name"
                              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                            <input
                              type="tel"
                              placeholder="Your Phone Number"
                              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Address Line 1</label>
                          <input
                            type="text"
                            placeholder="Street Address"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Address Line 2</label>
                          <input
                            type="text"
                            placeholder="Apt, Suite, Building (optional)"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                            <input
                              type="text"
                              placeholder="Your City"
                              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                            <input
                              type="text"
                              placeholder="Your State"
                              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Postal Code</label>
                            <input
                              type="text"
                              placeholder="Postal Code"
                              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                            />
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <button
                            onClick={() => setActiveTab('cart')}
                            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-medium flex items-center justify-center hover:from-indigo-700 hover:to-blue-700 transform transition-transform duration-200 hover:scale-105 shadow-md"
                          >
                            <User className="w-5 h-5 mr-2" />
                            Save Shipping Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, delay, animate, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getGradient = () => {
    switch(color) {
      case 'indigo': return 'from-indigo-500 to-indigo-600';
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'cyan': return 'from-cyan-500 to-cyan-600';
      default: return 'from-indigo-500 to-indigo-600';
    }
  };

  return (
    <div 
      className={`p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all duration-500 transform ${
        animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${isHovered ? "-translate-y-1" : ""} border border-slate-100 relative overflow-hidden`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${getGradient()} transform transition-all duration-500 ${
          isHovered ? "rotate-6 scale-110" : ""
        }`}>
          {icon}
        </div>
      </div>
      <h2 className="text-lg font-medium text-slate-600">{title}</h2>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      <div className={`mt-4 h-1 w-16 bg-gradient-to-r ${getGradient()} rounded-full transition-all duration-500 ${
        isHovered ? "w-3/4" : ""
      }`}></div>
    </div>
  );
};

// You'll need to add this CSS to your global styles
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.4s ease-out forwards;
// }

export default CustomerOrder;