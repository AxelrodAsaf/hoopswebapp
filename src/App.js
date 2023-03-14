import './App.css';
import { Routes, Route } from "react-router-dom";
import React from 'react';

import Login from './pages/Login.js';
import Default from './pages/Default.js';
import Dashboard from './pages/Dashboard';
import TableData from './pages/TableData';
import EditPlayer from './pages/EditPlayer';
import ApproveGames from './pages/ApproveGames';

function App() {
  return (
    <div className="all">
      <div>
      <Routes>
        <Route path={"/"} element={<Login />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/dashboard"} element={<Dashboard />} />
        <Route path={"/tabledata"} element={<TableData />} />
        <Route path={"/editplayer"} element={<EditPlayer />} />
        <Route path={"/approvegames"} element={<ApproveGames />} />
        <Route path="*" element={<Default />} />
      </Routes>
      </div>
    </div>
  );
}

export default App;
