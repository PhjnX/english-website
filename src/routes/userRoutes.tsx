// src/routes/userRoutes.tsx
import { lazy } from "react";

import ReadingScore from "../pages/client-users/ReadingTestPage/ReadingScore";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../pages/client-users/Login";
import ReviewPage from "../pages/client-users/ReadingTestPage/ReviewPage";
import LevelPage from "../pages/client-users/Lessons/LevelPage";
import ExercisePage from "../pages/client-users/Exercise";

const ClientUserLayout = lazy(() => import("../pages/client-users"));
const HomePage = lazy(() => import("../pages/client-users/HomePage"));
const AboutPage = lazy(() => import("../pages/client-users/AboutPage"));
const PracticePage = lazy(() => import("../pages/client-users/Lessons"));

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
      {
        path: "lessons",
        element: PracticePage,
      },
      {
        path: "lessons/:level",
        element: LevelPage,
      },
      {
        path: "lessons/:level/exercise/:exercise",
        element: ExercisePage,
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
