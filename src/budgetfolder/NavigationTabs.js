import React from 'react';

function NavigationTab({ activeTab, setActiveTab }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'overview' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'analytics' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'transactions' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Transactions
        </button>
      </div>
    </div>
  );
}

export default NavigationTab;