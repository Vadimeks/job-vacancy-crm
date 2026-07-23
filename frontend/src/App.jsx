import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Vacancies from "./pages/Vacancies";
import Candidates from "./pages/Candidates";
import Templates from "./pages/Templates";
import Inbox from "./pages/Inbox"; 
import Survey from "./pages/Survey";
import PublicLayout from "./components/PublicLayout";
export default function App() {
 return (
    <BrowserRouter>
      <Routes>
        {/* 🌍 ПУБЛІЧНЫЯ СТАРОНКІ (Для кандыдатаў) */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/anketa" element={<Survey />} /> {/* Анкета без лэйаўта для ТГ */}
        <Route path="/jobs" element={<PublicLayout><div className="p-20 text-center">Старінка підбору вакансій у розробці...</div></PublicLayout>} />
        <Route path="/cv" element={<PublicLayout><div className="p-20 text-center">Генератор резюме у розробці...</div></PublicLayout>} />
        <Route path="/contacts" element={<PublicLayout><div className="p-20 text-center">Наші контакти: +48 780 770 745</div></PublicLayout>} />

        {/* 🔐 АДМІН-ПАНЭЛЬ (Для рэкрутэраў - ВЯРНУЛІ ЯК БЫЛО) */}
        <Route path="/vacancies" element={<Layout><Vacancies /></Layout>} />
        <Route path="/candidates" element={<Layout><Candidates /></Layout>} />
        <Route path="/candidates/:id" element={<Layout><Candidates /></Layout>} />
        <Route path="/templates" element={<Layout><Templates /></Layout>} />
        <Route path="/inbox" element={<Layout><Inbox /></Layout>} />

        {/* Рэдырэкт для старой анкеты */}
        <Route path="/survey" element={<Survey />} />
        
        <Route path="*" element={<div className="p-10 text-center font-sans">404 - Сторінку не знайдено</div>} />
      </Routes>
    </BrowserRouter>
  );
}