// src/routes/userRoutes.tsx
import { lazy } from "react";

import ReadingScore from "../pages/client-users/ReadingTestPage/ReadingScore";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../pages/client-users/Login";
import ReviewPage from "../pages/client-users/ReadingTestPage/ReviewPage";

const ClientUserLayout = lazy(() => import("../pages/client-users"));
const HomePage = lazy(() => import("../pages/client-users/HomePage"));
const AboutPage = lazy(() => import("../pages/client-users/AboutPage"));
export const userRoutes = [
  {
    path: "",
    element: ClientUserLayout,
    children: [
      { path: "", element: HomePage },
      { path: "about", element: AboutPage },
      {
        path: "assessment",
        element: ProtectedRoute,
      },
    ],
  },
  {
    path: "login",
    element: LoginPage,
  },
  {
    path: "reading-score",
    element: ReadingScore,
  },
  {
    path: "review",
    element: ReviewPage,
  },
];
