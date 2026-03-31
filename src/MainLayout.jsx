import { Outlet } from "react-router-dom";
import Navigation from "./Components/Dashboard/Navigation";

const MainLayout = () => {
  return (
    <>
      <Navigation /> {/* Manager Nav inga mattum dhaan irukkum */}
      <main>
        <Outlet /> {/* Indha Outlet-la dhaan LeadPage, ActivitiesPage ellam render aagum */}
      </main>
    </>
  );
};

export default MainLayout;