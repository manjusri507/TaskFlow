import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard';
import ProjectDetails from './pages/ProjectDetails';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/projectboard/:id' element={<ProjectBoard />} />
        {/* <Route path='/projectboard' element={<ProjectBoard />} /> */}
        {/* <Route path="/projects/:projectId" element={<ProjectBoard />} /> */}

        {/* Correct route: include both projectId and taskId */}
        {/* <Route path='/projectdetails/:taskId' element={<ProjectDetails />} /> */}
        <Route path="/projectdetails/:projectId/:taskId" element={<ProjectDetails />} />

      </Routes>
    </BrowserRouter>
  );
}
