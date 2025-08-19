import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Generator from "./pages/Generator";
import History from "./pages/History";
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element={<Generator />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
