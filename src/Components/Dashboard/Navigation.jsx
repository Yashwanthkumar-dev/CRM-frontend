import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/crm-logo.png";
import { useState } from "react";
import { FastForward, X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { createLead } from "../../Api/api";

function Navigation() {
  const [openleadBox, setOpenLeadBox] = useState(false);
  const [addLead, setAddLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    followUps: "",
    location: "",
    source: "Direct",
    activities: [],
  });

  // handlechanges
  const handleChanges = (event) => {
    const { name, value } = event.target;
    setAddLead((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handleSubmit
  const handlesubmit = async (e) => {
    e.preventDefault();
    const { activities, ...dataToSend } = addLead;
    try {
      await createLead(dataToSend);
      setOpenLeadBox(false);
      toast.success("Lead added successfully!");
      
      // Form reset logic
      setAddLead({
        name: "", email: "", phone: "", company: "",
        followUps: "", location: "", source: "Direct", activities: []
      });

      // Page refresh to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Error adding lead");
      console.log("system error :", error.message || error.response?.data);
    }
  };

  const navLinkClass = ({ isActive }) => {
    return `font-inter px-5 py-2 rounded-2xl cursor-pointer duration-200 transition 
    ${
      isActive
        ? "bg-primary/20 text-primary font-medium"
        : "text-gray-600 hover:bg-primary/10 hover:text-black"
    }`;
  };

  return (
    <>
      <div className="bg-card py-3 outline-0 shadow-sm sticky top-0 z-40">
        <div className="mx-8 flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="pipeline-logo" className="w-25 -mb-3" />
            <h1 className="font-inter text-2xl font-semibold -ml-6 text-slate-800">
              pipeline<span className="text-primary font-inter font-bold">CRM</span>
            </h1>
          </div>

          <ul className="flex items-center gap-2 outline-0">
            <NavLink to="/admin" className={navLinkClass}>
              dashboard
            </NavLink>

            <NavLink to="leadPage" className={navLinkClass}>
              lead
            </NavLink>
            
            <NavLink to="Employees" className={navLinkClass}>employee</NavLink>
            
          </ul>

          <div>
            <button 
              onClick={() => setOpenLeadBox(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white font-inter font-semibold capitalize cursor-pointer hover:bg-primary/90 duration-300 transition-all active:scale-95"
            >
              <Plus size={18} />
              <span>add lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- ADD LEAD MODAL --- */}
      {openleadBox && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 my-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-slate-800 font-inter font-bold capitalize text-2xl">
                Create New Lead
              </h1>
              <button onClick={() => setOpenLeadBox(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handlesubmit}>
              <div className="grid grid-cols-1 gap-4">
                {/* Field Generator Helper */}
                {[
                  { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
                  { label: "Email Address", name: "email", type: "email", placeholder: "john@example.com" },
                  { label: "Phone Number", name: "phone", type: "text", placeholder: "+91 98XXX XXXX" },
                  { label: "Company", name: "company", type: "text", placeholder: "Company Name" },
                  { label: "Location", name: "location", type: "text", placeholder: "Chennai, India" },
                  { label: "Follow Ups", name: "followUps", type: "text", placeholder: "Ex: Next Week" },
                  { label: "Source", name: "source", type: "text", placeholder: "Direct, LinkedIn, etc." }
                ].map((field) => (
                  <div key={field.name} className="flex flex-col gap-1.5">
                    <label htmlFor={field.name} className="text-sm font-bold text-slate-600 ml-1">
                      {field.label}
                    </label>
                    <input
                      required
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={addLead[field.name]}
                      onChange={handleChanges}
                      placeholder={field.placeholder}
                      className="border border-slate-200 rounded-xl outline-primary/50 w-full py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-4">
                <button
                  type="button"
                  className="flex-1 text-sm capitalize bg-slate-100 hover:bg-slate-200 font-inter text-slate-600 py-3 rounded-xl font-bold duration-200 transition"
                  onClick={() => setOpenLeadBox(false)}
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 text-sm capitalize bg-primary hover:bg-primary/90 font-inter text-white py-3 rounded-xl font-bold duration-200 transition shadow-lg shadow-primary/20"
                >
                  Confirm & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Navigation;