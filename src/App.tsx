// src/App.tsx
import React, { Suspense } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { renderRoutes } from "./routes/renderRoutes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Đang tải trang...</div>}>
        <Routes>{renderRoutes()}</Routes>
              <ToastContainer position="top-right" autoClose={3000} />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
