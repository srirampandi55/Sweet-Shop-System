import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../utils/api';
import { Order } from '../types';
import toast from 'react-hot-toast';
import { Eye, Calendar, User, DollarSign } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { isDark } = useTheme(); // <-- ThemeContext

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ordersAPI.getAll();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId: string) => {
    try {
      const order = await ordersAPI.getById(orderId);
      setSelectedOrder(order);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to load order details');
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Prepare monthly revenue
  const months = [
    'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
  ];
  const revenueByMonth: Record<string, number> = {};
  months.forEach(month => revenueByMonth[month] = 0);
  orders.forEach(order => {
    const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
    revenueByMonth[month] += order.totalPrice;
  });

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: months.map(m => revenueByMonth[m]),
        backgroundColor: 'rgba(52, 211, 153, 0.7)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' as const, labels: { color: isDark ? '#fff' : '#111' } },
      title: { display: true, text: 'Monthly Revenue', color: isDark ? '#fff' : '#111' },
    },
    scales: {
      x: { ticks: { color: isDark ? '#fff' : '#111' }, grid: { color: isDark ? '#444' : '#e5e7eb' } },
      y: { ticks: { color: isDark ? '#fff' : '#111' }, grid: { color: isDark ? '#444' : '#e5e7eb' } },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Orders Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-4 bg-white dark:bg-gray-800 shadow rounded-lg flex items-center">
          <div className="p-3 rounded-lg bg-blue-500">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{orders.length}</p>
          </div>
        </div>

        <div className="card p-4 bg-white dark:bg-gray-800 shadow rounded-lg flex items-center">
          <div className="p-3 rounded-lg bg-green-500">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ₹{orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="card p-4 bg-white dark:bg-gray-800 shadow rounded-lg flex items-center">
          <div className="p-3 rounded-lg bg-purple-500">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Unique Customers</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {new Set(orders.map(o => o.customerName)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="card p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Orders Table */}
      <div className="card p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Order ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Customer</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Items</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Total</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="px-4 py-2">#{order.id.slice(-8)}</td>
                  <td className="px-4 py-2">{order.customerName}</td>
                  <td className="px-4 py-2">{order.items.length} items</td>
                  <td className="px-4 py-2">₹{order.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-2">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleViewOrder(order.id)}
                      className="text-primary-600 dark:text-primary-400 hover:underline flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 z-50 overflow-y-auto">
          <div className="relative top-20 mx-auto p-5 border dark:border-gray-700 w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Order Details - #{selectedOrder.id.slice(-8)}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 dark:text-gray-300 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</p>
                  <p>{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Order Date</p>
                  <p>{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold mb-2">Order Items</h4>
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2">
                    <div>
                      <p className="font-medium">{item.sweet.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">₹{selectedOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
