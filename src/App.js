// import { useRoutes } from "react-router-dom";
// import Themeroutes from "./routes/Router";
// import "../node_modules/bootstrap/dist/js/bootstrap.bundle"

// const App = () => {
//   const routing = useRoutes(Themeroutes);

//   return <div className="dark">{routing}</div>;
// };

// export default App;

import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./views/Layout";
import Home from "./views/Home";
import GameTracking from "./views/ui/GameTracking";
import Compass from "./views/ui/Compass";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/game-tracking" element={<GameTracking />} />
          <Route path="/calibrate-compass" element={<Compass />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
