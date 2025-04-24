// App.tsx
import React, { Suspense } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { renderRoutes } from "./routes/index";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>{renderRoutes()}</Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
