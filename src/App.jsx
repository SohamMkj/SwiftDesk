import AddTicket from "./components/AddTicket";
import "./global.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TicketDetails from "./components/TicketDetails";
import TicketBoard from "./components/TicketBoard";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-[100px] md:ml-[80px] overflow-y-auto overflow-x-hidden px-8 h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ticket" element={<AddTicket />} />
            <Route path="/ticketboard" element={<TicketBoard />} />
            <Route path="/ticket/:id" element={<TicketDetails />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  );
}
