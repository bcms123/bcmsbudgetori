import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Import the Supabase client
import BudgetHeader from './BudgetHeader';
import NavigationTab from './NavigationTabs';
import OverviewSection from './OverviewSection';
import AnalyticsSection from './AnalyticsSection';
import TransactionsSection from './TransactionsSection';
import EntryForm from './EntryForm';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [singleDate, setSingleDate] = useState('');
  const [filterType, setFilterType] = useState('range');
  const [pettyCashNotes, setPettyCashNotes] = useState([]);
  const [selectedPettyCashName, setSelectedPettyCashName] = useState('');
  const [pettyCashDescription, setPettyCashDescription] = useState('');
  const [pettyCashDate, setPettyCashDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingPettyCash, setEditingPettyCash] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const pettyCashNames = ['Rifkan', 'Bismillah', 'Mubassir', 'Azeem', 'Iftikar', 'Faris'];

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
    fetchPettyCashNotes();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('budget_entries')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching entries:', error);
    } else {
      setEntries(data || []);
    }
  };

  const fetchPettyCashNotes = async () => {
    const { data, error } = await supabase
      .from('petticashdetails')
      .select('*')
      .order('date', { ascending: false }); // Order by date instead of created_at
    
    if (error) {
      console.error('Error fetching petty cash notes:', error);
    } else {
      console.log('Fetched petty cash notes:', data); // Debug log
      setPettyCashNotes(data || []);
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

  const handleAddPettyCashNote = async () => {
    if (selectedPettyCashName && pettyCashDescription && pettyCashDate) {
      // For the database, we send name, description, and date
      // The created_at will be automatically set by Supabase
      const note = {
        name: selectedPettyCashName,
        description: pettyCashDescription,
        date: pettyCashDate
      };
      
      console.log('Adding petty cash note:', note); // Debug log
      
      if (editingPettyCash) {
        const { data, error } = await supabase
          .from('petticashdetails')
          .update(note)
          .eq('id', editingPettyCash.id)
          .select(); // Return the updated record
        
        if (error) {
          console.error('Error updating petty cash note:', error);
        } else {
          console.log('Updated petty cash note:', data); // Debug log
          await fetchPettyCashNotes();
          setEditingPettyCash(null);
          setSuccessMessage('Petty cash note updated successfully!');
        }
      } else {
        const { data, error } = await supabase
          .from('petticashdetails')
          .insert([note])
          .select(); // Return the inserted record
        
        if (error) {
          console.error('Error adding petty cash note:', error);
        } else {
          console.log('Added petty cash note:', data); // Debug log
          await fetchPettyCashNotes();
          setSuccessMessage('Petty cash note added successfully!');
        }
      }
      
      // Reset form
      setSelectedPettyCashName('');
      setPettyCashDescription('');
      setPettyCashDate(new Date().toISOString().split('T')[0]);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      console.log('Missing required fields:', { selectedPettyCashName, pettyCashDescription, pettyCashDate });
    }
  };

  const handleDeletePettyCashNote = async (id) => {
    console.log('Deleting petty cash note with id:', id); // Debug log
    const { error } = await supabase
      .from('petticashdetails')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting petty cash note:', error);
    } else {
      console.log('Deleted petty cash note successfully'); // Debug log
      await fetchPettyCashNotes();
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
${entries.slice(-10).map(entry => `${entry.date} | ${entry.type.toUpperCase()} | ${entry.category} | QAR ${entry.amount.toLocaleString()} | ${entry.description}`).join('\n')}

PETTY CASH NOTES:
${pettyCashNotes.map(note => `${new Date(note.created_at).toLocaleDateString()} | ${note.name} | ${note.description}`).join('\n')}
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

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.project_name && entry.project_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entry.contractor && entry.contractor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entry.location && entry.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesDate;
    if (filterType === 'specific' && singleDate) {
      matchesDate = entry.date === singleDate;
    } else if (filterType === 'range') {
      matchesDate = (!fromDate || entry.date >= fromDate) && (!toDate || entry.date <= toDate);
    } else {
      matchesDate = true;
    }
    
    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <BudgetHeader />
      <NavigationTab activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {activeTab === 'overview' && (
          <OverviewSection
            netBalance={netBalance}
            totalIn={totalIn}
            totalOut={totalOut}
            downloadPDF={downloadPDF}
            openAddForm={openAddForm}
            entries={entries}
            showAddForm={showAddForm}
            pettyCashNotes={pettyCashNotes}
            selectedPettyCashName={selectedPettyCashName}
            setSelectedPettyCashName={setSelectedPettyCashName}
            pettyCashDescription={pettyCashDescription}
            setPettyCashDescription={setPettyCashDescription}
            pettyCashDate={pettyCashDate}
            setPettyCashDate={setPettyCashDate}
            editingPettyCash={editingPettyCash}
            setEditingPettyCash={setEditingPettyCash}
            handleAddPettyCashNote={handleAddPettyCashNote}
            handleDeletePettyCashNote={handleDeletePettyCashNote}
            pettyCashNames={pettyCashNames}
            setActiveTab={setActiveTab}
            successMessage={successMessage}
          />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsSection
            monthlyData={getMonthlyData()}
            categoryData={getCategoryData()}
          />
        )}
        {activeTab === 'transactions' && (
          <TransactionsSection
            filteredEntries={filteredEntries}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
            singleDate={singleDate}
            setSingleDate={setSingleDate}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            openAddForm={openAddForm}
            editEntry={editEntry}
            deleteEntry={deleteEntry}
          />
        )}
        {showAddForm && (
          <EntryForm
            editingEntry={editingEntry}
            entryType={entryType}
            amount={amount}
            setAmount={setAmount}
            category={category}
            setCategory={setCategory}
            description={description}
            setDescription={setDescription}
            projectName={projectName}
            setProjectName={setProjectName}
            contractor={contractor}
            setContractor={setContractor}
            location={location}
            setLocation={setLocation}
            date={date}
            setDate={setDate}
            handleAddEntry={handleAddEntry}
            resetForm={resetForm}
            setEditingEntry={setEditingEntry}
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
          />
        )}
      </div>
    </div>
  );
}

export default Budget;