import React, { Suspense } from "react";
import "./assets/scss/style.scss";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import Loader from "./layouts/loader/Loader";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Suspense fallback={<Loader />}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Suspense>
);

reportWebVitals();
