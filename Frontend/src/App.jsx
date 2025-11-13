import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './Pages/WelcomePage/WelcomePage';
import LoginPage from './Pages/Auth/LoginIntern';
import RegisterPage from './Pages/Auth/RegisterIntern';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage/>} />
         <Route path="/intern-login" element={<LoginPage/>} />
         <Route path="/register-intern" element={<RegisterPage/>} />
    
      </Routes>
    </Router>
  );
}

export default App;