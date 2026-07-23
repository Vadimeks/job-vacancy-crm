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
        {/* 🔐 АДМІН-ПАНЭЛЬ (Для рэкрутэраў - СТАРЫЯ ПРОСТЫЯ АДРАСЫ) */}
        <Route path="/vacancies" element={<Layout><Vacancies /></Layout>} />
        <Route path="/candidates" element={<Layout><Candidates /></Layout>} />
        <Route path="/candidates/:id" element={<Layout><Candidates /></Layout>} />
        <Route path="/templates" element={<Layout><Templates /></Layout>} />
        <Route path="/inbox" element={<Layout><Inbox /></Layout>} />

        {/* 🌍 ПУБЛІЧНЫ ПАРТАЛ (Для кандыдатаў - СКЛАДАНЫЯ АДРАСЫ) */}
        <Route path="/nova-work-portal-2024" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/nova-work-portal-2024/anketa" element={<Survey />} />
        <Route path="/nova-work-portal-2024/jobs" element={<PublicLayout><div>Старінка підбору вакансій...</div></PublicLayout>} />
        <Route path="/nova-work-portal-2024/cv" element={<PublicLayout><div>Генератор резюме...</div></PublicLayout>} />
        <Route path="/nova-work-portal-2024/contacts" element={<PublicLayout><div className="p-20 text-center">Наші контакти: +48 780 770 745</div></PublicLayout>} />

        {/* Рэдырэкт з кораня на партал кандыдата, каб не было пустога экрана */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        
        <Route path="*" element={<div className="p-10 text-center font-sans">404 - Сторінку не знайдено</div>} />
      </Routes>
    </BrowserRouter>
  );
}