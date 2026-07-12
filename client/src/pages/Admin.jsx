import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Database, CreditCard, Users, Trash2, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('masti-admin') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('metrics'); // metrics, requests

  // Cost calculation configuration
  const membersCount = 76;
  const avgDailyReadsPerMember = 4;
  const databaseReadsCount = membersCount * avgDailyReadsPerMember * 30; // ~9,120 reads/mo
  const firestoreReadCost = (databaseReadsCount / 100000) * 0.06; // $0.06 per 100K reads
  const storageGB = 5.4;
  const storageCost = storageGB * 0.026; // $0.026 per GB
  const cloudRunRequests = 120000; // 120k requests/mo (all within free tier of 2M)
  const cloudRunCost = 0.00;
  const totalCost = firestoreReadCost + storageCost + cloudRunCost;

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'mongsters2026') {
      localStorage.setItem('masti-admin', 'true');
      window.dispatchEvent(new Event('masti-admin-login'));
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid admin access code. Try again!');
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/requests', {
        headers: {
          'x-admin-password': 'mongsters2026'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        console.error("Failed to fetch requests");
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to reject/remove this request?")) return;
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': 'mongsters2026'
        }
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
      } else {
        alert("Failed to delete request");
      }
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  const formatWhatsAppUrl = (phone, name) => {
    // Standardize phone format (remove symbols, add default country code if missing)
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone; // Fallback to Indian code if 10 digits
    const text = encodeURIComponent(`Hi ${name}, welcome to Masti Mongsters! 🦁 We received your request to join the pack and would love to chat. Let's do a quick handshake!`);
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Neon gradient background flare */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-green/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-pink/20 rounded-full blur-3xl" />

          <div className="text-center relative">
            <div className="mx-auto h-16 w-16 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center text-brand-green mb-6 shadow-inner animate-pulse">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="font-display font-extrabold text-3xl text-white tracking-tight">
              Admin Access Gate
            </h2>
            <p className="mt-2 text-sm text-gray-400 font-body">
              Enter the Masti Mongsters admin access token to unlock statistics, billing projections, and member onboarding.
            </p>
          </div>

          <form className="mt-8 space-y-6 relative" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-2xl relative block w-full px-4 py-4 border border-gray-800 bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green font-display text-center tracking-widest text-lg"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-brand-pink text-sm justify-center bg-brand-pink/10 py-3 rounded-2xl border border-brand-pink/20">
                <AlertCircle size={16} />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent font-display font-bold text-sm rounded-2xl text-white bg-brand-green hover:bg-brand-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green shadow-glow hover:-translate-y-0.5 transition-all duration-300"
              >
                Authenticate Portal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Top Banner section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900 border border-gray-800 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl" />
        
        <div>
          <div className="flex items-center gap-2 text-brand-green mb-2 font-display text-xs uppercase tracking-widest font-bold">
            <Unlock size={12} /> Secure Admin Environment
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-none">
            Masti Portal <span className="text-brand-green">Admin Terminal</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2 font-body">
            Idea Owner & Admin: Jaisheel | Architect: Rajesh
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('metrics')}
            className={`font-display font-bold text-sm px-6 py-3 rounded-2xl transition-all ${
              activeTab === 'metrics' ? 'bg-brand-green text-white shadow-glow' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Dashboard Metrics
          </button>
          <button 
            onClick={() => {
              setActiveTab('requests');
              fetchRequests();
            }}
            className={`font-display font-bold text-sm px-6 py-3 rounded-2xl transition-all relative ${
              activeTab === 'requests' ? 'bg-brand-green text-white shadow-glow' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Join Requests
            {requests.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-pink text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-4 ring-gray-900 animate-bounce">
                {requests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'metrics' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Metrics summary Cards */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-soft flex items-center gap-5">
                <div className="p-4 bg-brand-blue/10 text-brand-blue rounded-xl">
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Pack</div>
                  <div className="text-2xl font-display font-black text-brand-dark mt-1">{membersCount} Members</div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-soft flex items-center gap-5">
                <div className="p-4 bg-brand-pink/10 text-brand-pink rounded-xl">
                  <RefreshCw size={24} className="animate-spin-slow" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Monthly Hits</div>
                  <div className="text-2xl font-display font-black text-brand-dark mt-1">120K Requests</div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-soft flex items-center gap-5">
                <div className="p-4 bg-brand-green/10 text-brand-green rounded-xl">
                  <Database size={24} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Storage Size</div>
                  <div className="text-2xl font-display font-black text-brand-dark mt-1">{storageGB} GB</div>
                </div>
              </div>

            </div>

            {/* GCP Cost detail table */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-soft">
              <h3 className="font-display font-extrabold text-xl text-brand-dark mb-6 flex items-center gap-2">
                <CreditCard className="text-brand-green" size={20} />
                Google Cloud Platform Cost Estimation
              </h3>

              <div className="space-y-6">
                
                <div>
                  <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
                    <span>Cloud Run API Compute (120,000 requests/mo)</span>
                    <span className="text-brand-dark font-display font-bold">$0.00 / mo (Free Tier)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue rounded-full" style={{ width: '6%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
                    <span>Firestore Reads & Writes ({databaseReadsCount.toLocaleString()} operations/mo)</span>
                    <span className="text-brand-dark font-display font-bold">${firestoreReadCost.toFixed(3)} / mo</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
                    <span>Cloud Storage ({storageGB} GB assets + egress)</span>
                    <span className="text-brand-dark font-display font-bold">${storageCost.toFixed(3)} / mo</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-pink rounded-full" style={{ width: '22%' }} />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 flex justify-between items-center">
                  <div>
                    <span className="font-display font-bold text-lg text-brand-dark">Total Project Monthly Cost</span>
                    <p className="text-xs text-gray-400 mt-1 font-body">Under Firebase and GCP overall free tiers.</p>
                  </div>
                  <span className="font-display font-black text-3xl text-brand-green">${totalCost.toFixed(2)}</span>
                </div>

              </div>
            </div>

          </div>

          {/* Quick info panel */}
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-brand-dark mb-4">GCP Budget Insights</h3>
              <p className="text-gray-500 text-xs leading-relaxed font-body">
                The Masti Mongsters platform utilizes a serverless architecture designed by Rajesh to run <strong>100% free of charge</strong> under typical usage profiles. 
              </p>
              <div className="mt-6 p-4 bg-white border border-gray-200/50 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-brand-blue flex-shrink-0 mt-0.5" size={16} />
                <p className="text-[11px] text-gray-400 leading-normal font-body">
                  Costs will remain at $0.00 until monthly Firestore Reads exceed 1.5 Million operations, or GCS Storage exceeds 5 GB.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200/50 mt-6">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Project ID</div>
              <code className="text-xs bg-gray-200/50 border border-gray-200 px-2 py-1 rounded-md text-brand-dark mt-1.5 block font-mono">
                jaisheelmastiproject
              </code>
            </div>
          </div>

        </div>
      ) : (
        /* Requests Table Tab */
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-soft">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-extrabold text-xl text-brand-dark">
              Pending Onboarding Invites
            </h3>
            <button 
              onClick={fetchRequests} 
              className="p-2 rounded-lg border border-gray-100 hover:border-gray-200 text-gray-500 hover:text-brand-dark transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {loading && requests.length === 0 ? (
            <div className="py-12 text-center text-gray-400 font-semibold">
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="py-12 text-center text-gray-400 font-semibold font-body">
              No pending onboarding requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="text-left font-display font-bold text-xs text-gray-400 uppercase tracking-wider pb-4">
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">WhatsApp / Insta</th>
                    <th className="py-3 px-4">Referrer</th>
                    <th className="py-3 px-4">Reason for Joining</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-display font-bold text-brand-dark">{request.name}</div>
                        <div className="text-[10px] text-gray-400 font-body mt-0.5">
                          {new Date(request.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <div className="font-semibold text-gray-600">{request.phone}</div>
                        {request.handle && (
                          <div className="text-xs text-brand-pink font-semibold mt-0.5">@{request.handle}</div>
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-sm text-gray-500">
                        {request.referer}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-500 font-body max-w-xs truncate" title={request.reason}>
                        {request.reason}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2 justify-center">
                          <a
                            href={formatWhatsAppUrl(request.phone, request.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-brand-green hover:bg-brand-green/90 text-white font-display font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            <MessageCircle size={14} /> Contact
                          </a>
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold p-2.5 rounded-xl transition-all"
                            title="Reject Request"
                          >
                            <Trash2 size={14} />
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
  );
}
