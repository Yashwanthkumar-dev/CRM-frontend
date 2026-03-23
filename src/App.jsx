import { Route, Routes } from "react-router-dom";
import Navigation from "./Components/Navigation";
import LeadPage from "./Dashboard/LeadPage";
import DashBoardHomePage from "./Dashboard/DashBoardHomePage";
import ActivitiesPage from "./Dashboard/ActivitiesPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Navigation />
      <Routes>
        <Route path="/" element={<DashBoardHomePage />} />
        <Route path="/leadPage" element={<LeadPage />} />
        <Route path="/customer-activities/:id" element={<ActivitiesPage />} />
      </Routes>
    </>
  );
}
export default App;