// src/routes/userRoutes.tsx
import { lazy } from "react";

import ReadingScore from "../pages/client-users/ReadingTestPage/ReadingScore";
import ReadingPracticeScore from "../pages/client-users/ReadingPracticePage/ReadingPracticeScore";
import ReadingPracticeReview from "../pages/client-users/ReadingPracticePage/ReadingPracticeReview";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../pages/client-users/Login";
import ReviewPage from "../pages/client-users/ReadingTestPage/ReviewPage";
import LevelPage from "../pages/client-users/Lessons/LevelPage";
import Dashboard from "../pages/client-users/Dashboard/Dashboard";
import ReadingPracticePage from "../pages/client-users/ReadingPracticePage";

const ClientUserLayout = lazy(() => import("../pages/client-users"));
const HomePage = lazy(() => import("../pages/client-users/HomePage"));
const PracticePage = lazy(() => import("../pages/client-users/Lessons"));

export const userRoutes = [
  {
    path: "",
    element: ClientUserLayout,
    children: [
      { path: "", element: HomePage },
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
        path: "lessons/:level/:readingNum",
        element: ReadingPracticePage,
      },
      {
        path: "dashboard",
        element: Dashboard,
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
    path: "reading-practice-score/:level/:readingNum",
    element: ReadingPracticeScore,
  },
  {
    path: "review",
    element: ReviewPage,
  },
  {
    path: "reading-practice-review",
    element: ReadingPracticeReview,
  },
];
