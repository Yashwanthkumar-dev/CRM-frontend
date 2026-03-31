import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MessageSquarePlus,
  ChevronLeft,
  Clock,
  Ghost,
  X,
  Send,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { viewLeadActivitiesById, createActivity } from "../Api/api";

function LeadActivity() {
  // 1. Hook: URL-la irundhu ID-ah edukka
  const { id } = useParams();
  const navigate = useNavigate();

  // 2. Hook: State Management (Memory)
  const [activities, setActivities] = useState([]); // Timeline data store panna
  const [isLoading, setIsLoading] = useState(true); // Loading screen-kaga
  const [isModalOpen, setIsModalOpen] = useState(false); // Popup open/close panna
  const [newNote, setNewNote] = useState(""); // Input box value-kaga
  const [isSubmitting, setIsSubmitting] = useState(false); // Save button loading-kaga

  // 3. Hook: Effect (Action on Load)
  useEffect(() => {
    // Page load aanavudane intha function run aagum
    const fetchTimeline = async () => {
      try {
        setIsLoading(true);
        // api.js-la irundhu data-va fetch panroam
        const response = await viewLeadActivitiesById(id);
        setActivities(response || []); // Memory-la save panrom
      } catch (error) {
        toast.error("Failed to load activities");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTimeline();
    }
  }, [id]); // [id] dependency: ID maaruna thirumba fetch aagum

  // 4. Function: Form Submit Logic
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return toast.error("Please enter a note!");

    try {
      setIsSubmitting(true);
      // Backend-ku (ID, Body) anupuroam
      await createActivity(id, { notes: newNote });

      toast.success("Note added!");
      setNewNote(""); // Textarea-va clear panna
      setIsModalOpen(false); // Modal-ah close panna

      // Data-va refresh panna thirumba fetch call
      const updatedData = await viewLeadActivitiesById(id);
      setActivities(updatedData || []);
    } catch (error) {
      toast.error("Save failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 pt-28 font-inter">
      <div className="max-w-4xl mx-auto px-6">
        {/* Navigation Section */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm"
        >
          <ChevronLeft size={18} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          {/* Header Section */}
          <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                Timeline <span className="text-indigo-200 ml-2">#{id}</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1 text-sm italic">
                Tracking lead interactions...
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100"
            >
              <MessageSquarePlus size={20} /> Add Note
            </button>
          </div>

          {/* Timeline Body */}
          <div className="p-10">
            {isLoading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-slate-400 font-bold">Fetching logs...</p>
              </div>
            ) : activities.length > 0 ? (
              <div className="relative">
                {/* Vertical Connector Line */}
                <div className="absolute left-[7px] top-2 bottom-0 w-[2.5px] bg-indigo-50" />

                {activities.map((data, index) => (
                  <div key={index} className="flex gap-8 relative z-10 mb-10">
                    <div className="mt-2 p-1 bg-white border-2 border-indigo-600 rounded-full w-4 h-4 shadow-sm" />
                    <div className="flex-1 bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100 hover:bg-white transition-all">
                      <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <Clock size={12} />{" "}
                        {new Date(data.timeStamp).toLocaleString()}
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        {data.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem]">
                <Ghost className="text-slate-200 mx-auto mb-4" size={50} />
                <h3 className="text-lg font-bold text-slate-800 tracking-tight text-center">
                  No logs found
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Modal Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">Add Log</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
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
                  className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100"
                >
                  {isSubmitting ? "Saving..." : "Save Note"}
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
