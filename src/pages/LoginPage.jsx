import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { loginApi } from "../Api/api";

function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const location = useNavigate();
  const handleLoginChanges = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginApi(loginData);
      toast.success("login was successfull");
      location("/homepage");
    } catch (error) {
      toast.error("failed to login");
      console.log("system error :", error);
    }
  };
  return (
    <>
      <div className=" flex flex-col items-center justify-center bg-background h-screen">
        <div className=" mx-auto p-8 my-auto bg-white shadow-lg rounded-lg ">
          <div className="mb-2 ">
            <h1 className="text-center font-inter font-semibold text-2xl tracking-wide leading-relaxed">
              Log in with your work email
            </h1>
          </div>
          <div>
            <p className="text-center font-inter text-sm text-gray-600/70 w-md leading-relaxed">
              Welcome back! Enter your credentials to access your personalized
              pipelineCRM dashboard, manage your leads, and track your daily
              sales targets.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            {/* --- email ---- */}
            <div className="flex flex-col gap-2 leading-relaxed ">
              <label htmlFor="email" className="capitalize font-inter text-lg">
                email
              </label>
              <input
                type="email"
                className="outline-primary border border-gray-600  w-md px-2 py-1"
                id="email"
                name="email"
                value={loginData.value}
                onChange={handleLoginChanges}
              />
            </div>

            {/* --- password --- */}

            <div className="flex flex-col gap-2 leading-relaxed mt-5">
              <label
                htmlFor="password"
                className="capitalize font-inter text-lg"
              >
                password
              </label>
              <input
                type="password"
                className="outline-primary border border-gray-600 w-md px-2 py-1"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChanges}
              />
            </div>
            {/* --- button --- */}
            <div className="mt-5 leading-relaxed duration-200">
              <button
                type="submit"
                className="bg-secondary text-white capitalize font-semibold px-5 w-full py-2 hover:bg-secondary/90 text-lg"
              >
                Login to Account
              </button>
            </div>
          </form>
          <div className="text-center mt-3 leading-relaxed">
            <p className="text-gray-400 font-inter capitalize tracking-wider">
              Don't have an account? yet
            </p>
            <NavLink
              to="/signUp"
              className="text-gray-400 font-inter tracking-wider"
            >
              create new account
            </NavLink>
          </div>

          {/* <div className="mt-5">
            <h5 className="text-gray-600/80 text-center">
              ------------------ or ----------------
            </h5>
          </div> */}
        </div>
      </div>
    </>
  );
}
export default LoginPage;
