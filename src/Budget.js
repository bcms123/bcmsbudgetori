
import React, { useState, useEffect } from 'react';
import { Plus, Minus, ChevronRight, Lock, Edit3, Trash2, Download, BarChart3, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from './supabaseClient'; // Import the Supabase client

function Budget() {
  const [entries, setEntries] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [entryType, setEntryType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [projectName, setProjectName] = useState('');
  const [contractor, setContractor] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('overview');

  // Categories for construction company
  const incomeCategories = [
    'Project Payment', 'Consultation Fee', 'Equipment Rental', 'Contract Milestone', 
    'Emergency Repair', 'Maintenance Contract', 'Other Income'
  ];
  
  const expenseCategories = [
    'Materials', 'Labor Cost', 'Equipment Purchase', 'Equipment Rental', 'Fuel',
    'Vehicle Maintenance', 'Tools', 'Permits & Licenses', 'Insurance', 'Utilities',
    'Office Supplies', 'Marketing', 'Travel', 'Subcontractor', 'Other Expense'
  ];

  // Fetch entries from Supabase on component mount
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('budget_entries')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching entries:', error);
    } else {
      setEntries(data);
    }
  };

  // Calculate totals
  const totalIn = entries
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);
  
  const totalOut = entries
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);
  
  const netBalance = totalIn - totalOut;

  // Prepare monthly data for charts
  const getMonthlyData = () => {
    const monthlyData = {};
    entries.forEach(entry => {
      const month = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, income: 0, expense: 0 };
      }
      if (entry.type === 'income') {
        monthlyData[month].income += entry.amount;
      } else {
        monthlyData[month].expense += entry.amount;
      }
    });
    return Object.values(monthlyData).sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  // Category wise expense data
  const getCategoryData = () => {
    const categoryData = {};
    entries.filter(entry => entry.type === 'expense').forEach(entry => {
      if (!categoryData[entry.category]) {
        categoryData[entry.category] = 0;
      }
      categoryData[entry.category] += entry.amount;
    });
    return Object.entries(categoryData).map(([category, amount]) => ({ category, amount }));
  };

  const handleAddEntry = async () => {
    if (amount && description && category) {
      const newEntry = {
        type: entryType,
        amount: parseFloat(amount),
        description,
        category,
        project_name: projectName || null,
        contractor: contractor || null,
        location: location || null,
        date
      };
      
      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('budget_entries')
          .update(newEntry)
          .eq('id', editingEntry.id);
        
        if (error) {
          console.error('Error updating entry:', error);
        } else {
          await fetchEntries();
          setEditingEntry(null);
        }
      } else {
        // Add new entry
        const { error } = await supabase
          .from('budget_entries')
          .insert([newEntry]);
        
        if (error) {
          console.error('Error adding entry:', error);
        } else {
          await fetchEntries();
        }
      }
      
      resetForm();
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('');
    setProjectName('');
    setContractor('');
    setLocation('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowAddForm(false);
    setEntryType('');
  };

  const openAddForm = (type) => {
    setEntryType(type);
    setShowAddForm(true);
  };

  const editEntry = (entry) => {
    setEditingEntry(entry);
    setEntryType(entry.type);
    setAmount(entry.amount.toString());
    setDescription(entry.description);
    setCategory(entry.category);
    setProjectName(entry.project_name || '');
    setContractor(entry.contractor || '');
    setLocation(entry.location || '');
    setDate(entry.date);
    setShowAddForm(true);
  };

  const deleteEntry = async (id) => {
    const { error } = await supabase
      .from('budget_entries')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting entry:', error);
    } else {
      await fetchEntries();
    }
  };

  const downloadPDF = () => {
    const content = `
CONSTRUCTION COMPANY BUDGET REPORT
Generated: ${new Date().toLocaleDateString()}

NET BALANCE: QAR ${netBalance.toLocaleString()}
TOTAL INCOME: QAR ${totalIn.toLocaleString()}
TOTAL EXPENSES: QAR ${totalOut.toLocaleString()}

RECENT TRANSACTIONS:
${entries.slice(-10).map(entry => 
  `${entry.date} | ${entry.type.toUpperCase()} | ${entry.category} | QAR ${entry.amount.toLocaleString()} | ${entry.description}`
).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Construction Company Budget Tracker</h1>
          <p className="text-gray-600 mt-2">Manage your construction projects finances and track expenses</p>
        </div>
      </div>

      {/* Navigation Tabs */}
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

      <div className="max-w-7xl mx-auto px-4 pb-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Balance Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Net Balance</h2>
                  <span className="text-2xl font-bold text-gray-800">QAR {netBalance.toLocaleString()}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-green-600 text-sm font-medium">Total In (+)</div>
                    <div className="text-green-700 text-xl font-bold">QAR {totalIn.toLocaleString()}</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-red-600 text-sm font-medium">Total Out (-)</div>
                    <div className="text-red-700 text-xl font-bold">QAR {totalOut.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="flex-1 flex items-center justify-center text-blue-500 font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50"
                  >
                    <BarChart3 className="mr-2 w-4 h-4" />
                    VIEW REPORTS
                  </button>
                  <button 
                    onClick={downloadPDF}
                    className="flex items-center justify-center text-green-600 font-medium py-2 px-4 border border-green-200 rounded-lg hover:bg-green-50"
                  >
                    <Download className="mr-2 w-4 h-4" />
                    PDF
                  </button>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="flex items-center justify-center mb-8">
                <Lock className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-gray-600 text-sm">Only you can see these entries</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              {entries.length === 0 && (
                <div className="text-center mb-8">
                  <h3 className="text-xl font-medium text-gray-800 mb-4">Try adding your first entry</h3>
                  <div className="text-blue-500 text-2xl">↓</div>
                </div>
              )}

              {/* Action Buttons */}
              {!showAddForm && (
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600 block mb-2">Record Income</span>
                    <button
                      onClick={() => openAddForm('income')}
                      className="w-full bg-green-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center hover:bg-green-700 transition-colors"
                    >
                      <Plus className="mr-2 w-5 h-5" />
                      CASH IN
                    </button>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 block mb-2">Record Expense</span>
                    <button
                      onClick={() => openAddForm('expense')}
                      className="w-full bg-red-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <Minus className="mr-2 w-5 h-5" />
                      CASH OUT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Monthly Trends */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Income vs Expenses</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getMonthlyData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `QAR ${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                    <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCategoryData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => `QAR ${value.toLocaleString()}`} />
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Transaction History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Project</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{new Date(entry.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          entry.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{entry.category}</td>
                      <td className="px-4 py-3 text-sm">{entry.description}</td>
                      <td className="px-4 py-3 text-sm">{entry.project_name || '-'}</td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        <span className={entry.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          QAR {entry.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
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
        )}

        {/* Add/Edit Entry Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-6">
                {editingEntry ? 'Edit Entry' : `Record ${entryType === 'income' ? 'Income' : 'Expense'}`}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {(entryType === 'income' ? incomeCategories : expenseCategories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <input
                    type="text"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    placeholder="Project name (optional)"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contractor/Vendor</label>
                  <input
                    type="text"
                    placeholder="Contractor or vendor name"
                    value={contractor}
                    onChange={(e) => setContractor(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Job site or location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddEntry}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  {editingEntry ? 'Update Entry' : 'Add Entry'}
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setEditingEntry(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Budget;
