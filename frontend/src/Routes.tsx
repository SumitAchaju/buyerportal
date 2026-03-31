import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/login";
import AuthGuard from "./guards/AuthGuard";
import DashboardPage from "./pages/dashboard";
import LoginRedirectGuard from "./guards/LoginRedirectGuard";
import RegisterPage from "./pages/register";
import PropertiesPage from "./pages/property";
import NavBar from "./components/layout/Navbar";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <NavBar />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "/properties",
        element: <PropertiesPage />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <LoginRedirectGuard>
        <LoginPage />
      </LoginRedirectGuard>
    ),
  },
  {
    path: "/signup",
    element: (
      <LoginRedirectGuard>
        <RegisterPage />
      </LoginRedirectGuard>
    ),
  },
  {
    path: "*",
    element: <AuthGuard>404 Not Found</AuthGuard>,
  },
]);
