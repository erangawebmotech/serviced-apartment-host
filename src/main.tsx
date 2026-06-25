import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./slices/index.ts";
import Loader from "./components/common/loader/Loader.tsx";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.Fragment>
      <BrowserRouter>
        <Loader />
        <App />
        <ToastContainer newestOnTop />
      </BrowserRouter>
    </React.Fragment>
  </Provider>
);
