import React from "react";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {BrowserRouter} from "react-router-dom";
import BaseRoute from "./BaseRoute";
import "./App.css";
function App() {
  return (
    <>
      <BrowserRouter>
        <BaseRoute />
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
      />
    </>
  );
}

export default App;
