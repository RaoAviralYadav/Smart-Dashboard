// import React, { useState, useEffect, useCallback } from 'react';
// import { leadAPI, Lead, LeadsResponse } from '../services/api';
// import { Loader, Plus, Trash2, Edit2, Download } from 'lucide-react';

// export const DashboardPage: React.FC = () => {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [pages, setPages] = useState(0);
  
//   const [statusFilter, setStatusFilter] = useState('');
//   const [sourceFilter, setSourceFilter] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortBy, setSortBy] = useState('latest');
  
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     status: 'new',
//     source: 'website'
//   });

//   const fetchLeads = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await leadAPI.getAll(page, statusFilter, sourceFilter, searchQuery, sortBy);
//       setLeads(response.data.leads);
//       setTotal(response.data.pagination.total);
//       setPages(response.data.pagination.pages);
//     } catch (error) {
//       console.error('Error fetching leads:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, statusFilter, sourceFilter, searchQuery, sortBy]);

//   useEffect(() => {
//     setPage(1);
//   }, [statusFilter, sourceFilter, searchQuery, sortBy]);

//   useEffect(() => {
//     fetchLeads();
//   }, [fetchLeads]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await leadAPI.update(editingId, formData);
//       } else {
//         await leadAPI.create(formData.name, formData.email, formData.status, formData.source);
//       }
//       setFormData({ name: '', email: '', status: 'new', source: 'website' });
//       setEditingId(null);
//       setShowForm(false);
//       fetchLeads();
//     } catch (error) {
//       console.error('Error saving lead:', error);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (confirm('Are you sure?')) {
//       try {
//         await leadAPI.delete(id);
//         fetchLeads();
//       } catch (error) {
//         console.error('Error deleting lead:', error);
//       }
//     }
//   };

//   const handleEdit = (lead: Lead) => {
//     setFormData({
//       name: lead.name,
//       email: lead.email,
//       status: lead.status,
//       source: lead.source
//     });
//     setEditingId(lead._id);
//     setShowForm(true);
//   };

//   const handleExport = async () => {
//     try {
//       const blob = await leadAPI.export(statusFilter, sourceFilter, searchQuery);
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'leads.csv';
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error exporting:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 text-white p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold">Leads Dashboard</h1>
//           <div className="flex gap-3">
//             <button
//               onClick={handleExport}
//               className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
//             >
//               <Download size={18} /> Export CSV
//             </button>
//             <button
//               onClick={() => {
//                 setShowForm(true);
//                 setEditingId(null);
//                 setFormData({ name: '', email: '', status: 'new', source: 'website' });
//               }}
//               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
//             >
//               <Plus size={18} /> New Lead
//             </button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-slate-800 rounded-lg p-6 mb-6 space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <input
//               type="text"
//               placeholder="Search by name or email..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
//             />
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
//             >
//               <option value="">All Status</option>
//               <option value="new">New</option>
//               <option value="contacted">Contacted</option>
//               <option value="qualified">Qualified</option>
//               <option value="lost">Lost</option>
//             </select>
//             <select
//               value={sourceFilter}
//               onChange={(e) => setSourceFilter(e.target.value)}
//               className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
//             >
//               <option value="">All Sources</option>
//               <option value="website">Website</option>
//               <option value="instagram">Instagram</option>
//               <option value="referral">Referral</option>
//             </select>
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
//             >
//               <option value="latest">Latest First</option>
//               <option value="oldest">Oldest First</option>
//             </select>
//           </div>
//         </div>

