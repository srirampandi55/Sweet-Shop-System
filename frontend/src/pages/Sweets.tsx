import React, { useState, useEffect } from 'react';
import { sweetsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { Sweet } from '../types';
import toast from 'react-hot-toast';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

const Sweets: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
    toast.success(`Added ${sweet.name} to cart`);
  };

  const filteredSweets = sweets.filter(sweet =>
    sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sweet.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Sweets Catalog</h1>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search sweets..."
            className="input-field w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredSweets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No sweets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSweets.map((sweet) => (
            <SweetCard
              key={sweet.id}
              sweet={sweet}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface SweetCardProps {
  sweet: Sweet;
  onAddToCart: (sweet: Sweet, quantity: number) => void;
}

const SweetCard: React.FC<SweetCardProps> = ({ sweet, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= sweet.stock) {
      setQuantity(newQuantity);
    }
  };

  const isOutOfStock = sweet.stock === 0;
  const isLowStock = sweet.stock <= 5 && sweet.stock > 0;

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Out of Stock
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Low Stock
          </div>
        )}

        <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-6xl">🍬</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">{sweet.name}</h3>

        {sweet.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{sweet.description}</p>
        )}

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary-600">₹{sweet.price}</span>
          <span className="text-sm text-gray-500">Stock: {sweet.stock}</span>
        </div>

        {!isOutOfStock && (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= sweet.stock}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => onAddToCart(sweet, quantity)}
              className="btn-primary w-full flex items-center justify-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </button>
          </div>
        )}

        {isOutOfStock && (
          <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default Sweets;
