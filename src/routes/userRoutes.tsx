// src/routes/userRoutes.tsx
import { lazy } from "react";

import ReadingScore from "../pages/client-users/ReadingTestPage/ReadingScore";
import ReadingPracticeScore from "../pages/client-users/ReadingPracticePage/ReadingPracticeScore";
import ReadingPracticeReview from "../pages/client-users/ReadingPracticePage/ReadingPracticeReview";
import ProtectedRoute from "../components/ProtectedRoute";
import PrivateRouteAuth from "../components/PrivateRouteAuth";
import LoginPage from "../pages/client-users/Login";
import ReviewPage from "../pages/client-users/ReadingTestPage/ReviewPage";
import LevelPage from "../pages/client-users/Lessons/LevelPage";
import Dashboard from "../pages/client-users/Dashboard/Dashboard";
import ReadingPracticePage from "../pages/client-users/ReadingPracticePage";
import ReadingTestPage from "../pages/client-users/ReadingTestPage";
import MockTestPage from "../pages/client-users/ReadingTestPage/MockTestPage";

const ClientUserLayout = lazy(() => import("../pages/client-users"));
const HomePage = lazy(() => import("../pages/client-users/HomePage"));
const PracticePage = lazy(() => import("../pages/client-users/Lessons"));

// Wrapper components để bảo vệ routes
const ProtectedReadingPractice = () => (
  <PrivateRouteAuth redirectMessage="Vui lòng đăng nhập để làm bài luyện tập">
    <ReadingPracticePage />
  </PrivateRouteAuth>
);

const ProtectedDashboard = () => (
  <PrivateRouteAuth redirectMessage="Vui lòng đăng nhập để xem lộ trình học tập">
    <Dashboard />
  </PrivateRouteAuth>
);

const ProtectedReadingPracticeScore = () => (
  <PrivateRouteAuth redirectMessage="Vui lòng đăng nhập để xem kết quả bài luyện tập">
    <ReadingPracticeScore />
  </PrivateRouteAuth>
);

const ProtectedReviewPage = () => (
  <PrivateRouteAuth redirectMessage="Vui lòng đăng nhập để xem review bài test">
    <ReviewPage />
  </PrivateRouteAuth>
);

const ProtectedReadingPracticeReview = () => (
  <PrivateRouteAuth redirectMessage="Vui lòng đăng nhập để xem review bài luyện tập">
    <ReadingPracticeReview />
  </PrivateRouteAuth>
);

const ProtectedReadingTest = () => (
  <PrivateRouteAuth redirectMessage="Vui lòng đăng nhập để làm bài test IELTS Reading">
    <ReadingTestPage />
  </PrivateRouteAuth>
);

const ProtectedAssessment = () => (
  <PrivateRouteAuth redirectMessage="Vui lòng đăng nhập để truy cập bài test đánh giá trình độ">
    <ProtectedRoute />
  </PrivateRouteAuth>
);

const ProtectedReadingScore = () => (
  <PrivateRouteAuth redirectMessage="Vui lòng đăng nhập để xem kết quả bài test">
    <ReadingScore />
  </PrivateRouteAuth>
);

export const userRoutes = [
  {
    path: "",
    element: ClientUserLayout,
    children: [
      { path: "", element: HomePage },
      {
        path: "assessment",
        element: ProtectedAssessment,
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
        element: ProtectedReadingPractice,
      },
      {
        path: "dashboard",
        element: ProtectedDashboard,
      },
      {
        path: "mock-test",
        element: MockTestPage,
      },
    ],
  },
  {
    path: "login",
    element: LoginPage,
  },
  {
    path: "reading-score",
    element: ProtectedReadingScore,
  },
  {
    path: "reading-test",
    element: ProtectedReadingTest,
  },
  {
    path: "reading-practice-score/:level/:readingNum",
    element: ProtectedReadingPracticeScore,
  },
  {
    path: "review",
    element: ProtectedReviewPage,
  },
  {
    path: "reading-practice-review",
    element: ProtectedReadingPracticeReview,
  },
];
