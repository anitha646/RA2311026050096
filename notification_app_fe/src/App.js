import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [priorityNotifications, setPriorityNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('priority');
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotifications();
    fetchPriority();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/notifications');
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPriority = async () => {
    try {
      const res = await axios.get('http://localhost:5000/priority-notifications?n=10');
      setPriorityNotifications(res.data.priority_notifications || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const typeMatch = filterType === 'All' || n.Type === filterType;
    const searchMatch = !searchTerm || 
      (n.Title && n.Title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (n.Message && n.Message.toLowerCase().includes(searchTerm.toLowerCase()));
    return typeMatch && searchMatch;
  });

  const getRelativeTime = (timestamp) => {
    const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    return diff < 60 ? `${diff}m ago` : `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">Notification System</h1>
          <p className="text-blue-300 text-xl">Stay updated with what's important</p>
        </div>

        <div className="flex justify-center gap-6 mb-10">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${activeTab === 'all' ? 'bg-white text-black shadow-xl' : 'bg-white/10 hover:bg-white/20'}`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setActiveTab('priority')}
            className={`px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2 transition-all ${activeTab === 'priority' ? 'bg-amber-500 text-black shadow-xl' : 'bg-white/10 hover:bg-white/20'}`}
          >
            Priority Inbox ★
          </button>
        </div>

        <div className="flex gap-4 mb-10">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white/10 border border-white/30 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-400 text-lg"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/10 border border-white/30 rounded-2xl px-6 py-4 focus:outline-none text-lg"
          >
            <option value="All">All Types</option>
            <option value="Placement">Placement</option>
            <option value="Result">Result</option>
            <option value="Event">Event</option>
          </select>
        </div>

        <div className="space-y-6">
          {(activeTab === 'all' ? filteredNotifications : priorityNotifications).map((notif, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:border-blue-400 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="text-5xl mt-1">
                  {notif.Type === 'Placement' ? '💼' : notif.Type === 'Result' ? '📊' : '🎉'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-semibold">{notif.Title}</h3>
                    <span className="text-gray-400 text-sm">{getRelativeTime(notif.Timestamp)}</span>
                  </div>
                  <p className="mt-4 text-gray-200 text-[17px] leading-relaxed">{notif.Message}</p>
                  <div className="mt-6">
                    <span className="inline-block px-6 py-2 bg-white/20 rounded-full text-sm font-medium">
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