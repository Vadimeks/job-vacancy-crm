import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Vacancies from "./pages/Vacancies";
import Candidates from "./pages/Candidates";
import Templates from "./pages/Templates";
import Inbox from "./pages/Inbox"; // Дадалі імпарт

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/inbox" element={<Inbox />} /> {/* Дадалі маршрут */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
