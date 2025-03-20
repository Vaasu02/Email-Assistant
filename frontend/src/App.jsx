import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Emails from './pages/Emails';
import AIGeneration from './pages/AIGeneration';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <nav className="app-nav">
        <div className="app-nav-brand">
          <Link to="/">Email Assistant</Link>
        </div>
        <div className="app-nav-links">
          <Link to="/" className="app-nav-link">
            Emails
          </Link>
          <Link to="/ai-generation" className="app-nav-link">
            AI Generation
          </Link>
        </div>
      </nav>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Emails />} />
          <Route path="/ai-generation" element={<AIGeneration />} />
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
