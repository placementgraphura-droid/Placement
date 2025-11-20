import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './Pages/WelcomePage/WelcomePage';
import LoginPage from './Pages/Auth/LoginIntern';
import RegisterPage from './Pages/Auth/RegisterIntern';
import LoginMentor from './Pages/Auth/LoginMentor';
import MentorRegister from './Pages/Auth/RegisterMentor';
import LoginHiringTeam from './Pages/Auth/LoginHiringTeam';
import LoginAdmin from './Pages/Auth/LoginAdminPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage/>} />
         <Route path="/intern-login" element={<LoginPage/>} />
         <Route path="/register-intern" element={<RegisterPage/>} />

         <Route path="/mentor-login" element={<LoginMentor/>} />
         <Route path="/register-mentor" element={<MentorRegister/>} />
         <Route path="/hiring-team-login" element={<LoginHiringTeam/>} />
          <Route path="/admin-login" element={<LoginAdmin/>} />


    
      </Routes>
    </Router>
  );
}

export default App;