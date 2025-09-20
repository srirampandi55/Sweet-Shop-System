import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sweetsAPI, ordersAPI } from '../utils/api';
import { Sweet, Order } from '../types';
import toast from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  const [sweetForm, setSweetForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000); // update time every second
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sweetsData, ordersData] = await Promise.all([
        sweetsAPI.getAll(),
        isAdmin ? ordersAPI.getAll() : Promise.resolve([]),
      ]);
      setSweets(sweetsData);
      setOrders(ordersData);
    } catch (error: any) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSweetForm({ name: '', price: '', stock: '', description: '' });
    setEditingSweet(null);
    setShowAddModal(false);
  };

  const handleSubmitSweet = async (e: React.FormEvent) => {
    e.preventDefault();

    const sweetData = {
      name: sweetForm.name,
      price: parseFloat(sweetForm.price),
      stock: parseInt(sweetForm.stock),
      description: sweetForm.description || undefined,
    };

    try {
      if (editingSweet) {
        await sweetsAPI.update(editingSweet.id, sweetData);
        toast.success('Sweet updated successfully');
      } else {
        await sweetsAPI.create(sweetData);
        toast.success('Sweet added successfully');
      }
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDeleteSweet = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;

    try {
      await sweetsAPI.delete(id);
      toast.success('Sweet deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error('Failed to delete sweet');
    }
  };

  const handleEditSweet = (sweet: Sweet) => {
    setSweetForm({
      name: sweet.name,
      price: sweet.price.toString(),
      stock: sweet.stock.toString(),
      description: sweet.description || '',
    });
    setEditingSweet(sweet);
    setShowAddModal(true);
  };

  // Stats cards
  const stats = [
    {
      name: 'Total Sweets',
      value: sweets.length,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Low Stock',
      value: sweets.filter(s => s.stock < 10).length,
      icon: TrendingUp,
      color: 'bg-yellow-500',
    },
    {
      name: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'bg-green-500',
    },
    {
      name: 'Revenue',
      value: `₹${orders.reduce((sum, o) => sum + o.totalPrice, 0).toFixed(2)}`,
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  // Chart data (Revenue by month)
  const revenueData = orders.reduce<Record<string, number>>((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + order.totalPrice;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(revenueData),
    datasets: [
      {
        label: 'Revenue',
        data: Object.values(revenueData),
        borderColor: '#EC4899',
        backgroundColor: 'rgba(236,72,153,0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Monthly Revenue' },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Sweet
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-gray-800 shadow rounded-lg p-5 flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Sweets Table */}
      {isAdmin && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Sweets Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {sweets.map(sweet => (
                  <tr key={sweet.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{sweet.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">{sweet.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">₹{sweet.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sweet.stock < 10
                          ? 'bg-red-100 text-red-800'
                          : sweet.stock < 20
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {sweet.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEditSweet(sweet)} className="text-primary-600 hover:text-primary-900 mr-4"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteSweet(sweet.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Sweet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
            </h3>
            <form onSubmit={handleSubmitSweet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" required className="input-field mt-1" value={sweetForm.name} onChange={(e) => setSweetForm({ ...sweetForm, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                <input type="number" step="0.01" required className="input-field mt-1" value={sweetForm.price} onChange={(e) => setSweetForm({ ...sweetForm, price: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                <input type="number" required className="input-field mt-1" value={sweetForm.stock} onChange={(e) => setSweetForm({ ...sweetForm, stock: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea className="input-field mt-1" rows={3} value={sweetForm.description} onChange={(e) => setSweetForm({ ...sweetForm, description: e.target.value })} />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingSweet ? 'Update' : 'Add'} Sweet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
