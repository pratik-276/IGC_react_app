import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
const Layout = lazy(() => import("./views/Layout"));
const Home = lazy(() => import("./views/Home"));
const GameTracking = lazy(() => import("./views/ui/GameTracking"));
const Compass = lazy(() => import("./views/ui/Compass"));
const Login = lazy(() => import("./views/auth/Login.js"));
const Signup = lazy(() => import("./views/auth/Signup.js"));
const ForgotPass = lazy(() => import("./views/auth/ForgotPass.js"));

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/game-tracking" element={<GameTracking />} />
          <Route path="/calibrate-compass" element={<Compass />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgotPass />} />
      </Routes>
    </>
  );
};

export default App;
