import { User, UserCog } from "lucide-react";
import icon from "../../assets/crm-logo.png";
import { useState } from "react";
import toast from "react-hot-toast";
import { createLead } from "../../Api/api";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function Navigation() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    followUps: "",
    phone: "",
    location: "",
    company: "",
    source: "Direct",
  });

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending Data:", data);
      await createLead(data);
      toast.success("Lead added successfully");

     
      setData({
        name: "",
        email: "",
        followUps: "",
        phone: "",
        location: "",
        company: "",
        source: "Direct",
      });
      setOpen(false);

    
      window.dispatchEvent(new Event("leadAdded"));
    } catch (error) {
      toast.error("Process Failed! please try again");
      console.log("system error : ", error);
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="bg-white py-2 shadow-md">
        <div className="mx-9 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img src={icon} alt="company-logo" className="w-32" />
            <h1 className="text-2xl font-inter font-semibold -ml-10 -mt-4">
              pipeline<span className="text-primary">CRM</span>
            </h1>
          </div>
          <div className="flex items-center gap-7">
            <div onClick={() => setOpen(true)}>
              <button className="text-primary font-inter border border-primary capitalize hover:bg-primary hover:text-white hover:border-transparent cursor-pointer px-4 py-1 duration-300 transition-colors rounded-lg font-semibold">
                add lead
              </button>
            </div>

            <div>
              <h1 onClick={()=> navigate("/employee-activities")} className="text-primary font-inter border border-primary capitalize hover:bg-primary hover:text-white hover:border-transparent cursor-pointer px-4 py-1 duration-300 transition-colors rounded-lg font-semibold">Activities</h1>
            </div>
          </div>

          <NavLink to="/employee-profile">
            <div className="mr-10 p-4 bg-gray-900/10 rounded-md cursor-pointer">
              <UserCog size={23} className="text-primary" />
            </div>
          </NavLink>
        </div>

        {/* --- Add Lead Modal --- */}
        {open && (
          <div className="inset-0 fixed flex items-center justify-center bg-black/50 z-[100]">
            <div className="bg-white p-8 w-full max-w-2xl rounded-xl max-h-[90vh] overflow-y-auto">
              <h1 className="text-primary text-xl font-inter font-medium tracking-wider capitalize mb-4">
                create lead
              </h1>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 font-inter text-sm font-semibold capitalize">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={handleChanges}
                    className="border px-3 py-2 rounded-lg border-gray-300 outline-primary"
                    placeholder="example: ramanaa"
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 font-inter text-sm font-semibold capitalize">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChanges}
                    className="border px-3 py-2 rounded-lg border-gray-300 outline-primary"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 font-inter text-sm font-semibold capitalize">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={data.phone}
                    onChange={handleChanges}
                    className="border px-3 py-2 rounded-lg border-gray-300 outline-primary"
                    placeholder="+91 8148035717"
                  />
                </div>

                {/* Company */}
                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 font-inter text-sm font-semibold capitalize">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={data.company}
                    onChange={handleChanges}
                    className="border px-3 py-2 rounded-lg border-gray-300 outline-primary"
                    placeholder="NextGenDev"
                  />
                </div>

                {/* Source - Managed as Select for better UX */}
                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 font-inter text-sm font-semibold capitalize">
                    Source
                  </label>
                  <select
                    name="source"
                    value={data.source}
                    onChange={handleChanges}
                    className="border px-3 py-2 rounded-lg border-gray-300 outline-primary bg-white"
                  >
                    <option value="Direct">Direct</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 font-inter text-sm font-semibold capitalize">
                    Status
                  </label>
                  <input
                    type="text"
                    name="followUps"
                    value={data.followUps}
                    onChange={handleChanges}
                    className="border px-3 py-2 rounded-lg border-gray-300 outline-primary"
                    placeholder="New, Interested"
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-gray-500 font-inter text-sm font-semibold capitalize">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={data.location}
                    onChange={handleChanges}
                    className="border px-3 py-2 rounded-lg border-gray-300 outline-primary"
                    placeholder="Coimbatore, Chennai"
                  />
                </div>

                <div className="mt-7 flex items-center gap-5 justify-end md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-md capitalize text-red-600 border border-red-600 px-6 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-md capitalize text-white bg-green-600 px-6 py-1.5 rounded-lg hover:bg-green-700 transition-all cursor-pointer"
                  >
                    Create Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Navigation;
