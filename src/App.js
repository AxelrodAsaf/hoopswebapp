import './App.css';
import { Routes, Route } from "react-router-dom";
import React from 'react';

import Login from './pages/Login.js';
import Default from './pages/Default.js';
import Dashboard from './pages/Dashboard';
import TableData from './pages/TableData';
import AddData from './pages/AddData';

function App() {
  return (
    <div className="all">
      <div>
      <Routes>
        <Route path={"/"} element={<Login />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/dashboard"} element={<Dashboard />} />
        <Route path={"/tabledata"} element={<TableData />} />
        <Route path={"/addData"} element={<AddData />} />
        <Route path="*" element={<Default />} />
      </Routes>
      </div>
    </div>
  );
}

export default App;
