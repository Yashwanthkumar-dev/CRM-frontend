import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteEmployeeDetailsApi,
  fetchAllEmployeeDetailsApi,
  updateRoleApi,
} from "../Api/api";
import { Loader2, PenIcon, Trash2 } from "lucide-react";

function EmployeePage() {
  const [employeeList, setEmployeeList] = useState([]);
  const [role, setRole] = useState("EMPLOYEE");
  const [openBox, setOpenBox] = useState(false);
  const [selectId, setSelectId] = useState();
  // All handler

  //  --- fetch all employee ----
  const fetchAllEmployee = async () => {
    try {
      const response = await fetchAllEmployeeDetailsApi();
      console.log(response);

      setEmployeeList(response);
    } catch (error) {
      toast.error("failed to fetch employees");
      console.log("System error :", error);
    }
  };


  // --- handle submit event ---
  const handleSubmitRole = async (e) => {
    e.preventDefault();
    try {
      await updateRoleApi(selectId , role);
      toast.success("updated role successfully")
      setOpenBox(false);
      fetchAllEmployee()
    } catch (error) {
      toast.error("failed to submit");
    }
  };
  //  --- handle delete employee ---

  const handleEmployeDelete = async (id) => {
    try {
      await deleteEmployeeDetailsApi(id);
      setEmployeeList((prev) => prev.filter((empl) => empl.id !== id));
      toast.success("employee was deleted successfully");

      // fetchAllEmployee();
    } catch (error) {
      toast.error("failed to delete employee details");
      console.log("system: error :", error);
    }
  };

  useEffect(() => {
    fetchAllEmployee();
  }, []);

  return (
    <>
      {/* main container */}
      <div className=" mx-20 mt-10 p-6 rounded-xl">
        {/* employe container */}
        <div className=" overflow-x-scroll">
          <div>
            <h1 className="text-2xl font-inter  capitalize font-semibold tracking-wide">
              Employees management
            </h1>
          </div>

          {/* table  */}
          <table className="mt-6 w-full table-fixed  border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 capitalize text-slate-400  font-black trcking-widest">
                <th className="px-5 py-4 capitalize font-inter text-gray-700/70">
                  id
                </th>
                <th className="px-5 py-4 capitalize font-inter text-gray-700/70">
                  name
                </th>
                <th className="px-5 py-4 capitalize font-inter text-gray-700/70">
                  location
                </th>
                <th className="px-5 py-4 capitalize font-inter text-gray-700/70">
                  number
                </th>
                <th className="px-5 py-4 capitalize font-inter text-gray-700/70">
                  email
                </th>

                <th className="px-5 py-4 capitalize font-inter text-gray-700/70">
                  role
                </th>

                <th className="px-5 py-4 capitalize font-inter text-gray-700/70">
                  action
                </th>

                <th className="px-5 py-4 capitalize font-inter text-gray-700/70">
                  role
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {employeeList && employeeList.length > 0 ? (
                employeeList.map((data) => (
                  <tr
                    key={data.id}
                    className="hover:bg-slate-50/80 transition-all group text-center"
                  >
                    <td className="px-10 py-5 font-inter capitalize text-md text-slate-600/80  ">
                      {data.id}
                    </td>
                    <td className="px-10 py-5 font-inter capitalize text-md text-slate-600/80 ">
                      {data.name || "null"}
                    </td>
                    <td className="px-10 py-5 font-inter capitalize text-md text-slate-600/80 ">
                      {data.location || "null"}
                    </td>
                    <td className="px-10 py-5 font-inter capitalize text-md text-slate-600/80 ">
                      {data.number || "null"}
                    </td>
                    <td className="px-10 py-5 font-inter capitalize text-md text-slate-600/80 ">
                      {data.email || "null"}
                    </td>

                    <td className="px-10 py-5 font-inter capitalize  text-md text-slate-600/80 ">
                      {data.role}
                    </td>

                    <td className=" px-10 py-5 font-inter capitalize  text-md text-slate-600/80 flex items-center justify-center gap-8 ">
                      <button onClick={() => handleEmployeDelete(data.id)}>
                        <Trash2 size={18} className="text-red-700/50" />
                      </button>
                      <button>
                        <PenIcon size={18} className="text-blue-700/50" />
                      </button>
                    </td>

                    <td>
                      <button
                        className="border border-primary text-primary px-3 py-1 font-inter rounded-xl"
                        onClick={() => {
                          setSelectId(data.id);
                          setOpenBox(true);
                        }}
                      >
                        change
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td
                      className="px-10 py-20 font-inter capitalize "
                      colSpan="7"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2
                          size={40}
                          className="text-blue-500 animate-spin"
                        />
                        <p className="text-slate-400 text-sm font-medium animate-pulse">
                          Fetching Employee Records...
                        </p>
                      </div>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          {/* -- update employee to admin */}

          <div>
            {openBox && (
              <div className=" fixed w-full h-screen backdrop-blur-sm bg-black/50 inset-0 z-50 flex flex-col items-center justify-center ">
                <div className=" rounded-lg bg-white p-7 w-1/4 leading-relaxed">
                  <div>
                    <h1 className="text-lg font-inter capitalize text-gray-600">
                      update Role
                    </h1>
                  </div>

                  <form className="flex flex-col mt-5 " onSubmit={handleSubmitRole}>
                    <label
                      htmlFor="role"
                      className="font-inter text-lg capitalize "
                    >
                      role
                    </label>
                    <select
                      name="role"
                      id="role"
                      className="border mt-2 p-2.5 overflow-hidden rounded-lg outline-primary"
                      onChange={(e)=>setRole(e.target.value)}
                    >
                      <option value="EMPLOYEE" className="capitalize">
                        EMPLOYEE
                      </option>
                      <option value="ADMIN">ADMIN</option>
                    </select>

                    <div className="flex gap-3 items-center mt-5 ml-1 ">
                      <button
                        className="border-red-400 border text-red-500 rounded-xl px-5 py-1 font-inter"
                        onClick={() => setOpenBox(false)}
                      >
                        cancel
                      </button>
                      <button
                        type="submit"
                        className="border-green-600 border text-green-500 rounded-xl px-5 font-inter py-1"
                      >
                        submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default EmployeePage;
