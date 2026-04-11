import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 💡 Navigation-ku idhu venum macha
import {
  convertConversion,
  deleteSingleLead,
  updateFollowUps,
  viewAllLead,
} from "../Api/api";
import { PenLine, Trash2, History } from "lucide-react"; // History icon nalla irukkum
import toast from "react-hot-toast";

function LeadPage() {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const navigate = useNavigate(); // 💡 Router navigate function

  const getLeads = async () => {
    try {
      const response = await viewAllLead();
      setLeads(response);
    } catch (error) {
      console.log("system error: ", error);
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      await updateFollowUps(currentId, selectedStatus);
      toast.success("Updated successfully");
      setOpen(false);

      setLeads(
        leads.map((lead) =>
          lead.id === currentId ? { ...lead, followUps: selectedStatus } : lead
        )
      );
    } catch (error) {
      toast.error("Update failed");
      console.log("system error", error);
    }
  };

  const handleConvertToCustomer = async (id) => {
    try {
      await convertConversion(id);
      // Logic fix: filter panna udane list-la irundhu poyidum (converted to customer)
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      toast.success("Converted to customer!");
    } catch (error) {
      toast.error("Cannot convert to customer");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await deleteSingleLead(id);
      toast.success("Deleted successfully");
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    } catch (error) {
      toast.error("Delete failed");
      console.log("system error :", error);
    }
  };

  useEffect(() => {
    getLeads();
  }, []);

  return (
    <div className="bg-slate-100/50 min-h-screen pt-16 pb-10 font-inter">
      <div className="mx-9 bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="border-b border-slate-50 bg-white p-8 flex justify-between items-center">
          <h1 className="capitalize font-bold text-2xl text-slate-800">
            Lead Management
            <span className="ml-4 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-tighter">
              {leads.length} Active Leads
            </span>
          </h1>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-300 table-fixed text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 capitalize text-slate-400 text-[10px] font-black tracking-widest">
                <th className="w-[15%] px-10 py-6">Lead Info</th>
                <th className="w-[18%] px-6 py-6">Contact</th>
                <th className="w-[10%] px-6 py-6 text-center">Status</th>
                <th className="w-[12%] px-6 py-6">Company</th>
                <th className="w-[10%] px-6 py-6">Source</th>
                <th className="w-[10%] px-6 py-6 text-center">Timeline</th> 
                <th className="w-[12%] px-6 py-6 text-center">Actions</th>
                <th className="w-[13%] px-6 py-6 text-center">Transfer</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {leads && leads.length > 0 ? (
                leads.map((data) => (
                  <tr key={data.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-10 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 capitalize text-sm">{data.name || "—"}</span>
                        <span className="text-[10px] text-slate-400 font-medium">#{data.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-600 text-xs font-medium">{data.email || "—"}</span>
                        <span className="text-slate-400 text-[10px]">{data.phone || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight">
                        {data.followUps || "new"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-slate-500 text-xs font-semibold truncate block">{data.company || "Individual"}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase">
                        {data.source || "Direct"}
                      </span>
                    </td>

                    {/* 💡 Timeline Column - This links to your new page */}
                    <td className="px-6 py-5 text-center">
                      <button 
                        onClick={() => navigate(`/admin/customer-activities/${data.id}`)}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer group-hover:scale-110 active:scale-90"
                        title="View Activities"
                      >
                        <History size={18} />
                      </button>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-5">
                        <button
                          className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                          onClick={() => handleDelete(data.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-slate-300 hover:text-blue-500 transition-colors cursor-pointer"
                          onClick={() => {
                            setCurrentId(data.id);
                            setSelectedStatus(data.followUps || "new");
                            setOpen(true);
                          }}
                        >
                          <PenLine size={18} />
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => handleConvertToCustomer(data.id)}
                        className="bg-slate-900 hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-md active:scale-95"
                      >
                        To Customer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-24">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-4">
                        Fetching Data...
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal Logic remains same but with improved UI */}
      {open && (
        <div className="bg-slate-900/40 inset-0 z-50 fixed flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Update Lead</h1>
              <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-widest">Stage Management</p>
            </div>

            <form onSubmit={handlesubmit} className="space-y-6">
              <div className="flex flex-col space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Choose Progress</label>
                <select
                  className="border-2 border-slate-100 rounded-2xl p-4 w-full outline-blue-500 bg-slate-50 cursor-pointer font-bold text-slate-700 text-sm appearance-none"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="new">New Lead</option>
                  <option value="interested">Interested</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Contacted">Contacted</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 mt-10">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-slate-100 text-slate-500 font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-widest"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-blue-200"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadPage;