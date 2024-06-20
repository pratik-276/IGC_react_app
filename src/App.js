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
import ProfileMenu from "./views/profile/ProfileMenu";
import Billing from "./views/profile/Billing";
import ReferEarn from "./views/profile/ReferEarn";
import HelpSupport from "./views/profile/HelpSupport";
import ProfileProvider from "./context/ProfileContext";

const App = () => {
  return (
    <>
      <ProfileProvider>
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
            <Route
              path="my-account"
              element={
                <ProtectedRoute>
                  <ProfileMenu />
                </ProtectedRoute>
              }
            />
            <Route
              path="billing-section"
              element={
                <ProtectedRoute>
                  <Billing />
                </ProtectedRoute>
              }
            />
            <Route
              path="help-support"
              element={
                <ProtectedRoute>
                  <HelpSupport />
                </ProtectedRoute>
              }
            />
            <Route
              path="refer-earn"
              element={
                <ProtectedRoute>
                  <ReferEarn />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgotPass />} />
        </Routes>
      </ProfileProvider>
    </>
  );
};

export default App;
