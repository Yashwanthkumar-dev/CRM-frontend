import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MessageSquarePlus, ChevronLeft, Clock, Ghost, X, Loader2 
} from "lucide-react";
import toast from "react-hot-toast";
import { viewLeadActivitiesById, createActivity } from "../Api/api";

function LeadActivity() {
  // --- 1. PARAMS (URL-la irundhu ID edukka) ---
  const { id } = useParams();
  const navigate = useNavigate();

  // --- 2. STATE (Memory and UI control) ---
  const [activities, setActivities] = useState([]); // List storage
  const [isLoading, setIsLoading] = useState(true); // Loading screen
  const [isModalOpen, setIsModalOpen] = useState(false); // Popup toggle
  const [newNote, setNewNote] = useState(""); // Input text memory
  const [isSubmitting, setIsSubmitting] = useState(false); // Save button status

  // --- 3. EFFECT (Page load aagumbodu automatic-ah fetch panna) ---
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setIsLoading(true);
        const response = await viewLeadActivitiesById(id);
        // Latest interaction mela vara maadhiri reverse panrom
        setActivities(response ? [...response].reverse() : []);
      } catch (error) {
        toast.error("Failed to load activities");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTimeline();
    }
  }, [id]); // ID change aana effect thirumba run aagum

  // --- 4. FUNCTIONS (Logic for adding data) ---
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return toast.error("Please enter a note!");

    try {
      setIsSubmitting(true);
      await createActivity(id, { notes: newNote });
      
      toast.success("Note added!");
      setNewNote(""); 
      setIsModalOpen(false); 
      
      // Refresh list: Database-la irundhu thirumba latest data-va fetch panrom
      const updatedData = await viewLeadActivitiesById(id);
      setActivities(updatedData ? [...updatedData].reverse() : []);
    } catch (error) {
      toast.error("Save failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 pt-28 font-inter">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-all"
        >
          <ChevronLeft size={18} /> Back to Dashboard
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Header */}
          <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                Activity Logs <span className="text-indigo-200 ml-1">#{id.slice(-4)}</span>
              </h1>
              <p className="text-slate-400 font-medium text-sm mt-1">Lead Interaction History</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all shadow-lg"
            >
              <MessageSquarePlus size={20} /> Add Note
            </button>
          </div>

          {/* Timeline Body */}
          <div className="p-10">
            {isLoading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-slate-400 font-bold">Syncing logs...</p>
              </div>
            ) : activities.length > 0 ? (
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-[9px] top-2 bottom-0 w-[2px] bg-indigo-50" />

                {activities.map((data, index) => (
                  <div key={index} className="flex gap-8 relative z-10 mb-10 last:mb-0 group">
                    {/* Dot */}
                    <div className="mt-2 w-5 h-5 bg-white border-4 border-indigo-600 rounded-full shadow-sm group-hover:scale-125 transition-transform" />
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <Clock size={12} /> {new Date(data.timeStamp).toLocaleString()}
                      </div>
                      <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                        <p className="text-slate-700 font-medium leading-relaxed uppercase">
                          {data.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50/30 rounded-[2rem] border-2 border-dashed border-slate-100">
                <Ghost className="text-slate-200 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-bold text-slate-400">No activities found</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add Update</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleAddNote}>
              <textarea
                rows="5"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Details of the interaction..."
                className="w-full border-2 border-slate-100 rounded-2xl p-5 text-slate-700 font-medium outline-none focus:border-indigo-100 bg-slate-50 resize-none"
              />
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
                >
                  {isSubmitting ? "Saving..." : "Post Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadActivity;