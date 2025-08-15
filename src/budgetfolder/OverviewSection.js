import React, { useState } from 'react';
import { Lock, Plus, Minus, Download, BarChart3, Edit3, Trash2 } from 'lucide-react';

function OverviewSection({
  netBalance, totalIn, totalOut, downloadPDF, openAddForm, entries, showAddForm,
  pettyCashNotes, selectedPettyCashName, setSelectedPettyCashName, pettyCashDescription, setPettyCashDescription,
  pettyCashDate, setPettyCashDate, editingPettyCash, setEditingPettyCash,
  handleAddPettyCashNote, handleDeletePettyCashNote, pettyCashNames, setActiveTab, successMessage
}) {
  const [showDescriptions, setShowDescriptions] = useState(false);

  const editPettyCashNote = (note) => {
    setSelectedPettyCashName(note.name);
    setPettyCashDescription(note.description);
    setPettyCashDate(note.date); // Set the date from the note
    setEditingPettyCash(note);
  };

  const cancelEditPettyCash = () => {
    setSelectedPettyCashName('');
    setPettyCashDescription('');
    setPettyCashDate(new Date().toISOString().split('T')[0]);
    setEditingPettyCash(null);
  };

  return (
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

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Petty Cash Notes</h3>
              <select
                value={selectedPettyCashName}
                onChange={(e) => setSelectedPettyCashName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="">Select Name for Petty Cash</option>
                {pettyCashNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              {selectedPettyCashName && (
                <div>
                  <textarea
                    value={pettyCashDescription}
                    onChange={(e) => setPettyCashDescription(e.target.value)}
                    placeholder="Enter petty cash details"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    rows="4"
                  />
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={pettyCashDate}
                      onChange={(e) => setPettyCashDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddPettyCashNote}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      {editingPettyCash ? 'Update Note' : 'Add Note'}
                    </button>
                    {editingPettyCash && (
                      <button
                        onClick={cancelEditPettyCash}
                        className="px-4 bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
              {successMessage && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
                  {successMessage}
                </div>
              )}
              
              {/* Description View Section - Fixed to work with database structure */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 
                    className="text-md font-medium cursor-pointer text-blue-600 hover:underline flex items-center"
                    onClick={() => setShowDescriptions(!showDescriptions)}
                  >
                    Description View Section 
                    <span className="ml-2 text-sm">
                      {showDescriptions ? '▼' : '▶'}
                    </span>
                  </h4>
                  <span className="text-sm text-gray-500">
                    ({pettyCashNotes ? pettyCashNotes.length : 0} notes)
                  </span>
                </div>
                
                {/* Show section when expanded OR when there are no notes */}
                {(showDescriptions || (pettyCashNotes && pettyCashNotes.length === 0)) && (
                  <div className="mt-4">
                    {!pettyCashNotes || pettyCashNotes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <p>No petty cash notes yet.</p>
                        <p className="text-sm">Add your first note above!</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-lg shadow-sm divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Date</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Name</th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Description</th>
                              <th className="px-3 py-3 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {pettyCashNotes.map((note) => (
                              <tr key={note.id} className="hover:bg-gray-50">
                                <td className="px-3 py-4 text-sm text-gray-800">
                                  {note.date ? new Date(note.date).toLocaleDateString('en-GB') : 
                                   (note.created_at ? new Date(note.created_at).toLocaleDateString('en-GB') : 'N/A')}
                                </td>
                                <td className="px-3 py-4 text-sm font-medium text-gray-800">
                                  {note.name}
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-800">
                                  <div className="max-w-xs break-words" title={note.description}>
                                    {note.description}
                                  </div>
                                </td>
                                <td className="px-3 py-4 text-sm text-center">
                                  <div className="flex space-x-2 justify-center">
                                    <button
                                      onClick={() => editPettyCashNote(note)}
                                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                      title="Edit note"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this note?')) {
                                          handleDeletePettyCashNote(note.id);
                                        }
                                      }}
                                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                      title="Delete note"
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
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OverviewSection;