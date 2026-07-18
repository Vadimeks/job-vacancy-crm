import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Vacancies from "./pages/Vacancies";
import Candidates from "./pages/Candidates";
import Templates from "./pages/Templates";
import Inbox from "./pages/Inbox"; 
import Survey from "./pages/Survey";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 👈 Анкета БЕЗ лэйаўта (чысты экран для Тэлеграма) */}
        <Route path="/survey" element={<Survey />} />

        {/* Усе астатнія старонкі ЎНУТРЫ лэйаўта */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vacancies" element={<Vacancies />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/candidates/:id" element={<Candidates />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/inbox" element={<Inbox />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}