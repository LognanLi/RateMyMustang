import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TeacherList from './pages/TeacherList';
import Contact from './pages/Contact';

function App() {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true');

  const loginAdmin  = () => { sessionStorage.setItem('isAdmin', 'true');  setIsAdmin(true);  };
  const logoutAdmin = () => { sessionStorage.removeItem('isAdmin'); sessionStorage.removeItem('adminPassword'); setIsAdmin(false); };

  return (
    <BrowserRouter>
      <Header isAdmin={isAdmin} onLogout={logoutAdmin} />
      <Routes>
        <Route path="/"         element={<Home        isAdmin={isAdmin} onAdminLogin={loginAdmin} />} />
        <Route path="/teachers" element={<TeacherList isAdmin={isAdmin} />} />
        <Route path="/contact"  element={<Contact />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

