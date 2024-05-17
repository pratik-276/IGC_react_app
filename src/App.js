import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./views/Layout";
import Home from "./views/Home";
import GameTracking from "./views/ui/GameTracking";
import Compass from "./views/ui/Compass";
import Login from "./views/auth/Login";
import Signup from "./views/auth/Signup";
import ForgotPass from "./views/auth/ForgotPass";
import ProtectedRoute from "./utils/ProtectedRoute";

const App = () => {
  return (
    <>
      <Toaster toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/game-tracking" element={<GameTracking />} />
          <Route
            path="calibrate-compass"
            element={
              <ProtectedRoute>
                <Compass />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgotPass />} />
      </Routes>
    </>
  );
};

export default App;
