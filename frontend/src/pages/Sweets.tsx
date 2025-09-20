import React, { useState, useEffect } from 'react';
import { sweetsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { Sweet } from '../types';
import toast from 'react-hot-toast';
import { Plus, Minus, ShoppingCart, Search, Star, Heart, Filter } from 'lucide-react';

const Sweets: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const { addToCart } = useCart();

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      const data = await sweetsAPI.getAll();
      setSweets(data);
    } catch (error) {
      toast.error('Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (sweet: Sweet, quantity: number = 1) => {
    if (sweet.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }
    addToCart(sweet, quantity);
    toast.success(`Added ${sweet.name} to cart`, {
      icon: '🛒',
      style: {
        borderRadius: '12px',
        background: '#10b981',
        color: '#fff',
      },
    });
  };

  const filteredAndSortedSweets = sweets
    .filter(sweet =>
      sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sweet.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'stock': return b.stock - a.stock;
        default: return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-pink-200 rounded-full animate-spin"></div>
          <div className="w-24 h-24 border-4 border-pink-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">🍭</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
              🍬 Sweet Paradise 🍭
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
              Discover our premium collection of handcrafted sweets made with love and tradition
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for your favorite sweets..."
                  className="w-full pl-12 pr-4 py-4 text-gray-700 bg-white/90 backdrop-blur-sm rounded-full border-0 focus:ring-4 focus:ring-white/30 focus:bg-white transition-all duration-300 text-lg shadow-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🧁</div>
        <div className="absolute top-20 right-20 text-4xl opacity-30 animate-pulse">🍰</div>
        <div className="absolute bottom-10 left-1/4 text-5xl opacity-25 animate-bounce delay-300">🍪</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter and Sort Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border-2 border-purple-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock">Stock Level</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200">
            {filteredAndSortedSweets.length} sweets available
          </div>
        </div>

        {filteredAndSortedSweets.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No sweets found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your search or filters</p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              Show All Sweets
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedSweets.map((sweet, index) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onAddToCart={handleAddToCart}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface SweetCardProps {
  sweet: Sweet;
  onAddToCart: (sweet: Sweet, quantity: number) => void;
  index: number;
}

const SweetCard: React.FC<SweetCardProps> = ({ sweet, onAddToCart, index }) => {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= sweet.stock) {
      setQuantity(newQuantity);
    }
  };

  const isOutOfStock = sweet.stock === 0;
  const isLowStock = sweet.stock <= 5 && sweet.stock > 0;

  // Sweet emojis for variety
  const sweetEmojis = ['🍬', '🍭', '🧁', '🍰', '🍪', '🎂', '🍩', '🥧'];
  const sweetEmoji = sweetEmojis[index % sweetEmojis.length];

  return (
    <div 
      className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 ${
        isOutOfStock ? 'opacity-75' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      {/* Favorite Button */}
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 group/fav"
      >
        <Heart 
          className={`w-5 h-5 transition-all duration-200 group-hover/fav:scale-110 ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
          }`} 
        />
      </button>

      {/* Status Badge */}
      {isOutOfStock && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
          Out of Stock
        </div>
      )}
      {isLowStock && !isOutOfStock && (
        <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg animate-pulse">
          Low Stock
        </div>
      )}

      {/* Sweet Image/Icon */}
      <div className="relative h-48 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 rounded-t-3xl flex items-center justify-center overflow-hidden">
        <div 
          className={`text-8xl transition-all duration-500 transform ${
            isHovered ? 'scale-110 rotate-12' : 'scale-100'
          }`}
        >
          {sweetEmoji}
        </div>
        
        {/* Shine Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 -skew-x-12 transition-all duration-700 ${
          isHovered ? 'opacity-30 translate-x-full' : '-translate-x-full'
        }`}></div>
      </div>

      <div className="p-6 space-y-4">
        {/* Sweet Info */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
            {sweet.name}
          </h3>
          {sweet.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {sweet.description}
            </p>
          )}
        </div>

        {/* Price and Stock */}
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              ₹{sweet.price}
            </span>
            <span className="text-sm text-gray-500">per piece</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              sweet.stock > 10 ? 'bg-green-500' : sweet.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium text-gray-600">
              {sweet.stock} left
            </span>
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        {!isOutOfStock && (
          <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-center">
              <div className="flex items-center bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-16 text-center font-bold text-lg text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= sweet.stock}
                  className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => onAddToCart(sweet, quantity)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
          </div>
        )}

        {/* Out of Stock Button */}
        {isOutOfStock && (
          <button 
            disabled 
            className="w-full bg-gray-300 text-gray-500 font-bold py-4 rounded-2xl cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}

        {/* Rating Stars (Decorative) */}
        <div className="flex items-center justify-center gap-1 pt-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${
                i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`} 
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.0)</span>
        </div>
      </div>
    </div>
  );
};

export default Sweets;
