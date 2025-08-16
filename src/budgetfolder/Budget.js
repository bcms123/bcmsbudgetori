import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf'; // Updated import for jsPDF
import autoTable from 'jspdf-autotable'; // Add this import for table support
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
    try {
      const { data, error } = await supabase
        .from('budget_entries')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching entries:', error);
      } else {
        console.log('Fetched entries:', data); // Debug log
        setEntries(data || []);
      }
    } catch (error) {
      console.error('Network error fetching entries:', error);
      setEntries([]);
    }
  };

  const fetchPettyCashNotes = async () => {
    try {
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
    } catch (error) {
      console.error('Network error fetching petty cash notes:', error);
      setPettyCashNotes([]);
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

  // FIXED PDF DOWNLOAD FUNCTION
  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    // Debug: Log the data before generating PDF
    console.log('=== PDF GENERATION DEBUG ===');
    console.log('Entries for PDF:', entries);
    console.log('PettyCash notes for PDF:', pettyCashNotes);
    console.log('Total entries count:', entries?.length || 0);
    console.log('Total petty cash notes count:', pettyCashNotes?.length || 0);
    console.log('Totals:', { totalIn, totalOut, netBalance });

    // Header
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('CONSTRUCTION COMPANY BUDGET REPORT', 105, y, { align: 'center' });
    y += 15;

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, y, { align: 'center' });
    y += 20;

    // Summary Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('FINANCIAL SUMMARY', 10, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`NET BALANCE: QAR ${netBalance.toLocaleString()}`, 10, y);
    y += 8;
    doc.text(`TOTAL INCOME: QAR ${totalIn.toLocaleString()}`, 10, y);
    y += 8;
    doc.text(`TOTAL EXPENSES: QAR ${totalOut.toLocaleString()}`, 10, y);
    y += 20;

    // Transactions Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('RECENT TRANSACTIONS:', 10, y);
    y += 10;

    // Check if there are entries to display
    if (entries && entries.length > 0) {
      // Get the last 15 entries (or all if less than 15)
      const recentEntries = entries.slice(0, 15); // Get first 15 from already sorted data
      console.log('Recent entries for PDF:', recentEntries);

      try {
        // Use autoTable for transactions
        autoTable(doc, {
          startY: y,
          head: [['Date', 'Type', 'Category', 'Description', 'Project', 'Income', 'Expense']],
          body: recentEntries.map(entry => [
            entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A',
            entry.type ? entry.type.toUpperCase() : 'N/A',
            entry.category || 'N/A',
            entry.description ? 
              (entry.description.length > 25 ? entry.description.substring(0, 25) + '...' : entry.description) 
              : 'N/A',
            entry.project_name || '-',
            entry.type === 'income' ? `QAR ${(entry.amount || 0).toLocaleString()}` : '',
            entry.type === 'expense' ? `QAR ${(entry.amount || 0).toLocaleString()}` : ''
          ]),
          theme: 'striped',
          styles: { 
            fontSize: 8, 
            cellPadding: 2,
            overflow: 'linebreak'
          },
          headStyles: { 
            fillColor: [64, 64, 64],
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold'
          },
          columnStyles: {
            0: { cellWidth: 22 },
            1: { cellWidth: 18 },
            2: { cellWidth: 25 },
            3: { cellWidth: 35 },
            4: { cellWidth: 25 },
            5: { cellWidth: 25 },
            6: { cellWidth: 25 }
          },
          margin: { left: 10, right: 10 },
          didDrawPage: function (data) {
            console.log('Table drawn successfully');
          }
        });

        // Get the final Y position after the table
        y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : y + 50;
      } catch (error) {
        console.error('Error creating transactions table:', error);
        doc.setFontSize(10);
        doc.text('Error generating transactions table.', 10, y);
        y += 15;
      }
    } else {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('No transactions found.', 10, y);
      y += 15;
      doc.setTextColor(0);
    }

    // Add new page if needed
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Petty Cash Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('PETTY CASH NOTES:', 10, y);
    y += 10;

    // Check if there are petty cash notes to display
    if (pettyCashNotes && pettyCashNotes.length > 0) {
      console.log('Processing petty cash notes for PDF:', pettyCashNotes);

      try {
        // Use autoTable for petty cash notes
        autoTable(doc, {
          startY: y,
          head: [['Date', 'Name', 'Description']],
          body: pettyCashNotes.map(note => [
            note.date ? new Date(note.date).toLocaleDateString() : 
              (note.created_at ? new Date(note.created_at).toLocaleDateString() : 'N/A'),
            note.name || 'N/A',
            note.description ? 
              (note.description.length > 60 ? note.description.substring(0, 60) + '...' : note.description)
              : 'N/A'
          ]),
          theme: 'striped',
          styles: { 
            fontSize: 8, 
            cellPadding: 2,
            overflow: 'linebreak'
          },
          headStyles: { 
            fillColor: [64, 64, 64],
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold'
          },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 30 },
            2: { cellWidth: 120 }
          },
          margin: { left: 10, right: 10 }
        });
      } catch (error) {
        console.error('Error creating petty cash table:', error);
        doc.setFontSize(10);
        doc.text('Error generating petty cash table.', 10, y);
      }
    } else {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('No petty cash notes found.', 10, y);
      doc.setTextColor(0);
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
      doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 290, { align: 'center' });
    }

    // Save the PDF
    const fileName = `budget-report-${new Date().toISOString().split('T')[0]}.pdf`;
    console.log('Saving PDF as:', fileName);
    doc.save(fileName);
  };

  // Debug function - you can remove this after testing
  const debugState = () => {
    console.log('=== CURRENT STATE DEBUG ===');
    console.log('Entries:', entries);
    console.log('PettyCash Notes:', pettyCashNotes);
    console.log('Totals:', { totalIn, totalOut, netBalance });
    console.log('Entries length:', entries?.length || 0);
    console.log('PettyCash length:', pettyCashNotes?.length || 0);
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
      
      {/* Debug button - remove after testing */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <button 
          onClick={debugState}
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
        >
          Debug State (Check Console)
        </button>
      </div>

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