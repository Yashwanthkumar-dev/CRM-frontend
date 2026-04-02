import { useEffect, useState } from "react";
import {
  convertion,
  deleteSingleLead,
  leadsAnalytics,
  updateTime,
  viewAllLead,
  updateStatusApi,
  fetchSourceDataApi,
} from "../Api/api";
import {
  Clock7,
  Users,
  Calendar,
  Activity,
  Pen,
  Trash2,
  ExternalLink,
  X,
  CheckCircle2,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa6";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

function Homepage() {
  // --- 1. STATE MANAGEMENT ---
  const [leads, setLeads] = useState([]);
  const [card, setCard] = useState({
    totalLeads: 0,
    activeLead: 0,
    todayFollows: 0,
    leadPercentage: 0.0,
  });
  const [searchFilter, setSearchFilter] = useState("");

  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [nextDate, setNextDate] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayDate = new Date().toISOString().split("T")[0];

  const [leadSource, setLeadSource] = useState([]);

  // --- 2. FETCH DATA ---
  const fetchSourceData = async () => {
    try {
      const response = await fetchSourceDataApi();
      if (Array.isArray(response)) {
        setLeadSource(response);
      } else if (response && Array.isArray(response.data)) {
        setLeadSource(response.data);
      } else {
        setLeadSource([]);
      }
    } catch (error) {
      toast.error("failed to fetch source data");
      console.log("system error", error);
    }
  };

  const fetchData = async () => {
    try {
      const [leadRes, analyticsRes] = await Promise.all([
        viewAllLead(),
        leadsAnalytics(),
      ]);
      setLeads(Array.isArray(leadRes) ? leadRes : []);
      setCard(analyticsRes?.data || analyticsRes);
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  // inital fetching
  useEffect(() => {
    fetchData();
    fetchSourceData();
  }, []);

  // --- 3. FILTER LOGIC ---
  const filteredLeads = leads.filter((data) => {
    const search = searchFilter.toLowerCase();
    const name = data.name ? data.name.toLowerCase() : "";
    const email = data.email ? data.email.toLowerCase() : "";
    return name.includes(search) || email.includes(search);
  });

  const displayLeads =
    searchFilter.trim() !== ""
      ? filteredLeads
      : leads.filter((l) => l.nextFollowDate === todayDate).length > 0
        ? leads.filter((l) => l.nextFollowDate === todayDate)
        : leads;

  // --- 4. ACTION HANDLERS  ---
  const handleUpdateDate = async (e) => {
    e.preventDefault();
    if (!nextDate) return toast.error("Select a date");
    try {
      setIsSubmitting(true);
      await updateTime(selectedLeadId, nextDate);
      toast.success("Follow-up Rescheduled!");
      setShowDateModal(false);
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await updateStatusApi(selectedLeadId, statusValue);
      toast.success("Status Updated!");
      setShowStatusModal(false);
      fetchData();
    } catch (error) {
      toast.error("Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteSingleLead(id);
        toast.success("Lead Deleted");
        fetchData();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleConvert = async (id) => {
    try {
      setIsSubmitting(true);
      await convertion(id);
      toast.success("Converted to Customer! 🎉");
      fetchData();
    } catch (error) {
      toast.error("Conversion failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --5. what app connection ---
  const WhatAppHandler = (number) => {
    const whatAppUrl = `https://api.whatsapp.com/send?phone=${number}`;
    window.open(whatAppUrl, "_blank");
  };

  //  --- email connectio ---
  const emailHander = (email) => {
    const mail = `mailto:${email}`;
    window.location.href = mail;
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-28 pb-10 px-4 md:px-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Simple & Clean Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5 border border-slate-100">
            <div className="bg-indigo-50 p-4 rounded-xl text-indigo-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Leads</p>
              <p className="text-2xl font-bold text-slate-800">
                {card.totalLeads || 0}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5 border border-slate-100">
            <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">
                Today's Tasks
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {card.todayFollows || 0}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5 border border-slate-100">
            <div className="bg-amber-50 p-4 rounded-xl text-amber-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Leads</p>
              <p className="text-2xl font-bold text-slate-800">
                {card.activeLead || 0}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5 border border-slate-100">
            <div className="p-2 rounded-lg bg-green-100/60">
              <BsGraphUpArrow size={24} className="text-green-800" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium capitalize">
                lead rate
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {card.leadPercentage || 0.0} %
              </p>
            </div>
          </div>
        </div>

        {/* garph bar */}
        <div className="h-125 w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-10">
          <h1 className="text-xl text-gray-600 ml-3  text-center font-inter  capitalize mb-12">
            lead source analytics
          </h1>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={leadSource}>
              <XAxis
                dataKey="source"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="count"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Management Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Leads Database
              </h2>
              <p className="text-slate-400 text-sm italic">
                {searchFilter
                  ? `Searching: ${searchFilter}`
                  : "Manage your daily sales activities"}
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-2.5 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search name or email..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 transition-all"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr className="text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                  <th className="px-8 py-4 text-left">Lead Info</th>
                  <th className="px-8 py-4 text-center">Status</th>
                  <th className="px-8 py-4 text-center">Follow Up</th>
                  <th className="px-8 py-4 text-center">Actions</th>
                  <th className="px-8 py-4 text-right">Move</th>
                  <th className="px-8 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayLeads.length > 0 ? (
                  displayLeads.map((data) => (
                    <tr
                      key={data.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <p className="font-semibold text-slate-700">
                          {data.name}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">
                          {data.email}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                              data.followUps === "Qualified"
                                ? "bg-emerald-100 text-emerald-600"
                                : data.followUps === "Interested"
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-indigo-100 text-indigo-600"
                            }`}
                          >
                            {data.followUps || "New"}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedLeadId(data.id);
                              setStatusValue(data.followUps);
                              setShowStatusModal(true);
                            }}
                            className="text-[10px] text-indigo-400 mt-1 font-bold hover:underline"
                          >
                            Change
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <p className="text-sm text-slate-600 font-medium">
                          {data.nextFollowDate || "No Date"}
                        </p>
                        <button
                          onClick={() => {
                            setSelectedLeadId(data.id);
                            setNextDate(data.nextFollowDate || "");
                            setShowDateModal(true);
                          }}
                          className="text-slate-400 hover:text-indigo-500 mt-1"
                        >
                          <Clock7 size={16} className="mx-auto" />
                        </button>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <NavLink
                            to={`/activity/${data.id}`}
                            className="text-indigo-600 text-xs font-bold px-3 py-1 bg-indigo-50 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                          >
                            Activities
                          </NavLink>
                          <button
                            onClick={() => handleDelete(data.id)}
                            className="text-red-400 text-[10px] font-bold hover:text-red-600"
                          >
                            Delete Lead
                          </button>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => handleConvert(data.id)}
                          className="bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all flex items-center gap-2 ml-auto"
                        >
                          <CheckCircle2 size={14} /> Convert
                        </button>
                      </td>
                      <td className="flex flex-col   items-center  p-5 gap-2 ">
                        <i onClick={() => WhatAppHandler(data.number)}>
                          <FaWhatsapp
                            size={20}
                            className=" w-full text-green-600"
                          />
                        </i>
                        <i>
                          <MdEmail
                            size={20}
                            className=" w-full  text-red-500"
                            onClick={() => emailHander(data.email)}
                          />
                        </i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-20 text-center text-slate-400 italic"
                    >
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Update Status
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Current: {statusValue}
            </p>
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl mb-6 bg-slate-50 outline-none focus:border-indigo-500 font-medium"
            >
              <option value="Interested">Interested</option>
              <option value="Qualified">Qualified</option>
              <option value="Contracted">Contracted</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 py-3 text-slate-500 font-bold text-sm bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showDateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Schedule Follow-up
            </h2>
            <input
              type="date"
              value={nextDate}
              min={todayDate}
              onChange={(e) => setNextDate(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl mb-6 bg-slate-50 outline-none focus:border-emerald-500 font-medium"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowDateModal(false)}
                className="flex-1 py-3 text-slate-500 font-bold text-sm bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
              >
                Close
              </button>
              <button
                onClick={handleUpdateDate}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-all"
              >
                Update Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
