import React from 'react';
import { Calendar, Search, Plus, Minus, Edit3, Trash2 } from 'lucide-react';

function TransactionsSection({
  filteredEntries, searchQuery, setSearchQuery, filterType, setFilterType, singleDate, setSingleDate,
  fromDate, setFromDate, toDate, setToDate, openAddForm, editEntry, deleteEntry
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <div className="flex flex-col gap-4 w-full md:w-auto md:flex-row md:items-center md:gap-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full md:w-auto p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="range">Date Range</option>
            <option value="specific">Specific Date</option>
          </select>
          <div className="flex flex-wrap gap-2 w-full">
            {filterType === 'specific' ? (
              <div className="relative flex-1 min-w-[120px]">
                <input
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            ) : (
              <>
                <div className="relative flex-1 min-w-[120px]">
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div className="relative flex-1 min-w-[120px]">
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </>
            )}
          </div>
          <div className="flex gap-4 w-full">
            <button
              onClick={() => openAddForm('income')}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center hover:bg-green-700 transition-colors"
            >
              <Plus className="mr-2 w-4 h-4" />
              CASH IN
            </button>
            <button
              onClick={() => openAddForm('expense')}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <Minus className="mr-2 w-4 h-4" />
              CASH OUT
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Project</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Amount</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-left">{new Date(entry.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    entry.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {entry.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-left">{entry.category}</td>
                <td className="px-4 py-3 text-sm text-left">{entry.description}</td>
                <td className="px-4 py-3 text-sm text-left">{entry.project_name || '-'}</td>
                <td className="px-4 py-3 text-sm font-semibold text-right">
                  <span className={entry.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    QAR {entry.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={() => editEntry(entry)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionsSection;