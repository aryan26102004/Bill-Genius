import { useState } from "react";
import { useDispatch } from "react-redux";
import { EditProduct } from "../redux/inventory/inventorySlice";
import { 
  X, Package, DollarSign, Tag, BarChart2, 
  ArrowRight, Truck, Clock, Shield
} from "lucide-react";

const EditProductModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    stock: product?.stock || 0,
    price: product?.price || 0,
    description: product?.description || "",
    sku: product?.sku || "",
  });

  const handleChange = (e) => {
    const value = e.target.type === "number" 
      ? parseFloat(e.target.value) 
      : e.target.value;
      
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product || !product._id) {
      console.error("Error: Product ID is missing");
      return;
    }

    const updatedProductData = {
      name: formData.name || product.name,
      price: formData.price || product.price,
      stock: formData.stock || product.stock,
      category: formData.category || product.category,
      description: formData.description || product.description,
    };

    try {
      console.log("🔄 Updating Product:", updatedProductData);
      await dispatch(EditProduct({ id: product._id, updatedData: updatedProductData }));
      console.log("✅ Product Updated Successfully");
      onClose(); // Close the modal after update
    } catch (error) {
      console.error("❌ Error updating product:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100 p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with indigo background like in Home.jsx */}
        <div className="bg-indigo-600 p-6 shadow-lg shadow-indigo-200/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Package size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">Edit Product</span>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1"
            >
              <X size={24} />
            </button>
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
                  <Tag size={18} className="text-indigo-600" />
                </div>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter product name" 
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  value={formData.name}
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            {/* SKU & Category - 2 column layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={18} className="text-indigo-600" />
                  </div>
                  <input 
                    type="text" 
                    name="sku" 
                    placeholder="SKU" 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    value={formData.sku}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield size={18} className="text-indigo-600" />
                  </div>
                  <input 
                    type="text" 
                    name="category" 
                    placeholder="Category" 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    value={formData.category}
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>
            
            {/* Stock & Price - 2 column layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BarChart2 size={18} className="text-indigo-600" />
                  </div>
                  <input 
                    type="number" 
                    name="stock" 
                    placeholder="0" 
                    min="0" 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    value={formData.stock}
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={18} className="text-indigo-600" />
                  </div>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    value={formData.price}
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <div className="relative">
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Product description"
                  className="w-full p-4 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              Update Product
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;