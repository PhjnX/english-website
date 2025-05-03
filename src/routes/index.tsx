import React, { JSX, lazy } from "react";
import { Route } from "react-router-dom";
import Login from "../pages/client-users/Login";
import ReadingTest from "../pages/client-users/ReadingTestPage";
import ReadingScore from "../pages/client-users/ReadingTestPage/ReadingScore";

type TRoute = {
  path: string;
  element: React.ComponentType;
  children?: TRoute[];
};

const routes: TRoute[] = [
  {
    path: "",
    element: lazy(() => import("../pages/client-users")),
    children: [
      {
        path: "",
        element: lazy(() => import("../pages/client-users/HomePage")),
      },
      {
        path: "about",
        element: lazy(() => import("../pages/client-users/AboutPage")),
      },
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
];

export const renderRoutes = (): JSX.Element[] =>
  routes.map((route) => {
    const El = route.element;
    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={<El />}>
          {route.children.map((child) => {
            const Child = child.element;
            return (
              <Route key={child.path} path={child.path} element={<Child />} />
            );
          })}
        </Route>
      );
    }
    return <Route key={route.path} path={route.path} element={<El />} />;
  });
