import React, { useState, useEffect } from 'react';
import { sweetsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { Sweet } from '../types';
import toast from 'react-hot-toast';
import { Plus, Minus, ShoppingCart, Search, Filter, X } from 'lucide-react';

const Sweets: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const { addToCart } = useCart();

  // Placeholder images
  const placeholderImages = [
    'https://source.unsplash.com/400x400/?candy',
    'https://source.unsplash.com/400x400/?sweet',
    'https://source.unsplash.com/400x400/?dessert',
    'https://source.unsplash.com/400x400/?cake',
    'https://source.unsplash.com/400x400/?cupcake',
    'https://source.unsplash.com/400x400/?pastry',
  ];

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
      style: { borderRadius: '12px', background: '#10b981', color: '#fff' },
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-pink-600 dark:text-pink-400">
          🍬 Sweet Paradise
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Discover premium handcrafted sweets made with love
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search sweets..."
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter & Sort */}
      <div className="max-w-7xl mx-auto px-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 transition"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock">Stock Level</option>
          </select>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {filteredAndSortedSweets.length} sweets available
        </div>
      </div>

      {/* Sweets Grid */}
      {filteredAndSortedSweets.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold mb-2">No sweets found</h3>
          <button
            onClick={() => setSearchTerm('')}
            className="bg-pink-500 dark:bg-pink-400 text-white px-6 py-3 rounded-full hover:bg-pink-600 dark:hover:bg-pink-500 transition"
          >
            Show All
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedSweets.map((sweet, index) => (
            <SweetCard
              key={sweet.id}
              sweet={sweet}
              index={index}
              onSelect={() => setSelectedSweet(sweet)}
              placeholderImage={placeholderImages[index % placeholderImages.length]}
            />
          ))}
        </div>
      )}

      {/* Sweet Details Modal */}
      {selectedSweet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl max-w-lg w-full overflow-hidden relative">
            <button
              onClick={() => setSelectedSweet(null)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={selectedSweet.imageUrl || placeholderImages[0]}
              alt={selectedSweet.name}
              className="w-full h-64 object-cover"
            />

            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedSweet.name}</h2>
              {selectedSweet.description && (
                <p className="text-gray-700 dark:text-gray-300">{selectedSweet.description}</p>
              )}

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-pink-600 dark:text-pink-400">₹{selectedSweet.price}</span>
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  {selectedSweet.stock} left
                </span>
              </div>

              {/* Quantity and Add to Cart */}
              {selectedSweet.stock > 0 ? <QuantityAddToCart sweet={selectedSweet} onAddToCart={handleAddToCart} /> : (
                <button disabled className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 py-3 rounded-2xl">
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SweetCardProps {
  sweet: Sweet;
  index: number;
  placeholderImage: string;
  onSelect: () => void;
}

const SweetCard: React.FC<SweetCardProps> = ({ sweet, onSelect, placeholderImage }) => {
  const isOutOfStock = sweet.stock === 0;
  const isLowStock = sweet.stock > 0 && sweet.stock <= 5;

  return (
    <div
      className={`cursor-pointer bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform transform hover:-translate-y-2`}
      onClick={onSelect}
    >
      <div className="h-64 w-full overflow-hidden relative">
        <img
          src={sweet.imageUrl || placeholderImage}
          alt={sweet.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {isOutOfStock && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            Out of Stock
          </span>
        )}
        {isLowStock && !isOutOfStock && (
          <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
            Low Stock
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{sweet.name}</h3>
        {sweet.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{sweet.description}</p>
        )}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xl font-bold text-pink-600 dark:text-pink-400">₹{sweet.price}</span>
          <span className="text-sm text-gray-500 dark:text-gray-300">{sweet.stock} left</span>
        </div>
      </div>
    </div>
  );
};

interface QuantityAddToCartProps {
  sweet: Sweet;
  onAddToCart: (sweet: Sweet, quantity: number) => void;
}

const QuantityAddToCart: React.FC<QuantityAddToCartProps> = ({ sweet, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex gap-2 items-center mt-3">
      <button
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        <Minus className="h-4 w-4 text-gray-700 dark:text-gray-200" />
      </button>
      <span className="w-8 text-center">{quantity}</span>
      <button
        onClick={() => setQuantity(Math.min(sweet.stock, quantity + 1))}
        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        <Plus className="h-4 w-4 text-gray-700 dark:text-gray-200" />
      </button>
      <button
        onClick={() => onAddToCart(sweet, quantity)}
        className="bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 text-white px-4 py-2 rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-500 dark:hover:to-purple-500 transition"
      >
        <ShoppingCart className="w-4 h-4 inline-block mr-1" /> Add
      </button>
    </div>
  );
};

export default Sweets;
