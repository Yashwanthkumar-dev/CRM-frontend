import React, { useEffect, useState } from "react";
import { dashboardAnalytics } from "../Api/api";
import { ChartNoAxesColumn, icons, User, UserCheck } from "lucide-react";
import { data } from "react-router-dom";

const DashBoardHomePage = () => {
  const [dashboardData, setDashboardData] = useState({
    totalLeads: 0,
    totalCustomer: 0,
    intrestedCustomer: 0,
  });
  const [loading, setLoading] = useState(true);

  async function viewDashboardAnalytics() {
    try {
      const response = await dashboardAnalytics();
      setDashboardData(response);
    } catch (error) {
      console.log("system error :", error);
    }
  }

  useEffect(() => {
    viewDashboardAnalytics();
  }, []);

  const targetLead = 200;
  const data = [
    {
      name: "Total Leads",
      icons: User,
      value: dashboardData.totalLeads,
      color: "text-blue-800 bg-blue-100 rounded-xl p-1",
      progess: Math.min((dashboardData.totalLeads / targetLead) * 100, 100),
      bg: "bg-blue-500",
      batch: "this week +",
    },
    {
      name: "Total Customer",
      icons: ChartNoAxesColumn,
      value: dashboardData.totalCustomer,
      color: "text-yellow-800 bg-yellow-100 rounded-xl p-1",
      progess: Math.min((dashboardData.totalCustomer / targetLead) * 100, 100),
      bg: "bg-yellow-500",
      batch: "this week +",
    },
    {
      name: "Interested Customer",
      icons: UserCheck,
      value: dashboardData.intrestedCustomer,
      color: "text-green-800 bg-green-100 rounded-xl p-1",
      progess: Math.min(
        (dashboardData.intrestedCustomer / targetLead) * 100,
        100,
      ),
      bg: "bg-green-500",
      batch: "this week +",
    },
  ];
  return (
    <>
      <div className="bg-background/60 py-10">
        <div className="flex items-center mx-8 justify-between">
          {data &&
            data.map((item, index) => {
              return (
                <div
                  key={index}
                  className=" mx-3 p-4 rounded-lg bg-white shadow-md leading-relaxed space-y-2 w-120 xl:space-y-6"
                >
                  {/* name and icon */}
                  <div className="flex items-center justify-between gap-x-8">
                    <h1 className="font-inter text-lg text-gray-500 xl:text-xl">
                      {item.name}
                    </h1>
                    <item.icons className={`${item.color}`} />
                  </div>

                  {/* value  */}
                  <div>
                    <p className="text-xl font-inter xl:text-3xl">
                      {item.value || 0}
                    </p>
                  </div>
                  {/* progress bar */}
                  <div className="w-full bg-gray-500/5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`${item.bg} h-full transition-all duration-800 ease-in-out`}
                      style={{ width: `${item.progess}%` }}
                    ></div>
                  </div>

                  {/* label */}
                  <div className="mt-2 w-fit">
                    <h5 className=" text-[10px] text-gray-400">{item.batch}</h5>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Dashboard Cards-ku keela indha section-ah podunga */}
        <div className="mt-8 mx-8 bg-white p-8 rounded-4xl border border-gray-100 shadow-sm  w-82 ">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-md xl:text-xl font-bold font-inter text-slate-800 tracking-tight">
              Recent Activity
            </h2>
            <span className="text-[10px] xl:text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              LATEST
            </span>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-2.75 top-2 bottom-2 w-[0.5px] bg-gray-200"></div>

            <div className="space-y-10">
              {dashboardData.recentActivities &&
              dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="relative flex items-start gap-6 pl-10"
                  >
                    <div className="absolute left-0 top-1 w-[24px] h-[24px] flex items-center justify-center">
                      <div className="absolute w-full h-full rounded-full bg-blue-400 opacity-20 animate-ping"></div>
                      <div className="relative w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                    </div>

                    <div className="flex flex-col gap-2 w-full lg:gap-2 ">
                      <div className="flex items-center justify-between">
                        {/* JSON-la activityType illadha nala generic name */}
                        <h4 className="font-bold lg:text-[12px] lg:mt-2 xl:text-[13px] text-slate-700 uppercase tracking-widest">
                          Lead Update
                        </h4>
                        <span className="lg:text-[9px] text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                          {new Date(activity.timeStamp).toLocaleDateString(
                            
                            { day: "2-digit", month: "short" },
                          )}{" "}
                          |
                          {new Date(activity.timeStamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Using 'notes' from your JSON */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-sm text-slate-600 leading-relaxed italic lg:text-[13px]">
                          "{activity.notes}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400 text-sm italic">
                    No recent activities found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardHomePage;
