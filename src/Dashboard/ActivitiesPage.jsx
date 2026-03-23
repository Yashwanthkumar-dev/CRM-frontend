import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChartSpline, Plus, Clock, MessageSquare, X, Loader2 } from "lucide-react";
import { createActivity, viewLeadActivities } from "../Api/api";

const ActivitiesPage = () => {
  const { id } = useParams(); 
  const [activities, setActivities] = useState([]);
  const [leadInfo, setLeadInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchActivitiesData = async () => {
    if (!id || id === "undefined") return;
    try {
      setFetching(true);
      const data = await viewLeadActivities(id);
      setLeadInfo(data); 
      setActivities(data.activities || []); 
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchActivitiesData(); }, [id]);

  const handleSaveActivity = async () => {
    if (!newNote.trim()) return alert("Macha, note ezhudhunga!");
    setLoading(true);
    try {
      await createActivity(id, { notes: newNote });
      setShowModal(false);
      setNewNote("");
      fetchActivitiesData(); 
    } catch (error) {
      alert("Error saving activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50/50 p-6 min-h-screen font-inter">
      <div className="mx-auto max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-xl"><ChartSpline className="text-blue-600" /></div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                {leadInfo ? `${leadInfo.name}'s History` : "Loading..."}
              </h1>
              <p className="text-slate-500 text-sm">{leadInfo?.company} • ID: #{id}</p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all">
            <Plus size={18} /> Add Note
          </button>
        </div>

        {/* Timeline */}
        <div className="mt-12 relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100"></div>
          <div className="space-y-10">
            {fetching ? <Loader2 className="animate-spin mx-auto mt-10 text-slate-300" /> : 
              activities.length > 0 ? [...activities].reverse().map((item) => (
                <div key={item.id} className="relative pl-14 group">
                  <div className="absolute left-[14px] top-0 -translate-x-1/2 w-10 h-10 rounded-full bg-blue-50 border-4 border-white shadow-sm flex items-center justify-center z-10 group-hover:bg-blue-600 transition-colors">
                    <MessageSquare size={16} className="text-blue-600 group-hover:text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Clock size={12} /> {new Date(item.timeStamp).toLocaleString('en-IN')}
                    </span>
                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
                      <p className="text-slate-700 text-sm whitespace-pre-wrap">{item.notes}</p>
                    </div>
                  </div>
                </div>
              )) : <p className="text-center text-slate-400 italic py-10">No activities found.</p>
            }
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">New Note</h3>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="p-6">
              <textarea rows="4" className="w-full border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Spoke with lead about pricing..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 text-slate-600 font-semibold">Cancel</button>
              <button onClick={handleSaveActivity} disabled={loading} className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50">
                {loading ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ActivitiesPage;