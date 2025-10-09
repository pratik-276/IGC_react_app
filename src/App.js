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
import BubbleChart from "./views/blogs/claude";
import CLAUDE1 from "./views/blogs/claude_1";
import CLAUDE2 from "./views/blogs/claude_2";
import CLAUDE3 from "./views/blogs/claude_3";
import CLAUDE4 from "./views/blogs/claude_4";
import CLAUDE5 from "./views/blogs/claude_5";
import CLAUDE7 from "./views/blogs/claude_7";
import CLAUDE8 from "./views/blogs/claude_8";
import CLAUDE6 from "./views/blogs/claude_6";
import CLAUDE9 from "./views/blogs/claude_9";
import CLAUDE10 from "./views/blogs/claude_10";
import CLAUDE11 from "./views/blogs/claude_11";
import CLAUDE12 from "./views/blogs/claude_12";
import CLAUDE13 from "./views/blogs/claude_13";
import CLAUDE14 from "./views/blogs/claude_14";
import CLAUDE15 from "./views/blogs/claude_15";
import CLAUDE16 from "./views/blogs/claude_16";
import CLAUDE17 from "./views/blogs/claude_17";
import CLAUDE18 from "./views/blogs/claude_18";
import CLAUDE19 from "./views/blogs/claude_19";
import CLAUDE20 from "./views/blogs/claude_20";
import AnalyticsPage from "./views/ui/AnalyticsPage";

const App = () => {
  return (
    <>
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
                <Route path="blog/id_1" element={<CLAUDE1 />} />
                <Route path="blog/id_2" element={<CLAUDE2 />} />
                <Route path="blog/id_3" element={<CLAUDE3 />} />
                <Route path="blog/id_4" element={<CLAUDE4 />} />
                <Route path="blog/id_5" element={<CLAUDE5 />} />
                <Route path="blog/id_6" element={<CLAUDE6 />} />
                <Route path="blog/id_7" element={<CLAUDE7 />} />
                <Route path="blog/id_8" element={<CLAUDE8 />} />
                <Route path="blog/id_9" element={<CLAUDE9 />} />
                <Route path="blog/id_10" element={<CLAUDE10 />} />
                <Route path="blog/id_11" element={<CLAUDE11 />} />
                <Route path="blog/id_12" element={<CLAUDE12 />} />
                <Route path="blog/id_13" element={<CLAUDE13 />} />
                <Route path="blog/id_14" element={<CLAUDE14 />} />
                <Route path="blog/id_15" element={<CLAUDE15 />} />
                <Route path="blog/id_16" element={<CLAUDE16 />} />
                <Route path="blog/id_17" element={<CLAUDE17 />} />
                <Route path="blog/id_18" element={<CLAUDE18 />} />
                <Route path="blog/id_19" element={<CLAUDE19 />} />
                <Route path="blog/id_20" element={<CLAUDE20 />} />

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

                  <Route
                    path="analytics"
                    element={
                      <ProtectedRoute>
                        <AnalyticsPage />
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
                {/* <Route path="/signup" element={<SignupPage />} /> */}
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
