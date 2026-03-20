import { Route, Routes } from "react-router-dom"
import Navigation from "./Components/Navigation"
import LeadPage from "./Dashboard/LeadPage"
import CustomerPage from "./Dashboard/CustomerPage"
import DashBoardHomePage from "./Dashboard/DashBoardHomePage"
function App() {

  return (
    <>
        <Navigation/>

  <Routes>
    <Route path="/" element={<DashBoardHomePage/>}/>
    <Route path="/leadPage" element={<LeadPage/>}/>
    <Route path="/customerPage" element={<CustomerPage/>}/>
  </Routes>
    </>
  )
}

export default App
