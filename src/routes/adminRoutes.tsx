import { lazy } from "react";
import { Navigate } from "react-router-dom";
import PrivateRoute from "../pages/client-auth/PrivateRoute";
import ProfilePage from "../pages/client-admin/profile";

const AdminLayout = lazy(() => import("../pages/client-admin"));
const DashboardPage = lazy(() => import("../pages/client-admin/dashboard"));
const UserListPage = lazy(() => import("../pages/client-admin/users/UserList"));
const AddUserPage = lazy(
  () => import("../pages/client-admin/users/AddUserPage")
);
const AssessmentListPage = lazy(
  () => import("../pages/client-admin/assessment/AssessmentListPage")
);
const CreateAssessmentPage = lazy(
  () => import("../pages/client-admin/assessment/CreateAssessmentPage")
);
const ManageAssessmentPage = lazy(
  () => import("../pages/client-admin/assessment/ManageAssessmentPage")
);
const ReadingTestListPage = lazy(
  () => import("../pages/client-admin/Reading/ReadingTestListPage")
);
const ManageReadingTestPage = lazy(
  () => import("../pages/client-admin/Reading/ManageReadingTestPage")
);

const RedirectToDashboard = () => <Navigate to="dashboard" replace />;

export const adminRoutes = [
  {
    path: "admin",
    element: PrivateRoute,
    children: [
      {
        path: "",
        element: AdminLayout,
        children: [
          { path: "", element: RedirectToDashboard },
          { path: "dashboard", element: DashboardPage },
          { path: "users", element: UserListPage }, // ✅ bạn đang thiếu cái này
          { path: "users/add-user", element: AddUserPage }, // ✅ thêm dòng này
          { path: "assessments", element: AssessmentListPage },
          { path: "assessments/create", element: CreateAssessmentPage },
          {
            path: "assessments/:assessmentId/manage",
            element: ManageAssessmentPage,
          },
          { path: "reading", element: ReadingTestListPage  },
          {
            path: "reading/:readingTestId/manage",
            element: ManageReadingTestPage ,
          },
          { path: "profile", element: ProfilePage }
        ],
      },
    ],
  },
  {
    path: "auth",
    element: lazy(() => import("../pages/client-auth/AuthLogin")),
  },
];
