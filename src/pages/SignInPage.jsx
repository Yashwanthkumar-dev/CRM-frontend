import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { registrationApi } from "../Api/api";

function SignInPage() {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const location = useNavigate();
  const handleChanges = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrationApi(registerData);
      toast.success("registered successfully");
      location("/");
    } catch (error) {
      toast.error("failed to register data");
      console.log("system error :", error);
    }
  };
  return (
    <>
      <div className=" flex flex-col items-center justify-center bg-background h-screen">
        <div className=" mx-auto p-8 my-auto bg-white shadow-lg rounded-lg ">
          <div className="mb-2 ">
            <h1 className="text-center font-inter font-semibold text-2xl tracking-wide leading-relaxed">
              Sign up
            </h1>
          </div>
          <div>
            <p className="text-center font-inter text-sm text-gray-600/70 w-md leading-relaxed mx-auto">
              Join the pipelineCRM community. Create your account today to start
              organizing your sales pipeline, automating lead follow-ups, and
              growing your business.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center gap-2  mt-6">
              {/* --- email ---- */}
              <div className="flex flex-col gap-2 leading-relaxed ">
                <label
                  htmlFor="email"
                  className="capitalize font-inter text-lg"
                >
                  email
                </label>
                <input
                  type="email"
                  className="outline-primary border border-gray-600  w-72 px-2 py-2 rounded-lg"
                  id="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleChanges}
                />
              </div>

              {/* --- password --- */}

              <div className="flex flex-col gap-2 leading-relaxed ">
                <label
                  htmlFor="password"
                  className="capitalize font-inter text-lg"
                >
                  password
                </label>
                <input
                  type="password"
                  className="outline-primary border border-gray-600 w-72 px-2 py-2 rounded-lg"
                  id="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleChanges}
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-5  mt-6">
              {/* --- name --- */}
              <div className="flex flex-col gap-2 leading-relaxed ">
                <label htmlFor="name" className="capitalize font-inter text-lg">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="outline-primary border border-gray-600 w-72 px-2 py-2 rounded-lg"
                  value={registerData.name}
                  onChange={handleChanges}
                />
              </div>

              {/* --- phone number --- */}
              <div className="flex flex-col gap-2 leading-relaxed ">
                <label
                  htmlFor="phone"
                  className="capitalize font-inter text-lg"
                >
                  phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="outline-primary border border-gray-600 w-72 px-2 py-2 rounded-lg"
                  value={registerData.phone}
                  onChange={handleChanges}
                />
              </div>
            </div>
            {/*--- button ---  */}
            <div className="mt-6 leading-relaxed duration-200 ">
              <button
                type="submit"
                className="bg-secondary text-white capitalize font-semibold px-5 w-full py-2 hover:bg-secondary/90 text-lg"
              >
                Create Account
              </button>
            </div>
          </form>
          <div className="text-center mt-7 leading-relaxed ">
            <p className="text-gray-400 font-inter capitalize tracking-wider">
              Already have an account? <NavLink to="/">Login here</NavLink>
            </p>
          </div>

          {/* <div>
            <p className="text-center text-gray-600/80 font-inter my-5">
              -------- or --------
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
}
export default SignInPage;
