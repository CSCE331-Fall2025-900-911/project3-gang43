import React, { useState } from 'react';
import { BarChart3, Menu, Users, Package, Settings, TrendingUp, AlertCircle } from 'lucide-react';

const ManagerDashboard = () => {
  const [highContrast] = useState(false);
  const [fontSize] = useState('base');
  const [activeTab, setActiveTab] = useState('analytics');

  // Theme classes
  const bgClass = highContrast ? 'bg-black' : 'bg-gray-50';
  const cardBgClass = highContrast ? 'bg-gray-900 border-yellow-400 border-2' : 'bg-white';
  const sidebarBgClass = highContrast ? 'bg-gray-900 border-r-2 border-yellow-400' : 'bg-white';
  const textClass = highContrast ? 'text-yellow-300' : 'text-gray-900';
  const mutedTextClass = highContrast ? 'text-yellow-200' : 'text-gray-600';
  const hoverClass = highContrast ? 'hover:bg-yellow-400 hover:text-black' : 'hover:bg-gray-100';
  const fontSizeClass = fontSize === 'large' ? 'text-xl' : fontSize === 'xlarge' ? 'text-2xl' : 'text-base';

  const navItems = [
    { icon: BarChart3, label: 'Analytics', key: 'analytics' },
    { icon: Package, label: 'Inventory', key: 'inventory' },
    { icon: Menu, label: 'Menu Management', key: 'menu' },
    { icon: Users, label: 'Staff', key: 'staff' },
    { icon: Settings, label: 'Settings', key: 'settings' }
  ];

  const statsData = [
    { label: 'Today\'s Sales', value: '$1,247.50', change: '+12%', trend: 'up' },
    { label: 'Orders', value: '87', change: '+8%', trend: 'up' },
    { label: 'Avg Order', value: '$14.34', change: '+3%', trend: 'up' },
    { label: 'Popular Item', value: 'Taro Tea', change: '42 sold', trend: 'neutral' }
  ];

  const inventoryAlerts = [
    { item: 'Tapioca Pearls', level: 'Critical', quantity: '2 lbs' },
    { item: 'Taro Powder', level: 'Low', quantity: '5 lbs' },
    { item: 'Green Tea', level: 'Low', quantity: '3 boxes' }
  ];

  const recentOrders = [
    { id: '#1247', time: '2:34 PM', items: 'Classic Milk Tea, Taro Tea', total: '$12.00' },
    { id: '#1246', time: '2:31 PM', items: 'Matcha Latte', total: '$6.50' },
    { id: '#1245', time: '2:28 PM', items: 'Brown Sugar Boba, Fruit Tea', total: '$11.50' },
  ];

  return (
    <div className={`min-h-screen ${bgClass} ${textClass}`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`w-64 ${sidebarBgClass} p-6 shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-8 ${textClass}`}>Manager Portal</h2>
          <nav className="space-y-2">
            {navItems.map(({ icon, label, key }) => (
              <button 
                key={key} 
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${hoverClass} ${textClass} ${fontSizeClass} ${activeTab === key ? (highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-50 text-blue-600') : ''}`}
              >
                {React.createElement(icon, { className: "w-5 h-5" })}
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${textClass}`}>Sales Analytics</h1>
            <div className="flex gap-2">
              <button className={`px-4 py-2 ${cardBgClass} rounded-lg`}>
                Today
              </button>
              <button className={`px-4 py-2 ${cardBgClass} rounded-lg`}>
                This Week
              </button>
              <button className={`px-4 py-2 ${cardBgClass} rounded-lg`}>
                This Month
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {statsData.map(stat => (
              <div key={stat.label} className={`${cardBgClass} rounded-lg p-6 shadow-lg`}>
                <div className={`${mutedTextClass} mb-2 ${fontSizeClass}`}>{stat.label}</div>
                <div className={`text-3xl font-bold ${textClass} mb-2`}>{stat.value}</div>
                <div className="flex items-center gap-1">
                  {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                  <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Chart Placeholder */}
            <div className={`${cardBgClass} rounded-lg p-6 shadow-lg`}>
              <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>Sales Trend (Last 7 Days)</h2>
              <div className={`h-64 ${highContrast ? 'bg-gray-800' : 'bg-gray-100'} rounded flex items-center justify-center`}>
                <BarChart3 className={`w-16 h-16 ${mutedTextClass}`} />
              </div>
            </div>

            {/* Recent Orders */}
            <div className={`${cardBgClass} rounded-lg p-6 shadow-lg`}>
              <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>Recent Orders</h2>
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order.id} className={`p-3 ${highContrast ? 'bg-gray-800' : 'bg-gray-50'} rounded`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold ${textClass}`}>{order.id}</span>
                      <span className={`${mutedTextClass} text-sm`}>{order.time}</span>
                    </div>
                    <div className={`${mutedTextClass} text-sm mb-1`}>{order.items}</div>
                    <div className={`font-semibold ${textClass}`}>{order.total}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className={`${cardBgClass} rounded-lg p-6 shadow-lg`}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h2 className={`text-xl font-semibold ${textClass}`}>Low Inventory Alerts</h2>
            </div>
            <div className="space-y-3">
              {inventoryAlerts.map(alert => (
                <div key={alert.item} className={`flex justify-between items-center p-4 ${highContrast ? 'bg-gray-800' : 'bg-red-50'} rounded-lg`}>
                  <div>
                    <span className={`${textClass} ${fontSizeClass} font-semibold`}>{alert.item}</span>
                    <div className={`${mutedTextClass} text-sm`}>Remaining: {alert.quantity}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${alert.level === 'Critical' ? 'bg-red-500' : 'bg-orange-500'} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                      {alert.level}
                    </span>
                    <button className={`px-4 py-2 ${highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-600 text-white'} rounded hover:opacity-90`}>
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;