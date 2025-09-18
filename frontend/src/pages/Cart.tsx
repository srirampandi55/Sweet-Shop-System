import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (sweetId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(sweetId);
    } else {
      updateQuantity(sweetId, newQuantity);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerName: customerName.trim(),
        items: items.map(item => ({
          sweetId: item.sweet.id,
          quantity: item.quantity,
        })),
      };

      await ordersAPI.create(orderData);
      toast.success('Order placed successfully!');
      clearCart();
      setCustomerName('');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
        <a href="/sweets" className="btn-primary">
          Browse Sweets
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cart Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.sweet.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🍬</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.sweet.name}</h3>
                    <p className="text-sm text-gray-600">{item.sweet.description}</p>
                    <p className="text-lg font-bold text-primary-600">₹{item.sweet.price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.sweet.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.sweet.id, item.quantity + 1)}
                      disabled={item.quantity >= item.sweet.stock}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{(item.sweet.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.sweet.id)}
                      className="text-red-600 hover:text-red-800 mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹0.00</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-primary-600">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  required
                  className="input-field"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>

            <button
              onClick={clearCart}
              className="btn-secondary w-full mt-3"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
