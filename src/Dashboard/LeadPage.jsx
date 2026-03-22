import { useEffect, useState } from "react";
import { viewAllLead } from "../Api/api";

function LeadPage() {
  const [leads, setLeads] = useState([]);

  const getLeads = async () => {
    try {
      const response = await viewAllLead();
      setLeads(response);
    } catch (error) {
      console.log("system error: ", error);
    }
  };

  useEffect(() => {
    getLeads();
  }, []);

  return (
    <div className="bg-slate-100/50 min-h-screen pt-16 pb-10">
      <div className="mx-9 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="border-b border-gray-100 bg-white p-6">
          <h1 className="font-inter capitalize font-bold text-2xl text-slate-800">
            All Leads
            <span className="ml-3 text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              Total: {leads.length}
            </span>
          </h1>
        </div>

        {}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] table-fixed text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 capitalize text-slate-500 font-inter text-[11px] font-black tracking-widest">
                <th className="w-[18%] px-10 py-5">Name</th>
                <th className="w-[20%] px-6 py-5">Email</th>
                <th className="w-[10%] px-6 py-5 text-center">Followups</th>
                <th className="w-[15%] px-6 py-5">Phone</th>
                <th className="w-[12%] px-6 py-5">Location</th>
                <th className="w-[15%] px-6 py-5">Company</th>
                <th className="w-[10%] px-6 py-5">Source</th>
                <th className="w-[10%] px-6 py-5">created At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {leads && leads.length > 0 ? (
                leads.map((data) => (
                  <tr
                    key={data.id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-10 py-4 font-bold text-slate-700 capitalize truncate">
                      {data.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm truncate">
                      {data.email || "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg text-xs font-bold">
                        {data.followUps || "0"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-sm">
                      {data.phoneNumber || data.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm truncate">
                      {data.location || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm truncate">
                      {data.company || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {data.source || "Direct"}
                      </span>
                    </td>

                    <td  className="px-6 py-4 text-slate-500 text-sm truncate">{new Date(data.createdAt).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-24">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-400 font-medium mt-4 italic">
                        Loading leads data...
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LeadPage;
