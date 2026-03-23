import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  dashboardAnalytics,
  deleteSingleCustomer,
  leadSourceAnalytics,
  updateCustomerDetails,
  viewAllCustomerDetails,
} from "../Api/api";
import {
  ChartNoAxesColumn,
  User,
  UserCheck,
  Trash2,
  Activity,
  PieChart as PieIcon,
  Download,
  Search,
  Users,
  PenLine,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const DashBoardHomePage = () => {
  const [dashboardData, setDashboardData] = useState({
    totalLeads: 0,
    totalCustomer: 0,
    intrestedCustomer: 0,
    recentActivities: [],
  });
  const [selectedId, setSelectedID] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [leadSource, setLeadSource] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  // --- API Functions ---
  const fetchData = async () => {
    try {
      const [analytics, customers, sources] = await Promise.all([
        dashboardAnalytics(),
        viewAllCustomerDetails(),
        leadSourceAnalytics(),
      ]);
      setDashboardData(analytics);
      setCustomerData(customers);
      setLeadSource(sources);
    } catch (error) {
      console.error("Data Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteSingleCustomerByid = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteSingleCustomer(id);
        setCustomerData((prev) => prev.filter((c) => c.id !== id));
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
  };
  console.log(customerData.email);

  // ---  Search Logic ---
  const filteredCustomers = customerData.filter((customer) => {
    const search = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      (customer.phoneNumber && customer.phoneNumber.includes(search)) ||
      (customer.location && customer.location.toLowerCase().includes(search))
    );
  });

  // --- Excel Export Logic ---
  const exportToExcel = () => {
    const excelData = customerData.map(({ id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer_Data");
    XLSX.writeFile(
      workbook,
      `CRM_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const targetLead = 200;
  const statsCards = [
    {
      name: "Total Leads",
      icon: User,
      value: dashboardData.totalLeads,
      color: "text-blue-600 bg-blue-50",
      progress: Math.min((dashboardData.totalLeads / targetLead) * 100, 100),
      bg: "bg-blue-500",
    },
    {
      name: "Total Customer",
      icon: ChartNoAxesColumn,
      value: dashboardData.totalCustomer,
      color: "text-purple-600 bg-purple-50",
      progress: Math.min((dashboardData.totalCustomer / targetLead) * 100, 100),
      bg: "bg-purple-500",
    },
    {
      name: "Interested",
      icon: UserCheck,
      value: dashboardData.intrestedCustomer,
      color: "text-emerald-600 bg-emerald-50",
      progress: Math.min(
        (dashboardData.intrestedCustomer / targetLead) * 100,
        100,
      ),
      bg: "bg-emerald-500",
    },
  ];

  const [updateData, setUpdateData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    company: "",
    location: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomerDetails(selectedId, updateData);
      alert("customer was updated");
      setIsOpen(false);
      fetchData();
    } catch (error) {
      console.log("system error :", error);
      alert("can't update customer details");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="bg-slate-100/40 min-h-screen pb-10 font-inter">
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pt-10">
        {statsCards.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                  {item.name}
                </p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">
                  {item.value || 0}
                </h3>
              </div>
              <div className={`${item.color} p-3 rounded-2xl`}>
                <item.icon size={22} />
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`${item.bg} h-full transition-all duration-1000 ease-out`}
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 px-8 mt-10">
        {/* 2. RECENT ACTIVITY */}
        <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex-[1.4] overflow-y-scroll h-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-8 uppercase tracking-tight">
            <Activity className="text-blue-500" size={22} /> Recent Activity
          </h2>
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-3 before:h-full before:w-0.5 before:bg-slate-100">
            {dashboardData.recentActivities?.length > 0 ? (
              dashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="relative pl-10 group">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-blue-500 z-10 transition-transform group-hover:scale-125 shadow-sm"></div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group-hover:border-blue-100 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                        Update
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                        {new Date(activity.timeStamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 italic leading-relaxed">
                      "{activity.notes}"
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 italic">
                No recent updates found.
              </div>
            )}
          </div>
        </div>

        {/* 3. SOURCE ANALYTICS (Donut Chart) */}
        <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex-1 overflow-y-scroll h-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight font-inter">
              Source Analytics
            </h2>
            <PieIcon size={20} className="text-slate-300" />
          </div>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSource}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="count"
                  nameKey="source"
                  stroke="none"
                >
                  {leadSource.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="block text-3xl font-black text-slate-800 leading-none">
                {dashboardData.totalLeads}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Leads
              </span>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {leadSource.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-[11px] font-bold uppercase mb-1.5">
                  <span className="text-slate-500">{item.source}</span>
                  <span className="text-slate-800">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. CUSTOMER TABLE */}
      <div className="mx-8 mt-10 bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
              Customer Directory
            </h2>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Manage and track your customer base
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search name, email, location..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={exportToExcel}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-2xl transition-all shadow-md flex items-center gap-2 text-xs font-black cursor-pointer uppercase tracking-widest"
            >
              <Download size={16} /> Export
            </button>
          </div>
          <div>
            <span className="text-gray-600 font-inter bg-gray-200 px-4 py-2 rounded-xl uppercase font-semibold text-sm">
              total : {filteredCustomers.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                {[
                  "Name",
                  "Contact",
                  "Email",
                  "Company",
                  "Location",
                  "Action",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((data) => (
                  <tr
                    key={data.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    <td className="px-8 py-5 font-bold text-slate-700 capitalize">
                      {data.name}
                    </td>
                    <td className="px-8 py-5 text-slate-600 font-medium">
                      {data.phoneNumber}
                    </td>
                    <td className="px-8 py-5 text-slate-500 lowercase">
                      {data.email}
                    </td>
                    <td className="px-8 py-5 text-slate-500">
                      {data.company || "—"}
                    </td>
                    <td className="px-8 py-5 text-slate-500">
                      {data.location || "—"}
                    </td>
                    <td className="px-8 py-5 text-center pr-12 flex gap-4">
                      <button
                        onClick={() => {
                          setSelectedID(data.id);
                          setUpdateData(data);
                          setIsOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <PenLine size={20} className="text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteSingleCustomerByid(data.id)}
                        className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-28">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="text-slate-100" size={60} />
                      <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">
                        No results found for "{searchTerm}"
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. UPDATE CUSTOMER DETAILS */}
      <div>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ">
            <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl">
              <h2 className="text-2xl font-inter font-bold capitalize text-slate-500 mb-5">
                <label htmlFor="name" className="text-lg">
                  Customer name :
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={updateData.name}
                  onChange={handleChange}
                  className="w-full mb-5 p-2 border border-gray-400 rounded-xl  outline-primary/50 text-lg font-medium text-inter text-black"
                />
              </h2>

              <h2 className="text-2xl font-inter font-bold text-slate-500 mb-6 capitalize">
                <label htmlFor="email" className="text-lg">
                  customer email :
                </label>
                <input
                  type="text"
                  id="email"
                  value={updateData.email}
                  onChange={handleChange}
                  className="border border-gray-400 w-full rounded-xl p-2 outline-primary/50 text-lg font-medium text-inter text-black"
                />
              </h2>

              <h2 className="text-2xl font-inter font-bold text-slate-500 mb-6 capitalize">
                <label htmlFor="number" className="text-lg">
                  customer contact :
                </label>
                <input
                  type="text"
                  id="number"
                  value={updateData.phoneNumber}
                  onChange={handleChange}
                  className="border border-gray-400 w-full rounded-xl p-2 outline-primary/50 text-lg font-medium text-inter text-black"
                />
              </h2>

              <h2 className="text-2xl font-inter font-bold text-slate-500 mb-6 capitalize">
                <label htmlFor="company" className="text-lg">
                  customer company :
                </label>
                <input
                  type="text"
                  value={updateData.company}
                  id="company"
                  onChange={handleChange}
                  className="border border-gray-400 w-full rounded-xl p-2 outline-primary/50 text-lg font-medium text-inter text-black"
                />
              </h2>

              <h2 className="text-2xl font-inter font-bold text-slate-500 mb-6 capitalize">
                <label htmlFor="location" className="text-lg">
                  customer location :
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  id="location"
                  value={updateData.location}
                  className="border border-gray-400 w-full rounded-xl p-2 outline-primary/50 text-lg font-medium text-inter text-black"
                />
              </h2>
              <div className="flex items-center gap-5 ">
                <button
                  onClick={() => !setIsOpen()}
                  className="font-inter text-lg capitalize px-4 py-1 bg-red-400 font-bold text-white hover:bg-red-600 rounded-xl cursor-pointer"
                >
                  clear
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-lg font-inter text-white font-bold bg-green-600 rounded-xl capitalize px-4 py-1 hover:bg-green-400 cursor-pointer"
                >
                  update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoardHomePage;
