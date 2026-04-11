import { Route, Routes } from "react-router-dom";
import LeadPage from "./Dashboard/LeadPage";
import DashBoardHomePage from "./Dashboard/DashBoardHomePage";
import ActivitiesPage from "./Dashboard/ActivitiesPage";
import { Toaster } from "react-hot-toast";
import Homepage from "./pages/Homepage";
import MainLayout from "./MainLayout";
import Navigation from "./Components/workspace/Navigation";
import LeadActivity from "./pages/LeadActivity";
import LoginPage from "./pages/LoginPage";
import SignInPage from "./pages/SignInPage";
import ProductedRoute from "./Components/Dashboard/ProductedRoute";
import EmployeeProfile from "./pages/EmployeeProfile";
import EmployeePage from "./Dashboard/EmployeePage";

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* employee navigation  */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signUp" element={<SignInPage />} />
        <Route
          path="/homepage"
          element={
            <>
              <Navigation />
              <Homepage />
            </>
          }
        />
        <Route
          path="/activity/:id"
          element={
            <>
              <Navigation />
              <LeadActivity />
            </>
          }
        />
        <Route path="/employee-profile" element={<EmployeeProfile />} />

        {/* manager dashboard with navigation */}
        <Route element={<ProductedRoute allowRole="ADMIN" />}>
          <Route path="/admin" element={<MainLayout />}>
            <Route index element={<DashBoardHomePage />} />
            <Route path="leadPage" element={<LeadPage />} />
            <Route
              path="customer-activities/:id"
              element={<ActivitiesPage />}
            />
            <Route 
            path="Employees" 
            element ={<EmployeePage/>}
               />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
export default App;
