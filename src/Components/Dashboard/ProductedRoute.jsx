import { Navigate, Outlet } from "react-router-dom";

function ProductedRoute({ allowRole}) {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    if(!token){
        return <Navigate to="/"/>
    }
    if(allowRole && role !==allowRole){
        return <Navigate to="/homepage"/>
    }
  return <Outlet/>;
}
export default ProductedRoute;
