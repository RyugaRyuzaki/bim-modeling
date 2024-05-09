import React from "react";
import {Routes, Route} from "react-router-dom";
import {Helmet} from "react-helmet";
import Viewer from "@pages/viewer"; // Assuming Viewer is also imported from "./pages"
import {Error} from "./Error";
const BaseRoute = () => {
  return (
    <>
      <Routes>
        <Route
          path={import.meta.env.PROD ? "/bim-modeling" : "/"}
          element={
            <>
              <Helmet>
                <title>Bim Modeling</title>
              </Helmet>
              <Viewer />
            </>
          }
        />
        <Route path="*" element={<Error message="Opp!" />} />
      </Routes>
    </>
  );
};

export default BaseRoute;
