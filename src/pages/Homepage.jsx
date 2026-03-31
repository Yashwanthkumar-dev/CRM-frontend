import { useEffect, useState } from "react";
import { 
  convertion, 
  deleteSingleLead, 
  leadsAnalytics, 
  updateTime, 
  viewAllLead, 
  updateStatusApi 
} from "../Api/api";
import { Clock7, Users, Calendar, Activity, Pen, Trash2, ExternalLink, X, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

function Homepage() {
  const [leads, setLeads] = useState([]);
  const [card, setCard] = useState({ totalLeads: 0, activeLead: 0, todayFollows: 0 });
  
  // Modal States
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  // Form States
  const [nextDate, setNextDate] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayDate = new Date().toISOString().split("T")[0];

  const fetchData = async () => {
    try {
      const [leadRes, analyticsRes] = await Promise.all([viewAllLead(), leadsAnalytics()]);
      setLeads(Array.isArray(leadRes) ? leadRes : []);
      setCard(analyticsRes?.data || analyticsRes);
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Handlers ---

  const handleUpdateDate = async (e) => {
    e.preventDefault();
    if (!nextDate) return toast.error("Select a date!");
    try {
      setIsSubmitting(true);
      await updateTime(selectedLeadId, nextDate); // Check if your API expects (id, date)
      toast.success("Follow-up scheduled!");
      setShowDateModal(false);
      fetchData();
    } catch (error) {
      toast.error("Date update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!statusValue) return toast.error("Select a status!");
    try {
      setIsSubmitting(true);
      await updateStatusApi(selectedLeadId, statusValue);
      toast.success("Status updated!");
      setShowStatusModal(false);
      fetchData();
    } catch (error) {
      toast.error("Status update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteSingleLead(id);
        toast.success("Lead removed");
        fetchData();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleConvert = async (id) => {
    try {
      await convertion(id);
      toast.success("Lead converted to Customer! 🎉");
      fetchData();
    } catch (error) {
      toast.error("Conversion failed");
    }
  };

  const displayLeads = leads.filter(l => l.nextFollowDate === todayDate).length > 0
    ? leads.filter(l => l.nextFollowDate === todayDate)
    : leads;

  return (
    <div className="bg-[#F9FBFF] min-h-screen pt-32 pb-20 font-inter">
      <div className="max-w-[1400px] mx-auto px-10">
        
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          <StatCard title="Total Leads" count={card.totalLeads} icon={<Users size={22}/>} color="indigo" />
          <StatCard title="Today's Tasks" count={card.todayFollows} icon={<Calendar size={22}/>} color="emerald" />
          <StatCard title="Active Pipeline" count={card.activeLead} icon={<Activity size={22}/>} color="amber" />
        </div>

        {/* Lead Table */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-indigo-50/50 overflow-hidden">
          <div className="p-10 flex justify-between items-center border-b border-slate-50">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Lead Management</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Manage and track your sales funnel effectively.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                  <th className="py-7 px-10">Lead Details</th>
                  <th className="py-7 px-8 text-center">Status</th>
                  <th className="py-7 px-8 text-center">Next Follow-up</th>
                  <th className="py-7 px-8 text-center">Actions</th>
                  <th className="py-7 px-10 text-right">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayLeads.map((data) => (
                  <tr key={data.id} className="hover:bg-indigo-50/30 transition-all group">
                    <td className="py-7 px-10">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-lg">{data.name}</span>
                        <span className="text-sm text-slate-400">{data.email}</span>
                      </div>
                    </td>
                    <td className="py-7 px-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${
                          data.followUps === 'Qualified' ? 'bg-emerald-100 text-emerald-700' :
                          data.followUps === 'Interested' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {data.followUps || "New"}
                        </span>
                        <button 
                          onClick={() => { setSelectedLeadId(data.id); setStatusValue(data.followUps); setShowStatusModal(true); }}
                          className="text-[10px] font-bold text-indigo-500 hover:underline flex items-center gap-1"
                        >
                          <Pen size={10} /> Change
                        </button>
                      </div>
                    </td>
                    <td className="py-7 px-8 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-bold text-slate-600 italic">
                          {data.nextFollowDate || "Not Set"}
                        </span>
                        <button 
                          onClick={() => { setSelectedLeadId(data.id); setNextDate(data.nextFollowDate || ""); setShowDateModal(true); }}
                          className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                        >
                          <Clock7 size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="py-7 px-8 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <NavLink 
                          to={`/activity/${data.id}`} 
                          className="text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-[11px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                        >
                          Timeline <ExternalLink size={12} />
                        </NavLink>
                        <button onClick={() => handleDelete(data.id)} className="text-red-400 hover:text-red-600 text-[10px] font-bold uppercase flex items-center gap-1">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                    <td className="py-7 px-10 text-right">
                      <button 
                        onClick={() => handleConvert(data.id)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 ml-auto"
                      >
                        Convert <CheckCircle2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Status Update Modal */}
      {showStatusModal && (
        <ModalWrapper title="Update Lead Status" onClose={() => setShowStatusModal(false)}>
          <form onSubmit={handleUpdateStatus} className="space-y-6">
            <select 
              value={statusValue} 
              onChange={(e) => setStatusValue(e.target.value)}
              className="w-full border-2 border-slate-100 rounded-2xl p-5 text-slate-700 font-bold bg-slate-50 outline-none focus:border-indigo-200 transition-all"
            >
              <option value="Interested">Interested</option>
              <option value="Contracted">Contracted</option>
              <option value="Qualified">Qualified</option>
            </select>
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowStatusModal(false)} className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-all text-sm">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all text-sm">
                {isSubmitting ? "Updating..." : "Update Status"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* Date Update Modal */}
      {showDateModal && (
        <ModalWrapper title="Reschedule Follow-up" onClose={() => setShowDateModal(false)}>
          <form onSubmit={handleUpdateDate} className="space-y-6">
            <input 
              type="date" 
              value={nextDate} 
              onChange={(e) => setNextDate(e.target.value)}
              className="w-full border-2 border-slate-100 rounded-2xl p-5 text-slate-700 font-bold bg-slate-50 outline-none focus:border-indigo-200 transition-all"
            />
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowDateModal(false)} className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-all text-sm">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 transition-all text-sm">
                {isSubmitting ? "Saving..." : "Schedule Now"}
              </button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
}

// Reusable Stat Card Component
const StatCard = ({ title, count, icon, color }) => {
  const styles = {
    indigo: "border-indigo-500 text-indigo-600 bg-indigo-50/30",
    emerald: "border-emerald-500 text-emerald-600 bg-emerald-50/30",
    amber: "border-amber-500 text-amber-600 bg-amber-50/30"
  };
  return (
    <div className={`bg-white p-12 rounded-[3rem] shadow-xl shadow-slate-200/40 border-t-[12px] ${styles[color]} hover:-translate-y-2 transition-all duration-300`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-white rounded-2xl shadow-sm">{icon}</div>
        <h3 className="text-slate-400 font-black uppercase text-[11px] tracking-widest">{title}</h3>
      </div>
      <p className="text-6xl font-black text-slate-800 tracking-tighter">{count || 0}</p>
    </div>
  );
};

// Reusable Modal Wrapper Component
const ModalWrapper = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X size={20} className="text-slate-400" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default Homepage;