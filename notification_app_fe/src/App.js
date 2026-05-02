import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [priorityNotifications, setPriorityNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('priority');
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const typeColors = {
    Placement: 'bg-emerald-500 text-white',
    Result: 'bg-blue-500 text-white',
    Event: 'bg-purple-500 text-white',
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [allRes, priRes] = await Promise.all([
        axios.get('http://localhost:5000/notifications'),
        axios.get('http://localhost:5000/priority-notifications?n=10')
      ]);
      setNotifications(allRes.data.notifications || []);
      setPriorityNotifications(priRes.data.priority_notifications || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchType = filterType === 'All' || n.Type === filterType;
    const matchSearch = !searchTerm || 
      n.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.Message?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const getRelativeTime = (timestamp) => {
    const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    return diff < 60 ? `${diff}m ago` : `${Math.floor(diff/60)}h ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Notification System
          </h1>
          <p className="text-blue-300 text-lg">Stay updated with what's important</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-10">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all ${activeTab === 'all' ? 'bg-white text-black shadow-xl' : 'bg-white/10 hover:bg-white/20'}`}
          >
            All Notifications
          </button>
          <button 
            onClick={() => setActiveTab('priority')}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all flex items-center gap-2 ${activeTab === 'priority' ? 'bg-amber-500 text-black shadow-xl' : 'bg-white/10 hover:bg-white/20'}`}
          >
            Priority Inbox ★
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Placement">Placement</option>
            <option value="Result">Result</option>
            <option value="Event">Event</option>
          </select>
        </div>

        {/* Notifications Grid */}
        <div className="grid gap-6">
          {(activeTab === 'all' ? filteredNotifications : priorityNotifications).map((notif, index) => (
            <div key={index} className="notification-card bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 group">
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 ${typeColors[notif.Type] || 'bg-gray-700'}`}>
                  {notif.Type === 'Placement' ? '💼' : notif.Type === 'Result' ? '📊' : '🎯'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {notif.Title}
                    </h3>
                    <span className="text-sm text-gray-400 whitespace-nowrap ml-4">
                      {getRelativeTime(notif.Timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mt-3 leading-relaxed">{notif.Message}</p>
                  
                  <div className="mt-5">
                    <span className={`inline-flex items-center px-5 py-2 rounded-full text-sm font-medium ${typeColors[notif.Type] || 'bg-gray-700'}`}>
                      {notif.Type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;