//         {/* Form Modal */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
//               <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Lead' : 'New Lead'}</h2>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Name"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
//                   required
//                 />
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
//                   required
//                 />
//                 <select
//                   value={formData.status}
//                   onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                   className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
//                 >
//                   <option value="new">New</option>
//                   <option value="contacted">Contacted</option>
//                   <option value="qualified">Qualified</option>
//                   <option value="lost">Lost</option>
//                 </select>
//                 <select
//                   value={formData.source}
//                   onChange={(e) => setFormData({ ...formData, source: e.target.value })}
//                   className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
//                 >
//                   <option value="website">Website</option>
//                   <option value="instagram">Instagram</option>
//                   <option value="referral">Referral</option>
//                 </select>
//                 <div className="flex gap-3">
//                   <button
//                     type="submit"
//                     className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
//                   >
//                     Save
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowForm(false)}
//                     className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-semibold"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Leads Table */}
//         <div className="bg-slate-800 rounded-lg overflow-hidden">
//           {loading ? (
//             <div className="flex justify-center items-center p-12">
//               <Loader className="animate-spin" size={40} />
//             </div>
//           ) : leads.length === 0 ? (
//             <div className="text-center p-12 text-slate-400">
//               <p>No leads found. Create your first lead to get started.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-700">
//                   <tr>
//                     <th className="px-6 py-3 text-left">Name</th>
//                     <th className="px-6 py-3 text-left">Email</th>
//                     <th className="px-6 py-3 text-left">Status</th>
//                     <th className="px-6 py-3 text-left">Source</th>
//                     <th className="px-6 py-3 text-left">Created</th>
//                     <th className="px-6 py-3 text-left">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {leads.map((lead) => (
//                     <tr key={lead._id} className="border-t border-slate-700 hover:bg-slate-700/50">
//                       <td className="px-6 py-4">{lead.name}</td>
//                       <td className="px-6 py-4">{lead.email}</td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
//                           lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
//                           lead.status === 'qualified' ? 'bg-green-500/20 text-green-400' :
//                           'bg-red-500/20 text-red-400'
//                         }`}>
//                           {lead.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 capitalize">{lead.source}</td>
//                       <td className="px-6 py-4 text-sm text-slate-400">
//                         {new Date(lead.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleEdit(lead)}
//                             className="text-blue-400 hover:text-blue-300"
//                           >
//                             <Edit2 size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(lead._id)}
//                             className="text-red-400 hover:text-red-300"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {pages > 1 && (
//           <div className="flex justify-center gap-2 mt-6">
//             <button
//               onClick={() => setPage(Math.max(1, page - 1))}
//               disabled={page === 1}
//               className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg"
//             >
//               Previous
//             </button>
//             <span className="px-4 py-2 text-slate-400">
//               Page {page} of {pages}
//             </span>
//             <button
//               onClick={() => setPage(Math.min(pages, page + 1))}
//               disabled={page === pages}
//               className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect, useCallback } from 'react';
import { leadAPI, Lead } from '../services/api';
import { Loader, Plus, Trash2, Edit2, Download } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'new',
    source: 'website'
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await leadAPI.getAll(page, statusFilter, sourceFilter, searchQuery, sortBy);
      setLeads(response.data.leads);
      setPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, sourceFilter, searchQuery, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, sourceFilter, searchQuery, sortBy]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await leadAPI.update(editingId, formData);
      } else {
        await leadAPI.create(formData.name, formData.email, formData.status, formData.source);
      }
      setFormData({ name: '', email: '', status: 'new', source: 'website' });
      setEditingId(null);
      setShowForm(false);
      fetchLeads();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await leadAPI.delete(id);
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleEdit = (lead: Lead) => {
    setFormData({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source
    });
    setEditingId(lead._id);
    setShowForm(true);
  };

  const handleExport = async () => {
    try {
      const response = await leadAPI.export(statusFilter, sourceFilter, searchQuery);
      const blob = new Blob([response.data as any], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Leads Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            >
              <Download size={18} /> Export CSV
            </button>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({ name: '', email: '', status: 'new', source: 'website' });
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              <Plus size={18} /> New Lead
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="instagram">Instagram</option>
              <option value="referral">Referral</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Lead' : 'New Lead'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                </select>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="website">Website</option>
                  <option value="instagram">Instagram</option>
                  <option value="referral">Referral</option>
                </select>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Leads Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader className="animate-spin" size={40} />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center p-12 text-slate-400">
              <p>No leads found. Create your first lead to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Source</th>
                    <th className="px-6 py-3 text-left">Created</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className="border-t border-slate-700 hover:bg-slate-700/50">
                      <td className="px-6 py-4">{lead.name}</td>
                      <td className="px-6 py-4">{lead.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                          lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                          lead.status === 'qualified' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 capitalize">{lead.source}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(lead)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={18} />
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

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-slate-400">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setPage(Math.min(pages, page + 1))}
              disabled={page === pages}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};