import { Link, NavLink } from "react-router-dom";
import logo from "../assets/crm-logo.png"
function Navigation() {
  const navLinkClass = ({isActive}) => {
    return `font-inter px-5 py-2 rounded-2xl cursor-pointer duration-200 transition 
    ${
      isActive
        ? "bg-primary/20 text-primary font-medium"
        : "text-gray-600 hover:bg-primary/10 hover:text-black"
    }`;
  };

  return (
    <>
      <div className="bg-card py-3 outline-0">
        <div className="mx-8 flex items-center justify-between">
          <div className="flex items-center ">
            <img src={logo} alt="pipeline-logo" className="
            w-25 -mb-3"/>
            <h1 className="font-inter text-2xl font-semibold -ml-6">
              pipeline<span className="text-primary font-inter">CRM</span>
            </h1>
          </div>

          <ul className="flex items-center gap-2 outline-0">
            <NavLink to="/" className={navLinkClass}>
              dashboard
            </NavLink>

            <NavLink to="/leadPage" className={navLinkClass}>
              lead
            </NavLink>

            <NavLink to="/customerPage" className={navLinkClass}>
              customer
            </NavLink>
          </ul>

          <div>
            <button className="px-3 py-1 rounded-lg bg-primary text-card font-inter capitalize cursor-pointer hover:bg-primary/10 hover:text-primary duration-300 transition-color">
              +add lead
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Navigation;
