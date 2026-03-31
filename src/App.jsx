import { Route, Routes } from "react-router-dom";
import LeadPage from "./Dashboard/LeadPage";
import DashBoardHomePage from "./Dashboard/DashBoardHomePage";
import ActivitiesPage from "./Dashboard/ActivitiesPage";
import { Toaster } from "react-hot-toast";
import Homepage from "./pages/Homepage";
import MainLayout from "./MainLayout";
import Navigation from "./Components/workspace/Navigation";
import LeadActivity from "./pages/LeadActivity";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Navigation/>
      <Routes>
        {/* employee navigation  */}
        <Route path="/" element={<Homepage />} />
        <Route path="/activity/:id" element={<LeadActivity/>} />

        {/* manager dashboard with navigation */}
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<DashBoardHomePage />} />
          <Route path="leadPage" element={<LeadPage />} />
          <Route path="customer-activities/:id" element={<ActivitiesPage />} />
        </Route>
      </Routes>
    </>
  );
}
export default App;
