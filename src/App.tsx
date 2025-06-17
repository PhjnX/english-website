import { Suspense } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { renderRoutes } from "./routes/renderRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLoader from "./components/AppLoader";
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<AppLoader />}>
        <Routes>{renderRoutes()}</Routes>
        <ToastContainer position="top-right" autoClose={1800} />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
