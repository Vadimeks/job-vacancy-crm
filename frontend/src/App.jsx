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
        <Route path="/anketa" element={<Survey />} />
{/* Дадаем рэдырэкт са старога адраса, каб не зламаць бот, пакуль не абнавім яго */}
<Route path="/survey" element={<Survey />} />

       {/* 🔐 Схаваная CRM (Адмін-панэль) */}
<Route path="/nova-management-secure-2024/*" element={
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

{/* 📄 Будучая старонка CV (заглушка) */}
<Route path="/cv" element={<div className="p-10 text-center font-sans">Генератор CV у розробці...</div>} />

{/* 🏠 Галоўная старонка (калі хтосьці зойдзе проста на дамен) */}
<Route path="/" element={<div className="p-10 text-center font-sans">Nova Work Agency - Офіційний сайт</div>} />
      </Routes>
    </BrowserRouter>
  );
}