import { lazy } from "react";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/
const Home = lazy(() => import("../views/Home.js"));
const GameTracking = lazy(() => import("../views/ui/GameTracking"));
const Compass = lazy(() => import("../views/ui/Compass"));
const Login = lazy(() => import("../views/auth/Login.js"));
const Signup = lazy(() => import("../views/auth/Signup.js"));
const ForgotPass = lazy(() => import("../views/auth/ForgotPass.js"));

/*****Routes******/
const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", exact: true, element: <Home /> },
      { path: "/game-tracking", exact: true, element: <GameTracking /> },
      { path: "/calibrate-compass", exact: true, element: <Compass /> },
    ],
  },
  { path: "/login", exact: true, element: <Login /> },
  { path: "/signup", exact: true, element: <Signup /> },
  { path: "/forgot-password", exact: true, element: <ForgotPass /> },
];

export default ThemeRoutes;
