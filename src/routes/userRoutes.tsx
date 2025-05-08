// src/routes/userRoutes.tsx
import { lazy } from "react";
import Login from "../pages/client-users/Login";
import ReadingTest from "../pages/client-users/ReadingTestPage";

const ClientUserLayout = lazy(() => import("../pages/client-users"));
const HomePage = lazy(() => import("../pages/client-users/HomePage"));
const AboutPage = lazy(() => import("../pages/client-users/AboutPage"));
import ReadingScore from "../pages/client-users/ReadingTestPage/ReadingScore";
import ReviewPage from "../pages/client-users/ReadingTestPage/ReviewPage";
export const userRoutes = [
  {
    path: "",
    element: ClientUserLayout,
    children: [
      { path: "", element: HomePage },
      { path: "about", element: AboutPage },
    ],
  },
  {
    path: "login",
    element: Login,
  },
  {
    path: "assessment",
    element: ReadingTest,
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
