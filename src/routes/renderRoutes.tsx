// src/routes/renderRoutes.tsx
import React, { JSX } from "react";
import { Route } from "react-router-dom";
import { userRoutes } from "./userRoutes";
import { adminRoutes } from "./adminRoutes";

type TRoute = {
  path: string;
  element: React.ComponentType;
  children?: TRoute[];
};

const allRoutes: TRoute[] = [...userRoutes, ...adminRoutes];

export const renderRoutes = (): JSX.Element[] =>
  allRoutes.map((route) => {
    const El = route.element;
    return (
      <Route key={route.path} path={route.path} element={<El />}>
        {route.children?.map((child) => {
          const Child = child.element;
          return (
            <Route key={child.path} path={child.path} element={<Child />}>
              {child.children?.map((grandchild) => {
                const GrandChild = grandchild.element;
                return (
                  <Route
                    key={grandchild.path}
                    path={grandchild.path}
                    element={<GrandChild />}
                  />
                );
              })}
            </Route>
          );
        })}
      </Route>
    );
  });
