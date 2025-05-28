import { useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../redux/inventory/inventorySlice";
import { X, Package, DollarSign, Tag, BarChart2, Truck, Zap } from "lucide-react";

const AddProductModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ 
    name: "", 
    category: "", 
    stock: 0, 
    price: 0,
    description: "",
    sku: ""
  });

  // Categories from productModel.js
  const categories = ["Electronics", "Clothing", "Home", "Grocery", "Other"];

  const handleChange = (e) => {
    const value = e.target.type === "number" 
      ? parseFloat(e.target.value) 
      : e.target.value;
      
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("🆕 Form Data Before Sending:", formData);
  
    const newProduct = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      description: formData.description,
    };
  
    try {
      console.log("🚀 Sending Product Data:", newProduct);
      await dispatch(createProduct(newProduct));
      console.log("✅ Product Added Successfully");
      onClose();
    } catch (error) {
      console.error("❌ Error adding product:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100 p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with indigo gradient to match Home.jsx */}
        <div className="bg-indigo-600 p-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Package size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Add New Product</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Feature badge like in Home.jsx */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mt-4">
            <Zap size={14} />
            <span>Add to your inventory</span>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={18} className="text-indigo-500" />
                </div>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter product name" 
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            {/* SKU & Category - 2 column layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                <input 
                  type="text" 
                  name="sku" 
                  placeholder="SKU" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  name="category" 
                  value={formData.category}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                  onChange={handleChange} 
                  required 
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Stock & Price - 2 column layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BarChart2 size={18} className="text-indigo-500" />
                  </div>
                  <input 
                    type="number" 
                    name="stock" 
                    placeholder="0" 
                    min="0" 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={18} className="text-indigo-500" />
                  </div>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                name="description"
                rows="3"
                placeholder="Product description"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;