import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// import Layout from "./views/Layout";
import Layout from "./views/AntdLayout";
import Home from "./views/Home";
import Compass from "./views/ui/Compass";
import CompassMod from "./views/ui/CompassMod";

import Login from "./views/auth/Login";
import LoginPage from "./views/auth/LoginPage";
import SignupPage from "./views/auth/SignupPage";
import OtpVerification from "./views/auth/OtpVerification";

import ProtectedRoute from "./utils/ProtectedRoute";
import ProfileMenu from "./views/profile/ProfileMenu";
import ProfileProvider from "./context/ProfileContext";
import ContactSalesProvider from "./context/confirmationContext";
import ScrollToTop from "./layouts/ScrollToTop";
import { CasinoProvider } from "./context/casinoContext";
import { GameProvider } from "./context/gameContext";

import DashboardMod from "./views/ui/DashboardMod";
import CompetitorDashboardMod from "./views/ui/CompetitorDashboardMod";
import GameDetailsMod from "./views/ui/GameDetailsMod";
import CompassDetails from "./views/ui/CompassDetails";
import RawDataDashboard from "./views/ui/RawDataDashboard";
import GameRank from "./views/ui/GameRank";
import GameRankL2 from "./views/ui/GameRankL2";
import GameProvideMarketshare from "./views/ui/GameProvideMarketshare";
import GameProvideMarketshareL2 from "./views/ui/GameProvideMarketshareL2";
import CasinoRequests from "./views/ui/CasinoRequests";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// BLOGS
import CLAUDE1 from "./views/blogs/claude_1";
import CLAUDE2 from "./views/blogs/claude_2";
import CLAUDE3 from "./views/blogs/claude_3";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="blog/id_1" element={<CLAUDE1 />} />
      </Routes>
      <Routes>
        <Route path="blog/id_2" element={<CLAUDE2 />} />
      </Routes>
      <Routes>
        <Route path="blog/id_3" element={<CLAUDE3 />} />
      </Routes>
      <ProfileProvider>
        <CasinoProvider>
          <ContactSalesProvider>
            <GameProvider>
              <ScrollToTop />
              <Toaster
                toastOptions={{ duration: 1500, style: { zIndex: 10001 } }}
                position="top-right"
              />

              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route
                    index
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="calibrate-compass-mod"
                    element={
                      <ProtectedRoute>
                        <Compass />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="calibrate-compass"
                    element={
                      <ProtectedRoute>
                        <CompassMod />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="compass-details"
                    element={
                      <ProtectedRoute>
                        <CompassDetails />
                      </ProtectedRoute>
                    }
                  />

                  {/* added by akshay */}
                  <Route
                    path="position-details"
                    element={
                      <ProtectedRoute>
                        <GameDetailsMod />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardMod />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="competitor-dashboard"
                    element={
                      <ProtectedRoute>
                        <CompetitorDashboardMod />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="game-rank-report"
                    element={
                      <ProtectedRoute>
                        <GameRank />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="game-rank-details"
                    element={
                      <ProtectedRoute>
                        <GameRankL2 />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="game-provider-marketshare"
                    element={
                      <ProtectedRoute>
                        <GameProvideMarketshare />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="game-provider-marketshare-details"
                    element={
                      <ProtectedRoute>
                        <GameProvideMarketshareL2 />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="all-data-dashboard"
                    element={
                      <ProtectedRoute>
                        <RawDataDashboard />
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
                    path="casino-requests"
                    element={
                      <ProtectedRoute>
                        <CasinoRequests />
                      </ProtectedRoute>
                    }
                  />

                  {/*
                  <Route
                    path="/game-tracking"
                    element={
                      <ProtectedRoute>
                        <GameTracking />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/game-tracking-details"
                    element={
                      <ProtectedRoute>
                        <GameTrackingDetails />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="priority-casinos"
                    element={
                      <ProtectedRoute>
                        <DailyDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="competitor-dashboard-mod"
                    element={
                      <ProtectedRoute>
                        <CompetitorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="game-track-details"
                    element={
                      <ProtectedRoute>
                        <TrackerDetails trackingDetails={null} />
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
                  /> */}
                </Route>
                {/* <Route path="/login" element={<Login />} /> */}
                {/* <Route path="/verify" element={<Verify />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forget-password" element={<ForgotPass />} /> */}

                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/verify-otp" element={<OtpVerification />} />
              </Routes>
            </GameProvider>
          </ContactSalesProvider>
        </CasinoProvider>
      </ProfileProvider>
    </>
  );
};

export default App;
